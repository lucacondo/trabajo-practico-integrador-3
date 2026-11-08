import { EventModel } from "../models/event.model.js";

export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        msg: "Evento no encontrado",
      });
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (event.organizer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        msg: "No tienes permiso para cambiar este evento",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Error interno en el servidor",
      error,
    });
  }
};
