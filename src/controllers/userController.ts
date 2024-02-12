import { NextFunction ,Request,Response} from "express";
import { IUserInteractor } from "../interfaces/IUserInteractor";
export class userController {
  private interactor: IUserInteractor;
  constructor(interactor: IUserInteractor){
    this.interactor=interactor
  }
  async onRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
        const body=req.body

        const data=await this.interactor.registerUser(body)
        return res.json(data)
    } catch (error) {
        next(error)
    }
  }
}