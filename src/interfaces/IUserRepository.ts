import { User } from "../entities/User";

export interface IUserRepository{
    create(data:User):Promise<User>;
    find(email:string):Promise<User|null>
}