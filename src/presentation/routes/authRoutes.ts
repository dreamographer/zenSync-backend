import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import {validateToken} from "../middleware/validateToken"
import { userSchema } from "../validators/userValidator";
import { userController } from "../controllers/userController";

import passport from "passport";

const controller = new userController();

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
