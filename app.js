import express from "express";
import { startDB } from "./src/config/database.js";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

app.listen(PORT, async () => {
  await startDB();
  console.log("Servidor corriendo en el puerto", PORT);
});
