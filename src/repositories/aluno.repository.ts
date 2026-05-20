import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Aluno } from '../entities/aluno.entity';
import { SegmentacaoAlunoQuery } from '../models/aluno-segmentacao.model';
import { log } from '../utils/logger';

export class AlunoRepository {
  private repository(): Repository<Aluno> {
    return AppDataSource.getRepository(Aluno);
  }

  async findSegmentados(filtros: SegmentacaoAlunoQuery): Promise<Aluno[]> {
    log('[REPOSITORY] AlunoRepository.findSegmentados() - Executando consulta', filtros);
    const qb = this.repository().createQueryBuilder('aluno');

    if (filtros.programa) {
      qb.andWhere('LOWER(aluno.programa) = LOWER(:programa)', { programa: filtros.programa });
    }

    if (filtros.status) {
      qb.andWhere('aluno.status = :status', { status: filtros.status });
    }

    if (filtros.risco) {
      qb.andWhere('aluno.riscoEvasao = :risco', { risco: filtros.risco });
    }

    if (filtros.categoria) {
      qb.andWhere('LOWER(aluno.categoria) = LOWER(:categoria)', { categoria: filtros.categoria });
    }

    if (filtros.ocupacao) {
      qb.andWhere('LOWER(aluno.ocupacao) = LOWER(:ocupacao)', { ocupacao: filtros.ocupacao });
    }

    if (filtros.escolaridade) {
      qb.andWhere('LOWER(aluno.escolaridade) = LOWER(:escolaridade)', {
        escolaridade: filtros.escolaridade
      });
    }

    if (filtros.busca) {
      qb.andWhere('(LOWER(aluno.nome) LIKE :busca OR LOWER(aluno.email) LIKE :busca)', {
        busca: `%${filtros.busca.toLowerCase()}%`
      });
    }

    qb.orderBy('aluno.nome', 'ASC').limit(filtros.limite || 50);

    const alunos = await qb.getMany();
    log('[REPOSITORY] AlunoRepository.findSegmentados() - Retornando', alunos.length, 'alunos');
    return alunos;
  }

  async findOneByEmail(email: string): Promise<Aluno | null> {
    return this.repository().findOneBy({ email });
  }
}
