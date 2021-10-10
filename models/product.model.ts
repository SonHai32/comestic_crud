import {Double} from "bson";
import { Cat } from "./cat.model"
export interface Product {
  _id?: string;
  product_name: string;
  product_price: number;
  product_old_price: number;
  product_discount: number;
  product_rating: number;
  product_amount: number;
  product_img_urls: string[];
  product_colors?: string[];
  product_sizes?: string[];
  product_cat: Cat;
}
