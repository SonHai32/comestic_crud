import { Document, ObjectId } from "bson";
import { ProductGroup } from "./../models/product-group.model";
import {
  Collection,
  DeleteResult,
  InsertManyResult,
  MongoClient,
  UpdateResult,
} from "mongodb";

export class ProductGroupService {
  constructor(private collection: Collection<ProductGroup>) {}

  public static async injectDB(connection: MongoClient) {
    if (this.prototype.collection) return;

    try {
      if (!process.env.DB_NAME) throw new Error("Missing database name");
      this.prototype.collection = connection
        .db(process.env.DB_NAME)
        .collection("product-groups");
    } catch (error) {
      throw error;
    }
  }

  public static GetProductGroup() {
    return this.prototype.collection.find<ProductGroup>({}).toArray();
  }

  public static InsertProductGroup(
    createBy: string,
    productGroups: Array<any>
  ): Promise<InsertManyResult> {
    const productGroupsMap: ProductGroup[] = productGroups.map((val) => {
      return {
        ...val,
        _id: new ObjectId(),
        created_by: createBy,
        created_at: new Date(),
        last_modified: { updated_at: new Date(), updated_by: createBy },
      } as ProductGroup;
    });
    if (!this.prototype.collection)
      throw new Error("Missing mongodb collection instance");
    return this.prototype.collection.insertMany(productGroupsMap);
  }

  public static UpdateProductGroup(
    updatedBy: string,
    productGroups: ProductGroup[]
  ) {
    if (!this.prototype.collection)
      throw new Error("Missing mongodb collection instance");
    const updateList: Array<Promise<UpdateResult>> = productGroups.map(
      (val: ProductGroup) => {
        const updateVal = {
          ...val,
          last_modified: {
            updated_at: new Date(),
            updated_by: updatedBy,
          },
        } as ProductGroup;

        return this.prototype.collection.updateOne(
          { _id: val._id },
          [{ $set: updateVal }, { $unset: "_id" }],
          { upsert: false }
        );
      }
    );

    return Promise.all(updateList);
  }

  public static DeleteProductGroup(listOfID: string[]): Promise<DeleteResult> {
    return this.prototype.collection.deleteMany({
      _id: { $in: [...listOfID.map((val: string) => new ObjectId(val))] },
    });
  }
}
