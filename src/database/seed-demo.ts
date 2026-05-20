import { AppDataSource } from './data-source';
import { Aluno } from '../entities/aluno.entity';
import { log } from '../utils/logger';

export async function seedDemoAlunos(): Promise<void> {
  if (process.env.NODE_ENV === 'test' || process.env.SEED_DEMO === 'false') {
    return;
  }

  const repository = AppDataSource.getRepository(Aluno);
  const total = await repository.count();

  if (total > 0) {
    return;
  }

  await repository.save([
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

  log('[DATABASE] Seed de demonstracao inserido com 5 alunos');
}
