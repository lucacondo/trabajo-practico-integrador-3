import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  updateUserValidations,
  userIdValidation,
} from "../middlewares/validations/user.validations.js";
import { validateMiddleware } from "../middlewares/validation.middleware.js";

export const userRouter = Router();

userRouter.get("/users", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userIdValidation,
  validateMiddleware,
  getUserById,
);
userRouter.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userIdValidation,
  updateUserValidations,
  validateMiddleware,
  updateUser,
);
userRouter.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userIdValidation,
  validateMiddleware,
  deleteUser,
);
