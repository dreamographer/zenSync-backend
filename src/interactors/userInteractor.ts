import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserInteractor } from "../interfaces/IUserInteractor";
import { IMailer } from "../interfaces/IMailer";

export class userInteractor implements IUserInteractor {
  private repository: IUserRepository;
  private mailer: IMailer;

  constructor(
    repository: IUserRepository,
    mailer: IMailer,
  ) {
    this.repository = repository;
    this.mailer=mailer
  }

  async registerUser(input: User) {
    const data=this.repository.create(input);
    this.mailer.SendEmail("ashwink",data)
    return data
  }
}