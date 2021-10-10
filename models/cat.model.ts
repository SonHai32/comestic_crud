import { Timestamp } from "bson";

export interface Cat {
  _id?: string;
  cat_id: string;
  cat_name: string;
  sub_cate?: Cat;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
