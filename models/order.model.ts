import { Double } from "bson";
import { Timestamp } from "bson";
import { Cart } from "./cart.model";
export interface Order {
  _id?: string;
  cart: Cart[];
  total: Double;
  shipping_detai: {
    customer: string;
    phone_number: string;
    email_address: string;
    address: string;
    shipping_fee: Double;
    note: string;
    status: string;
  };
  created_at: Timestamp;
  created_by: string;
  status: string;
}
