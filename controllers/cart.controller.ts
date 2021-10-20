import { ResponseType } from "../types/response.type";
import { Cart } from "../models/cart.model";
import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { Request, Response } from "express";
import CartService from "../services/cart.service";
export const _Get = async (req: Request, res: Response) => {
  try {
    const accessToken = req.body.accessToken;
    const cartsResponse: Cart[] = await CartService.getAllCart(accessToken._id);

    res.json({ status: "SUCCESS", carts: cartsResponse });
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};

export const _Insert = async (req: Request, res: Response) => {
  try {
    const cart: any = req.body.cart;
    const accessToken: any = req.body.accessToken;
    const result: InsertOneResult | undefined = await CartService.insertCart(
      cart,
      accessToken._id
    );
    if (result?.insertedId)
      res.json({ status: "SUCCESS", message: "Inserted" } as ResponseType);
    else throw new Error("Insert fail");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};

export const _UpdateCartQuantity = async (req: Request, res: Response) => {
  try {
    const cart: Cart = req.body.cart;
    const result: UpdateResult | undefined =
      await CartService.updateCartQuantity(cart);
    if (result) {
      if (result.matchedCount > 0)
        res.json({ status: "SUCCESS", message: "Updated" } as ResponseType);
      else throw new Error("Updated fail");
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};

export const _Delete = async (req: Request, res: Response) => {
  try {
    const listID: string[] = req.body.listID;
    if (listID) {
      const result: DeleteResult | undefined = await CartService.deleteCart(
        listID
      );
      if (result && result.deletedCount > 0) {
        res.json({
          status: "SUCCESS",
          message: "Deleted",
        } as ResponseType);
      } else throw new Error("Fail to delete");
    } else throw new Error("Missing listID");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};
