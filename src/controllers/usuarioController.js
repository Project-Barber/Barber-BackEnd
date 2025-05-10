import pool from "../database/db.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const formatDateForDatabase = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`; 
};

const cadastrarUsuario = async (req, res) => {
  const { nome, data_nascimento, email, senha, endereco, telefone } = req.body;

  try {
    const dataFormatada = formatDateForDatabase(data_nascimento);

    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO barber.usuarios (nome, data_nascimento, email, senha, endereco, telefone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nome, dataFormatada, email, hashedPassword, endereco, telefone]
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

export { cadastrarUsuario, loginUsuario };
