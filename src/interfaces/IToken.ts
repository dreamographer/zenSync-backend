export interface IToken {
  generateToken(userId: string): string;
  verifyToken(token: string): any;
}
