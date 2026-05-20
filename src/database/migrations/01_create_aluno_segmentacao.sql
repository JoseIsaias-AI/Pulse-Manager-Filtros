CREATE TABLE IF NOT EXISTS aluno (
  id_aluno SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  idade INTEGER CHECK (idade IS NULL OR (idade >= 0 AND idade <= 120)),
  genero VARCHAR(80),
  ocupacao VARCHAR(150),
  escolaridade VARCHAR(100),
  programa VARCHAR(120) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  risco_evasao VARCHAR(20) NOT NULL CHECK (risco_evasao IN ('baixo', 'medio', 'alto')),
  engajamento INTEGER NOT NULL DEFAULT 0 CHECK (engajamento >= 0 AND engajamento <= 100),
  data_ingresso DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'ativo' CHECK (
    status IN ('ativo', 'inativo', 'egresso', 'desligado', 'em_acompanhamento')
  )
);

CREATE INDEX IF NOT EXISTS idx_aluno_programa ON aluno (programa);
CREATE INDEX IF NOT EXISTS idx_aluno_categoria ON aluno (categoria);
CREATE INDEX IF NOT EXISTS idx_aluno_risco_evasao ON aluno (risco_evasao);
CREATE INDEX IF NOT EXISTS idx_aluno_status ON aluno (status);
CREATE INDEX IF NOT EXISTS idx_aluno_ocupacao ON aluno (ocupacao);
CREATE INDEX IF NOT EXISTS idx_aluno_escolaridade ON aluno (escolaridade);
