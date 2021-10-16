import { ResponseType } from "../types/response.type";
import { CartError } from "./../types/cartError.type";
import { Cart } from "./../models/cart.model";
import { Request, Response, NextFunction } from "express";

export const CartValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart: Cart = req.body.cart;
    const errorList: string[] = [];

    if (!cart) errorList.push(CartError.MSS_CART);
    else {
      if (!cart.product) errorList.push(CartError.MSS_PRODUCT);
      if (!cart.quantity) errorList.push(CartError.MSS_QUANTITY);
      if (!cart.total) errorList.push(CartError.MSS_TOTAL);
    }

    if (errorList.length > 0) {
      throw new Error(errorList.join(" , "));
    } else return next();
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};
