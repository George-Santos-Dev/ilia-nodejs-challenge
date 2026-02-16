# FinTech Wallet Challenge (Monorepo)

Implementação do desafio técnico da ília com arquitetura de microserviços + frontend.

## Visão Geral

Este repositório contém 3 aplicações:

- `ms-users` (porta `3002`): cadastro, autenticação e gestão de usuários.
- `ms-wallet` (porta `3001`): operações de carteira (crédito/débito), extrato e saldo.
- `frontend` (porta `5173`): interface web para login e uso da carteira.

A solução foi construída com:

- Node.js + TypeScript
- NestJS (microserviços backend)
- React + Vite + MUI (frontend)
- PostgreSQL (1 banco por microserviço)
- JWT para autenticação externa e interna entre serviços

## Arquitetura e Fluxos

### 1) Autenticação externa

1. Cliente chama `POST /auth` no `ms-users`.
2. `ms-users` valida credenciais e retorna `access_token` (JWT externo).
3. Frontend envia esse token no header `Authorization: Bearer <token>`.

### 2) Fluxo de transações

1. Cliente chama `POST /transactions` no `ms-wallet`.
2. `ms-wallet` valida JWT externo.
3. Antes de gravar transação, `ms-wallet` chama `ms-users` em rota interna para validar existência do usuário.
4. Comunicação interna usa JWT próprio (`JWT_INTERNAL_SECRET`).

### 3) Segurança

- Rotas públicas:
  - `POST /users` (criação de usuário)
  - `POST /auth` (login)
- Rotas privadas (JWT externo):
  - `ms-users`: listagem/detalhe/edição/remoção
  - `ms-wallet`: criar/listar transações e consultar saldo
- Rota interna protegida por JWT interno:
  - `GET /internal/users/:id/exists`

## Estrutura do Repositório

```text
.
├── ms-users/
├── ms-wallet/
├── frontend/
├── docker-compose.yml
└── package.json (workspaces)
```

## Pré-requisitos

- Node.js 18+
- npm 9+
- Docker + Docker Compose (para execução containerizada)

## Variáveis de Ambiente

Cada aplicação possui `.env.example`.

### `ms-users/.env`

- `PORT=3002`
- `JWT_EXTERNAL_SECRET=ILIACHALLENGE`
- `JWT_INTERNAL_SECRET=ILIACHALLENGE_INTERNAL`
- `DATABASE_URL=postgresql://users_user:users_pass@users-db:5432/users`
- `SEED_DEFAULT_USER=true`
- `SEED_DEFAULT_USER_EMAIL=admin@local.test`
- `SEED_DEFAULT_USER_PASSWORD=123456`
- `FRONTEND_URL=http://localhost:5173`

### `ms-wallet/.env`

- `PORT=3001`
- `JWT_EXTERNAL_SECRET=ILIACHALLENGE`
- `JWT_INTERNAL_SECRET=ILIACHALLENGE_INTERNAL`
- `DATABASE_URL=postgresql://wallet_user:wallet_pass@wallet-db:5432/wallet`
- `USERS_SERVICE_URL=http://ms-users:3002`
- `FRONTEND_URL=http://localhost:5173`

### `frontend/.env`

- `VITE_USERS_API_URL=http://localhost:3002`
- `VITE_WALLET_API_URL=http://localhost:3001`

## Como Executar

### Opção A: Docker Compose (recomendado)

Na raiz:

```bash
docker compose up --build
```

Serviços:

- Frontend: `http://localhost:5173`
- Users API: `http://localhost:3002`
- Wallet API: `http://localhost:3001`
- PostgreSQL users: `localhost:5434`
- PostgreSQL wallet: `localhost:5433`

### Opção B: Local (sem Docker)

1. Instale dependências do monorepo:

```bash
npm install
```

2. Suba os bancos (ou configure `DATABASE_URL` para bancos já existentes).

3. Rode cada app em terminal separado:

```bash
npm run dev:users
npm run dev:wallet
npm run dev:frontend
```

## Scripts Úteis (raiz)

```bash
npm run build
npm run test
npm run lint
```

Também é possível executar por workspace:

```bash
npm --workspace ms-users test
npm --workspace ms-wallet test
npm --workspace frontend test
```

## Endpoints Principais

### `ms-users`

- `POST /users` cria usuário
- `POST /auth` autentica usuário
- `GET /users` lista usuários (JWT)
- `GET /users/:id` detalha usuário (JWT)
- `PATCH /users/:id` atualiza usuário (JWT)
- `DELETE /users/:id` remove usuário (JWT)
- `GET /internal/users/:id/exists` valida existência (JWT interno)

### `ms-wallet`

- `POST /transactions` cria transação (`CREDIT` ou `DEBIT`) (JWT)
- `GET /transactions` lista transações, com filtro opcional `type` (JWT)
- `GET /balance` retorna saldo consolidado (JWT)

## Validações de Negócio Implementadas

- Email normalizado (trim + lowercase) em cadastro/login/atualização.
- Não permite cadastro/atualização com email já existente.
- Em débito, bloqueia valor acima do saldo (`insufficient balance`).
- Sempre sanitiza retorno de usuário (não expõe senha).
- Validação global de DTOs com `ValidationPipe` no NestJS.

## Testes

### Backend

Foram priorizados os testes unitários dos dois microserviços.

Execução validada:

- `ms-users`: **10 suítes**, **22 testes** passando
- `ms-wallet`: **4 suítes**, **11 testes** passando

### Frontend

Os testes do frontend **não foram implementados nesta entrega** por questão de tempo.

A prioridade foi:

1. concluir a criação e integração dos **dois microserviços** (`ms-users` e `ms-wallet`), e
2. garantir cobertura unitária das regras de negócio no backend.

## Observações de Projeto

- O backend está organizado em camadas (application/domain/infrastructure/presentation).
- Cada microserviço possui banco dedicado.
- A comunicação interna entre serviços já está protegida com JWT específico.
- O frontend está preparado para i18n (`pt-BR` e `en`) e estados de loading/erro/vazio.
- Durante o desenvolvimento foi utilizada a sincronização automática do schema do TypeORM (`synchronize: true`) para acelerar a evolução.
- Em ambiente de produção, o caminho recomendado é desabilitar essa flag e controlar alterações de banco com migrations versionadas.
