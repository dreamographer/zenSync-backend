import { NextFunction, Request, Response } from "express";
import { IUserAuth } from "../../interfaces/IUserAuth";
import { IPassportUser } from "../../interfaces/IPassportUser";
import { File } from "../../entities/File";
import { User } from "../../entities/User";
const CLIENT_URL = process.env.CLIENT_URL;


export class authController {
  private authService: IUserAuth;

  constructor(authService: IUserAuth) {
    this.authService = authService;
  }
  async onRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const existingUser = await this.authService.findUserByEmail(body.email);

      if (existingUser) {
        if (!existingUser.verified) {
          return res
            .status(409)
            .json({ error: "Verification Link Already Send" });
        }
        return res
          .status(409)
          .json({ error: "User Already exits with given email " });
      }
      const data = await this.authService.registerUser(body);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async handlePassportCallback(req: Request, res: Response) {
    try {
      if (req && req.user) {
        const user = req.user as IPassportUser;
        const email = user.emails[0].value;
        const existingUser = await this.authService.findUserByEmail(email);
        let token;
        if (existingUser && existingUser.id) {
          token = this.authService.generateToken(existingUser.id.toString());
        } else {
          const data = {
            fullname: user.displayName,
            email: email,
            profile: user.photos[0].value,
            password: user.id,
            verified: true,
          };
          const resp = await this.authService.registerUser(data, "Google");
          if (resp && resp.id) {
            token = this.authService.generateToken(resp.id.toString());
          }
        }
        if (token) {
          res.cookie("jwt", token.accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            sameSite: "none",
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
      const result = await this.authService.verifyUser(email, token);
      if (result) {
        res.redirect(`${CLIENT_URL}/verify-email?token=${token}`);
      } else {
        const error = "Invalid token";
        res.redirect(`${CLIENT_URL}/verify-email?error=${error}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.authService.loginUser(email, password);

      if (user?.id) {
        const { accessToken, refreshToken } = this.authService.generateToken(
          user.id
        );
        if (accessToken && refreshToken) {
          res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: true,
            domain: CLIENT_URL,
            path: "/",
            maxAge: 15 * 60 * 1000, // Access token expires in 15 minutes
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            domain: CLIENT_URL,
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // Refresh token expires in 24 hours
          });
          return res.status(200).json({ message: "Sign-in successful", user });
        } else {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateUsername(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const newUsername = req.body.fullname;
      const updatedUser=await this.authService.updateUsername(userId, newUsername);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating username:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async onUserLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        domain: CLIENT_URL ,
      
      });
      res.cookie("refreshToken", "", {
        httpOnly: true,
        sameSite: "none",
        expires: new Date(0),
      });
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async onUserFind(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user as string;
      const user = await this.authService.findUserById(userId);

      let data = {
        id: user?.id,
        fullname: user?.fullname,
        email: user?.email,
        verified: user?.verified,
        profile: user?.profile,
      };
      return res.json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async getUsersFromSearch(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;

      const users = await this.authService.getUsersFromSearch(email as string);

      res.json(users as User[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
