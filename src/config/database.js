import mongoose from "mongoose";

export const startDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Integrador3");
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log("No se pudo conectar a la base de datos", error);
  }
};
