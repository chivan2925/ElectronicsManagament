# AUTH

## Scope

The current backend authentication flow is still admin/staff focused for login. Public customer registration exists at `POST /api/auth/register`, but customer login/ownership tokens are not complete yet.

Auth is implemented with Spring Security, JWT, stateless sessions, and a staff details service.

## Public And Protected Routes

Public routes:

- `GET /api/health`
- `GET /api/health/readiness`
- `POST /api/admin/auth/login`
- `POST /api/auth/register`
- `GET /api/payments/vnpay-return`
- `GET /api/payments/momo-return`
- `GET /api/system/payment/vnpay-ipn`
- `POST /api/system/payment/momo-ipn`
- `/v3/api-docs/**`
- `/swagger-ui/**`
- `/swagger-ui.html`

All other routes require a valid JWT access token.

## Customer Registration

Endpoint:

```http
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "customer@example.com",
  "phone": "0909123456",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

Response body:

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

Notes:

- Passwords are hashed with the shared backend `PasswordEncoder`.
- `role` is derived as customer `USER` metadata; the staff/admin `roles` table remains unchanged.
- Clients cannot provide ADMIN or STAFF role data in the request.
- The endpoint does not return password or hash values.

## Login

Endpoint:

```http
POST /api/admin/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Response body:

```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "staffId": 1,
  "fullName": "Admin User",
  "email": "admin@example.com",
  "role": "Admin"
}
```

The frontend should save `accessToken` under:

```text
accessToken
```

If the backend later returns a refresh token, the frontend stores it under:

```text
refreshToken
```

## Authenticated Requests

Send the token in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

Frontend convention:

```js
// Prefer using frontend/src/auth/authStorage.js rather than direct storage calls.
saveAuthSession(session);
```

The shared Axios client in `frontend/src/api/client.js` reads the centralized auth storage and appends the `Authorization` header.

## Logout

Endpoint:

```http
POST /api/admin/auth/logout
Authorization: Bearer <accessToken>
```

Behavior:

- Extracts the current token from the request header.
- Extracts the token id and expiry.
- Stores the token id in `InvalidatedTokenRepository`.
- Future requests using the same token are treated as unauthenticated.

Response body:

```text
Logout succeeded.
```

The current backend response string is localized. Frontend code should not depend on the exact text.

## Token Contents And Expiry

The JWT subject is the staff email. The token also has:

- `jti`: generated token id.
- `iat`: issued-at timestamp.
- `exp`: expiration timestamp based on `electronics.app.jwtExpirationMs`.

Token secrets and expiration are configured through backend application properties. Do not copy real secrets into documentation or frontend code.

## Unauthorized Response

When authentication is missing, invalid, expired, or the token was invalidated, Spring Security returns `401`.

Current response shape:

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication is required or the token is invalid.",
  "path": "/api/admin/categories"
}
```

The actual backend message may be localized. Frontend code should branch on `status` or HTTP status, not on `message`.

## Login Error Responses

The login endpoint returns explicit status codes for common authentication failures:

| Case | HTTP status | Notes |
| --- | --- | --- |
| Invalid email or password | `401 Unauthorized` | Frontend should show an invalid credentials message. |
| Disabled or blocked staff account | `403 Forbidden` | Frontend should show an account disabled/blocked message. |
| Locked or deleted staff account | `423 Locked` | Frontend should show an account locked message. |

## Frontend Handling Rules

- Keep login form state separate from admin dashboard state.
- Store only tokens and non-sensitive display data.
- Try the centralized frontend refresh flow on eligible `401` responses when `refreshToken` is available.
- Remove the auth session when refresh fails or no refresh token is available.
- Redirect admin users to the login page after token removal.
- Redirect successful admin/staff login to `/admin/dashboard`.
- Redirect successful user-shaped login sessions to `/`.
- Prefer `VITE_AUTH_TOKEN_STORAGE=session` unless a long-lived local development session is needed.
- Do not store passwords.
- Do not display raw JWT values in the UI.
- The frontend refresh flow is ready, but the current backend admin auth controller exposes login/logout only. Real refresh requires backend refresh-token response and `POST /api/admin/auth/refresh` support.

## Role And Permission Notes

The backend already has role and permission entities, role management APIs, and `@EnableMethodSecurity`.

Current endpoint access is guarded by role and resource permissions. Admin-only areas include users, staff, roles, and permissions; staff access to other admin modules requires matching resource permissions such as `product:view` or `order:update`.
