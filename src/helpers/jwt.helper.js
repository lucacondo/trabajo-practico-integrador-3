import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  } catch (error) {
    throw new error("Error generando el token: " + error.message);
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.sign(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new error("Error verificando el token: " + error.message);
  }
};
