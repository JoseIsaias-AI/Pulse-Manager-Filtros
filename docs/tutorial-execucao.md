# Tutorial de Execução — UC-13 Segmentação de Alunos

## 1. Por que os comandos deram erro?

### `npm run migrate test`

Esse comando não é o ideal. O correto é rodar os comandos separados:

```bash
npm run migrate
npm test
```

O erro observado foi:

```text
ECONNREFUSED 127.0.0.1:5432
```

Isso significa que o projeto tentou conectar em um PostgreSQL local na porta `5432`, mas não encontrou nenhum servidor PostgreSQL rodando.

### `npm run dev`

Antes, o servidor tentava subir usando PostgreSQL por padrão. Como o PostgreSQL não estava rodando, a inicialização falhava. Agora `npm run dev` usa `sql.js` em memória por padrão, então é possível visualizar a aplicação localmente sem instalar PostgreSQL.

## 2. Rodar sem instalar PostgreSQL

```bash
cd C:\Users\Inteli\Desktop\modulo2\g03\uc13-segmentacao-alunos
npm install
npm run dev
```

O terminal deve mostrar:

```text
Pulse UC-13 rodando em http://localhost:3002
Tela: http://localhost:3002/alunos/segmentacao
API:  http://localhost:3002/api/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto
```

Abra no navegador:

```text
http://localhost:3002/alunos/segmentacao
```

API direta:

```text
http://localhost:3002/api/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto
```

Logs esperados:

```text
[SERVER] GET /alunos/segmentacao - Requisicao recebida
[ROUTE] GET /alunos/segmentacao - Tela de segmentacao
[SERVICE] AlunoSegmentacaoService.segmentar() - Filtros recebidos ...
[REPOSITORY] AlunoRepository.findSegmentados() - Executando consulta ...
[REPOSITORY] AlunoRepository.findSegmentados() - Retornando 1 alunos
```

## 3. Rodar os testes

```bash
npm test
```

Resultado esperado:

```text
PASS src/tests/aluno-segmentacao.integration.test.ts
  UC-13 - GET /api/alunos/segmentacao
    PASS CT01 - deve consultar e segmentar alunos por programa e risco com sucesso
    PASS CT02 - deve rejeitar consulta ampla sem criterio de segmentacao
    PASS CT03 - deve rejeitar payload de query com limite em tipo invalido
    PASS CT04 - deve consultar aluno persistido no banco real de teste com findOneBy

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

## 4. Instalar PostgreSQL no Windows

Use esta parte se quiser rodar com PostgreSQL local, mais próximo do vídeo.

### Passo 1 — Baixar o instalador

Acesse:

```text
https://www.postgresql.org/download/windows/
```

Baixe o instalador da EDB para Windows.

### Passo 2 — Instalar

Durante a instalação:

- mantenha a porta padrão `5432`;
- defina a senha do usuário `postgres`;
- instale também o `pgAdmin`, se o instalador oferecer;
- anote a senha escolhida.

### Passo 3 — Confirmar que o PostgreSQL está rodando

No PowerShell:

```powershell
Get-Service | Where-Object { $_.DisplayName -match "PostgreSQL" }
```

O status deve aparecer como `Running`.

### Passo 4 — Criar o banco

Se `psql` estiver no PATH:

```bash
psql -U postgres
```

Dentro do `psql`:

```sql
CREATE DATABASE pulse_uc13;
\q
```

Se preferir usar o pgAdmin:

1. Abra o pgAdmin.
2. Conecte no servidor local.
3. Clique com o botão direito em `Databases`.
4. Escolha `Create > Database`.
5. Nomeie como `pulse_uc13`.

### Passo 5 — Criar `.env`

Crie um arquivo `.env` dentro de `uc13-segmentacao-alunos`:

```env
NODE_ENV=development
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=SUA_SENHA_AQUI
DB_DATABASE=pulse_uc13
DB_SSL=false
PORT=3002
AUDITORIA_URL=
```

### Passo 6 — Rodar migrations

```bash
npm run migrate
```

Esse comando aplica:

```text
src/database/migrations/01_create_aluno_segmentacao.sql
src/database/migrations/02_seed_aluno_segmentacao.sql
```

### Passo 7 — Rodar servidor com PostgreSQL

```bash
npm run dev:postgres
```

Abra:

```text
http://localhost:3002/alunos/segmentacao
```

Para rodar a suíte Jest apontando para PostgreSQL real:

```bash
npm run test:postgres
```

## 5. Observação para a avaliação

- Para visualização local rápida, `npm run dev` usa banco em memória.
- Para PostgreSQL real, use `npm run migrate` e `npm run dev:postgres`.
- Nos testes, a persistência não é mockada. O teste usa um banco relacional em memória via TypeORM, com tabelas e consultas reais.
- A única parte mockada com `jest.mock()` é a integração externa de auditoria.
