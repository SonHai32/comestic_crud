import { UpdateResult } from "mongodb";
import { Order } from "./../models/order.model";
import { ResponseType } from "./../types/response.type";
import { OrderFilter } from "./../models/order-filter.model";
import { Request, Response } from "express";
import OrderService from "../services/order.service";
import { OrderResponse } from "../models/order-response.model";

export const _Get = async (req: Request, res: Response) => {
  try {
    const accessToken = req.body.accessToken;
    const filter: OrderFilter = req.body.filter;
    if (accessToken) {
      let orders: OrderResponse;
      if (filter) orders = await OrderService.getAll(accessToken._id, filter);
      else orders = await OrderService.getAll(accessToken._id);

      res.json(orders);
    } else throw new Error("Missing access token");
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};

export const _Update = async (req: Request, res: Response) => {
  try {
    const order: Order = req.body.order;
    if (order && order._id) {
      const id = order._id;
      delete order._id;
      const updateResult: UpdateResult | undefined = await OrderService.update(
        id,
        order
      );
      if (updateResult && updateResult?.upsertedCount > 0) {
        res.json({ status: "SUCCESS", message: "Updated" } as ResponseType);
      } else throw new Error("Update fail");
    }
  } catch (error) {
    res.json({
      status: "FAIL",
      message: (error as Error).message,
    } as ResponseType);
  }
};
