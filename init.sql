CREATE SCHEMA IF NOT EXISTS barber;

CREATE TABLE IF NOT EXISTS barber.usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  tipo_usuario VARCHAR(20) DEFAULT 'user',
    CHECK (tipo_usuario IN ('user', 'barber', 'secretary', 'admin')),
  descricao TEXT,
  avaliacao NUMERIC DEFAULT 0,
  imagem TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
