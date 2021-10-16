import { OrderFilter } from "./../models/order-filter.model";
import { ObjectId } from "bson";
import { Collection, FindCursor, MongoClient, UpdateResult } from "mongodb";
import { Order } from "../models/order.model";
import { OrderResponse } from "../models/order-response.model";

export default class OrderService {
  constructor(private orderCollection: Collection) {}

  static async injectDB(connection: MongoClient) {
    if (this.prototype.orderCollection) return;

    this.prototype.orderCollection = connection
      .db(process.env.DB_NAME)
      .collection("orders");
  }

  static async update(
    id: string,
    order: Order
  ): Promise<UpdateResult | undefined> {
    try {
      return await this.prototype.orderCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: order },
        { upsert: false }
      );
    } catch (error) {}
  }
  static async getAll(
    userID: string,
    filter?: OrderFilter
  ): Promise<OrderResponse> {
    try {
      const query = { created_by: userID };
      const cursor: FindCursor<Order> =
        this.prototype.orderCollection.find<Order>(query);
      let orders: Order[];
      if (filter) {
        orders = await cursor
          .limit(filter.perPage)
          .skip(filter.page)
          .sort({ created_at: "desc" })
          .toArray();
      } else orders = await cursor.sort({ created_at: "desc" }).toArray();

      const totalResult: number =
        await this.prototype.orderCollection.countDocuments(query);

      const orderRespose: OrderResponse = {
        status: orders && orders.length > 0 ? "SUCCESS" : "FAIL",
        totalResult,
        orders: orders ? orders : [],
        page: filter && filter?.page ? filter.page : 0,
        perPage: filter && filter.perPage ? filter.perPage : null,
      };
      return orderRespose;
    } catch (error) {
      throw error;
    }
  }
}
