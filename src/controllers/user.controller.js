import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";
import { matchedData } from "express-validator";
import { hashPassword } from "../helpers/bcrypt.helpers.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      deletedAt: null,
    })
      .select("-password")
      .populate("events");

    return res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).populate("events");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuario obtenido correctamente",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const data = matchedData(req, { locations: ["body"] });

    const user = await UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    user.deletedAt = new Date();

    await user.save();

    await EventModel.deleteMany({
      organizer: id,
    });

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
