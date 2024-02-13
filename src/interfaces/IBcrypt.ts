export interface IBcrypt {
  Encrypt(data: string): Promise<string>;
  compare(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
