import { User } from "../../entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { User as UserModel} from "../models/User";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const User = await UserModel.findOne({ _id: id });  //!!update to send only requred data 
    if (User) {   
      const userData: User = {
        id: User._id.toString(),
        fullname: User.fullname,
        email: User.email,
        password: User.password,
        profile: User.profile || undefined,
        verify_token: User.verify_token || undefined,
        verified: User.verified,
      };
      return userData;
    }
    return null;
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
        verify_token: User.verify_token || undefined,
        verified: User.verified,
      };
      return userData;
    }
    return null;
  }

  async update(email: string, data: any): Promise<User | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
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
        verify_token: updatedUser.verify_token || undefined,
        verified: updatedUser.verified,
      };
    }
    return null;
  }

  async create(data: User): Promise<User> {
    const newUserDocument = await UserModel.create(data);
    const newUser: User = {
      id: newUserDocument._id.toString(),
      fullname: newUserDocument.fullname,
      email: newUserDocument.email,
      password: newUserDocument.password,
      profile: newUserDocument.profile || undefined,
      verify_token: newUserDocument.verify_token || undefined,
      verified: newUserDocument.verified,
    };
    return newUser;
  }
}