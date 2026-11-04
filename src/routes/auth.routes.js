import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import {
  validationsLogin,
  validationsRegister,
} from "../middlewares/validations/auth.validations.js";
import { validateMiddleware } from "../middlewares/validation.middleware.js";

export const authRouter = Router();

authRouter.post("/register", validationsRegister, validateMiddleware, register);

authRouter.post("/login", validationsLogin, validateMiddleware, login);
