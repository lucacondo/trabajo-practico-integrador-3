import { body, param } from "express-validator";
import { EventModel } from "../../models/event.model.js";
import { CategoryModel } from "../../models/category.model.js";

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

export const updateEventValidations = [
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser un texto")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .custom(async (title, { req }) => {
      const event = await EventModel.findOne({ title });

      if (event && event._id.toString() !== req.params.id) {
        throw new Error("Ya existe un evento con ese título");
      }

      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser un texto")
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate debe ser una fecha válida")
    .bail()
    .custom(async (startDate, { req }) => {
      const event = await EventModel.findById(req.params.id);

      if (!event) {
        return true;
      }

      const endDate = req.body.endDate ?? event.endDate;

      if (new Date(startDate) >= new Date(endDate)) {
        throw new Error("startDate debe ser anterior a endDate");
      }

      return true;
    }),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate debe ser una fecha válida")
    .bail()
    .custom(async (endDate, { req }) => {
      const event = await EventModel.findById(req.params.id);

      if (!event) {
        return true;
      }

      const startDate = req.body.startDate ?? event.startDate;

      if (new Date(endDate) <= new Date(startDate)) {
        throw new Error("endDate debe ser posterior a startDate");
      }

      return true;
    }),

  body("capacity")
    .optional()
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
    .optional()
    .isString()
    .withMessage("El venue debe ser un texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El venue debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .optional()
    .isString()
    .withMessage("La dirección debe ser un texto")
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .optional()
    .isString()
    .withMessage("La ciudad debe ser un texto")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("categories debe ser un array")
    .bail()
    .custom(async (categories) => {
      const validIds = categories.every(
        (id) => typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id),
      );

      if (!validIds) {
        throw new Error("Las categorías deben tener IDs válidos");
      }

      const uniqueIds = [...new Set(categories)];

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
