import { Document, ObjectId } from "bson";
import { Collection, InsertOneResult, MongoClient } from "mongodb";

export class TokenService {
  constructor(private rfTokenCollection: Collection) {}

  static async injectDB(connection: MongoClient): Promise<void> {
    try {
      if (this.prototype.rfTokenCollection) return;
      this.prototype.rfTokenCollection = connection
        .db(process.env.DB_NAME)
        .collection("refresh_token");
    } catch (error) {
      throw error;
    }
  }

  static async checkRefreshToken(token: string): Promise<Document | null> {
    try {
      return await this.prototype.rfTokenCollection.findOne<any>({ token });
    } catch (error) {
      throw error;
    }
  }

  static async storeRefreshToken(
    token: string
  ): Promise<InsertOneResult | undefined> {
    try {
      return await this.prototype.rfTokenCollection.insertOne({
        token,
        _id: new ObjectId(),
      });
    } catch (error) {
      throw error;
    }
  }
}
