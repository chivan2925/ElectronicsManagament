# DEPLOYMENT

## Purpose

This guide describes the deployment foundation for ElectronicsManagement.

No production deployment has been performed from this repository. The current setup is a production-oriented local foundation with Docker, health checks, environment templates, and CI checks.

## Deployment Topology

```text
Browser
  -> Frontend container (Nginx serving Vite build)
  -> /api proxy
  -> Backend container (Spring Boot)
  -> PostgreSQL
  -> Cloudinary / VNPay / MoMo
```

Services:

| Service | Purpose | Default local port |
| --- | --- | --- |
| `frontend` | Static React app served by unprivileged Nginx | `8088` |
| `backend` | Spring Boot REST API | `8080` |
| `postgres` | PostgreSQL database | `5432` |

## Deployment Files

```text
.env.example
.env.production.example
docker-compose.yml
docker-compose.dev.yml
frontend/Dockerfile
frontend/nginx.conf
frontend/.env.production.example
frontend/.dockerignore
backend/electronics/Dockerfile
backend/electronics/.dockerignore
backend/electronics/src/main/resources/application-docker.yml
backend/electronics/src/main/resources/application-prod.yml
.github/workflows/frontend-ci.yml
.github/workflows/backend-ci.yml
.github/workflows/deployment-config-ci.yml
```

## Environment Management

Create a local `.env` from the template:

```bash
cp .env.example .env
```

For real production, copy values from `.env.production.example` into your deployment secret store or an untracked production env file, then replace every placeholder before startup.

Rules:

- Keep `.env` local.
- Do not commit real database, JWT, payment, or Cloudinary secrets.
- Use hosting-platform secrets or a secret manager for real environments.
- Keep provider callback URLs aligned with the public HTTPS backend URL.
- Use `SPRING_PROFILES_ACTIVE=prod` only after production values, HTTPS callbacks, and controlled migrations are ready.

Main environment groups:

| Group | Variables |
| --- | --- |
| Compose | `COMPOSE_PROJECT_NAME`, `FRONTEND_PORT`, `BACKEND_PORT`, `FRONTEND_DEV_PORT` |
| Database | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` |
| Backend | `SPRING_PROFILES_ACTIVE`, `SPRING_JPA_HIBERNATE_DDL_AUTO`, `SPRING_JPA_SHOW_SQL`, `SERVER_PORT`, `JAVA_OPTS` |
| Security | `ELECTRONICS_JWT_SECRET`, `ELECTRONICS_JWT_EXPIRATION_MS`, `CORS_ALLOWED_ORIGIN_PATTERNS` |
| Swagger | `SPRINGDOC_API_DOCS_ENABLED`, `SPRINGDOC_SWAGGER_UI_ENABLED` |
| Payments | `PAYMENT_FRONTEND_SUCCESS_URL`, `PAYMENT_FRONTEND_FAILED_URL`, `VNPAY_*`, `MOMO_*` |
| Uploads | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Frontend | `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_SITE_URL`, `VITE_OG_IMAGE_URL`, `VITE_APP_VERSION`, `VITE_AUTH_TOKEN_STORAGE`, `VITE_*_API_PATH` |

Detailed variable reference: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

## Production-Like Local Stack

Build and run the Docker stack:

```bash
docker compose --env-file .env up --build -d
```

Open:

```text
http://localhost:8088
http://localhost:8080/api/health
http://localhost:8080/swagger-ui.html
```

View logs:

```bash
docker compose logs -f frontend backend postgres
```

Stop:

```bash
docker compose down
```

Stop and remove local database data:

```bash
docker compose down -v
```

Use `down -v` only when local data can be deleted.

## Development Docker Stack

Run live-mounted containers for development:

```bash
docker compose -f docker-compose.dev.yml --env-file .env up --build
```

Default development URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- PostgreSQL: `localhost:5432`

The development stack uses Vite dev server and `mvn spring-boot:run`.

## Manual Build And Run

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build:production
```

Backend:

```bash
cd backend/electronics
mvn test
mvn -DskipTests package
```

Run backend manually:

```bash
cd backend/electronics
mvn spring-boot:run
```

Run frontend manually:

```bash
cd frontend
npm run dev
```

## Health Checks

Backend probes:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Liveness: API process is running. |
| `GET /api/health/readiness` | Readiness: API and database connectivity are available. |

Docker Compose uses backend readiness before starting the production-like frontend service.

## Release Checklist

Before deploying to a real environment:

1. Replace every placeholder in `.env`.
2. Use a unique 32+ byte `ELECTRONICS_JWT_SECRET`.
3. Set `SPRING_PROFILES_ACTIVE=prod` and `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` after controlled migrations exist.
4. Disable SQL logging unless needed for debugging.
5. Restrict `CORS_ALLOWED_ORIGIN_PATTERNS` to real frontend origins.
6. Use HTTPS public URLs for payment return and notify endpoints.
7. Set real Cloudinary and payment credentials through secrets management.
8. Decide whether Swagger should be disabled with `SPRINGDOC_API_DOCS_ENABLED=false` and `SPRINGDOC_SWAGGER_UI_ENABLED=false`.
9. Confirm the backend `prod` profile starts without placeholder/sandbox configuration errors.
10. Run frontend, backend, and deployment-config CI checks.
11. Confirm backups, restore procedure, log retention, and monitoring are ready.

## Payment Deployment Notes

For VNPay and MoMo:

- Backend return URLs must be public HTTPS URLs.
- MoMo notify URL must point to `/api/system/payment/momo-ipn`.
- VNPay IPN must point to `/api/system/payment/vnpay-ipn`.
- Frontend success/failed URLs must point to deployed frontend routes.
- Do not expose provider secrets to the frontend.

See [PAYMENT.md](PAYMENT.md).

## Database And Migration Notes

Current local defaults allow Hibernate schema updates for development. Production should use controlled migrations/backfills instead of `ddl-auto:update`.

Recommended production posture:

```env
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
```

Add migration tooling before a real rollout if the schema will be managed across environments.

## Rollback Notes

This repository does not include an automated rollout or rollback pipeline yet.

For a real deployment, prepare:

- Versioned images.
- Database backup before schema changes.
- A tested restore command.
- A way to shift traffic back to the previous frontend/backend image.
- Payment callback compatibility between old and new backend versions.

## Validation Commands

Check Compose rendering:

```bash
docker compose --env-file .env.example config
docker compose -f docker-compose.dev.yml --env-file .env.example config
```

Check app builds:

```bash
cd frontend
npm run lint
npm run build:production

cd ../backend/electronics
mvn test
mvn -DskipTests package
```
