import express from "express";
//import { cadastrarUsuario, loginUsuario,  } from "../controllers/usuarioController.js";
import usuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/cadastrar", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.loginUsuario);
router.post("/cadastrar/barbeiro", usuarioController.cadastrarBarbeiro);
router.post("/cadastrar/secretario", usuarioController.cadastrarSecretario);
router.get("/exibir", usuarioController.exibirUsuarios);
router.get("/exibir/:id", usuarioController.exibirUsuarioPorId);
router.patch("/atualizar/:id", usuarioController.atualizarUsuario);
router.delete("/deletar/:id", usuarioController.deletarUsuario);

export default router;
