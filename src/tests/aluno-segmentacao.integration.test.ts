import request from 'supertest';
import { Repository } from 'typeorm';
import { app } from '../app';
import { AppDataSource, initializeDatabase } from '../database/data-source';
import { Aluno } from '../entities/aluno.entity';
import { registrarConsultaSegmentacao } from '../integrations/auditoria.integration';

jest.mock('../integrations/auditoria.integration', () => ({
  registrarConsultaSegmentacao: jest.fn().mockResolvedValue(undefined)
}));

describe('UC-13 - GET /api/alunos/segmentacao', () => {
  let alunoRepository: Repository<Aluno>;

  beforeAll(async () => {
    await initializeDatabase();
    alunoRepository = AppDataSource.getRepository(Aluno);
  });

  beforeEach(async () => {
    await AppDataSource.synchronize(true);
    jest.clearAllMocks();

    await alunoRepository.save([
      {
        nome: 'Maria Silva',
        email: 'maria.silva@pulsemais.org',
        idade: 19,
        genero: 'feminino',
        ocupacao: 'estudante',
        escolaridade: 'ensino_medio',
        programa: 'Mentoria de permanencia',
        categoria: 'conectado',
        riscoEvasao: 'alto',
        engajamento: 42,
        dataIngresso: '2026-02-10',
        status: 'em_acompanhamento'
      },
      {
        nome: 'Joao Pereira',
        email: 'joao.pereira@pulsemais.org',
        idade: 21,
        genero: 'masculino',
        ocupacao: 'buscando_emprego',
        escolaridade: 'ensino_medio',
        programa: 'Jornada de empregabilidade',
        categoria: 'capacitado',
        riscoEvasao: 'baixo',
        engajamento: 88,
        dataIngresso: '2026-02-12',
        status: 'ativo'
      },
      {
        nome: 'Ana Costa',
        email: 'ana.costa@pulsemais.org',
        idade: 23,
        genero: 'feminino',
        ocupacao: 'empregada',
        escolaridade: 'ensino_superior',
        programa: 'Portal de acompanhamento',
        categoria: 'egresso',
        riscoEvasao: 'medio',
        engajamento: 71,
        dataIngresso: '2025-11-05',
        status: 'egresso'
      },
      {
        nome: 'Luana Santos',
        email: 'luana.santos@pulsemais.org',
        idade: 18,
        genero: 'feminino',
        ocupacao: 'estudante',
        escolaridade: 'ensino_medio',
        programa: 'Mentoria de permanencia',
        categoria: 'conectado',
        riscoEvasao: 'baixo',
        engajamento: 79,
        dataIngresso: '2026-03-01',
        status: 'ativo'
      },
      {
        nome: 'Carlos Henrique',
        email: 'carlos.henrique@pulsemais.org',
        idade: 22,
        genero: 'masculino',
        ocupacao: 'buscando_emprego',
        escolaridade: 'ensino_medio',
        programa: 'Jornada de empregabilidade',
        categoria: 'capacitado',
        riscoEvasao: 'alto',
        engajamento: 38,
        dataIngresso: '2026-01-20',
        status: 'ativo'
      }
    ]);
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('CT01 - deve consultar e segmentar alunos por programa e risco com sucesso', async () => {
    const response = await request(app)
      .get('/api/alunos/segmentacao')
      .query({ programa: 'Mentoria de permanencia', risco: 'alto' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.alunos[0]).toMatchObject({
      nome: 'Maria Silva',
      email: 'maria.silva@pulsemais.org',
      programa: 'Mentoria de permanencia',
      riscoEvasao: 'alto'
    });
    expect(registrarConsultaSegmentacao).toHaveBeenCalledWith({
      fluxo: 'UC-13',
      filtros: expect.objectContaining({
        programa: 'Mentoria de permanencia',
        risco: 'alto'
      }),
      total: 1
    });
  });

  it('CT02 - deve rejeitar consulta ampla sem criterio de segmentacao', async () => {
    const response = await request(app).get('/api/alunos/segmentacao');

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      success: false,
      message: 'Informe ao menos um criterio de segmentacao.'
    });
    expect(registrarConsultaSegmentacao).not.toHaveBeenCalled();
  });

  it('CT03 - deve rejeitar payload de query com limite em tipo invalido', async () => {
    const response = await request(app)
      .get('/api/alunos/segmentacao')
      .query({ programa: 'Mentoria de permanencia', limite: 'abc' });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: 'O parametro limite deve ser um numero inteiro positivo.'
    });
    expect(registrarConsultaSegmentacao).not.toHaveBeenCalled();
  });

  it('CT04 - deve consultar aluno persistido no banco real de teste com findOneBy', async () => {
    const alunoPersistido = await alunoRepository.findOneBy({
      email: 'carlos.henrique@pulsemais.org'
    });

    expect(alunoPersistido).toMatchObject({
      nome: 'Carlos Henrique',
      email: 'carlos.henrique@pulsemais.org',
      programa: 'Jornada de empregabilidade',
      riscoEvasao: 'alto',
      status: 'ativo'
    });

    const response = await request(app)
      .get('/api/alunos/segmentacao')
      .query({ busca: 'carlos.henrique' });

    expect(response.status).toBe(200);
    expect(response.body.data.total).toBe(1);
    expect(response.body.data.alunos[0]).toMatchObject({
      idAluno: alunoPersistido?.idAluno,
      nome: 'Carlos Henrique',
      email: 'carlos.henrique@pulsemais.org'
    });
  });
});
