import { body, param } from "express-validator";
import { UserModel } from "../../models/user.model.js";

// Validar el ID del usuario
export const userIdValidation = [
  param("id").isMongoId().withMessage("El ID del usuario no es válido"),
];

// Validaciones del perfil embebido
const profileValidations = [
  body("profile.firstName")
    .optional()
    .isString()
    .withMessage("El nombre debe ser un texto")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u)
    .withMessage("El nombre solo puede contener letras"),

  body("profile.lastName")
    .optional()
    .isString()
    .withMessage("El apellido debe ser un texto")
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u)
    .withMessage("El apellido solo puede contener letras"),

  body("profile.birthDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("La fecha de nacimiento no es válida")
    .bail()
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }

      return true;
    }),

  body("profile.phone")
    .optional()
    .matches(/^\d{8,15}$/)
    .withMessage("El teléfono debe tener entre 8 y 15 números"),
];

// Validaciones para actualizar un usuario (admin)
export const updateUserValidations = [
  body("username")
    .optional()
    .isString()
    .withMessage("El username debe ser un texto")
    .bail()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("El username debe ser alfanumérico")
    .bail()
    .custom(async (username, { req }) => {
      const user = await UserModel.findOne({ username });

      if (user && user._id.toString() !== req.params.id) {
        throw new Error("El username ya está registrado");
      }

      return true;
    }),

  body("email")
    .optional()
    .isString()
    .withMessage("El email debe ser un texto")
    .bail()
    .isEmail()
    .withMessage("El email no es válido")
    .bail()
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({ email });

      if (user && user._id.toString() !== req.params.id) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("password")
    .optional()
    .isString()
    .withMessage("La contraseña debe ser un texto")
    .bail()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("Debe contener una mayúscula")
    .matches(/[a-z]/)
    .withMessage("Debe contener una minúscula")
    .matches(/[0-9]/)
    .withMessage("Debe contener un número"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser user o admin"),

  ...profileValidations,
];

// Validaciones para actualizar el propio perfil
export const updateProfileValidations = [...profileValidations];
