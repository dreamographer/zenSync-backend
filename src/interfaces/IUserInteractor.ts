import { Types } from "mongoose";
import { User } from "../entities/User";

export interface IUserInteractor {
  registerUser(data: User): Promise<User>;

}