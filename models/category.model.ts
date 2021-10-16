export interface Category {
  _id?: string;
  name: string;
  slug: string;
  sub_cate?: Category;
  last_modified: {
    updated_at: Date;
    update_by: string;
  };
  created_at: Date;
  created_by: string;
}
