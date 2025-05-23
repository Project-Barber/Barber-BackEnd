import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";

import usuarioRoutes from "./src/routes/usuarioRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/usuarios", usuarioRoutes);

app.get("/", (req, res) => {
  res.send("API da barbearia funcionando com segurança! 🔐✂️");
});

export default app;
