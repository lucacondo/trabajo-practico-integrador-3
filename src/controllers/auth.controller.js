import { comparePassword } from "../helpers/bcrypt.helpers.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

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

    const token = await generateToken({
      id: user._id,
      username: user.username,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    return res - json({ msg: "Login exitoso" });
  } catch (error) {
    return res.status(500).json({ msg: "Error interno en el servidor", error });
  }
};
