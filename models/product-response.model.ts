import { Product } from "./product.model";
export interface ProductResponse {
  product_list: Product[];
  page: number;
  per_page: number;
  total_result: number;
  status: "SUCCESS" | "FAIL";
  error?: {
    message: string;
    code: number;
  };
}
