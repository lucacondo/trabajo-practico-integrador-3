import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";
import { EventModel } from "../models/event.model.js";

// Crear categoría
export const createCategory = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const category = await CategoryModel.create(data);

    return res.status(201).json({
      msg: "Categoría creada correctamente",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().populate("events");

    return res.status(200).json({
      msg: "Categorías encontradas correctamente",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

// Obtener categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id).populate("events");

    if (!category) {
      return res.status(404).json({
        msg: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      msg: "Categoría encontrada correctamente",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

// Actualizar categoría
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req, { locations: ["body"] });

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!category) {
      return res.status(404).json({
        msg: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      msg: "Categoría actualizada correctamente",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

// Eliminar categoría
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        msg: "Categoría no encontrada",
      });
    }

    await EventModel.updateMany(
      { categories: id },
      { $pull: { categories: id } },
    );

    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Categoría eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};
