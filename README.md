# Pulse Mais: UC-13 Segmentação de Alunos

![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-TypeORM-4169E1?logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Supertest-C21325?logo=jest&logoColor=white)

> Este repositório isola o fluxo de segmentação de alunos (UC-13). O sistema completo está em [Pulse Manager](https://github.com/JoseIsaias-AI/Pulse-Manager).

Projeto em **Node.js**, **TypeScript**, **Express**, **TypeORM**, **PostgreSQL**, **Jest** e **Supertest** para implementar e testar o fluxo **UC-13: Localizar e segmentar alunos** do sistema Pulse Mais.

O foco deste repositório é demonstrar um fluxo real do domínio da Pulse Mais com separação em camadas, persistência de dados, migrations SQL, tela web, API REST e testes de integração automatizados.

## Contexto do Projeto

A Pulse Mais acompanha jovens em diferentes etapas de formação, permanência, empregabilidade, ensino superior e desenvolvimento pessoal. Um dos desafios do sistema é permitir que a equipe encontre alunos rapidamente e forme grupos de acompanhamento a partir de dados estruturados.

No WAD do projeto, esse fluxo aparece como parte da necessidade de centralizar dados e permitir consultas operacionais úteis para tomada de decisão. O caso de uso escolhido foi o **UC-13**, voltado para localização e segmentação de alunos.

Esse fluxo permite responder perguntas como:

- Quais alunos estão em risco alto de evasão?
- Quais alunos pertencem a determinado programa?
- Quais alunos estão ativos, egressos ou em acompanhamento?
- Quais alunos podem ser encontrados por nome ou e-mail?
- Quais grupos podem ser acompanhados pela equipe a partir de filtros combinados?

## Objetivo

Implementar um fluxo de segmentação de alunos que possa ser executado pela web, consumido via API e validado por testes de integração.

O projeto cobre:

- consulta de alunos por múltiplos critérios;
- validação de regras de negócio;
- persistência real nos testes;
- mock apenas de integração externa;
- documentação formal do fluxo;
- matriz `RF → RN → Teste`;
- execução visual no navegador;
- suporte a PostgreSQL por migrations.

## Fluxo Implementado

**Caso de uso:** `UC-13: Localizar e segmentar alunos`

**Endpoint principal:**

```http
GET /api/alunos/segmentacao
```

**Tela web:**

```text
GET /alunos/segmentacao
```

### Filtros disponíveis

| Filtro | Descrição |
|---|---|
| `programa` | Filtra alunos por programa da Pulse Mais. |
| `status` | Filtra por situação do aluno, como `ativo`, `egresso` ou `em_acompanhamento`. |
| `risco` | Filtra por risco de evasão: `baixo`, `medio` ou `alto`. |
| `categoria` | Filtra por etapa/categoria da jornada. |
| `ocupacao` | Filtra por ocupação atual. |
| `escolaridade` | Filtra por escolaridade. |
| `busca` | Busca por nome ou e-mail. |
| `limite` | Limita a quantidade de registros retornados. |

### Exemplo de requisição

```text
http://localhost:3002/api/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto
```

### Exemplo de resposta

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
        "idAluno": 1,
        "nome": "Maria Silva",
        "email": "maria.silva@pulsemais.org",
        "idade": 19,
        "genero": "feminino",
        "ocupacao": "estudante",
        "escolaridade": "ensino_medio",
        "programa": "Mentoria de permanencia",
        "categoria": "conectado",
        "riscoEvasao": "alto",
        "engajamento": 42,
        "dataIngresso": "2026-02-10",
        "status": "em_acompanhamento"
      }
    ]
  }
}
```

## Arquitetura

O projeto segue uma organização em camadas:

```text
Rota
  → Controller
    → Service
      → Repository
        → TypeORM
          → Banco de dados
```

### Responsabilidades

| Camada | Responsabilidade |
|---|---|
| `routes` | Define os endpoints HTTP. |
| `controllers` | Extrai parâmetros da requisição e monta a resposta. |
| `services` | Concentra validações e regras de negócio. |
| `repositories` | Executa consultas no banco com TypeORM. |
| `entities` | Define o modelo persistido da tabela `aluno`. |
| `database` | Configura conexão, migrations e seed de demonstração. |
| `views` | Contém a tela EJS para uso via navegador. |
| `tests` | Contém a suíte Jest de integração. |

## Estrutura de Pastas

```text
uc13-segmentacao-alunos/
  package.json
  jest.config.js
  tsconfig.json
  .env.example
  README.md
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

## Banco de Dados

A entidade principal é `Aluno`, persistida na tabela `aluno`.

### Campos principais

| Campo | Descrição |
|---|---|
| `id_aluno` | Identificador único do aluno. |
| `nome` | Nome do aluno. |
| `email` | E-mail único. |
| `idade` | Idade do aluno. |
| `genero` | Gênero informado. |
| `ocupacao` | Ocupação atual. |
| `escolaridade` | Escolaridade atual. |
| `programa` | Programa da Pulse Mais. |
| `categoria` | Etapa/categoria na jornada. |
| `risco_evasao` | Classificação de risco: `baixo`, `medio` ou `alto`. |
| `engajamento` | Indicador numérico de engajamento. |
| `data_ingresso` | Data de ingresso na jornada. |
| `status` | Situação atual do aluno. |

### Migrations

As migrations ficam em:

```text
src/database/migrations/
```

Arquivos:

- `01_create_aluno_segmentacao.sql`
- `02_seed_aluno_segmentacao.sql`

A migration de criação define:

- tabela `aluno`;
- chave primária;
- `UNIQUE` para e-mail;
- `CHECK` para idade;
- `CHECK` para risco de evasão;
- `CHECK` para engajamento;
- `CHECK` para status;
- índices para campos usados nos filtros.

## Regras de Negócio

| Regra | Resultado esperado |
|---|---|
| A consulta deve ter ao menos um critério de segmentação. | Retorna `422`. |
| `limite` deve ser um número inteiro positivo. | Retorna `400` se inválido. |
| `limite` não pode passar de 100. | Retorna `422`. |
| `status` deve pertencer ao domínio válido. | Retorna `400` se inválido. |
| `risco` deve ser `baixo`, `medio` ou `alto`. | Retorna `400` se inválido. |
| `busca` deve ter ao menos 3 caracteres. | Retorna `400` se inválido. |

## Pré-requisitos

- Node.js 18 ou superior
- npm

Opcional:

- PostgreSQL local ou remoto

## Instalação

Entre na pasta do projeto:

```bash
cd uc13-segmentacao-alunos
```

Instale as dependências:

```bash
npm install
```

## Execução Local sem PostgreSQL

Para rodar rapidamente sem instalar banco externo:

```bash
npm run dev
```

Esse comando usa banco em memória com `sql.js` e insere dados de demonstração automaticamente.

Abra no navegador:

```text
http://localhost:3002/alunos/segmentacao
```

API direta:

```text
http://localhost:3002/api/alunos/segmentacao?programa=Mentoria%20de%20permanencia&risco=alto
```

## Execução com PostgreSQL

Crie um banco chamado:

```text
pulse_uc13
```

Crie um arquivo `.env` na raiz do projeto:

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

Execute as migrations:

```bash
npm run migrate
```

Suba o servidor usando PostgreSQL:

```bash
npm run dev:postgres
```

Abra:

```text
http://localhost:3002/alunos/segmentacao
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor com banco em memória (`sql.js`). |
| `npm run dev:postgres` | Sobe o servidor usando PostgreSQL. |
| `npm run migrate` | Executa as migrations SQL em PostgreSQL. |
| `npm test` | Executa os testes de integração com banco em memória. |
| `npm run test:postgres` | Executa os testes apontando para PostgreSQL. |

## Testes

A suíte de integração está em:

```text
src/tests/aluno-segmentacao.integration.test.ts
```

Ela usa:

- Jest;
- Supertest;
- TypeORM;
- banco relacional em memória com `sql.js`;
- `jest.mock()` apenas para a integração externa de auditoria.

### Casos cobertos

| Caso | Tipo | Objetivo |
|---|---|---|
| CT01 | Sucesso | Deve consultar e segmentar alunos por programa e risco com sucesso. |
| CT02 | Regra de negócio violada | Deve rejeitar consulta ampla sem critério de segmentação. |
| CT03 | Payload inválido | Deve rejeitar `limite=abc`. |
| CT04 | Persistência | Deve validar aluno persistido com `findOneBy`. |

Executar:

```bash
npm test
```

Resultado esperado:

```text
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

## Matriz RF → RN → Teste

| Requisito Funcional | Regra de Negócio | Caso de Teste | Tipo |
|---|---|---|---|
| RF012: Localizar e segmentar alunos com múltiplos critérios combinados. | A segmentação deve aceitar filtros combinados de perfil, jornada e risco. | CT01 | Sucesso |
| RF012: Localizar e segmentar alunos com múltiplos critérios combinados. | A consulta operacional não deve ser executada sem critério. | CT02 | Regra de negócio violada |
| RF012: Localizar e segmentar alunos com múltiplos critérios combinados. | Os parâmetros devem respeitar tipos e domínios válidos. | CT03 | Payload inválido |
| RF012/RF003: Segmentar e consultar alunos cadastrados. | O resultado deve vir de dados persistidos no banco de teste. | CT04 | Persistência |

## Documentação Complementar

- `docs/fluxo-uc13.md`: documentação formal do fluxo, testes, tempos observados e matriz RF → RN → Teste.
- `docs/tutorial-execucao.md`: tutorial de execução local, PostgreSQL e solução de erros comuns.

## Observações Técnicas

- A persistência não é mockada nos testes.
- O banco em memória é usado para facilitar execução local e CI, mas executa operações reais via TypeORM.
- A integração externa de auditoria é mockada com `jest.mock()`.
- Para reproduzir com PostgreSQL real, configure `.env`, rode `npm run migrate` e depois `npm run dev:postgres`.
- Caso apareça `ECONNREFUSED 127.0.0.1:5432`, significa que o PostgreSQL não está instalado, não está rodando ou não está acessível na porta `5432`.

## Status

Projeto funcional, com tela web, API REST, migrations SQL e testes de integração passando.

## Autor

**José Isaías** · Engenharia de Computação no Inteli ·
[LinkedIn](https://www.linkedin.com/in/joseisaias) ·
[GitHub](https://github.com/JoseIsaias-AI)
