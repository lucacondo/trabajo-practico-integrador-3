import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model.js";

export const createEvent = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    const event = await EventModel.create({
      ...data,
      organizer: req.user.id,
    });

    return res.status(201).json({
      msg: "Evento creado correctamente",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("organizer", "username email profile")
      .populate("categories", "name description");

    return res.status(200).json({
      msg: "Eventos encontrados correctamente",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.find({
      organizer: req.user.id,
    }).populate("categories", "name description");

    return res.status(200).json({
      msg: "Mis eventos encontrados correctamente",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id)
      .populate("organizer", "username email profile")
      .populate("categories", "name description");

    if (!event) {
      return res.status(404).json({
        msg: "Evento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Evento encontrado correctamente",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = matchedData(req, { locations: ["body"] });

    const event = await EventModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!event) {
      return res.status(404).json({
        msg: "Evento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Evento actualizado correctamente",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        msg: "Evento no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Evento eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};
