import { User } from "../../entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { User as UserModel} from "../models/User";

export class UserRepository implements IUserRepository{
    async find(email: string): Promise<User | null> {
        const User=await UserModel.findOne({email:email})
        if(User){
            const userData: User = {
              id: User._id.toString(),
              fullname: User.fullname,
              email: User.email,
              password: User.password,
              profile: User.profile || undefined, // Ensure profile is optional
            };
            return userData;
        }
        return null
    }
    
    async create(data: User): Promise<User> {
     const newUserDocument = await UserModel.create(data);
     const newUser: User = {
       id: newUserDocument._id.toString(),
       fullname: newUserDocument.fullname,
       email: newUserDocument.email,
       password: newUserDocument.password,
       profile: newUserDocument.profile || undefined, // Ensure profile is optional
     };
     return newUser;
      return newUser;
    }

}