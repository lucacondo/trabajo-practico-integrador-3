import { matchedData } from "express-validator";
import { comparePassword, hashPassword } from "../helpers/bcrypt.helpers.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const hashedPassword = await hashPassword(data.password);

    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
    });

    const userData = user.toObject();

    delete userData.password;

    return res.status(201).json({
      msg: "Usuario registrado exitosamente",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = matchedData(req, {
      locations: ["body"],
    });

    const user = await UserModel.findOne({
      username,
      deletedAt: null,
    });

    if (!user) {
      return res.status(401).json({
        msg: "Credenciales inválidas",
      });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        msg: "Credenciales inválidas",
      });
    }

    const token = generateToken({
      id: user._id,
      username: user.username,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({
      msg: "Login exitoso",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};
