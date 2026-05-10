# API DOCUMENTATION

## Purpose

This is the API entry point for ElectronicsManagement. It summarizes how the frontend talks to the backend and links to the detailed endpoint inventory.

Detailed docs:

- [api/ENDPOINTS.md](api/ENDPOINTS.md)
- [api/AUTH.md](api/AUTH.md)
- [api/ERROR_FORMAT.md](api/ERROR_FORMAT.md)

## Base URL

Local backend:

```text
http://localhost:8080/api
```

Frontend variable:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

When the frontend is served by Nginx in Docker:

```env
VITE_API_BASE_URL=/api
```

## API Client

Frontend API calls should go through:

```text
frontend/src/api/client.js
frontend/src/api/*Service.js
frontend/src/api/*Mapper.js
```

Rules:

- Do not call Axios directly from many UI components.
- Normalize flexible backend response wrappers in mapper/service files.
- Use `Authorization: Bearer <token>` for protected endpoints.
- Use `skipGlobalErrorHandler` only for flows that render local error UI.
- Use `X-Request-Id` correlation when debugging frontend/backend logs.

## Authentication

Admin/staff login:

```http
POST /api/admin/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Customer registration:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "customer@example.com",
  "phone": "0909123456",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

Successful registration creates an `ACTIVE` customer account and returns safe profile metadata only:

```json
{
  "id": 1,
  "fullName": "Nguyễn Văn A",
  "email": "customer@example.com",
  "phone": "0909123456",
  "role": "USER",
  "status": "ACTIVE"
}
```

Customer login:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "customer@example.com",
  "password": "Password123!"
}
```

Successful customer login returns a customer-scoped JWT session:

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "id": 1,
  "userId": 1,
  "fullName": "Nguyễn Văn A",
  "email": "customer@example.com",
  "phone": "0909123456",
  "role": "USER",
  "roles": ["USER"],
  "accountType": "user",
  "status": "ACTIVE"
}
```

Authenticated request:

```http
Authorization: Bearer <accessToken>
```

Current frontend auth supports separate customer and admin/staff login surfaces. Refresh-token support is not finalized yet.

## Public Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Liveness probe. |
| `GET /api/health/readiness` | Readiness probe with database connectivity. |
| `POST /api/admin/auth/login` | Admin/staff login. |
| `POST /api/auth/login` | Customer login. |
| `POST /api/auth/register` | Customer account registration. |
| `GET /api/payments/vnpay-return` | VNPay browser return. |
| `GET /api/payments/momo-return` | MoMo browser return. |
| `GET /api/system/payment/vnpay-ipn` | VNPay IPN. |
| `POST /api/system/payment/momo-ipn` | MoMo IPN. |
| `/swagger-ui.html`, `/swagger-ui/**`, `/v3/api-docs/**` | OpenAPI docs when enabled. |

All other endpoints require authentication unless the backend policy changes.

## Endpoint Groups

| Group | Paths |
| --- | --- |
| Admin auth | `/admin/auth/*` |
| Customer auth | `/auth/login`, `/auth/register`, `/auth/logout` |
| Catalog | `/admin/categories`, `/admin/brands`, `/admin/products`, `/admin/variants`, `/admin/media` |
| People and access | `/admin/users`, `/admin/staffs`, `/admin/roles`, `/admin/permissions` |
| Sales | `/admin/orders`, `/admin/payments`, `/admin/return-requests`, `/admin/coupons` |
| Warehouse | `/admin/warehouses`, `/admin/warehouse-transactions` |
| Storefront account/order | `/users/{userId}/profile`, `/orders` |
| Payments | `/payments/*`, `/system/payment/*` |
| Health | `/health`, `/health/readiness` |

## Common List Parameters

Most admin list endpoints support:

| Parameter | Notes |
| --- | --- |
| `page` | Zero-based page index. |
| `size` | Page size. |
| `sort` | Spring sort syntax, for example `updatedAt,desc`. |
| `keyword` | Search term. |
| `status` | Resource-specific status. |
| `fromDate`, `toDate` | Date filtering when supported. |
| `dateType` | Date field selection when supported. |

## Error Handling

Backend errors are normalized by the frontend API client into a consistent UI shape.

Important response families:

- Standard application errors use `statusCode`, `error`, `message`, and optional `details`.
- Auth errors use `status`, `error`, `message`, and `path`.

Frontend code should branch on HTTP status, not localized message text.

See [api/ERROR_FORMAT.md](api/ERROR_FORMAT.md).

## Swagger

When enabled:

```text
http://localhost:8080/swagger-ui.html
http://localhost:8080/v3/api-docs
```

Disable Swagger in production if it is not protected by network or auth controls:

```env
SPRINGDOC_API_DOCS_ENABLED=false
SPRINGDOC_SWAGGER_UI_ENABLED=false
```

## Updating API Docs

When adding or changing an endpoint:

1. Update controller/service code.
2. Update frontend service/mapper contracts if used by the UI.
3. Update [api/ENDPOINTS.md](api/ENDPOINTS.md).
4. Update [api/AUTH.md](api/AUTH.md) if auth behavior changes.
5. Update [api/ERROR_FORMAT.md](api/ERROR_FORMAT.md) if response shape changes.
6. Run frontend/backend validation commands relevant to the change.
