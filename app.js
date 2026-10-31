import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { startDB } from "./src/config/database.js";
import { userRouter } from "./src/routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

//rutas
app.use("/api", userRouter);

app.listen(PORT, async () => {
  await startDB();
  console.log("Servidor corriendo en el puerto", PORT);
});
