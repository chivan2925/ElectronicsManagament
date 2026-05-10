# DEPLOYMENT

## Purpose

This document describes the Docker and deployment foundation for ElectronicsManagement.

No real deployment has been performed. The files in this repository are a local, production-oriented foundation for building containers, running the app stack, and preparing environment-specific deployment work later.

## Services

The Docker foundation includes:

- `frontend`: React + Vite app built into static assets and served by unprivileged Nginx.
- `backend`: Spring Boot API packaged as a Java 21 runtime image.
- `postgres`: PostgreSQL database with a named Docker volume.

## Health Checks

The backend exposes minimal deployment probes:

- `GET /api/health`: liveness check for the API process.
- `GET /api/health/readiness`: readiness check that verifies database connectivity.

The production backend image uses `/api/health/readiness` for its Docker healthcheck, and the production Compose frontend waits for the backend service to become healthy before starting.

## Files

```text
.env.example
docker-compose.yml
docker-compose.dev.yml
frontend/Dockerfile
frontend/nginx.conf
frontend/.dockerignore
backend/electronics/Dockerfile
backend/electronics/.dockerignore
```

## Environment Management

Copy the example file before running Docker locally:

```bash
cp .env.example .env
```

Use `.env` for local values only. Do not commit real credentials, provider secrets, or production database passwords.

Important environment groups:

- Postgres: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`.
- Backend: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `ELECTRONICS_JWT_SECRET`, `SPRING_JPA_HIBERNATE_DDL_AUTO`, `CORS_ALLOWED_ORIGIN_PATTERNS`.
- Payment: `PAYMENT_FRONTEND_SUCCESS_URL`, `PAYMENT_FRONTEND_FAILED_URL`, `VNPAY_*`, `MOMO_*`.
- Uploads: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Frontend build: `VITE_API_BASE_URL`, `VITE_AUTH_TOKEN_STORAGE`, `VITE_*_API_PATH`.

For production-like local containers, `VITE_API_BASE_URL=/api` lets Nginx proxy API traffic to the backend service without exposing cross-origin browser requests.

## Production-Like Local Stack

Build and start the containerized stack:

```bash
docker compose --env-file .env up --build -d
```

Default local URLs from `.env.example`:

- Frontend: `http://localhost:8088`
- Backend API: `http://localhost:8080/api`
- Postgres: `localhost:5432`

Stop the stack:

```bash
docker compose down
```

Stop and remove the database volume only when you intentionally want to delete local data:

```bash
docker compose down -v
```

## Development Stack

Use the development compose file when you want live source mounts and Vite dev server behavior:

```bash
docker compose -f docker-compose.dev.yml --env-file .env up --build
```

Default development URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Postgres: `localhost:5432`

The dev stack uses:

- `frontend` Dockerfile `development` target with Vite on port `5173`.
- `backend` Dockerfile `development` target with `mvnw spring-boot:run`.
- Named cache volumes for frontend `node_modules` and Maven dependencies.

## Production Notes

Before a real deployment:

- Replace all placeholder values in `.env`.
- Inject secrets through the hosting platform or a secret manager, not committed files.
- Set `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` after controlled migrations/backfills exist.
- Set production payment return, notify, and frontend URLs to public HTTPS URLs.
- Restrict `CORS_ALLOWED_ORIGIN_PATTERNS` to the real frontend origins if the backend is exposed directly.
- Consider disabling Swagger in production with `SPRINGDOC_API_DOCS_ENABLED=false` and `SPRINGDOC_SWAGGER_UI_ENABLED=false`.
- Run frontend and backend validation before building release images.
- Add TLS, backups, log collection, database migration automation, and infrastructure-specific health checks in the hosting layer.

## Validation Commands

Check Docker Compose rendering without starting containers:

```bash
docker compose --env-file .env.example config
docker compose -f docker-compose.dev.yml --env-file .env.example config
```

Existing project validation:

```bash
cd frontend
npm run lint
npm run build

cd ../backend/electronics
mvn test
```
