import { ResponseType } from "./../types/response.type";
import { Cart } from "./../models/cart.model";
import { DeleteResult, UpdateResult } from "mongodb";
import { CartFilter } from "./../models/cart-filter.model";
import { CartResponse } from "./../models/cart-response.model";
import { Request, Response } from "express";
import CartService from "../services/cart.service";
export const _Get = async (req: Request, res: Response) => {
  try {
    const filter = req.body.filter as CartFilter;
    const accessToken = req.body.accessToken;
    let cartsResponse: CartResponse;
    if (filter) {
      cartsResponse = await CartService.getAllCart(accessToken._id, filter);
    } else cartsResponse = await CartService.getAllCart(accessToken._id);

    if (cartsResponse) res.json(cartsResponse);
    else throw new Error("Fail to get carts");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};

export const _Update = async (req: Request, res: Response) => {
  try {
    const cart: Cart = req.body.cart;
    let id = cart._id;
    delete cart._id;
    if (id && cart) {
      const result: UpdateResult | undefined = await CartService.updateCart(
        id,
        cart
      );
      if (result?.matchedCount && result.matchedCount > 0) {
        res.json({ status: "SUCCESS", message: "Updated" } as ResponseType);
      } else throw new Error("Update fail");
    } else throw new Error("Missing cart");
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
