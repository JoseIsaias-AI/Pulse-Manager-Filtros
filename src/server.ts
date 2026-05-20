import dotenv from 'dotenv';
import { app } from './app';
import { initializeDatabase } from './database/data-source';
import { seedDemoAlunos } from './database/seed-demo';

dotenv.config();

const port = Number(process.env.PORT || 3002);

initializeDatabase()
  .then(async () => {
    await seedDemoAlunos();
    app.listen(port, () => {
      console.log(`Pulse UC-13 rodando em http://localhost:${port}`);
      console.log(`Tela: http://localhost:${port}/alunos/segmentacao`);
      console.log(
        `API:  http://localhost:${port}/api/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto`
      );
    });
  })
  .catch((error) => {
    console.error('Erro ao inicializar banco de dados', error);
    process.exit(1);
  });
