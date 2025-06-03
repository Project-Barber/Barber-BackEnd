
CREATE SCHEMA IF NOT EXISTS barber;

CREATE TABLE IF NOT EXISTS barber.usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'user'
    CHECK (tipo_usuario IN ('user', 'barber', 'secretary', 'admin')),
  descricao TEXT,
  avaliacao NUMERIC DEFAULT 0,
  imagem TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS barber.servicos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  duracao_em_horas INTEGER NOT NULL CHECK (duracao_em_horas > 0)
);

INSERT INTO barber.servicos (nome, duracao_em_horas) VALUES
('Corte', 1),
('Barba', 1),
('Selagem', 1),
('Corte Infantil', 1),
('Sobrancelha', 1),
('Limpeza de Pele', 1),
('Limpeza de ouvido', 1),
('Limpeza nazal', 1),
('Hidratação', 1),
('Botóx', 1)
ON CONFLICT (nome) DO NOTHING;

CREATE TABLE IF NOT EXISTS barber.disponibilidade_barbeiros (
  id SERIAL PRIMARY KEY,
  id_barbeiro INTEGER REFERENCES barber.usuarios(id),
  dia_semana VARCHAR(10) NOT NULL
    CHECK (dia_semana IN ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado')),
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS barber.agendamentos (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES barber.usuarios(id),
  id_barbeiro INTEGER REFERENCES barber.usuarios(id),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS barber.agendamento_servicos (
  id_agendamento INTEGER REFERENCES barber.agendamentos(id) ON DELETE CASCADE,
  id_servico INTEGER REFERENCES barber.servicos(id),
  PRIMARY KEY (id_agendamento, id_servico)
);

CREATE OR REPLACE FUNCTION barber.validar_conflito_agendamento()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM barber.agendamentos
    WHERE
      id_barbeiro = NEW.id_barbeiro AND
      data = NEW.data AND
      (
        (NEW.hora_inicio, NEW.hora_fim) OVERLAPS (hora_inicio, hora_fim)
      )
  ) THEN
    RAISE EXCEPTION 'Horário indisponível para o barbeiro selecionado.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verificar_conflito_agendamento
BEFORE INSERT ON barber.agendamentos
FOR EACH ROW
EXECUTE FUNCTION barber.validar_conflito_agendamento();
