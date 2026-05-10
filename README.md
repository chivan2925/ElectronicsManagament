# ElectronicsManagement

ElectronicsManagement is an electronics and gaming ecommerce platform with a customer storefront, a staff/admin dashboard, and a Spring Boot backend API.

The repository directory is currently named `ElectronicsManagament`, but the product name used in documentation is ElectronicsManagement.

Current phase: `Phase 8 - Production + Deploy`.

## Project Overview

ElectronicsManagement covers the main workflows for an electronics store:

- Customer browsing, product listing, product detail, cart, checkout, payment handoff, wishlist, notifications, and account/order tracking.
- Admin operations for catalog, variants, media upload, users, staff, roles, orders, warehouse, coupons, and analytics.
- Backend API for admin operations, authenticated checkout/account flows, payment webhooks, media upload, monitoring, and deployment readiness.

Primary storefront categories:

- điện thoại
- laptop
- tai nghe
- chuột
- bàn phím
- lót chuột
- PC Gaming
- máy bộ
- linh kiện PC
- ghế gaming
- phụ kiện gaming

## Tech Stack

| Area | Stack |
| --- | --- |
| Frontend | React 19, Vite/Rolldown, React Router, Tailwind CSS, Axios, Framer Motion, lucide-react, Recharts |
| Backend | Java 21, Spring Boot 4, Spring Web MVC, Spring Security, JWT, Spring Data JPA, PostgreSQL |
| Integrations | Cloudinary, VNPay Sandbox, MoMo Sandbox |
| DevOps | Docker, Docker Compose, GitHub Actions CI checks |
| Documentation | Markdown docs under `docs/`, AI context under `docs/ai-context/` |

## Screenshots

Screenshots are not committed yet. Add production screenshots later using this structure:

| Surface | Placeholder |
| --- | --- |
| Storefront homepage | `docs/screenshots/storefront-home.png` |
| Product listing | `docs/screenshots/product-listing.png` |
| Checkout | `docs/screenshots/checkout.png` |
| Payment result | `docs/screenshots/payment-result.png` |
| Admin dashboard | `docs/screenshots/admin-dashboard.png` |
| Admin CRUD table | `docs/screenshots/admin-crud.png` |

## Repository Map

```text
.
├─ frontend/                  React + Vite app
├─ backend/electronics/       Spring Boot API
├─ docs/                      Product, API, architecture, setup, workflow docs
├─ database/                  Database reference assets
├─ .github/workflows/         CI check workflows
├─ docker-compose.yml         Production-like local stack
├─ docker-compose.dev.yml     Development stack
├─ .env.example               Docker and runtime environment template
├─ DEPLOYMENT.md              Deployment guide
├─ PAYMENT.md                 Payment sandbox guide
├─ SECURITY.md                Security guide
└─ AGENTS.md                  AI/developer working rules
```

## Prerequisites

Install the tools that match the workflow you want to use:

- Node.js 20+ and npm.
- Java 21.
- Maven 3.9+ or the backend Maven wrapper if available.
- PostgreSQL 15+ for manual local backend runs.
- Docker Desktop or a compatible Docker engine for Compose workflows.

## Setup Guide

1. Clone the repository and enter the project directory.

```bash
git clone <repository-url>
cd ElectronicsManagament
```

2. Prepare environment files.

For Docker workflows:

```bash
cp .env.example .env
```

For manual frontend runs, create `frontend/.env.local` when you need overrides:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AUTH_TOKEN_STORAGE=session
```

For manual backend runs, either export environment variables or rely on the safe local defaults in `backend/electronics/src/main/resources/application.yml`.

3. Prepare PostgreSQL for manual backend runs.

```sql
CREATE DATABASE electronics_management;
```

Use environment variables if your local database credentials differ from the backend defaults:

```bash
DB_URL=jdbc:postgresql://localhost:5432/electronics_management
DB_USERNAME=postgres
DB_PASSWORD=<local-password>
```

Never commit real credentials.

## Run Locally

### Backend

```bash
cd backend/electronics
mvn spring-boot:run
```

Default backend URL:

```text
http://localhost:8080/api
```

Useful backend checks:

```bash
mvn test
mvn -q -DskipTests compile
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

Useful frontend checks:

```bash
npm run lint
npm run build
```

### Docker Compose

```bash
cp .env.example .env
docker compose --env-file .env up --build
```

Default Docker URLs:

- Frontend: `http://localhost:8088`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

For live-mounted development containers:

```bash
docker compose -f docker-compose.dev.yml --env-file .env up --build
```

## Demo Presentation Mode

Use demo mode for rehearsals or product presentations when a live backend seed is not available:

```env
VITE_DEMO_MODE=true
```

Demo mode adds quick-fill demo accounts on login pages and serves local seeded mock API data for catalog browsing, checkout, payment return verification, account order tracking, and admin CRUD-style screens. See [docs/DEMO_PRESENTATION.md](docs/DEMO_PRESENTATION.md) for accounts, scenarios, coupons, and the presentation checklist.

## Client Routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront homepage |
| `/products` | Product listing |
| `/categories/:categorySlug` | Category listing |
| `/products/:slug` | Product detail |
| `/cart` | Cart |
| `/checkout` | Authenticated checkout |
| `/payment/success` | Payment verification success/result page |
| `/payment/failed` | Payment failed/cancelled/result page |
| `/login` | Customer/admin-aware login surface |
| `/register` | Customer registration placeholder |
| `/wishlist` | Wishlist |
| `/profile` | Account overview |
| `/profile/orders` | Order history |
| `/profile/orders/:id` | Order tracking/detail |
| `/profile/settings` | Profile settings |

## Admin Routes

Admin routes require an admin or staff session. Some routes require admin-only access or specific resource permissions.

| Route | Purpose |
| --- | --- |
| `/admin/login` | Admin/staff login |
| `/admin` or `/admin/dashboard` | Dashboard |
| `/admin/categories` | Category CRUD |
| `/admin/brands` | Brand CRUD |
| `/admin/products` | Product CRUD |
| `/admin/variants` | Variant CRUD |
| `/admin/media` | Media library and upload |
| `/admin/orders` | Order operations |
| `/admin/warehouse` | Warehouse and stock operations |
| `/admin/coupons` | Coupon CRUD |
| `/admin/users` | Customer account management |
| `/admin/staff` | Staff management |
| `/admin/roles` | Roles and permissions |
| `/admin/reports/revenue` | Revenue analytics placeholder |
| `/admin/reports/best-sellers` | Best-seller report placeholder |
| `/admin/reports/activity` | Activity log placeholder |

## Payment Sandbox Guide

Supported checkout methods:

- COD: creates an order and shows the confirmation state without external redirect.
- VNPay Sandbox: creates a signed payment URL through the backend and redirects the browser to VNPay.
- MoMo Sandbox: creates a signed payment request through the backend and redirects the browser to MoMo.

Important local environment variables:

```env
PAYMENT_FRONTEND_SUCCESS_URL=http://localhost:5173/payment/success
PAYMENT_FRONTEND_FAILED_URL=http://localhost:5173/payment/failed
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_SECRET_KEY=YOUR_SECRET_KEY
VNPAY_RETURN_URL=http://localhost:8080/api/payments/vnpay-return
MOMO_PARTNER_CODE=MOMO_PARTNER_CODE
MOMO_ACCESS_KEY=MOMO_ACCESS_KEY
MOMO_SECRET_KEY=MOMO_SECRET_KEY
MOMO_RETURN_URL=http://localhost:8080/api/payments/momo-return
MOMO_NOTIFY_URL=http://localhost:8080/api/system/payment/momo-ipn
```

See [PAYMENT.md](PAYMENT.md) for the full sandbox flow and testing checklist.

## API Documentation

- API overview: [docs/API.md](docs/API.md)
- Endpoint inventory: [docs/api/ENDPOINTS.md](docs/api/ENDPOINTS.md)
- Authentication: [docs/api/AUTH.md](docs/api/AUTH.md)
- Error format: [docs/api/ERROR_FORMAT.md](docs/api/ERROR_FORMAT.md)
- Swagger UI locally: `http://localhost:8080/swagger-ui.html`

## Architecture Documentation

- Architecture overview: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- System architecture: [docs/architecture/SYSTEM_ARCHITECTURE.md](docs/architecture/SYSTEM_ARCHITECTURE.md)
- Frontend structure: [docs/architecture/FRONTEND_STRUCTURE.md](docs/architecture/FRONTEND_STRUCTURE.md)
- Backend structure: [docs/architecture/BACKEND_STRUCTURE.md](docs/architecture/BACKEND_STRUCTURE.md)

## More Documentation

- Setup instructions: [docs/SETUP.md](docs/SETUP.md)
- Environment variables: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
- Demo presentation guide: [docs/DEMO_PRESENTATION.md](docs/DEMO_PRESENTATION.md)
- Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
- Payment: [PAYMENT.md](PAYMENT.md)
- Security: [SECURITY.md](SECURITY.md)
- Backend payment details: [docs/backend/PAYMENT.md](docs/backend/PAYMENT.md)
- Backend upload details: [docs/backend/FILE_UPLOAD.md](docs/backend/FILE_UPLOAD.md)

## Development Rules

- Read [AGENTS.md](AGENTS.md) before structured code work.
- Keep frontend API calls centralized under `frontend/src/api`.
- Keep client storefront and admin dashboard concerns separate.
- Do not commit secrets, real provider credentials, build outputs, or local `.env` files.
- Preserve the existing homepage layout unless a task explicitly asks for a layout change.

AI-assisted work should also update:

- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `CHANGELOG_AI.md`
