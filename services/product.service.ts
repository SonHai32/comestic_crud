import { ProductResponse } from "../models/product-response.model";
import { Collection, MongoClient } from "mongodb";
import { ProductListQuery } from "../models/product-query.model";
import { Product } from "../models/product.model";
import { Double, ObjectId } from "bson";

export default class ProductService {
  constructor(private productCollection: Collection) {}
  static async injectDB(connection: MongoClient) {
    if (this.prototype.productCollection) {
      return;
    }
    try {
      if (process.env.DB_NAME) {
        this.prototype.productCollection = connection
          .db(process.env.DB_NAME)
          .collection("products");
      } else {
        throw new Error("Database Name not found");
      }
    } catch (error) {
      throw error;
    }
  }

  static async getProductDetail(productID: string): Promise<Product | null> {
    return await this.prototype.productCollection.findOne<Product>({
      _id: new ObjectId(productID),
    });
  }
  
  static async getProduct(query: ProductListQuery) {
    let _query = [];
    if (query.name) {
      _query.push({ $text: { $search: query.name } });
    }
    if (query.cat_id) {
      _query.push({
        "product_cat.cat_id": query.cat_id,
      });
    }
    if (query.price) {
      _query.push({
        product_price: { $gte: query.price[0], $lte: query.price[1] },
      });
    }
    try {
      const finalQuery = _query.length > 0 ? { $and: _query } : {};
      const cursor = this.prototype.productCollection.find(finalQuery);
      const displayCursor = cursor
        .limit(query.per_page)
        .skip(query.per_page * query.page);

      const productList = (await displayCursor.toArray()) as Product[];
      const totalNumProduct =
        await this.prototype.productCollection.countDocuments(finalQuery);

      return {
        product_list: productList,
        total_num_product: totalNumProduct,
        page: query.page,
        per_page: query.per_page,
      } as ProductResponse;
    } catch (error) {
      throw error;
    }
  }

  static async InsertProduct(product: Product) {
    const {
      product_amount,
      product_discount,
      product_old_price,
      product_price,
      product_rating,
    } = product;
    const productPropMaptoBson = {
      ...product,
      product_amount: new Double(product_amount),
      product_discount: new Double(product_discount),
      product_old_price: new Double(product_old_price),
      product_price: new Double(product_price),
      product_rating: new Double(product_rating),
      _id: new ObjectId(),
    };
    return await this.prototype.productCollection.insertOne(
      productPropMaptoBson
    );
  }
  static async UpdateProduct(product: Product, ID: string) {
    return await this.prototype.productCollection.updateOne(
      { _id: new ObjectId(ID) },
      { $set: product },
      { upsert: false }
    );
  }
  static async DeleteProdct(productID: string): Promise<number> {
    return (
      await this.prototype.productCollection.deleteOne({
        _id: new ObjectId(productID),
      })
    ).deletedCount;
  }
  static async DeleteManyProduct(productID: string[]) {
    return await this.prototype.productCollection.deleteMany({
      _id: { $in: productID.map((val: string) => new ObjectId(val)) },
    });
  }
}
