import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import { validateToken } from "../middleware/validateToken";
import { userSchema } from "../validators/userValidator";
import { authController } from "../controllers/authController";
import { demoController } from "../controllers/demoController";
import { UserRepository } from "../../database/repository/UserRepository";
import { authService } from "../../services/userService";
import { Mailer } from "../../external-libraries/mailer";
import { Bcrypt } from "../../external-libraries/bcrypt";
import { Token } from "../../external-libraries/Token";
import { DemoService } from "../../services/demoService";
import { WorkspaceRepository } from "../../database/repository/workspaceRepository";
import { FolderRepository } from "../../database/repository/folderRepository";
import { FileRepository } from "../../database/repository/fileRepository";
import passport from "passport";
const repository = new UserRepository();
const mailer = new Mailer();
const bcrypt = new Bcrypt();
const token = new Token();
const auth = new authService(repository, mailer, bcrypt, token);
const controller = new authController(auth);
const demo = new DemoService(
  repository,
  new WorkspaceRepository(),
  new FolderRepository(),
  new FileRepository(),
  bcrypt,
  token
);
const demoCtrl = new demoController(demo);
const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL;

router.post(
  "/signup",
  validateRequest(userSchema),
  controller.onRegisterUser.bind(controller)
);
router.post("/login", controller.onLoginUser.bind(controller));
router.post("/demo", demoCtrl.onDemoLogin.bind(demoCtrl));
router.put("/:userId", controller.updateUsername.bind(controller));
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

router.get("/users/me", validateToken, controller.onUserFind.bind(controller));

router.get(
  "/search",
  validateToken,
  controller.getUsersFromSearch.bind(controller)
);

export default router;
