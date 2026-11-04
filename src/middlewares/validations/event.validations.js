import { body, param } from "express-validator";
import { EventModel } from "../models/event.model.js";
import { CategoryModel } from "../models/category.model.js";

export const createEventValidations = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .custom(async (title) => {
      const event = await EventModel.findOne({ title });

      if (event) {
        throw new Error("Ya existe un evento con ese título");
      }

      return true;
    }),

  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("startDate es obligatorio")
    .isISO8601()
    .withMessage("startDate debe ser una fecha válida"),

  body("endDate")
    .notEmpty()
    .withMessage("endDate es obligatorio")
    .isISO8601()
    .withMessage("endDate debe ser una fecha válida")
    .bail()
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("endDate debe ser posterior a startDate");
      }

      return true;
    }),

  body("capacity")
    .isInt({ min: 1 })
    .withMessage("capacity debe ser un entero mayor o igual a 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("price debe ser mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("Estado inválido"),

  body("location.venue")
    .notEmpty()
    .withMessage("El venue es obligatorio")
    .isLength({ min: 3, max: 100 }),

  body("location.address")
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .isLength({ min: 5, max: 150 }),

  body("location.city")
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .isString()
    .withMessage("La ciudad debe ser un texto")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  // Validaciones de categorías

  body("categories")
    .optional()
    .isArray()
    .withMessage("categories debe ser un array")
    .bail()
    .custom(async (categories) => {
      // Verificar que todos los IDs tengan un formato válido
      const validIds = categories.every(
        (id) => typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id),
      );

      if (!validIds) {
        throw new Error("Las categorías deben tener IDs válidos");
      }

      // Evitar contar IDs repetidos
      const uniqueIds = [...new Set(categories)];

      // Buscar las categorías existentes
      const count = await CategoryModel.countDocuments({
        _id: { $in: uniqueIds },
      });

      if (count !== uniqueIds.length) {
        throw new Error("Una o más categorías no existen");
      }

      return true;
    }),

  body("categories.*")
    .isMongoId()
    .withMessage("Una de las categorías tiene un ID inválido"),
];

export const eventIdValidation = [
  param("id").isMongoId().withMessage("El ID del evento no es válido"),
];
