import { NextFunction, Request, Response } from "express";
import { IUserInteractor } from "../../interfaces/IUserInteractor";
import { userInteractor } from "../../interactors/userInteractor";
interface UserProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

interface User {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
  provider: string;
  _raw: string;
  _json: UserProfile;
}

export class userController {
  private interactor: IUserInteractor;
  constructor(interactor: IUserInteractor) {
    this.interactor = interactor;
  }
  async onRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const existingUser = await this.interactor.findUserByEmail(body.email);
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "User Already exits with given email" });
      }
      const data = await this.interactor.registerUser(body);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async handleGoogleCallback(req: Request, res: Response) {
    if (req && req.user) {
      const user = (req.user as User)._json;
      const existingUser = await this.interactor.findUserByEmail(user.email);
      if (existingUser && existingUser.id) {
        const token =  this.interactor.generateToken(
          existingUser.id.toString()
        );
          if (token) {
            res.cookie("jwt", token, {
              httpOnly: true,
              secure: true,
              maxAge: 30 * 24 * 60 * 60 * 1000, 
            });
            return res.redirect("http://localhost:5000/auth/home");
          }
      }else{
        const data = { fullname: user.name ,email:user.email,profile:user.picture,password:user.sub};
        const resp = await this.interactor.registerUser(data);
        return res.redirect("http://localhost:3000/login");
      }
    }
 
  }
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await this.interactor.loginUser(email, password);
      if (token) {
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return res.status(200).json({ message: "Sign-in successful" });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      next(error);
    }
  }
}
