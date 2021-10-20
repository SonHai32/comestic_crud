import { CategoryResponse } from "../models/category-response.model";
import { Category } from "../models/category.model";
import { Collection, DeleteResult, MongoClient } from "mongodb";
import { ObjectId } from "bson";
import { CategoryFilter } from "../models/category-filter.model";

("use strict");

export default class CategoryService {
  constructor(private categoryCollection: Collection) {}

  static async injectDB(connection: MongoClient) {
    if (this.prototype.categoryCollection) {
      return;
    } else {
      try {
        this.prototype.categoryCollection = connection
          .db(process.env.DB_NAME)
          .collection("categories");
      } catch (error) {
        throw error;
      }
    }
  }

  static async getAllCategory(
    filter?: CategoryFilter
  ): Promise<CategoryResponse> {
    try {
      const cursor = this.prototype.categoryCollection.find<Category>({});
      let categories: Category[] = [];
      if (filter?.perPage) {
        const cursorLimit = cursor
          .limit(filter.perPage)
          .skip(filter.page ? filter.page : 0);
        if (filter.nameSort) {
          categories = await cursorLimit
            .sort({ cat_name: filter.nameSort })
            .toArray();
        }
      } else {
        if (filter?.nameSort) {
          categories = await cursor
            .sort({ cat_name: filter.nameSort })
            .toArray();
        } else {
          categories = await cursor.toArray();
        }
      }
      const totalResult =
        await this.prototype.categoryCollection.countDocuments({});
      const response: CategoryResponse = {
        status: categories ? "SUCCESS" : "FAIL",
        categories: categories ? categories : [],
        page: filter?.page ? filter.page : 0,
        perPage: filter?.perPage ? filter.perPage : null,
        totalResult: totalResult,
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryByID(slug: string) {
    try {
      return await this.prototype.categoryCollection.findOne<Category>({
        slug,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryByName(cat_name: string) {
    try {
      return await this.prototype.categoryCollection.findOne<Category>({
        cat_name,
      });
    } catch (error) {
      throw error;
    }
  }

  static async isSlugExisted(slug: string) {
    try {
      return await this.prototype.categoryCollection.findOne<Category>({
        slug,
      });
    } catch (error) {
      throw error;
    }
  }
  static async isNameExisted(name: string) {
    try {
      return await this.prototype.categoryCollection.findOne<Category>({
        name,
      });
    } catch (error) {
      throw error;
    }
  }

  static async insertCategory(category: Category) {
    try {
      return await this.prototype.categoryCollection.insertOne({
        ...category,
        _id: new ObjectId(),
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(categoryID: string, category: Category) {
    try {
      return await this.prototype.categoryCollection.updateOne(
        { _id: new ObjectId(categoryID) },
        { $set: category },
        { upsert: false }
      );
    } catch (error) {
      throw error;
    }
  }
  static async deleteCategory(
    listID: string[]
  ): Promise<DeleteResult | undefined> {
    try {
      return await this.prototype.categoryCollection.deleteMany({
        _id: { $in: listID.map((val) => new ObjectId(val)) },
      });
    } catch (error) {
      throw error;
    }
  }
}
