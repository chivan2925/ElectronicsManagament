# BACKEND_STRUCTURE

## Purpose

This document describes the current backend structure for the Spring Boot application in `backend/electronics`.

The backend is the source of truth for admin operations, catalog management, warehouse workflows, order state, payment handling, authentication, and persistence.

## Stack

- Java 25
- Spring Boot 4.0.5
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
│  ├─ payment/
│  ├─ AppConfig.java
│  └─ CloudinaryConfig.java
├─ controller/
│  ├─ admin/
│  └─ system/
├─ dto/
│  ├─ request/
│  └─ response/
├─ entity/
│  ├─ enums/
│  ├─ key/
│  ├─ order/
│  ├─ warehouse/
│  └─ root entity classes
├─ exception/
├─ job/
├─ mapper/
├─ repository/
├─ security/
│  ├─ auth/admin/
│  └─ jwt/
├─ service/
│  ├─ admin/
│  ├─ admin/impl/
│  ├─ admin/payment/
│  ├─ system/
│  └─ system/impl/
└─ util/
   └─ payment/
```

## Layer Responsibilities

### Controllers

Location:

```text
controller/admin/
controller/system/
```

Responsibilities:

- Define REST endpoints.
- Accept path variables, query parameters, request bodies, and authenticated staff principal.
- Delegate business logic to services.
- Return response DTOs or empty success responses.

Current controller groups:

- Admin auth
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
- System payment webhooks

### Services

Location:

```text
service/admin/
service/admin/impl/
service/system/
service/system/impl/
```

Responsibilities:

- Implement business rules.
- Validate lifecycle transitions beyond basic request validation.
- Coordinate repositories and mappers.
- Handle authenticated staff context when needed.
- Apply side effects such as stock updates, token invalidation, payment handling, and media upload.

### Repositories

Location:

```text
repository/
```

Responsibilities:

- Provide database access through Spring Data JPA.
- Keep persistence queries isolated from controllers and UI-facing DTOs.

### Entities

Location:

```text
entity/
```

Responsibilities:

- Model persisted domain state.
- Define relationships between catalog, user, staff, order, warehouse, payment, media, review, and return request data.
- Use enums for state and type fields.

Important entity groups:

- Catalog: `CategoryEntity`, `BrandEntity`, `ProductEntity`, `VariantEntity`, `MediaEntity`
- People and access: `UserEntity`, `StaffEntity`, `RoleEntity`, `PermissionEntity`, `AddressEntity`
- Sales: `OrderEntity`, `OrderDetailEntity`, `CouponEntity`
- Payments: `PaymentTransactionEntity`
- Warehouse: `WarehouseEntity`, `WarehouseDetailEntity`, `WarehouseTransactionEntity`, `WarehouseTransactionDetailEntity`
- Security: `InvalidatedTokenEntity`
- Customer feedback and returns: `ReviewEntity`, `ReturnRequestEntity`

### DTOs

Location:

```text
dto/request/
dto/response/
```

Responsibilities:

- Keep API contracts separate from entity models.
- Use request DTOs for validation.
- Use response DTOs for frontend-safe output shapes.

Request DTOs are currently strongest for admin workflows. Public client request DTOs are still limited.

### Mappers

Location:

```text
mapper/
```

Responsibilities:

- Convert entities to response DTOs.
- Convert request DTOs to entities where appropriate.
- Keep mapping logic out of controllers.

MapStruct is configured in Maven for mapper generation.

### Security

Location:

```text
security/
```

Important classes:

- `SecurityConfig`
- `StaffDetails`
- `StaffDetailsService`
- `JwtAuthenticationFilter`
- `JwtAuthEntryPoint`
- `JwtUtils`

Current behavior:

- Stateless sessions.
- CSRF disabled for REST API usage.
- `POST /api/admin/auth/login` is public.
- Payment IPN endpoints are public.
- Swagger/OpenAPI endpoints are public.
- Other endpoints require authentication.
- JWT subject is the staff email.
- JWT token id is checked against the invalidated token repository.

### Exceptions

Location:

```text
exception/GlobalExceptionHandler.java
dto/response/system/ErrorResponseDTO.java
```

Current handled cases:

- `IllegalArgumentException` -> `400 Bad Request`
- `MethodArgumentNotValidException` -> `400 Bad Request`
- `EntityNotFoundException` -> `404 Not Found`
- `IllegalStateException` -> `409 Conflict`
- Unhandled `Exception` -> `500 Internal Server Error`

Authentication errors are handled separately by `JwtAuthEntryPoint`.

See `docs/api/ERROR_FORMAT.md`.

## Request Lifecycle

```text
HTTP request
  -> Security filter chain
  -> JwtAuthenticationFilter when protected
  -> Controller
  -> Request DTO validation
  -> Service
  -> Repository
  -> Entity persistence
  -> Mapper
  -> Response DTO
  -> HTTP response
```

## Domain Modules

### Catalog

Includes categories, brands, products, variants, and media.

Status enum:

```text
ProductStatus: ACTIVE, HIDDEN, DELETED
```

### People And Access

Includes users, staff, roles, permissions, and addresses.

Status enum:

```text
UserStatus: ACTIVE, BLOCKED, DELETED
```

### Sales

Includes orders, order details, coupons, payment transactions, return requests, and reviews.

Key enums:

```text
OrderStatus
PaymentStatus
PaymentMethodType
ShippingProvider
ShippingStatus
CouponStatus
CouponTimeStatus
CouponType
ReturnRequestStatus
```

### Warehouse

Includes warehouses, stock details, and warehouse transactions.

Key enums:

```text
WarehouseStatus
WarehouseTransactionType
WarehouseTransactionStatus
```

### System Integrations

Includes Cloudinary media upload, VNPay, Momo, system payment service, and payment webhook handling.

## Jobs

Location:

```text
job/
```

Current jobs:

- `TokenCleanupScheduler`
- `OrderCleanupScheduler`

These are intended for cleanup or lifecycle maintenance work outside direct request handling.

## Configuration

Location:

```text
backend/electronics/src/main/resources/application.yml
```

Contains local configuration for:

- Spring application name.
- PostgreSQL datasource.
- JPA/Hibernate behavior.
- Multipart upload limits.
- JWT settings.
- Payment provider settings.
- Cloudinary settings.

Important security note:

- Do not copy real secret values into docs or frontend code.
- Move secrets to environment variables before serious deployment.

## API Documentation

Current endpoint inventory:

```text
docs/api/ENDPOINTS.md
```

Authentication behavior:

```text
docs/api/AUTH.md
```

Error format:

```text
docs/api/ERROR_FORMAT.md
```

Swagger/OpenAPI is enabled through Springdoc:

```text
/swagger-ui.html
/swagger-ui/**
/v3/api-docs/**
```

## Development Commands

Run from `backend/electronics/`:

```bash
mvn test
mvn spring-boot:run
```

Build outputs should stay out of git:

```text
backend/electronics/target/
```

## Adding A New Backend Resource

When adding a new backend resource, follow the existing pattern:

1. Add or update entity and enum types.
2. Add repository.
3. Add request and response DTOs.
4. Add mapper.
5. Add service interface.
6. Add service implementation.
7. Add controller endpoint.
8. Add validation and error handling.
9. Update `docs/api/ENDPOINTS.md`.
10. Add or update tests when the workflow has business risk.

## Known Gaps

- Public storefront/customer APIs are not complete.
- Fine-grained permission checks are not documented as an authorization matrix yet.
- Secrets should be externalized from local configuration.
- Payment config paths should be checked before deployment.
