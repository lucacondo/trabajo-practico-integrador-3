import { Router } from "express";
import {
  login,
  register,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";

import {
  validationsLogin,
  validationsRegister,
} from "../middlewares/validations/auth.validations.js";
import { updateProfileValidations } from "../middlewares/validations/user.validations.js";

import { validateMiddleware } from "../middlewares/validation.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", validationsRegister, validateMiddleware, register);

authRouter.post("/login", validationsLogin, validateMiddleware, login);

authRouter.get("/profile", authMiddleware, getProfile);

authRouter.put(
  "/profile",
  authMiddleware,
  updateProfileValidations,
  validateMiddleware,
  updateProfile,
);

authRouter.post("/logout", authMiddleware, logout);
