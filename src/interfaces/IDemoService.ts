import { User } from "../entities/User";

export interface IDemoService {
  createDemoUser(): Promise<User>;
  seedDemoData(userId: string): Promise<void>;
  purgeExpiredDemoUsers(): Promise<number>;
  generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  };
}
