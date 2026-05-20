import { Aluno, RiscoEvasao, StatusAluno } from '../entities/aluno.entity';

export interface SegmentacaoAlunoQuery {
  programa?: string;
  status?: StatusAluno;
  risco?: RiscoEvasao;
  categoria?: string;
  ocupacao?: string;
  escolaridade?: string;
  busca?: string;
  limite?: number;
}

export interface SegmentacaoAlunoResponse {
  success: true;
  data: {
    total: number;
    filtrosAplicados: SegmentacaoAlunoQuery;
    alunos: Aluno[];
  };
}

export const statusPermitidos: StatusAluno[] = [
  'ativo',
  'inativo',
  'egresso',
  'desligado',
  'em_acompanhamento'
];

export const riscosPermitidos: RiscoEvasao[] = ['baixo', 'medio', 'alto'];
