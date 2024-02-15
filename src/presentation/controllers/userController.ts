import { NextFunction, Request, Response } from "express";
import { IUserInteractor } from "../../interfaces/IUserInteractor";
import { userInteractor } from "../../interactors/userInteractor";
const CLIENT_URL = process.env.CLIENT_URL;
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

  async handlePassportCallback(req: Request, res: Response) {
  try {
      if (req && req.user) {
        const user = (req.user as User);
        const email=user.emails[0].value
        const existingUser = await this.interactor.findUserByEmail(email);
        let token;
        if (existingUser && existingUser.id) {
          token = this.interactor.generateToken(existingUser.id.toString());
        } else {
          const data = {
            fullname: user.displayName,
            email: email,
            profile: user.photos[0].value,
            password: user.id,
          };
          const resp = await this.interactor.registerUser(data, "Google");
          if (resp && resp.id) {
            token = this.interactor.generateToken(resp.id.toString());
          }
        }
        if (token) {
          res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          
          return res.redirect(`${CLIENT_URL}/dashboard`);
        }
      }
  } catch (error) {
    console.log(error);
    
  }
 
  }

  async onVerifyUser(req: Request, res: Response, next: NextFunction) {
   try {
      const token = req.query.token as string;
      const email = req.query.email as string;
      const result = await this.interactor.verifyUser(email, token);
      if (result) {
        res.redirect(`${CLIENT_URL}/verify-email?token=${token}`);
      } else {
        const error = "Invalid token";
        res.redirect(`${CLIENT_URL}/verify-email?error=${error}`);
      }
   } catch (error) {
    
   }
  }
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      
      const user = await this.interactor.loginUser(email, password);
      console.log(user);
      
      if (user?.id) {
        const token =  this.interactor.generateToken(user.id)
      if (token) {
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return res.status(200).json({ message: "Sign-in successful",user });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }
    } catch (error) {
      next(error);
    }
  }
  async onUserLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
    return  res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async onUserFind(req: Request, res: Response, next: NextFunction) {
    try {
      
      const userId=req.user as string
      const user=await this.interactor.findUserById(userId)
      return res.json(user)
    } catch (error) {
      console.log(error);
      
    }
    
  }
}
