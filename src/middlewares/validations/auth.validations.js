import { body } from "express-validator";
import { UserModel } from "../../models/user.model.js";

export const validationsRegister = [
  body("username")
    .notEmpty()
    .withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username debe ser alfanumerico")
    .custom(async (username) => {
      const user = await UserModel.findOne({ username });

      if (user) {
        throw new Error("El username ya está registrado");
      }

      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("El email no debe estar vació")
    .isEmail()
    .withMessage("El email debe ser valido")
    .custom(async (email) => {
      const email = await UserModel.findOne({ email });

      if (email) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("La password no debe estar vacía")
    .isLength({ min: 8 })
    .withMessage("La password debe contener 8 caracteres minimo")
    .matches(/[A - Z]/)
    .withMessage("Debe contener al menos una mayúscula")
    .matches(/[a-z]/)
    .withMessage("Debe contener al menos una minúscula")
    .matches(/[0-9]/)
    .withMessage("Debe contener al menos un numero"),

  body("profile.firstName")
    .notEmpty()
    .withMessage("El firstName no debe ser vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("Debe contener entre 2 a 50 caracteres"),

  body("profile.lastName")
    .notEmpty()
    .withMessage("El firstName no debe ser vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("Debe contener entre 2 a 50 caracteres"),

  body("birthDate")
    .optional()
    .isISO8601()
    .withMessage("La fecha de nacimiento debe ser valida")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("La fecha de nacimiento no pueda ser futura");
      }

      return true;
    }),

  body("phone")
    .optional()
    .matches(/^\d{8,15}$/),
];

export const validationsLogin = [
  body("username")
    .notEmpty()
    .withMessage("El username es obligatorio")
    .isString()
    .withMessage("El username debe ser un texto"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isString()
    .withMessage("La contraseña debe ser un texto"),
];
