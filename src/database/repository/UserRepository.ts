import { User } from "../../entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { User as UserModel} from "../models/User";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const User = await UserModel.findOne({ _id: id }); //!!update to send only requred data
    if (User) {
      const userData: User = {
        id: User._id.toString(),
        fullname: User.fullname,
        email: User.email,
        password: User.password,
        profile: User.profile || undefined,
        verify_token: User.verify_token,
        verified: User.verified,
      };
      return userData;
    }
    return null;
  }

  async getUsersFromSearch(email: string): Promise<any[]> {
    if (!email) return [];
    const accounts = await UserModel.find(
      {
        email: { $regex: `^${email}`, $options: "i" },
        verified: true,
      },
      { id: "$_id" , fullname: 1, email: 1, profile: 1,_id:0 }
    );
    return accounts;
  }


  
  async findByEmail(email: string): Promise<User | null> {
    const User = await UserModel.findOne({ email: email });
    if (User) {
      const userData: User = {
        id: User._id.toString(),
        fullname: User.fullname,
        email: User.email,
        password: User.password,
        profile: User.profile || undefined,
        verify_token: User.verify_token,
        verified: User.verified,
      };
      return userData;
    }
    return null;
  }

  async update(id: string, data: any): Promise<User | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    if (updatedUser) {
      return {
        id: updatedUser._id.toString(),
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        password: updatedUser.password,
        profile: updatedUser.profile || undefined,
        verify_token: updatedUser.verify_token,
        verified: updatedUser.verified,
      };
    }
    return null;
  }

  
  async deleteUnverifiedAccounts(): Promise<void> {
    const fifteenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const unverifiedAccounts = await UserModel.find({
      createdAt: { $lte: fifteenMinutesAgo },
      verified: false,
    });

    for (const account of unverifiedAccounts) {
      await UserModel.deleteOne({ _id: account._id });
    }
  }
  async create(data: User): Promise<User> {
    const newUserDocument = await UserModel.create(data);
    setTimeout(this.deleteUnverifiedAccounts, 10 * 60 * 1000);
    const newUser: User = {
      id: newUserDocument._id.toString(),
      fullname: newUserDocument.fullname,
      email: newUserDocument.email,
      password: newUserDocument.password,
      profile: newUserDocument.profile || undefined,
      verify_token: newUserDocument.verify_token,
      verified: newUserDocument.verified,
    };
    return newUser;
  }
}