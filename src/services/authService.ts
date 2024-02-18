import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserAuth } from "../interfaces/IUserAuth";
import { IMailer } from "../interfaces/IMailer";
import { IBcrypt } from "../interfaces/IBcrypt";
import { IToken } from "../interfaces/IToken";
import { v4 as uuidv4 } from "uuid";
export class authService implements IUserAuth {
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
  generateToken(userId: string): string {
    return this.token.generateToken(userId);
  }

  findUserByEmail(email: string): Promise<User | null> {
    const user = this.repository.findByEmail(email);
    return user;
  }
  findUserById(id: string): Promise<User | null> {
    const user = this.repository.findById(id);
    return user;
  }
  async verifyUser(email: string, token: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);

    if (user) {
      if (user.verify_token === token) {
        const data = {
          verified: true,
        };
        const update = await this.repository.update(email, data);
        if (update) {
          return update;
        }
      }
    }
    return null;
  }
  async registerUser(input: User, type?: string) {
    if (input.password) {
      const hashedPassword = await this.bcrypt.Encrypt(input.password);
      input.password = hashedPassword;
    }
    const token = uuidv4();
    input.verify_token = token;
    const data = await this.repository.create(input);
    if (type) {
      return data;
    } else {
      const email = data.email;
      const html = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            color: #333;
            font-size: 24px;
            margin: 0;
        }

        .content {
            margin-bottom: 30px;
        }

        .content p {
            margin: 0 0 10px;
            line-height: 1.5;
        }

        .footer {
            text-align: center;
        }

        .footer p {
            color: #999;
            font-size: 14px;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Greetings, ${data.fullname}</h1>
        </div>
        <div class="content">
        <p>Welcome To <strong>zenSync.</strong></p>
        <p>Your All-In-One collaboration and productivity platform</p>
        <p>Verify Your Email and Make your TeamWork Zen</p>
        <div >
        <a href=${process.env.SERVER_URL}/auth/verify-email?email=${email}&token=${token}>Verify</a>
        <div>
        </div>
    </div>
</body>
</html>`;
      this.mailer.SendEmail(email, html);
      return data;
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    if (user.password) {
      const isPasswordCorrect = await this.bcrypt.compare(
        password,
        user.password
      );
      if (isPasswordCorrect && user.id !== undefined) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
