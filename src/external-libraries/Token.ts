
import jwt from "jsonwebtoken";
import { IToken } from "../interfaces/IToken";
export class Token implements IToken {
  private readonly JWT_Key: string = process.env.JWT_SECRET||' ';
  generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_Key, { expiresIn: "24h" });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.JWT_Key);
  }
}
