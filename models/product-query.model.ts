export interface ProductListQuery {
  name?: string;
  cat_id?: string[];
  cat_name?: string;
  price?: number[];
  per_page: number;
  page: number;
}
