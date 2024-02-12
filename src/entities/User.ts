import { ObjectId } from "mongoose";

export interface User {
  id?: ObjectId;
  fullname: string;
  email: string;
  password:string
}
