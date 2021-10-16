import { Double, Timestamp, Int32, ObjectId } from "bson";
import { Category } from "./category.model";
export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: Category;
  original_price: Double;
  sell_price: Double;
  display_price: Double;
  profit: Double;
  rating: Double;
  quantity: Int32;
  brand: string;
  slug: string;
  sizes?: string[];
  colors?: string[];
  images_list: string[];
  display_image: string;
  post_markdown?: string;
  created_detail: {
    created_at: Date;
    created_by_id: string;
    created_by_username: string;
  };
  last_modify: {
    updated_by_id: string;
    updated_by_username: string;
    updated_at: Date;
  };
}
