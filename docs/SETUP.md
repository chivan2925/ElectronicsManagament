# SETUP

## Purpose

This guide helps a new developer run ElectronicsManagement locally.

For deployment-specific instructions, see [../DEPLOYMENT.md](../DEPLOYMENT.md).

## Prerequisites

Install:

- Node.js 20+ and npm.
- Java 21.
- Maven 3.9+.
- PostgreSQL 15+.
- Docker Desktop or compatible Docker engine if using Compose.

Check versions:

```bash
node --version
npm --version
java --version
mvn --version
docker --version
```

## Clone

```bash
git clone <repository-url>
cd ElectronicsManagament
```

The folder name intentionally reflects the current repository spelling. Documentation uses the product name ElectronicsManagement.

## Option A: Manual Local Setup

### 1. Database

Create a local PostgreSQL database:

```sql
CREATE DATABASE electronics_management;
```

If your local credentials are not the backend defaults, set environment variables before starting the backend:

```bash
DB_URL=jdbc:postgresql://localhost:5432/electronics_management
DB_USERNAME=postgres
DB_PASSWORD=<local-password>
```

PowerShell example:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/electronics_management"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="<local-password>"
```

### 2. Backend

```bash
cd backend/electronics
mvn spring-boot:run
```

Backend URLs:

```text
http://localhost:8080/api/health
http://localhost:8080/api/health/readiness
http://localhost:8080/swagger-ui.html
```

### 3. Frontend

Create `frontend/.env.local` only when you need local overrides:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AUTH_TOKEN_STORAGE=session
```

Run:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Option B: Docker Setup

```bash
cp .env.example .env
docker compose --env-file .env up --build
```

Open:

```text
http://localhost:8088
http://localhost:8080/api/health
```

Development Compose:

```bash
docker compose -f docker-compose.dev.yml --env-file .env up --build
```

## Validation

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend/electronics
mvn test
mvn -q -DskipTests compile
```

Compose config:

```bash
docker compose --env-file .env.example config
docker compose -f docker-compose.dev.yml --env-file .env.example config
```

## Main Local Routes

Storefront:

```text
/
/products
/products/:slug
/cart
/checkout
/payment/success
/payment/failed
/profile
```

Admin:

```text
/admin/login
/admin/dashboard
/admin/products
/admin/orders
/admin/media
/admin/warehouse
/admin/roles
```

## Data Notes

- The backend expects PostgreSQL.
- Hibernate defaults to `ddl-auto:update` for local development.
- Production should use controlled migrations and `ddl-auto:validate`.
- No production seed credentials should be committed.
- Admin login requires staff data in the database.

## Common Issues

### Frontend cannot reach backend

Check:

- Backend is running on `http://localhost:8080`.
- `VITE_API_BASE_URL=http://localhost:8080/api`.
- CORS allows the frontend origin.

### Backend cannot reach database

Check:

- PostgreSQL is running.
- Database exists.
- `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` are correct.

### Payment redirects fail locally

Check:

- Backend return URLs point to `http://localhost:8080/api/payments/...`.
- Frontend success/failed URLs point to `http://localhost:5173/payment/...`.
- Provider sandbox credentials are configured.

### Media upload fails

Check:

- Cloudinary variables are set.
- File type is JPG, PNG, or WEBP.
- File size is 5MB or less.

## Next Reading

- [../README.md](../README.md)
- [ENVIRONMENT.md](ENVIRONMENT.md)
- [API.md](API.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [../PAYMENT.md](../PAYMENT.md)
- [../SECURITY.md](../SECURITY.md)
