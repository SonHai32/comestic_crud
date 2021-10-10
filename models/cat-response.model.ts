import { Cat } from "./cat.model";

export interface CategoryResponse {
  status: "SUCCESS" | "FAIL";
  categories: Cat[];
  totalResult: number;
  page: number | null;
  perPage: number | null;
}
