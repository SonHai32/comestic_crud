import { CartResponse } from "./../models/cart-response.model";
import { CartFilter } from "./../models/cart-filter.model";
import { ObjectId } from "bson";
import { Cart } from "./../models/cart.model";
import {
  Collection,
  MongoClient,
  InsertOneResult,
  UpdateResult,
} from "mongodb";

("use strict");
export default class CartService {
  constructor(private cartCollection: Collection) {}

  static async injectDB(connection: MongoClient): Promise<void> {
    try {
      if (this.prototype.cartCollection) return;
      else {
        this.prototype.cartCollection = connection
          .db(process.env.DB_NAME)
          .collection("carts");
      }
    } catch (error) {
      throw error;
    }
  }

  static async insertCart(cart: Cart): Promise<InsertOneResult | undefined> {
    try {
      return await this.prototype.cartCollection.insertOne({
        ...cart,
        _id: new ObjectId(),
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateCart(
    cartID: string,
    cart: Cart
  ): Promise<UpdateResult | undefined> {
    try {
      return await this.prototype.cartCollection.updateOne(
        { _id: cartID },
        { $set: cart },
        { upsert: false }
      );
    } catch (error) {}
  }
  static async deleteCart(listID: string[]) {
    try {
      const mapListID = listID.map((val: string) => new ObjectId(val));
      return await this.prototype.cartCollection.deleteMany({
        _id: { $in: mapListID },
      });
    } catch (error) {}
  }

  static async getAllCart(
    userID: string,
    filter?: CartFilter
  ): Promise<CartResponse> {
    try {
      let carts: Cart[] = [];
      const cursor = this.prototype.cartCollection.find<Cart>({
        created_by: userID,
      });
      if (filter) {
        carts = await cursor.limit(filter.perPage).skip(filter.page).toArray();
      } else carts = await cursor.sort({ created_at: "desc" }).toArray();
      const totalResult: number =
        await this.prototype.cartCollection.countDocuments({});

      const cartResponse: CartResponse = {
        carts,
        page: filter && filter.page ? filter.page : 0,
        perPage: filter && filter.perPage ? filter.perPage : 0,
        totalResult,
        status: carts.length > 0 ? "SUCCESS" : "FAIL",
      };

      return cartResponse;
    } catch (error) {
      throw error;
    }
  }
}
