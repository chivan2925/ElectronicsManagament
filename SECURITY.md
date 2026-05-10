# SECURITY

## Purpose

This guide summarizes the security posture and operating rules for ElectronicsManagement.

Detailed backend security behavior lives in [docs/backend/SECURITY.md](docs/backend/SECURITY.md).

## Current Security Posture

ElectronicsManagement currently includes:

- JWT-based admin/staff authentication.
- Protected admin routes with role and permission policies.
- Protected storefront checkout and account routes.
- Payment callback validation for VNPay and MoMo.
- Upload validation for JPG, PNG, and WEBP media.
- Environment-driven backend secrets and provider credentials.
- Frontend auth storage controls through `VITE_AUTH_TOKEN_STORAGE`.

Customer registration is still not fully backed by public customer APIs, and final customer account ownership contracts remain Phase 8 work.

## Authentication

Admin/staff login:

```http
POST /api/admin/auth/login
```

Authenticated requests use:

```http
Authorization: Bearer <accessToken>
```

Frontend auth rules:

- Store only safe user display metadata.
- Store tokens through `frontend/src/auth/authStorage.js`.
- Prefer `VITE_AUTH_TOKEN_STORAGE=session` for safer browser persistence.
- Clear the auth session on non-refreshable `401`.
- Do not store passwords or raw sensitive responses.

Backend auth rules:

- Passwords are BCrypt hashes.
- Sessions are stateless.
- Logout invalidates the JWT token id until expiry.
- Staff with inactive roles or blocked/deleted status cannot authenticate.

## Authorization

Admin authorization is permission-aware:

- `ADMIN` has full admin access.
- `STAFF` requires matching resource permissions for module access and actions.
- User-shaped/customer sessions cannot access `/admin/*`.

Examples:

| Resource | Permissions |
| --- | --- |
| Products | `product:view`, `product:create`, `product:update`, `product:delete` |
| Orders | `order:view`, `order:update` |
| Coupons | `coupon:view`, `coupon:create`, `coupon:update`, `coupon:delete` |
| Warehouse | `warehouse:view`, `warehouse:create`, `warehouse:update`, `warehouse:delete` |
| Media | `media:view`, `media:create`, `media:update`, `media:delete` |

Admin-only areas include users, staff, roles, and permissions.

## Secrets

Never commit real values for:

- `DB_PASSWORD`
- `ELECTRONICS_JWT_SECRET`
- `VNPAY_SECRET_KEY`
- `MOMO_SECRET_KEY`
- `MOMO_ACCESS_KEY`
- `CLOUDINARY_API_SECRET`
- Production frontend/backend URLs if they reveal private infrastructure.

Use `.env.example` only as a template. Real secrets should come from local `.env`, hosting platform secrets, or a secret manager.

## Payment Security

Payment success is never trusted from frontend state alone.

The backend must validate:

- Required provider callback fields.
- Provider signature.
- Merchant identity.
- Local order id and transaction ownership.
- Expected amount.
- Duplicate successful callback attempts.
- Reused provider transaction ids.

Public payment endpoints:

```text
GET  /api/payments/vnpay-return
GET  /api/payments/momo-return
GET  /api/system/payment/vnpay-ipn
POST /api/system/payment/momo-ipn
```

Provider secrets stay on the backend only.

## Upload Security

Media upload rules:

- Admin/staff authentication is required.
- Accepted types: JPG, PNG, WEBP.
- Max file size: 5MB.
- Backend validates extension, MIME type, and magic bytes.
- Cloudinary API secret must never reach the frontend.

## API Error Handling

Frontend code should branch on HTTP status, not localized error messages.

Relevant docs:

- [docs/api/ERROR_FORMAT.md](docs/api/ERROR_FORMAT.md)
- [docs/api/AUTH.md](docs/api/AUTH.md)

## Production Checklist

Before production:

1. Replace every placeholder secret.
2. Use HTTPS for frontend, backend, payment return, and payment notify URLs.
3. Restrict CORS to production frontend origins.
4. Set `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` after controlled migrations are ready.
5. Disable Swagger/OpenAPI if it is not protected by network or auth.
6. Keep `SPRING_JPA_SHOW_SQL=false`.
7. Confirm payment provider callback URLs in provider dashboards.
8. Add backup and restore procedures for PostgreSQL.
9. Add rate limiting for auth, payment, and upload endpoints when deploying behind an edge layer.
10. Complete customer auth and customer ownership checks before public account launch.

## Known Remaining Risks

- Public customer registration APIs are not finalized.
- Customer-owned resource checks need a dedicated public customer principal contract.
- Backend refresh-token support is not complete yet.
- Upload rate limiting and malware scanning are not implemented.
- Production migrations are not yet formalized.
