import { Timestamp, Int32, Double, ObjectId } from "bson";
import { Product } from "./product.model";
export interface Cart {
  _id?: string;
  product: Product;
  quantity: Int32;
  total: Double;
  created_at: Date;
  created_by: string;
}
