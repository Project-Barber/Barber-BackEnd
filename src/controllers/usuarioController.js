import bcrypt from 'bcryptjs';
import userModels from '../models/userModels.js';
import logger from '../utils/logger.js';
import functionsBasic from '../utils/basicFunctions.js';
import globalMiddlewares from '../middlewares/globalMiddlewares.js';


const cadastrarUsuario = async (req, res) => {
  logger.info("Cadastrando usuário");
  const { nome, data_nascimento, email, senha, endereco, telefone } = req.body;

  try {
    if (!nome || !data_nascimento || !email || !senha || !endereco || !telefone) {
      logger.error("Erro ao cadastrar usuário: Campos obrigatórios não preenchidos");
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const usuarioExistente = await userModels.findUserByEmail(email);
    if (usuarioExistente) {
      logger.error("Erro ao cadastrar usuário: Email já cadastrado");
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const dataFormatada = await functionsBasic.formatDate(data_nascimento);
    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await userModels.createUser(nome, dataFormatada, email, hashedPassword, endereco, telefone);
    if (!result) {
      logger.error("Erro ao cadastrar usuário: Falha ao criar usuário");
      return res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
    logger.info(result);
    const token = await globalMiddlewares.generateToken(result.id, result.email);

    logger.info("Usuário cadastrado com sucesso");
    res.status(201).json({ message: "Usuário cadastrado com sucesso", usuario: result, token_usuario: token });

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }                 

};

const cadastrarBarbeiro = async (req, res) => {
  logger.info("Cadastrando barbeiro");
  const { nome, data_nascimento, email, senha, endereco, telefone, descricao, avaliacao, imagem } = req.body;

  try {
    if (!nome || !data_nascimento || !email || !senha || !endereco || !telefone || !descricao || !avaliacao || !imagem) {
      logger.error("Erro ao cadastrar barbeiro: Campos obrigatórios não preenchidos");
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const usuarioExistente = await userModels.findUserByEmail(email);
    if (usuarioExistente) {
      logger.error("Erro ao cadastrar barbeiro: Email já cadastrado");
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const dataFormatada = await functionsBasic.formatDate(data_nascimento);
    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await userModels.createBarber(
      nome,
      dataFormatada,
      email,
      hashedPassword,
      endereco,
      telefone,
      "barber",
      descricao,
      0,
      imagem
    );

    if (!result) {
      logger.error("Erro ao cadastrar barbeiro: Falha ao criar usuário");
      return res.status(500).json({ error: "Erro ao cadastrar barbeiro" });
    }

    logger.info(result);
    const token = await globalMiddlewares.generateToken(result.id, result.email);

    logger.info("Barbeiro cadastrado com sucesso");
    res.status(201).json({ message: "Barbeiro cadastrado com sucesso", usuario: result, token});

  } catch (error) {
    console.error("Erro ao cadastrar barbeiro:", error);
    res.status(500).json({ error: "Erro ao cadastrar barbeiro" });
  }
};

const cadastrarSecretario = async (req, res) => {
  logger.info("Cadastrando secretário");
  const { nome, data_nascimento, email, senha, endereco, telefone, descricao, avaliacao, imagem } = req.body;

  try {
    if (!nome || !data_nascimento || !email || !senha || !endereco || !telefone || !descricao || !avaliacao || !imagem) {
      logger.error("Erro ao cadastrar secretário: Campos obrigatórios não preenchidos");
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const usuarioExistente = await userModels.findUserByEmail(email);
    if (usuarioExistente) {
      logger.error("Erro ao cadastrar secretário: Email já cadastrado");
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const dataFormatada = await functionsBasic.formatDate(data_nascimento);
    const hashedPassword = await bcrypt.hash(senha, 10);

    const result = await userModels.createSecretary(
      nome,
      dataFormatada,
      email,
      hashedPassword,
      endereco,
      telefone,
      "secretary",
      descricao,
      0,
      imagem
    );

    if (!result) {
      logger.error("Erro ao cadastrar secretário: Falha ao criar usuário");
      return res.status(500).json({ error: "Erro ao cadastrar secretário" });
    }

    const token = await globalMiddlewares.generateToken(result.id, result.email);

    logger.info("Secretário cadastrado com sucesso");
    res.status(201).json({ message: "Secretário cadastrado com sucesso", usuario: result, token});
  } catch (error) {
    logger.error("Erro ao cadastrar secretário:", error);
    res.status(500).json({ error: "Erro ao cadastrar secretário" });
  }
};



const loginUsuario = async (req, res) => {
  logger.info("Realizando login do usuário");
  const { email, senha } = req.body;

  try {
    const usuario = await userModels.findUserByEmail(email);

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!usuario || !senhaCorreta) {
      logger.error("Erro ao fazer login: Usuário ou senha incorretos");
      return res.status(404).json({ error: "Usuárioou senha incorretos" });
    }
      
    const token = globalMiddlewares.generateToken(usuario);

    logger.info("Login realizado com sucesso");
    res.status(200).json({ message: "Login bem-sucedido", token: token, tipo_usuario: usuario.tipo_usuario });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

const exibirUsuarios = async(req, res) => {
  logger.info("Exibindo todos os usuários");
  try{
    const usuarios = await userModels.findAllUsers();
    if (!usuarios) {
      logger.error("Erro ao exibir usuários: Nenhum usuário encontrado");
      return res.status(404).json({ error: "Nenhum usuário encontrado" });
    }
    logger.info("Usuários exibidos com sucesso");
    res.status(200).json({ message: "Usuários exibidos com sucesso", usuarios });
  }catch(error){
    logger.error("Erro ao exibir usuários:", error);
    res.status(500).json({ error: "Erro ao exibir usuários" });
  }
}
const exibirUsuarioPorId = async(req, res) => {
  logger.info("Exibindo usuário por ID");
  const { id } = req.params;
  try{
    const usuario = await userModels.findUserByID(id);
    if (!usuario) {
      logger.error("Erro ao exibir usuário: Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    logger.info("Usuário exibido com sucesso");
    res.status(200).json({ message: "Usuário exibido com sucesso", usuario });
  }
  catch(error){
    logger.error("Erro ao exibir usuário:", error);
    res.status(500).json({ error: "Erro ao exibir usuário" });
  }
}
const atualizarUsuario = async(req, res) => {
  logger.info("Atualizando usuário");
  const { id } = req.params;
  const { nome, data_nascimento, email, senha, endereco, telefone } = req.body;

  try{
    const usuarioExistente = await userModels.findUserByID(id);
    if (!usuarioExistente) {
      logger.error("Erro ao atualizar usuário: Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const usuarioAtualizado = await userModels.updateUserByID(id, nome, data_nascimento, email, senha, endereco, telefone);
    if (!usuarioAtualizado) {
      logger.error("Erro ao atualizar usuário: Falha ao atualizar usuário");
      return res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
    logger.info("Usuário atualizado com sucesso");
    res.status(200).json({ message: "Usuário atualizado com sucesso", usuario: usuarioAtualizado });
  }catch(error){
    logger.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}
const deletarUsuario = async(req, res) => {
  logger.info("Deletando usuário");
  const { id } = req.params;
  try{
    const usuarioExistente = await userModels.findUserByID(id);
    if (!usuarioExistente) {
      logger.error("Erro ao deletar usuário: Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await userModels.deleteUserByID(id);
    logger.info("Usuário deletado com sucesso");
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  }catch(error){
    logger.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
}
export default { cadastrarUsuario, loginUsuario, cadastrarBarbeiro, cadastrarSecretario, exibirUsuarios, exibirUsuarioPorId, atualizarUsuario,deletarUsuario };
