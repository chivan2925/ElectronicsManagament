# ENVIRONMENT VARIABLES

## Purpose

This guide documents environment variables used by local development, Docker Compose, the Spring Boot backend, and the Vite frontend.

Use `.env.example` as the template. Keep real `.env` files out of git.

## Files

| File | Purpose |
| --- | --- |
| `.env.example` | Root Docker/runtime template with safe placeholders. |
| `.env.production.example` | Production deployment template with explicit placeholders. Do not use as-is. |
| `.env` | Local Docker/runtime values. Do not commit. |
| `frontend/.env.example` | Vite local development template. |
| `frontend/.env.production.example` | Vite production build template. |
| `frontend/.env.local` | Optional Vite local overrides. Do not commit. |
| `backend/electronics/src/main/resources/application.yml` | Backend defaults and environment variable bindings. |
| `backend/electronics/src/main/resources/application-docker.yml` | Docker/local container runtime defaults. |
| `backend/electronics/src/main/resources/application-prod.yml` | Production runtime defaults with validation posture. |

## Compose Variables

| Variable | Example | Notes |
| --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | `electronics-management` | Docker Compose project name. |
| `FRONTEND_PORT` | `8088` | Host port for production-like frontend container. |
| `FRONTEND_DEV_PORT` | `5173` | Host port for Vite dev container. |
| `VITE_DEV_API_BASE_URL` | `http://localhost:8080/api` | Dev Compose frontend API origin. |
| `VITE_DEV_SITE_URL` | `http://localhost:5173` | Dev Compose frontend site origin. |
| `BACKEND_PORT` | `8080` | Host port for backend container. |
| `JAVA_OPTS` | `-XX:MaxRAMPercentage=75.0` | Optional JVM runtime tuning. |

## Database Variables

| Variable | Example | Notes |
| --- | --- | --- |
| `POSTGRES_IMAGE_TAG` | `18-alpine` | Docker Postgres image tag. |
| `POSTGRES_DB` | `electronics_management` | Docker database name. |
| `POSTGRES_USER` | `electronics` | Docker database user. |
| `POSTGRES_PASSWORD` | `change-me-local-password` | Local placeholder only. |
| `POSTGRES_PORT` | `5432` | Host database port. |
| `DB_URL` | `jdbc:postgresql://postgres:5432/electronics_management` | Backend JDBC URL. |
| `DB_USERNAME` | `electronics` | Backend database username. |
| `DB_PASSWORD` | `change-me-local-password` | Backend database password. |

## Backend Runtime Variables

| Variable | Default | Notes |
| --- | --- | --- |
| `SERVER_PORT` | `8080` | Spring Boot server port. |
| `SPRING_PROFILES_ACTIVE` | `docker` in Compose, `prod` for real production | Active Spring profile. |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Use `validate` for production after migrations exist. |
| `SPRING_JPA_SHOW_SQL` | `false` in Compose | Keep false outside debugging. |
| `SPRINGDOC_API_DOCS_ENABLED` | `true` | Disable in production if Swagger is not protected. |
| `SPRINGDOC_SWAGGER_UI_ENABLED` | `true` | Disable in production if Swagger is not protected. |
| `CORS_ALLOWED_ORIGIN_PATTERNS` | Localhost origins | Restrict to real origins in production. |

## Security Variables

| Variable | Example | Notes |
| --- | --- | --- |
| `ELECTRONICS_JWT_SECRET` | `replace-with-at-least-32-random-bytes` | Must be unique and secret per environment. |
| `ELECTRONICS_JWT_EXPIRATION_MS` | `86400000` | Access token lifetime in milliseconds. |

Production rule:

```text
Never reuse development JWT secrets in production.
```

## Frontend Variables

Vite exposes only variables prefixed with `VITE_`.

| Variable | Example | Notes |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` or `/api` | API base URL. Use `/api` behind Nginx proxy. |
| `VITE_API_TIMEOUT` | `15000` | Axios timeout in milliseconds. |
| `VITE_SITE_URL` | `https://your-domain.example` | Public site origin for canonical URLs. |
| `VITE_OG_IMAGE_URL` | `https://your-domain.example/og-image.png` | Public Open Graph image URL. |
| `VITE_APP_VERSION` | `local` | Build/release label used by frontend monitoring metadata. |
| `VITE_BUILD_SOURCEMAP` | `false` | Set `true` only when production source maps are intentionally produced and protected. |
| `VITE_ENABLE_CLIENT_MONITORING` | `true` | Enables the local frontend monitoring buffer. |
| `VITE_ENABLE_CLIENT_LOGS` | `false` | Enables browser console logs when explicitly needed. |
| `VITE_MONITOR_ROUTE_CHANGES` | `false` | Enables route-change monitoring events. |
| `VITE_AUTH_TOKEN_STORAGE` | `session` | `session` is preferred; `local` is available for long-lived dev sessions. |
| `VITE_AUTH_REFRESH_ENDPOINT` | `/admin/auth/refresh` | Frontend-ready; backend refresh endpoint is not finalized. |
| `VITE_DEMO_MODE` | `false` | Set to `true` only for local demo/presentation mode with seeded mock API responses and demo accounts. |
| `VITE_PRODUCT_API_PATH` | `/products` | Public storefront product catalog path used by frontend catalog service calls. |
| `VITE_COUPON_API_PATH` | `/admin/coupons` | Coupon API path. |
| `VITE_ORDER_API_PATH` | `/orders` | Storefront order API path. |
| `VITE_PAYMENT_API_PATH` | `/payments` | Payment API path. |
| `VITE_REALTIME_WS_URL` | empty | Optional future WebSocket endpoint. |
| `VITE_USER_API_PATH` | `/admin/users` | Admin user API path. |
| `VITE_USER_PROFILE_API_PATH` | `/users` | Account profile API path. |
| `VITE_USER_ORDER_API_PATH` | `/orders` | Account order API path. |
| `VITE_WISHLIST_API_PATH` | empty | Optional wishlist backend path. Leave empty until a compatible backend wishlist API exists. |

## Payment Variables

Frontend result URLs:

| Variable | Example |
| --- | --- |
| `PAYMENT_FRONTEND_SUCCESS_URL` | `http://localhost:5173/payment/success` |
| `PAYMENT_FRONTEND_FAILED_URL` | `http://localhost:5173/payment/failed` |

VNPay:

| Variable | Example |
| --- | --- |
| `VNPAY_TMN_CODE` | `YOUR_TMN_CODE` |
| `VNPAY_SECRET_KEY` | `YOUR_SECRET_KEY` |
| `VNPAY_PAY_URL` | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| `VNPAY_REFUND_URL` | `https://sandbox.vnpayment.vn/merchant_webapi/api/transaction` |
| `VNPAY_RETURN_URL` | `http://localhost:8080/api/payments/vnpay-return` |

MoMo:

| Variable | Example |
| --- | --- |
| `MOMO_PARTNER_CODE` | `MOMO_PARTNER_CODE` |
| `MOMO_ACCESS_KEY` | `MOMO_ACCESS_KEY` |
| `MOMO_SECRET_KEY` | `MOMO_SECRET_KEY` |
| `MOMO_ENDPOINT` | `https://test-payment.momo.vn/v2/gateway/api/create` |
| `MOMO_REFUND_URL` | `https://test-payment.momo.vn/v2/gateway/api/refund` |
| `MOMO_RETURN_URL` | `http://localhost:8080/api/payments/momo-return` |
| `MOMO_NOTIFY_URL` | `http://localhost:8080/api/system/payment/momo-ipn` |

## Cloudinary Variables

| Variable | Notes |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Required for real media upload. |
| `CLOUDINARY_API_KEY` | Required for real media upload. |
| `CLOUDINARY_API_SECRET` | Secret. Backend only. |

## Production Recommendations

- Use HTTPS URLs for all public frontend/backend/payment URLs.
- Set `VITE_API_BASE_URL=/api` when Nginx proxies backend traffic.
- Set `SPRING_PROFILES_ACTIVE=prod` for real production.
- Set `SPRING_JPA_HIBERNATE_DDL_AUTO=validate`.
- Set `SPRING_JPA_SHOW_SQL=false`.
- Disable Swagger unless access is restricted.
- Keep VNPay/MoMo sandbox endpoints out of the `prod` profile.
- Replace every `replace-with-*`, `YOUR_*`, and local placeholder before startup.
- Rotate secrets per environment.
- Store secrets outside git.
