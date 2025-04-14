import pool from "../database/db.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const cadastrarUsuario = async (req, res) => {
  const { nome, data_nascimento, email, senha, endereco, telefone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO barber.usuarios (nome, data_nascimento, email, senha, endereco, telefone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nome, data_nascimento, email, hashedPassword, endereco, telefone]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso", usuario: result.rows[0] });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }  
};

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query("SELECT * FROM barber.usuarios WHERE email = $1", [email]);
    const usuario = result.rows[0];

    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

const removerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM barber.usuarios WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) return res.status(404).json({ error: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário removido com sucesso", usuario: result.rows[0] });
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    res.status(500).json({ error: "Erro ao remover usuário" });
  }
}
const todosOsUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM barber.usuarios");
    const usuarios = result.rows;

    if (usuarios.length === 0) return res.status(404).json({ error: "Nenhum usuário encontrado" });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
}

const buscarUsuarioPorID = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM barber.usuarios WHERE id = $1", [id]);
    const usuario = result.rows[0];

    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}

const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, email, senha, endereco, telefone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "UPDATE barber.usuarios SET nome = $1, data_nascimento = $2, email = $3, senha = $4, endereco = $5, telefone = $6 WHERE id = $7 RETURNING *",
      [nome, data_nascimento, email, hashedPassword, endereco, telefone, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Usuário não encontrado" });

    res.status(200).json({ message: "Usuário atualizado com sucesso", usuario: result.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}
export { cadastrarUsuario, loginUsuario, todosOsUsuarios,buscarUsuarioPorID, removerUsuario, atualizarUsuario };