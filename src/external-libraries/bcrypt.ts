
import bcrypt from "bcryptjs"
import { IBcrypt } from "../interfaces/IBcrypt";

export class Bcrypt implements IBcrypt {
  private saltRounds = 10;
  async Encrypt(input: string): Promise<string> {
    return await bcrypt.hash(input, this.saltRounds);
    
  }
  async compare(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}