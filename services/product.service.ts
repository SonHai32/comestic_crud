import { ProductResponse } from "../models/product-response.model";
import { Collection, MongoClient } from "mongodb";
import { ProductListQuery } from "../models/product-query.model";
import { Product } from "../models/product.model";
import { Double, Int32, ObjectId, Timestamp } from "bson";

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

  static async isProductNameExisted(productName: string, productID?: string) {
    const product = await this.prototype.productCollection.findOne<Product>({
      name: productName,
    });
    if (product && productID) {
      return product._id?.toString() !== productID;
    } else if (product) {
      return true;
    } else return false;
  }
  static async isSlugExisted(slug: string, productID?: string) {
    const product = await this.prototype.productCollection.findOne<Product>({
      slug,
    });
    if (product && productID) {
      return product._id !== productID;
    } else if (product) {
      return true;
    } else return false;
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
        $or: [
          {
            sell_price: { $gte: query.price[0], $lte: query.price[1] },
          },
          {
            display_price: { $gte: query.price[0], $lte: query.price[1] },
          },
        ],
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

  static async InsertProduct(user: any, product: any) {
    const {
      display_price,
      original_price,
      sell_price,
      profit,
      quantity,
      rating,
      discount,
    } = product;
    const productPropMaptoBson = {
      ...product,
      created_at: Timestamp.fromInt(Date.now()),
      quantity: new Int32(quantity),
      rating: new Double(rating),
      discount: new Double(discount),
      display_price: new Double(display_price),
      original_price: new Double(original_price),
      sell_price: new Double(sell_price),
      profit: new Double(profit),
      last_modify: {
        updated_at: Timestamp.fromInt(Date.now()),
        updated_by_id: user._id,
        updated_by_username: user.username,
      },
      created_detail: {
        created_at: new Date(),
        created_by_id: user._id,
        created_by_username: user.username,
      },
    } as Product;
    return await this.prototype.productCollection.insertOne({
      ...productPropMaptoBson,
      _id: new ObjectId(),
    });
  }
  static async UpdateProduct(product: Product, ID: string, accessToken: any) {
    return await this.prototype.productCollection.updateOne(
      { _id: new ObjectId(ID) },
      {
        $set: {
          ...product,
          last_modify: {
            updated_at: new Date(),
            updated_by_id: accessToken._id,
            updated_by_username: accessToken.username,
          },
        } as Product,
      },
      { upsert: false }
    );
  }
  // static async DeleteProdct(productID: string): Promise<number> {
  //   return (
  //     await this.prototype.productCollection.deleteOne({
  //       _id: new ObjectId(productID),
  //     })
  //   ).deletedCount;
  // }
  static async DeleteManyProduct(productID: string[]) {
    return await this.prototype.productCollection.deleteMany({
      _id: { $in: productID.map((val: string) => new ObjectId(val)) },
    });
  }
}
