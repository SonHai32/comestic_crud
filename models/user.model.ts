import { Timestamp } from "bson";
export interface User {
  _id?: string;
  username: string;
  password: string;
  phone_number: string;
  email_address: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  status: boolean;
  role: "USER" | "ADMIN";
}
