import { Types } from "mongoose";
import { User } from "../entities/User";

export interface IUserAuth {
  registerUser(data: Partial<User>, type?: string): Promise<User>;
  loginUser(email: string, password: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(email: string): Promise<User | null>;
  generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  };
  verifyUser(email: string, token: string): Promise<User | null>;
  getUsersFromSearch(email: string): Promise<User[]>;
  updateUsername(userId: string, newUsername: string): Promise<User | null>;
} 