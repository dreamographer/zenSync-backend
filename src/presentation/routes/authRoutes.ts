import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import {validateToken} from "../../middleware/validateToken"
import { userSchema } from "../../validators/userValidator";
import { userController } from "../controllers/userController";
import { UserRepository } from "../../database/repository/UserRepository";
import { userInteractor } from "../../interactors/userInteractor";
import { Mailer } from "../../external-libraries/mailer";
import { Bcrypt } from "../../external-libraries/bcrypt";
import { Token } from "../../external-libraries/Token";
import passport from "passport";
import { User } from "../../database/models/User";
const repository = new UserRepository();
const mailer = new Mailer();
const bcrypt = new Bcrypt();
const token = new Token();
const interactor = new userInteractor(repository, mailer, bcrypt, token);
const controller = new userController(interactor);

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL;

router.post(
  "/signup",
  validateRequest(userSchema),
  controller.onRegisterUser.bind(controller)
);
router.post("/login", controller.onLoginUser.bind(controller));
router.get("/logout", controller.onUserLogout.bind(controller));
router.get("/verify-email", controller.onVerifyUser.bind(controller));
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login`,
  }),
  controller.handlePassportCallback.bind(controller)
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${CLIENT_URL}/login`,
  }),
  controller.handlePassportCallback.bind(controller)
);
  router.get("/users/me",validateToken,controller.onUserFind.bind(controller));
export default router;
