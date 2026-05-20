import express from 'express';
import path from 'path';
import alunoRoutes from './routes/aluno.routes';
import { log } from './utils/logger';

export const app = express();

app.use((req, _res, next) => {
  log(`[SERVER] ${req.method} ${req.path} - Requisicao recebida`);
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(alunoRoutes);

app.get('/', (_req, res) => {
  res.redirect('/alunos/segmentacao');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});
