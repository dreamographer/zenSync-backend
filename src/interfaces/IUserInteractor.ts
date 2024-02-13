import { Types } from "mongoose";
import { User } from "../entities/User";

export interface IUserInteractor {
  registerUser(data: User): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  loginUser(email: string, password: string): Promise<string | null>;
}