export interface CategoryFilter {
  page: number;
  perPage: number;
  nameSort?: 1 | -1; //0: Sort ascending | 1: Sort descending
}
