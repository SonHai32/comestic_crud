import { Order } from "./order.model";
export interface OrderResponse {
  status: "SUCCESS" | "FAIL";
  orders: Order[];
  page: number;
  perPage: number | null;
  totalResult: number;
}
