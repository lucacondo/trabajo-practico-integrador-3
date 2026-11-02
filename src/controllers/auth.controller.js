import { comparePassword, hashPassword } from "../helpers/bcrypt.helpers.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;

    if (!username || !email || !password || !profile) {
      return res.status(400).json({
        msg: "Todos los campos son requeridos",
      });
    }

    const existingUsername = await UserModel.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        msg: "Este username ya está registrado",
      });
    }

    const existingEmail = await UserModel.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        msg: "Este email ya está registrado",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profile,
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
