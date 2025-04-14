import express from "express";
import { cadastrarUsuario, loginUsuario, todosOsUsuarios,removerUsuario,atualizarUsuario,buscarUsuarioPorID } from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/cadastrar", cadastrarUsuario);
router.post("/login", loginUsuario);
router.delete("/remover/:id", removerUsuario);
router.get("/buscar", todosOsUsuarios);
router.get("/buscar/:id", buscarUsuarioPorID);
router.put("/atualizar/:id", atualizarUsuario);

export default router;
