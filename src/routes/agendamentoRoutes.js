import express from "express";
import agendamentoController from "../controllers/agendamentoController.js";
import globalMiddlewares from '../middlewares/globalMiddlewares.js';

const router = express.Router();

router.post("/", globalMiddlewares.jwtRequired, agendamentoController.criarAgendamento);
router.get("/horarios-disponiveis", globalMiddlewares.jwtRequired, agendamentoController.horariosDisponiveis);
router.get('/services', globalMiddlewares.jwtRequired, agendamentoController.getServicos);

export default router;
