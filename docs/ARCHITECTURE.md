# ARCHITECTURE

## Purpose

This document is the high-level architecture entry point for ElectronicsManagement.

Detailed docs:

- [architecture/SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md)
- [architecture/FRONTEND_STRUCTURE.md](architecture/FRONTEND_STRUCTURE.md)
- [architecture/BACKEND_STRUCTURE.md](architecture/BACKEND_STRUCTURE.md)

## System Summary

ElectronicsManagement has three main runtime parts:

```text
React storefront/admin
  -> Spring Boot REST API
  -> PostgreSQL
```

External integrations:

- Cloudinary for product/media images.
- VNPay and MoMo for sandbox online payment handoff.
- Browser local/session storage for frontend auth/cart/wishlist support where backend contracts are incomplete.

## Surfaces

| Surface | Location | Role |
| --- | --- | --- |
| Client storefront | `frontend/src/pages/client`, `frontend/src/components` | Customer ecommerce experience. |
| Admin dashboard | `frontend/src/pages/admin`, `frontend/src/admin` | Staff/admin operations and CRUD workflows. |
| Backend API | `backend/electronics/src/main/java/org/example/electronics` | Domain logic, persistence, auth, payment, media, monitoring. |
| Database | PostgreSQL | Catalog, users, staff, roles, orders, payments, coupons, warehouse, media. |

## Frontend Architecture

Key principles:

- Keep storefront and admin concerns separate.
- Keep API calls centralized under `frontend/src/api`.
- Normalize response shapes before they reach UI components.
- Use React Router route guards for auth and role protection.
- Keep homepage layout stable unless explicitly requested.

Important folders:

```text
frontend/src/
├─ admin/              Admin layouts, hooks, services, reusable admin components
├─ api/                Axios client, service modules, mappers
├─ auth/               Auth context, storage, roles, permissions
├─ cart/               Shared cart state
├─ components/         Shared and storefront components
├─ guards/             ProtectedRoute, StaffRoute, AdminRoute, GuestRoute
├─ hooks/              Storefront and integration hooks
├─ pages/              Client and admin pages
├─ routes/             Lazy route definitions and preload helpers
├─ seo/                Metadata helpers
├─ utils/              Formatting, identity, payment, tracking helpers
└─ wishlist/           Wishlist provider/state
```

## Backend Architecture

Key principles:

- Controllers define HTTP contracts.
- Services own business rules and side effects.
- Repositories isolate persistence.
- DTOs and mappers keep API contracts separate from entities.
- Security is enforced through Spring Security, roles, and permissions.

Important packages:

```text
org.example.electronics/
├─ config/
├─ controller/
├─ dto/
├─ entity/
├─ exception/
├─ job/
├─ mapper/
├─ monitoring/
├─ repository/
├─ security/
├─ service/
└─ util/
```

## Request Flow

Authenticated admin request:

```text
Admin UI
  -> frontend API service
  -> Axios client with bearer token
  -> Spring Security JWT filter
  -> Controller
  -> Service
  -> Repository
  -> PostgreSQL
  -> Mapper/DTO response
  -> UI state
```

Payment handoff:

```text
Checkout
  -> create order
  -> create payment request
  -> provider sandbox
  -> backend return/IPN validation
  -> frontend result route
  -> server-side status verification
```

Media upload:

```text
Admin media UI
  -> multipart upload
  -> backend validation
  -> Cloudinary
  -> media API create/update
  -> product/variant/media UI
```

## Deployment Architecture

Production-like Docker stack:

```text
frontend: Nginx static server + /api proxy
backend: Spring Boot API
postgres: PostgreSQL with named volume
```

See [../DEPLOYMENT.md](../DEPLOYMENT.md).

## Current Known Boundaries

- Admin CRUD is API-backed.
- Storefront product listing/detail, checkout, payment, and account routes have partial real API integration.
- Homepage product sections and search overlay still use mock/local data.
- Public customer registration exists; customer login and ownership contracts are not finalized.
- Dashboard/report analytics still use mock analytics data until reporting APIs exist.
- Production migrations, public customer ownership, and real payment credentials remain Phase 8 work.

## Documentation Map

| Topic | Doc |
| --- | --- |
| Setup | [SETUP.md](SETUP.md) |
| Environment | [ENVIRONMENT.md](ENVIRONMENT.md) |
| API | [API.md](API.md) |
| Deployment | [../DEPLOYMENT.md](../DEPLOYMENT.md) |
| Payment | [../PAYMENT.md](../PAYMENT.md) |
| Security | [../SECURITY.md](../SECURITY.md) |
| AI context | [ai-context/PROJECT_CONTEXT.md](ai-context/PROJECT_CONTEXT.md) |
