import { OrderError } from "./../types/orderError.type";
import { Order } from "./../models/order.model";
import { NextFunction } from "express";
import { Request, Response } from "express";
import { ResponseType } from "../types/response.type";
export const OrderValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order: Order = req.body.order;
    const errorList: string[] = [];
    if (!order) errorList.push(OrderError.MSS_ORDER);
    else {
      if (!order.cart) errorList.push(OrderError.MSS_CART);
      if (!order.shipping_detai) errorList.push(OrderError.MSS_SHIPPING_DETAIL);
      if (!order.total) errorList.push(OrderError.MSS_TOTAL);
    }

    if (errorList.length > 0) throw new Error(errorList.join(" , "));
    else return next();
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};
