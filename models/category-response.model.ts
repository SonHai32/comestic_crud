import { Category } from "./category.model";

export interface CategoryResponse {
  status: "SUCCESS" | "FAIL";
  categories: Category[];
  totalResult: number;
  page: number | null;
  perPage: number | null;
}
