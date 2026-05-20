import { Request, Response } from 'express';
import { AppError } from '../errors/app-error';
import { RiscoEvasao, StatusAluno } from '../entities/aluno.entity';
import { SegmentacaoAlunoQuery } from '../models/aluno-segmentacao.model';
import { AlunoSegmentacaoService } from '../services/aluno-segmentacao.service';

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return Number(value);
}

export class AlunoSegmentacaoController {
  constructor(private readonly service: AlunoSegmentacaoService) {}

  exibirTela = async (req: Request, res: Response): Promise<void> => {
    const filtros = this.extrairFiltros(req);
    const temFiltro = Object.values(filtros).some((valor) => valor !== undefined && valor !== '');

    if (!temFiltro) {
      res.render('aluno-segmentacao', {
        filtros,
        alunos: [],
        total: 0,
        error: null
      });
      return;
    }

    try {
      const resultado = await this.service.segmentar(filtros);
      res.render('aluno-segmentacao', {
        filtros,
        alunos: resultado.data.alunos,
        total: resultado.data.total,
        error: null
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado ao segmentar alunos.';
      res.status(400).render('aluno-segmentacao', {
        filtros,
        alunos: [],
        total: 0,
        error: message
      });
    }
  };

  segmentar = async (req: Request, res: Response): Promise<void> => {
    const filtros = this.extrairFiltros(req);

    try {
      const resultado = await this.service.segmentar(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erro inesperado ao segmentar alunos.'
      });
    }
  };

  private extrairFiltros(req: Request): SegmentacaoAlunoQuery {
    return {
      programa: optionalString(req.query.programa),
      status: optionalString(req.query.status) as StatusAluno | undefined,
      risco: optionalString(req.query.risco) as RiscoEvasao | undefined,
      categoria: optionalString(req.query.categoria),
      ocupacao: optionalString(req.query.ocupacao),
      escolaridade: optionalString(req.query.escolaridade),
      busca: optionalString(req.query.busca),
      limite: optionalNumber(req.query.limite)
    };
  }
}
