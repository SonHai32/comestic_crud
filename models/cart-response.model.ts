import { Cart } from "./cart.model";
export interface CartResponse {
  status: "FAIL" | "SUCCESS";
  carts: Cart[];
  totalResult: number;
  page: number;
  perPage: number | null;
}
