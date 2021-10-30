import { ObjectId } from "bson";
export interface ProductGroup {
  _id: ObjectId;
  group_id: string;
  title: string;
  status: boolean;
  availableIn?: Date;
  expiresIn?: Date;
  created_at: Date;
  created_by: string;
  last_modified: {
    updated_at: Date;
    updated_by: string;
  };
}
