INSERT INTO aluno (
  nome,
  email,
  idade,
  genero,
  ocupacao,
  escolaridade,
  programa,
  categoria,
  risco_evasao,
  engajamento,
  data_ingresso,
  status
) VALUES
  (
    'Maria Silva',
    'maria.silva@pulsemais.org',
    19,
    'feminino',
    'estudante',
    'ensino_medio',
    'Mentoria de permanencia',
    'conectado',
    'alto',
    42,
    '2026-02-10',
    'em_acompanhamento'
  ),
  (
    'Joao Pereira',
    'joao.pereira@pulsemais.org',
    21,
    'masculino',
    'buscando_emprego',
    'ensino_medio',
    'Jornada de empregabilidade',
    'capacitado',
    'baixo',
    88,
    '2026-02-12',
    'ativo'
  )
ON CONFLICT (email) DO NOTHING;
