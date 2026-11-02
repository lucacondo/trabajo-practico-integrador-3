export const adminMiddleware = (req, res, next) => {
  try {
    const token = req.cookies["token"];

    if (!token) {
      return res.status(401).json({ msg: "No autenticado" });
    }

    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error interno en el servidor" });
  }
};
