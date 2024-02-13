import { NextFunction ,Request,Response} from "express";
import { IUserInteractor } from "../../interfaces/IUserInteractor";
export class userController {
  private interactor: IUserInteractor;
  constructor(interactor: IUserInteractor){
    this.interactor=interactor
  }
  async onRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
        const body=req.body
        const existingUser=await this.interactor.findUserByEmail(body.email)
        if(existingUser){
          return res.status(409).json({error:"User Already exits with given email"})
        }
        const data=await this.interactor.registerUser(body)
        return res.json(data)
    } catch (error) {
        next(error)
    }
  }
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const token=await this.interactor.loginUser(email,password)
         if (token) {
          res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });
          return res.status(200).json({ message: "Sign-in successful"});
         } else {
           return res.status(401).json({ message: "Invalid credentials" });
         }
    } catch (error) {
        next(error)
    }
  }
}