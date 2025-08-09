# Task Tracker API

API completa com **Auth (JWT)**, **RBAC**, **PostgreSQL + Prisma**, **Swagger**, **Testes** e **Docker**.

## Subir com Docker (banco)
```bash
docker compose up -d
```

## Configurar e rodar
```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
# http://localhost:3000/docs
```

### Admin seed
- email: `admin@demo.com`
- senha: `Admin123!`

## Endpoints (resumo)
- `POST /auth/register`, `POST /auth/login`
- `GET /users/me`
- `CRUD /projects`
- `CRUD /tasks` (+ filtros e paginação)
- `POST/GET /comments/:taskId`
- `GET /docs` (Swagger), `GET /health`

## Tests
```bash
npm test
```
