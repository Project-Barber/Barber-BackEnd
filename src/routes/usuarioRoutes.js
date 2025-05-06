import express from "express";
//import { cadastrarUsuario, loginUsuario,  } from "../controllers/usuarioController.js";
import usuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/cadastrar", usuarioController.cadastrarUsuario);
router.post("/login", usuarioController.loginUsuario);
router.post("/cadastrar/barbeiro", usuarioController.cadastrarBarbeiro);
router.post("/cadastrar/secretario", usuarioController.cadastrarSecretario);


export default router;
