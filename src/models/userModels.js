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

const findAllUsers = async() =>{
    const result = await pool.query("SELECT id,nome, data_nascimento,  email, endereco, telefone, tipo_usuario, descricao, imagem FROM barber.usuarios");
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows;
}
const findUserByID = async (id) => {
    const result = await pool.query("SELECT id,nome, data_nascimento,  email, endereco, telefone, tipo_usuario, descricao, imagem FROM barber.usuarios WHERE id = $1", [id]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}
const updateUserByID = async (id, updateFields) => {
    const fields = Object.keys(updateFields);
    const values = Object.values(updateFields);

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const result = await pool.query(
        `UPDATE barber.usuarios SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, id]
    );
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}

const deletUserByID = async (id) => {
    const result = await pool.query("DELETE FROM barber.usuarios WHERE id = $1", [id]);
    return result.rowCount;
}


export default { createUser, findUserByEmail, createBarber, createSecretary, findAllUsers, findUserByID, updateUserByID,deletUserByID };

