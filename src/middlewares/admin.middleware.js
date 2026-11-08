export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "No autenticado",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        msg: "No tienes permisos de administrador",
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
