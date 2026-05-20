import { Router } from 'express';
import { AlunoSegmentacaoController } from '../controllers/aluno-segmentacao.controller';
import { AlunoRepository } from '../repositories/aluno.repository';
import { AlunoSegmentacaoService } from '../services/aluno-segmentacao.service';
import { log } from '../utils/logger';

const router = Router();

const alunoRepository = new AlunoRepository();
const alunoSegmentacaoService = new AlunoSegmentacaoService(alunoRepository);
const alunoSegmentacaoController = new AlunoSegmentacaoController(alunoSegmentacaoService);

router.get('/alunos/segmentacao', (req, res, next) => {
  log('[ROUTE] GET /alunos/segmentacao - Tela de segmentacao');
  alunoSegmentacaoController.exibirTela(req, res).catch(next);
});

router.get('/api/alunos/segmentacao', (req, res, next) => {
  log('[ROUTE] GET /api/alunos/segmentacao - API de segmentacao');
  alunoSegmentacaoController.segmentar(req, res).catch(next);
});

export default router;
