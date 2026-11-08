import { Router } from "express";

import {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

import {
  createEventValidations,
  updateEventValidations,
  eventIdValidation,
} from "../middlewares/validations/event.validations.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/ownerOrAdmin.middleware.js";
import { validateMiddleware } from "../middlewares/validation.middleware.js";

export const eventRouter = Router();

// Crear evento
eventRouter.post(
  "/events",
  authMiddleware,
  createEventValidations,
  validateMiddleware,
  createEvent,
);

// Obtener todos los eventos
eventRouter.get("/events", authMiddleware, getAllEvents);

// Obtener mis eventos
eventRouter.get("/events/my", authMiddleware, getMyEvents);

// Obtener evento por ID
eventRouter.get(
  "/events/:id",
  authMiddleware,
  eventIdValidation,
  validateMiddleware,
  getEventById,
);

// Actualizar evento
eventRouter.put(
  "/events/:id",
  authMiddleware,
  eventIdValidation,
  updateEventValidations,
  validateMiddleware,
  ownerOrAdminMiddleware,
  updateEvent,
);

// Eliminar evento
eventRouter.delete(
  "/events/:id",
  authMiddleware,
  eventIdValidation,
  validateMiddleware,
  ownerOrAdminMiddleware,
  deleteEvent,
);
