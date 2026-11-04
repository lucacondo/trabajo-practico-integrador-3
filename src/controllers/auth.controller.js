import { matchedData } from "express-validator";
import { comparePassword, hashPassword } from "../helpers/bcrypt.helpers.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const data = matchedData(req);

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: "Usuario registrado exitosamente",
      data: user,
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
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username, deletedAt: null });

    if (!user) {
      return res.status(401).json({ msg: "Credenciales invalidas" });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ msg: "Credenciales invalidas" });
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

    return res.status(200).json({ msg: "Login exitoso" });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno en el servidor", error });
  }
};
