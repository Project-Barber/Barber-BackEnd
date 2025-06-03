import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import {conectDataBase } from './src/database/db.js';

import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import agendamentoRoutes from "./src/routes/agendamentoRoutes.js";


dotenv.config();
conectDataBase();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());


app.use("/usuarios", usuarioRoutes);

app.use("/agendamentos", agendamentoRoutes);

app.get("/", (req, res) => {
  res.send("API da barbearia funcionando com segurança! 🔐✂️");
});

export default app;
