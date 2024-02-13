import { User } from "../../entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { User as UserModel} from "../models/User";

export class UserRepository implements IUserRepository{
    async find(email: string): Promise<User | null> {
        const User=await UserModel.findOne({email:email})
        if(User){
            User.id=User._id
        }
        return User
    }
    
    async create(data: User): Promise<User> {
        const newUser = await UserModel.create(data)
            newUser.id = newUser._id;
        return newUser
    }

}