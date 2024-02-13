import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserInteractor } from "../interfaces/IUserInteractor";
import { IMailer } from "../interfaces/IMailer";
import { IBcrypt } from "../interfaces/IBcrypt";
import { IToken } from "../interfaces/IToken";

export class userInteractor implements IUserInteractor {
  private repository: IUserRepository;
  private mailer: IMailer;
  private bcrypt: IBcrypt;
  private token: IToken;
  constructor(
    repository: IUserRepository,
    mailer: IMailer,
    bcrypt: IBcrypt,
    token: IToken
  ) {
    this.repository = repository;
    this.mailer = mailer;
    this.bcrypt = bcrypt;
    this.token = token;
  }

  findUserByEmail(email: string): Promise<User | null> {
    const user = this.repository.find(email);
    return user;
  }
  async registerUser(input: User) {
    const hashedPassword = await this.bcrypt.Encrypt(input.password);
    input.password = hashedPassword;
    const data = await this.repository.create(input);
    this.mailer.SendEmail("ashwink", data);
    return data;
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    const user = await this.repository.find(email);
    if (!user) {
      return null;
    }

    const isPasswordCorrect = await this.bcrypt.compare(
      password,
      user.password
    );

    if (isPasswordCorrect && user.id !== undefined) {
      const token = this.token.generateToken(user.id.toString());
      return token;
    } else {
      return null;
    }
  }
}
