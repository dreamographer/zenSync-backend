import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { userSchema } from "../../validators/userValidator";
import { userController } from "../controllers/userController";
import { UserRepository } from "../../database/repository/UserRepository";
import { userInteractor } from "../../interactors/userInteractor";
import { Mailer } from "../../external-libraries/mailer";
import { Bcrypt } from "../../external-libraries/bcrypt";
import { Token } from "../../external-libraries/Token";
const repository=new UserRepository()
const mailer=new Mailer
const bcrypt=new Bcrypt 
const token=new Token
const interactor = new userInteractor(repository, mailer, bcrypt, token);
const controller=new userController(interactor)

const router = express.Router();

router.post("/signup",validateRequest(userSchema), controller.onRegisterUser.bind(controller));                                 
router.post("/login",controller.onLoginUser.bind(controller));                                 

export default router;


