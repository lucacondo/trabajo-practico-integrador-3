import { Router } from "express";

import {
  categoryIdValidation,
  createCategoryValidations,
  updateCategoryValidations,
} from "../middlewares/validations/categories.validations.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validateMiddleware } from "../middlewares/validation.middleware.js";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

export const categoryRouter = Router();

// Crear categoría
categoryRouter.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  createCategoryValidations,
  validateMiddleware,
  createCategory,
);

// Obtener todas las categorías
categoryRouter.get("/categories", authMiddleware, getAllCategories);

// Obtener categoría por ID
categoryRouter.get(
  "/categories/:id",
  authMiddleware,
  categoryIdValidation,
  validateMiddleware,
  getCategoryById,
);

// Actualizar categoría
categoryRouter.put(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  categoryIdValidation,
  updateCategoryValidations,
  validateMiddleware,
  updateCategory,
);

// Eliminar categoría
categoryRouter.delete(
  "/categories/:id",
  authMiddleware,
  adminMiddleware,
  categoryIdValidation,
  validateMiddleware,
  deleteCategory,
);
