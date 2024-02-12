import express from "express";
import { validateRequest } from "../../infrastructure/middleware/validateRequest";
// import { userSchema } from "../../infrastructure/validators/userValidator";
import { userController } from "../../controllers/userController";
import { UserRepository } from "../../database/repository/UserRepository";
import { userInteractor } from "../../interactors/userInteractor";
import { Mailer } from "../../external-libraries/mailer";
const repository=new UserRepository()
const mailer=new Mailer
const interactor=new userInteractor(repository,mailer)
const controller=new userController(interactor)

const router = express.Router();

router.post("/signup", controller.onRegisterUser.bind(controller));                                 

export default router;
