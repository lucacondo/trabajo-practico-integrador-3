import { body, param } from "express-validator";
import { CategoryModel } from "../../models/category.model.js";

export const createCategoryValidations = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .custom(async (name) => {
      const category = await CategoryModel.findOne({ name });

      if (category) {
        throw new Error("La categoría ya existe");
      }

      return true;
    }),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar 200 caracteres"),
];

export const categoryIdValidation = [
  param("id").isMongoId().withMessage("ID de categoría inválido"),
];

// Validaciones para actualizar categorías
export const updateCategoryValidations = [
  body("name")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .custom(async (name, { req }) => {
      const category = await CategoryModel.findOne({ name });

      if (category && category._id.toString() !== req.params.id) {
        throw new Error("Ya existe una categoría con ese nombre");
      }

      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar 200 caracteres"),
];
