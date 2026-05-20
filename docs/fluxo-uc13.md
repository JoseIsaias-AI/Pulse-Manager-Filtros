# Documentação Formal — UC-13 | Consultar e Segmentar Alunos

Projeto: **Pulse Manager**  
Fluxo implementado: **UC-13 — Localizar e segmentar alunos**  
Endpoint principal: `GET /api/alunos/segmentacao`  
Tecnologias: **Node.js, TypeScript, Express, TypeORM, Jest, Supertest, SQL.js e PostgreSQL**

## 1. Fluxo Escolhido

O fluxo escolhido foi o **UC-13 — Localizar e segmentar alunos**, relacionado à necessidade da Pulse Mais de encontrar alunos rapidamente e formar grupos de acompanhamento com base em critérios combinados.

O endpoint implementado permite consultar alunos usando filtros como:

- `programa`
- `status`
- `risco`
- `categoria`
- `ocupacao`
- `escolaridade`
- `busca`
- `limite`

Exemplo de chamada:

```http
GET /api/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto
```

## 2. Justificativa da Escolha

Esse fluxo foi escolhido porque atende uma dor central da Pulse Mais: localizar alunos e criar segmentos úteis para acompanhamento, oportunidades, análise de risco de evasão e tomada de decisão pela equipe gestora.

No WAD, o fluxo se relaciona principalmente ao `RF012`, que define que o sistema deve permitir a localização e segmentação de alunos com base em múltiplos critérios combinados. Ele também se conecta ao risco `R7`, que aponta a possibilidade de filtros e segmentações não atenderem às buscas operacionais da instituição.

Como `aluno` é a entidade central do domínio do Pulse Mais, testar a segmentação valida um caminho relevante de ponta a ponta: rota, controller, service, repository, banco de dados, regra de negócio e resposta HTTP.

## 3. Estrutura Implementada

```text
uc13-segmentacao-alunos/
  package.json
  jest.config.js
  tsconfig.json
  .env.example
  src/
    app.ts
    server.ts
    controllers/
      aluno-segmentacao.controller.ts
    database/
      connection.ts
      data-source.ts
      migrate.ts
      seed-demo.ts
      migrations/
        01_create_aluno_segmentacao.sql
        02_seed_aluno_segmentacao.sql
    entities/
      aluno.entity.ts
    errors/
      app-error.ts
    integrations/
      auditoria.integration.ts
    models/
      aluno-segmentacao.model.ts
    repositories/
      aluno.repository.ts
    routes/
      aluno.routes.ts
    services/
      aluno-segmentacao.service.ts
    tests/
      aluno-segmentacao.integration.test.ts
      setup-env.ts
    utils/
      logger.ts
    views/
      aluno-segmentacao.ejs
  docs/
    fluxo-uc13.md
    tutorial-execucao.md
```

## 4. Funcionamento do Fluxo

1. O usuário acessa a tela ou a API de segmentação.
2. A rota `aluno.routes.ts` recebe a requisição.
3. O `AlunoSegmentacaoController` extrai os filtros da query string.
4. O `AlunoSegmentacaoService` valida payload e regras de negócio.
5. O `AlunoRepository` monta a consulta TypeORM com filtros combinados.
6. O banco retorna os alunos que atendem aos critérios.
7. A integração externa de auditoria é chamada pelo service.
8. Nos testes, apenas a auditoria é mockada com `jest.mock()`.
9. A API retorna `success`, `total`, `filtrosAplicados` e `alunos`.

Fluxo em camadas:

```text
GET /api/alunos/segmentacao
  -> aluno.routes.ts
  -> AlunoSegmentacaoController
  -> AlunoSegmentacaoService
  -> AlunoRepository
  -> TypeORM
  -> Banco de dados
```

## 5. Execução Web: Como Abrir no Navegador

Para visualizar o fluxo acontecendo foi criada uma tela EJS em:

```text
src/views/aluno-segmentacao.ejs
```

Ela mostra:

- formulário com filtros de segmentação;
- botão para filtrar;
- botão para limpar;
- tabela com alunos retornados;
- total de alunos encontrados.

### 5.1. Rodar sem instalar PostgreSQL

Esse modo usa banco relacional em memória com `sql.js`. É o caminho mais simples para ver a aplicação funcionando localmente.

```bash
cd uc13-segmentacao-alunos
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

Exemplo com filtros já aplicados:

```text
http://localhost:3002/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto
```

### 5.2. Logs esperados no terminal

Ao acessar a tela ou a API, o terminal exibe os seguintes logs:

```text
[SERVER] GET /alunos/segmentacao - Requisicao recebida
[ROUTE] GET /alunos/segmentacao - Tela de segmentacao
[SERVICE] AlunoSegmentacaoService.segmentar() - Filtros recebidos ...
[REPOSITORY] AlunoRepository.findSegmentados() - Executando consulta ...
[REPOSITORY] AlunoRepository.findSegmentados() - Retornando 1 alunos
```

## 6. Banco de Dados e Migrations

O projeto possui uma pasta `database` com a seguinte estrutura:

```text
src/database/
  connection.ts
  data-source.ts
  migrate.ts
  migrations/
    01_create_aluno_segmentacao.sql
    02_seed_aluno_segmentacao.sql
```

### 6.1. Migration de criação

Arquivo:

```text
src/database/migrations/01_create_aluno_segmentacao.sql
```

Esse SQL cria a tabela `aluno` com:

- chave primária `id_aluno`;
- e-mail único;
- campos de perfil e jornada;
- `CHECK` para `idade`;
- `CHECK` para `risco_evasao`;
- `CHECK` para `engajamento`;
- `CHECK` para `status`;
- índices para filtros de segmentação.

### 6.2. Seed inicial

Arquivo:

```text
src/database/migrations/02_seed_aluno_segmentacao.sql
```

Esse SQL insere alunos fictícios da Pulse Mais para uso em PostgreSQL.

### 6.3. Rodar migrations em PostgreSQL

Com PostgreSQL instalado e banco `pulse_uc13` criado:

```bash
npm run migrate
```

Se aparecer o erro abaixo:

```text
ECONNREFUSED 127.0.0.1:5432
```

significa que o PostgreSQL não está instalado, não está rodando ou não está aceitando conexão na porta `5432`.

## 7. Execução com PostgreSQL Real

Para rodar com PostgreSQL, crie um arquivo `.env` dentro da pasta `uc13-segmentacao-alunos`:

```env
NODE_ENV=development
DB_TYPE=postgres
DATABASE_URL=
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=SUA_SENHA_AQUI
DB_DATABASE=pulse_uc13
DB_SSL=false
PORT=3002
AUDITORIA_URL=
```

Depois rode:

```bash
npm run migrate
npm run dev:postgres
```

Abra:

```text
http://localhost:3002/alunos/segmentacao
```

Para executar a suíte Jest apontando para PostgreSQL real:

```bash
npm run test:postgres
```

Observação: nesta máquina, o PostgreSQL não estava instalado; por isso os testes documentados foram executados com banco relacional em memória via TypeORM e `sql.js`, sem mockar a persistência.

## 8. Banco Usado nos Testes

Nos testes automatizados locais, o projeto usa TypeORM com `sql.js`.

Isso significa:

- o banco é relacional;
- a tabela é criada de verdade;
- os inserts são reais;
- as consultas são reais;
- o `QueryBuilder` do TypeORM é executado;
- a persistência não é substituída por mock, spy ou array local.

O banco é recriado antes de cada teste com:

```typescript
await AppDataSource.synchronize(true);
```

Depois disso, o `beforeEach` repovoa o banco com 5 alunos fictícios:

| Aluno | Programa | Categoria | Risco | Status |
|---|---|---|---|---|
| Maria Silva | Mentoria de permanência | conectado | alto | em_acompanhamento |
| João Pereira | Jornada de empregabilidade | capacitado | baixo | ativo |
| Ana Costa | Portal de acompanhamento | egresso | médio | egresso |
| Luana Santos | Mentoria de permanência | conectado | baixo | ativo |
| Carlos Henrique | Jornada de empregabilidade | capacitado | alto | ativo |

## 9. Integrações Externas Mockadas

A integração externa identificada no fluxo foi a auditoria de consulta:

```text
src/integrations/auditoria.integration.ts
```

Ela é chamada após a segmentação para registrar o uso do fluxo. Nos testes, ela é mockada com:

```typescript
jest.mock('../integrations/auditoria.integration', () => ({
  registrarConsultaSegmentacao: jest.fn().mockResolvedValue(undefined)
}));
```

A persistência do banco não é mockada.

## 10. Regras Implementadas

| Regra | Implementação | Erro esperado |
|---|---|---|
| A consulta deve ter ao menos um critério de segmentação. | `AlunoSegmentacaoService.validarFiltros()` | `422` |
| `limite` deve ser um número inteiro positivo. | Validação de tipo e valor numérico. | `400` |
| `limite` não pode passar de 100. | Regra para evitar consultas amplas demais. | `422` |
| `status` deve pertencer ao domínio válido do aluno. | `ativo`, `inativo`, `egresso`, `desligado`, `em_acompanhamento`. | `400` |
| `risco` deve ser válido. | `baixo`, `medio`, `alto`. | `400` |
| `busca` deve ter ao menos 3 caracteres. | Evita buscas curtas demais. | `400` |

## 11. Suíte Jest

Arquivo principal:

```text
src/tests/aluno-segmentacao.integration.test.ts
```

Configuração da suíte:

- `beforeAll`: inicializa o `AppDataSource` e obtém o `Repository<Aluno>`.
- `beforeEach`: limpa o schema, recria tabelas e insere os dados base.
- `afterAll`: encerra a conexão com o banco.
- `supertest`: executa o endpoint HTTP real.
- `jest.mock()`: mocka apenas a integração externa de auditoria.
- `findOneBy`: valida persistência real no `CT04`.

## 12. Casos de Teste Obrigatórios

| Caso | Nome no Jest | O que valida | Resultado esperado | Tempo observado |
|---|---|---|---|---|
| CT01 — Sucesso | Deve consultar e segmentar alunos por programa e risco com sucesso. | Caminho feliz do UC-13 com `programa=Mentoria de permanencia` e `risco=alto`. | `200`, `success=true`, total `1`, retorna Maria Silva. | ~124 ms |
| CT02 — Regra de negócio violada | Deve rejeitar consulta ampla sem critério de segmentação. | Regra que impede consulta sem filtro. | `422`, mensagem de critério obrigatório. | ~11 ms |
| CT03 — Payload inválido | Deve rejeitar payload de query com limite em tipo inválido. | Parâmetro `limite=abc` inválido. | `400`, mensagem de limite inválido. | ~11 ms |
| CT04 — Persistência | Deve consultar aluno persistido no banco real de teste com `findOneBy`. | O banco contém Carlos Henrique e o endpoint também retorna esse registro. | `findOneBy` encontra o aluno e o endpoint retorna total `1`. | ~12 ms |

Tempo total observado da suíte:

```text
Time: 8.707 s, estimated 14 s
```

## 13. Como Testar

### 13.1. Testar a API manualmente

Com o servidor rodando:

```bash
npm run dev
```

Acesse no navegador:

```text
http://localhost:3002/api/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto
```

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "total": 1,
    "filtrosAplicados": {
      "programa": "Mentoria de permanencia",
      "risco": "alto"
    },
    "alunos": [
      {
        "nome": "Maria Silva",
        "programa": "Mentoria de permanencia",
        "riscoEvasao": "alto"
      }
    ]
  }
}
```

### 13.2. Testar a tela web

Com o servidor rodando:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3002/alunos/segmentacao
```

Na tela:

1. Selecione um programa.
2. Selecione um risco.
3. Clique em `Filtrar`.
4. Confira a tabela com os alunos retornados.

### 13.3. Rodar a suíte Jest

```bash
npm test
```

## 14. Resultado Obtido no Terminal

Comando executado:

```bash
npm test
```

Output obtido:

```text
> pulse-uc13-segmentacao-alunos@1.0.0 test
> jest --runInBand

PASS src/tests/aluno-segmentacao.integration.test.ts (7.882 s)
  UC-13 - GET /api/alunos/segmentacao
    √ CT01 - deve consultar e segmentar alunos por programa e risco com sucesso (124 ms)
    √ CT02 - deve rejeitar consulta ampla sem criterio de segmentacao (11 ms)
    √ CT03 - deve rejeitar payload de query com limite em tipo invalido (11 ms)
    √ CT04 - deve consultar aluno persistido no banco real de teste com findOneBy (12 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        8.707 s, estimated 14 s
Ran all test suites.
```

Também foi validado o servidor local com `npm run dev`:

```text
PAGE_STATUS=200
API_STATUS=200
```

Tempo aproximado de resposta observado na chamada manual local:

- Página web: resposta `200`, carregamento imediato em ambiente local.
- API com filtro `programa + risco`: resposta `200`, retorno de 1 aluno.
- Consulta no repository: log retornou `1 alunos`.

## 15. Matriz RF → RN → Teste

| Requisito Funcional | Regra de Negócio | Caso de Teste | Tipo | Evidência |
|---|---|---|---|---|
| RF012 — Localizar e segmentar alunos com múltiplos critérios combinados. | A segmentação deve aceitar filtros combinados de perfil, jornada e risco. | CT01 | Sucesso | Retorna Maria Silva com `programa=Mentoria de permanencia` e `risco=alto`. |
| RF012 — Localizar e segmentar alunos com múltiplos critérios combinados. | A consulta operacional não deve ser executada sem critério, reduzindo custo, ruído e exposição de dados. | CT02 | Regra de negócio violada | Retorna `422` sem consultar/persistir resultado. |
| RF012 — Localizar e segmentar alunos com múltiplos critérios combinados. | Os parâmetros devem respeitar tipos e domínios válidos antes de consultar o banco. | CT03 | Payload inválido | Retorna `400` para `limite=abc`. |
| RF012/RF003 — Segmentar e consultar alunos cadastrados. | O resultado deve vir de dados persistidos no banco de teste, não de mock ou array local. | CT04 | Persistência | `findOneBy` encontra Carlos Henrique no banco e o endpoint retorna o mesmo aluno. |
