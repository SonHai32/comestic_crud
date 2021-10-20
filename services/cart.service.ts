import { Double, Int32, ObjectId } from "bson";
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

  static async insertCart(
    cart: any,
    created_by: string
  ): Promise<InsertOneResult | undefined> {
    try {
      const { quantity } = cart;
      const { display_price } = cart.product;
      const total = new Double(Math.floor(quantity * display_price));
      const mapToCart: Cart = {
        ...(cart as Cart),
        created_at: new Date(),
        created_by,
        total,
      };
      return await this.prototype.cartCollection.insertOne({
        ...mapToCart,
        _id: new ObjectId(),
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateCartQuantity(
    cart: any
  ): Promise<UpdateResult | undefined> {
    try {
      const _id: ObjectId = cart._id ? new ObjectId(cart._id) : new ObjectId();
      const { quantity } = cart;
      const { display_price } = cart.product;
      const total: Double = new Double(quantity * display_price);

      return await this.prototype.cartCollection.updateOne(
        { _id },
        { $set: { quantity: new Int32(quantity), total } },
        { upsert: false }
      );
    } catch (error) {
      throw error;
    }
  }
  static async deleteCart(listID: string[]) {
    try {
      const mapListID = listID.map((val: string) => new ObjectId(val));
      return await this.prototype.cartCollection.deleteMany({
        _id: { $in: mapListID },
      });
    } catch (error) {
      throw error;
    }
  }

  static async getAllCart(userID: string): Promise<Cart[]> {
    try {
      return this.prototype.cartCollection
        .find<Cart>({ created_by: userID })
        .toArray();
    } catch (error) {
      throw error;
    }
  }
}
