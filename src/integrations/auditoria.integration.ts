import { SegmentacaoAlunoQuery } from '../models/aluno-segmentacao.model';

interface AuditoriaPayload {
  fluxo: 'UC-13';
  filtros: SegmentacaoAlunoQuery;
  total: number;
}

export async function registrarConsultaSegmentacao(payload: AuditoriaPayload): Promise<void> {
  if (!process.env.AUDITORIA_URL) {
    return;
  }

  await fetch(process.env.AUDITORIA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
