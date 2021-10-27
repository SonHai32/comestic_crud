import { ProductResponse } from "../models/product-response.model";
import { Collection, FindCursor, MongoClient } from "mongodb";
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

  static async getProduct(query?: any) {
    try {
      let _query = [];

      if (query) {
        if (query.name) _query.push({ $text: { $search: query.name } });

        if (query.category_slug)
          _query.push({ "category.slug": query.category_slug });

        if (query.price)
          _query.push({ display_price: new Double(query.price) });

        if (query.priceStart && query.priceEnd)
          _query.push({
            display_price: {
              $gte: new Double(query.priceStart),
              $lte: new Double(query.priceEnd),
            },
          });
      }

      const finalQuery = _query.length > 0 ? { $and: _query } : {};
      const cursor = this.prototype.productCollection.find<Product>(finalQuery);
      const displayCursor: FindCursor<Product> =
        query?.page && query.perPage
          ? cursor.limit(query.perPage).skip(query.page - 1) // client alway send page index filter greater than 0
          : cursor;
      const productList: Product[] = await displayCursor.toArray();
      const totalNumProduct =
        await this.prototype.productCollection.countDocuments(finalQuery);

      return {
        status: productList ? "SUCCESS" : "FAIL",
        product_list: productList,
        total_result: totalNumProduct,
        page: query?.page ? query.page : 0,
        per_page: query?.perPage ? query.perPage : null,
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
