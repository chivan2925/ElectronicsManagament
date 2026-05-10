# BACKEND_STRUCTURE

## Purpose

This document describes the Spring Boot backend under `backend/electronics`.

The backend is the source of truth for admin operations, catalog data, orders, payments, warehouse workflows, media uploads, authentication, authorization, monitoring, and persistence.

## Stack

- Java 21
- Spring Boot 4.0.3
- Spring Web MVC
- Spring Data JPA
- Spring Security
- JWT through `jjwt`
- PostgreSQL
- Jakarta Bean Validation
- MapStruct
- Lombok
- Springdoc OpenAPI
- Cloudinary SDK

## Root Package

```text
org.example.electronics
```

Main entry point:

```text
backend/electronics/src/main/java/org/example/electronics/ElectronicsApplication.java
```

## Package Structure

```text
org.example.electronics/
├─ config/
│  └─ payment/
├─ controller/
│  ├─ admin/
│  ├─ system/
│  └─ user/
├─ dto/
│  ├─ request/
│  └─ response/
├─ entity/
│  ├─ enums/
│  ├─ key/
│  ├─ order/
│  ├─ warehouse/
│  └─ root entities
├─ exception/
├─ job/
├─ mapper/
├─ monitoring/
├─ repository/
├─ security/
│  ├─ auth/
│  └─ jwt/
├─ service/
│  ├─ admin/
│  ├─ system/
│  └─ user-facing/payment helpers
└─ util/
   └─ payment/
```

## Layer Responsibilities

| Layer | Responsibility |
| --- | --- |
| Controller | HTTP routes, request/response contracts, auth principal access. |
| DTO | Validated input and frontend-safe output contracts. |
| Service | Business rules, lifecycle transitions, side effects. |
| Repository | JPA persistence access. |
| Mapper | Entity-to-DTO and DTO-to-entity conversion. |
| Security | JWT validation, auth entry points, role/permission enforcement. |
| Monitoring | Structured request and domain event logging. |
| Job | Scheduled cleanup and lifecycle tasks. |

## Controller Groups

Admin:

- Auth
- Categories
- Brands
- Products
- Variants
- Media
- Users and addresses
- Staff
- Roles and permissions
- Orders
- Payments
- Return requests
- Coupons
- Warehouses
- Warehouse transactions

User/storefront:

- Profile
- Orders
- Payment creation/return/status

System:

- Health/readiness
- Payment IPNs

## Security

Important classes:

```text
SecurityConfig
StaffDetails
StaffDetailsService
JwtAuthenticationFilter
JwtAuthEntryPoint
JwtAccessDeniedHandler
JwtUtils
```

Current behavior:

- Stateless sessions.
- JWT bearer token authentication.
- Public health, login, payment return/IPN, and Swagger routes.
- Admin-only routes for users, staff, roles, and permissions.
- Permission-aware admin access for catalog, media, orders, coupons, warehouse, and payment reads.
- JSON `401` and `403` responses.

## Main Domain Modules

| Module | Entities and concepts |
| --- | --- |
| Catalog | Category, Brand, Product, Variant, Media |
| People/access | User, Staff, Role, Permission, Address |
| Sales | Order, Order detail, Coupon, Return request |
| Payments | Payment transaction, provider callbacks, refunds |
| Warehouse | Warehouse, stock detail, warehouse transaction |
| Security | Invalidated token |
| Feedback | Review |

## Request Lifecycle

```text
HTTP request
  -> Security filter chain
  -> JWT filter for protected routes
  -> Controller
  -> Bean validation
  -> Service
  -> Repository
  -> Entity persistence
  -> Mapper
  -> DTO response
```

## Health And OpenAPI

Health:

```text
GET /api/health
GET /api/health/readiness
```

OpenAPI when enabled:

```text
/swagger-ui.html
/swagger-ui/**
/v3/api-docs/**
```

## Configuration

Main config file:

```text
backend/electronics/src/main/resources/application.yml
```

Environment-driven groups:

- Database: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- JWT: `ELECTRONICS_JWT_SECRET`, `ELECTRONICS_JWT_EXPIRATION_MS`
- CORS: `CORS_ALLOWED_ORIGIN_PATTERNS`
- Payment: `PAYMENT_*`, `VNPAY_*`, `MOMO_*`
- Cloudinary: `CLOUDINARY_*`
- Swagger: `SPRINGDOC_*`

See [../ENVIRONMENT.md](../ENVIRONMENT.md).

## Development Commands

Run from `backend/electronics/`:

```bash
mvn spring-boot:run
mvn test
mvn -q -DskipTests compile
```

## Adding A Backend Resource

Follow the existing pattern:

1. Add or update entity/enums.
2. Add repository.
3. Add request/response DTOs.
4. Add mapper.
5. Add service interface and implementation.
6. Add controller.
7. Add security policy.
8. Add frontend service/mapper if used by UI.
9. Update API docs.
10. Add tests for business-risk workflows.

## Known Gaps

- Public customer registration/auth is not finalized.
- Customer ownership checks need a final principal contract.
- Production migrations/backfills are not implemented.
- Payment/refund edge cases need broader automated tests.
