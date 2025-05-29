import {pool} from "../database/db.js";

const createUser = async (nome, data_nascimento, email, senha, endereco, telefone) => {
    const result = await pool.query(
        "INSERT INTO barber.usuarios (nome, data_nascimento, email, senha, endereco, telefone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [nome, data_nascimento, email, senha, endereco, telefone]
    );
    return result.rows[0];
};

const createBarber = async (nome, data_nascimento, email, senha, endereco, telefone, tipo_usuario,  descricao, avaliacao, imagem) => {
    const result = await pool.query(
      `INSERT INTO barber.usuarios 
       (nome, data_nascimento, email, senha, endereco, telefone, tipo_usuario, descricao, avaliacao, imagem)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [nome, data_nascimento, email, senha, endereco, telefone, tipo_usuario, descricao, avaliacao, imagem]
    );
    return result.rows[0];
  };

const createSecretary = async (nome, data_nascimento, email, senha, endereco, telefone, tipo_usuario, descricao, avaliacao, imagem) => {
    const result = await pool.query(
        `INSERT INTO barber.usuarios 
        (nome, data_nascimento, email, senha, endereco, telefone, tipo_usuario, descricao, avaliacao, imagem)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [nome, data_nascimento, email, senha, endereco, telefone, tipo_usuario, descricao, avaliacao, imagem]
    );
    return result.rows[0];
};
  

const findUserByEmail = async (email) => {
    const result = await pool.query("SELECT * FROM barber.usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}

export default { createUser, findUserByEmail, createBarber, createSecretary };

