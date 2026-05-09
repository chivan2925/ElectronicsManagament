# SECURITY

## Purpose

This document describes backend security behavior and rules for the Spring Boot API.

The current authentication surface is admin/staff focused. Customer authentication is not complete yet.

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

## Public Routes

The following routes are public:

```text
POST /api/admin/auth/login
GET  /api/system/payment/vnpay-ipn
POST /api/system/payment/momo-ipn
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
- Frontend should remove `admin_access_token` on `401`.

## Roles And Permissions

The backend has:

- `roles`
- `permissions`
- `role_permissions`
- `@EnableMethodSecurity`

Current state:

- Endpoints are mainly protected by authentication.
- Fine-grained endpoint permissions are not fully implemented or documented yet.

Future rule:

- If method-level authorization is added, document each required permission in an authorization matrix.

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

Configuration currently includes local secrets and provider keys in `application.yml`.

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

1. Move secrets out of `application.yml`.
2. Add admin route protection in frontend.
3. Add permission matrix for admin endpoints.
4. Add customer auth if public user flows are built.
5. Review token cleanup schedule.
6. Review password reset flow.
7. Ensure payment webhook signature validation is covered by tests.
8. Disable noisy SQL logging in production.
