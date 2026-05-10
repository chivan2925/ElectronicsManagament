# SECURITY

## Purpose

This document describes backend security behavior and rules for the Spring Boot API.

The current login surface is admin/staff focused. Public customer registration exists, but customer login and account ownership tokens are not complete yet.

## Security Stack

- Spring Security
- Stateless sessions
- JWT access tokens through `jjwt`
- BCrypt password hashing
- Staff authentication through `StaffDetailsService`
- Token invalidation through `invalidated_tokens`

## Main Security Classes

| Class | Responsibility |
| --- | --- |
| `SecurityConfig` | Security filter chain, public/protected route rules, password encoder, authentication manager. |
| `StaffDetailsService` | Loads staff account by email for authentication. |
| `StaffDetails` | Exposes staff identity and authorities to Spring Security. |
| `JwtUtils` | Generates, validates, and reads JWT values. |
| `JwtAuthenticationFilter` | Reads bearer tokens and populates `SecurityContext`. |
| `JwtAuthEntryPoint` | Writes `401 Unauthorized` responses. |
| `JwtAccessDeniedHandler` | Writes JSON `403 Forbidden` responses for authenticated users without enough permission. |

## Public Routes

The following routes are public:

```text
POST /api/admin/auth/login
POST /api/auth/register
GET  /api/health
GET  /api/health/readiness
GET  /api/system/payment/vnpay-ipn
POST /api/system/payment/momo-ipn
GET  /api/payments/vnpay-return
GET  /api/payments/momo-return
/v3/api-docs/**
/swagger-ui/**
/swagger-ui.html
```

All other routes require a valid JWT.

## Admin Login Flow

```text
POST /api/admin/auth/login
  -> AuthenticationManager
  -> StaffDetailsService
  -> BCrypt password verification
  -> JwtUtils.generateJwtToken
  -> AdminLoginResponseDTO
```

Successful login returns:

- `accessToken`
- `tokenType`
- `staffId`
- `fullName`
- `email`
- `role`

## Authenticated Request Flow

```text
HTTP request
  -> Authorization: Bearer <token>
  -> JwtAuthenticationFilter
  -> JwtUtils.validateJwtToken
  -> invalidated token check
  -> StaffDetailsService.loadUserByUsername
  -> SecurityContext authentication
  -> Controller
```

## Logout Flow

```text
POST /api/admin/auth/logout
  -> extract bearer token
  -> extract token id and expiration
  -> store token id in invalidated_tokens
```

After logout, the same token is no longer accepted.

## Password Rules

Current backend behavior:

- Passwords are stored as BCrypt hashes.
- `PasswordEncoder` is `BCryptPasswordEncoder`.
- Staff password reset currently returns a temporary plain-text password.

Rules:

- Never log plain-text passwords.
- Never store plain-text passwords.
- Treat reset-password responses as sensitive.
- Add forced password change later if the reset flow is used in production.

## JWT Rules

The JWT contains:

- Subject: staff email.
- Token id: `jti`.
- Issued-at timestamp.
- Expiration timestamp.

Rules:

- Do not expose JWT secrets to frontend code.
- Do not put JWT values in logs.
- Do not branch frontend logic on localized auth messages.
- Frontend should remove `accessToken` on `401`.

## Roles And Permissions

The backend has:

- `roles`
- `permissions`
- `role_permissions`
- `@EnableMethodSecurity`

Current state:

- Admin-only account, staff, role, and permission endpoints require `ROLE_ADMIN`.
- Other admin resources require `ROLE_ADMIN` or a matching normalized `PERM:*` authority.
- `StaffDetails` exposes `ROLE_STAFF`, inferred `ROLE_ADMIN`, raw role/permission values, and normalized permission values such as `PERM:product:view`.
- Disabled staff or staff assigned to an inactive role cannot authenticate.

Current authorization matrix:

| Resource | View | Create | Update | Delete |
| --- | --- | --- | --- | --- |
| Categories | `category:view` | `category:create` | `category:update` | `category:delete` |
| Brands | `brand:view` | `brand:create` | `brand:update` | `brand:delete` |
| Products | `product:view` | `product:create` | `product:update` | `product:delete` |
| Variants | `variant:view` | `variant:create` | `variant:update` | `variant:delete` |
| Media | `media:view` | `media:create` | `media:update` | `media:delete` |
| Orders | `order:view` | Admin only | `order:update` | Admin only |
| Payments | `payment:view` or `order:view` | Admin only | Admin only | Admin only |
| Return requests | `return-request:view` or `order:view` | Admin only | `return-request:update` or `order:update` | Admin only |
| Coupons | `coupon:view` | `coupon:create` | `coupon:update` | `coupon:delete` |
| Warehouses and stock transactions | `warehouse:view` | `warehouse:create` | `warehouse:update` | `warehouse:delete` |

## Error Shape

Authentication errors use the JWT entry point shape:

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication is required or the token is invalid.",
  "path": "/api/admin/categories"
}
```

Application errors use `ErrorResponseDTO`.

See:

```text
docs/api/ERROR_FORMAT.md
```

## Secret Management

Configuration reads secrets and provider keys from environment variables and keeps committed defaults as development placeholders.

Rules:

- Do not copy secrets into docs.
- Do not commit new real secrets.
- Move secrets to environment variables before serious deployment.
- Use safe placeholders in documentation.

Recommended future pattern:

```yaml
electronics:
  app:
    jwtSecret: ${JWT_SECRET}
    jwtExpirationMs: ${JWT_EXPIRATION_MS:86400000}
```

## Security Checklist

Before production:

1. Override every placeholder secret through environment variables.
2. Keep frontend and backend permission matrices aligned.
3. Add customer auth if public user flows are built.
4. Review token cleanup schedule.
5. Review password reset flow.
6. Ensure payment webhook signature validation is covered by tests.
7. Disable noisy SQL logging in production.
