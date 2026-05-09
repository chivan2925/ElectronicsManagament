# AUTH

## Scope

The current backend authentication flow is for admin staff. Customer/public authentication is not complete yet.

Auth is implemented with Spring Security, JWT, stateless sessions, and a staff details service.

## Public And Protected Routes

Public routes:

- `POST /api/admin/auth/login`
- `GET /api/system/payment/vnpay-ipn`
- `POST /api/system/payment/momo-ipn`
- `/v3/api-docs/**`
- `/swagger-ui/**`
- `/swagger-ui.html`

All other routes require a valid JWT access token.

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

## Authenticated Requests

Send the token in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

Frontend convention:

```js
localStorage.setItem("accessToken", response.data.accessToken);
```

The shared Axios client in `frontend/src/api/client.js` already reads this key and appends the `Authorization` header.

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

## Frontend Handling Rules

- Keep login form state separate from admin dashboard state.
- Store only the access token and non-sensitive display data.
- Remove `accessToken` on `401`.
- Redirect admin users to the login page after token removal.
- Do not store passwords.
- Do not display raw JWT values in the UI.
- Do not add refresh-token logic until the backend supports it.

## Role And Permission Notes

The backend already has role and permission entities, role management APIs, and `@EnableMethodSecurity`.

Current endpoint access is mainly guarded by authentication. If fine-grained authorization is added later, document the required permissions per endpoint in `ENDPOINTS.md` or a dedicated authorization matrix.
