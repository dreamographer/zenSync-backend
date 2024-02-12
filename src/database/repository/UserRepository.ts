import { User } from "../../entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { User as UserModel} from "../models/User";

export class UserRepository implements IUserRepository{
    
    async create(data: User): Promise<User> {
        const newUser = await UserModel.create(data)
            newUser.id = newUser._id;
        return newUser
    }

}