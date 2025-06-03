import express from "express";
import agendamentoController from "../controllers/agendamentoController.js";

const router = express.Router();

router.post("/", agendamentoController.criarAgendamento);
router.get("/horarios-disponiveis", agendamentoController.horariosDisponiveis);

export default router;
