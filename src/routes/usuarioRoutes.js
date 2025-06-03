import express from "express";
//import { cadastrarUsuario, loginUsuario,  } from "../controllers/usuarioController.js";
import usuarioController from "../controllers/usuarioController.js";
import globalMiddlewares from '../middlewares/globalMiddlewares.js';

const router = express.Router();

router.post("/cadastrar", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.loginUsuario);
router.post("/logout", globalMiddlewares.jwtRequired, usuarioController.logout);
router.post("/cadastrar/barbeiro", usuarioController.cadastrarBarbeiro);
router.post("/cadastrar/secretario", usuarioController.cadastrarSecretario);
router.get("/exibir/todos", globalMiddlewares.jwtRequired, usuarioController.exibirUsuarios);
router.get("/exibir", globalMiddlewares.jwtRequired, usuarioController.exibirUsuarioPorId);
router.patch("/atualizar", globalMiddlewares.jwtRequired, usuarioController.atualizarUsuario);
router.delete("/deletar", globalMiddlewares.jwtRequired, usuarioController.deletarUsuario);

export default router;
