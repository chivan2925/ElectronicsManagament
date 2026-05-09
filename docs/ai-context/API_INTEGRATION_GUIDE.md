# API_INTEGRATION_GUIDE

## Purpose

This guide defines how frontend API integration should be done later.

Current phase:

```text
Phase 4 — Auth + Backend Integration foundation
```

The shared frontend API layer and centralized auth architecture exist. Admin/staff login is connected to the backend JWT API; admin CRUD pages are not yet connected to real admin APIs.

## Backend API Scope

Backend Spring Boot admin APIs exist for:

- Category
- Brand
- Product
- Variant
- Staff
- User
- Role / Permission
- Order
- Warehouse
- Coupon
- Media

Catalog integration must preserve the storefront category labels:

- điện thoại
- laptop
- tai nghe
- chuột
- bàn phím
- lót chuột
- PC Gaming
- máy bộ
- linh kiện PC
- ghế gaming
- phụ kiện gaming

Other backend areas:

- Admin auth.
- Payment transactions.
- Return requests.
- VNPay and Momo webhooks.
- Cloudinary media upload.

## Frontend API Client

Shared Axios client:

```text
frontend/src/api/client.js
frontend/src/api/apiConfig.js
frontend/src/api/apiErrorHandler.js
frontend/src/api/normalizeApiError.js
frontend/src/api/refreshTokenService.js
```

Current behavior:

- Uses `VITE_API_BASE_URL`.
- Uses `VITE_API_TIMEOUT`.
- Uses `VITE_AUTH_REFRESH_ENDPOINT`.
- Falls back to `http://localhost:8080/api`.
- Defaults request timeout to `15000` ms.
- Reads `accessToken` through `frontend/src/auth/authStorage.js`.
- Adds `Authorization: Bearer <token>` automatically when a token is available.
- Supports `skipAuth` for requests that must not send a bearer token.
- Uses a shared response interceptor for normalized errors, retry handling, refresh handling, and `401` auth cleanup.
- Attempts a single shared refresh-token request on eligible `401` responses, then retries the original request once.
- Avoids duplicate concurrent refresh calls through `refreshTokenService`.
- Avoids infinite refresh loops with `__isRetryAfterRefresh` and `skipAuthRefresh`.
- Clears the centralized auth session when refresh fails or no refresh token is available.
- Supports `skipUnauthorizedHandler` for requests that should not trigger auth cleanup.
- Dispatches `auth:unauthorized` on handled `401` responses for AuthProvider handling.
- Retries safe idempotent requests (`GET`, `HEAD`, `OPTIONS`) once by default on network, timeout, or server errors.
- Keeps unsafe request retries opt-in through request config.
- Exposes reusable data-returning API helpers through `api.get`, `api.post`, `api.put`, `api.patch`, `api.delete`, and `api.request`.
- Attaches normalized error details to Axios errors as `error.apiError` and `error.normalizedError`.

Environment example:

```text
frontend/.env.example
```

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=15000
VITE_AUTH_REFRESH_ENDPOINT=/admin/auth/refresh
```

## Integration Rules

- Do not call axios directly inside many UI components.
- Add API modules under `frontend/src/api`.
- Keep request/response shapes close to backend DTOs.
- Add loading, error, and empty states before replacing mock data.
- Replace mock data one resource at a time.

## Recommended API Module Structure

```text
frontend/src/api/
├─ client.js
├─ apiConfig.js
├─ apiErrorHandler.js
├─ normalizeApiError.js
├─ refreshTokenService.js
├─ authService.js
├─ categoryService.js
├─ brandService.js
├─ productService.js
├─ userService.js
├─ staffService.js
├─ orderService.js
├─ warehouseService.js
├─ couponService.js
└─ mediaService.js
```

Resource services expose basic CRUD helpers:

- `getAll(params)`
- `getById(id)`
- `create(payload)`
- `update(id, payload)`
- `remove(id)`

`authService.js` owns login/logout and token helpers. It calls `POST /admin/auth/login` for the current backend admin/staff JWT flow.

The homepage must continue using mock data until storefront API integration is explicitly started.

## Auth Architecture

Frontend auth files:

```text
frontend/src/auth/
├─ AuthContext.jsx
├─ AuthProvider.jsx
├─ useAuth.js
├─ usePermissions.js
├─ authStorage.js
├─ authHelpers.js
├─ roleHelpers.js
└─ PermissionGate.jsx

frontend/src/guards/
├─ ProtectedRoute.jsx
├─ AdminRoute.jsx
├─ StaffRoute.jsx
├─ GuestRoute.jsx
├─ RouteGuardState.jsx
└─ routeGuardUtils.jsx

frontend/src/store/auth/
├─ authReducer.js
└─ index.js
```

Auth state shape:

- `user`
- `roles`
- `permissions`
- `accessToken`
- `refreshToken`
- `isAuthenticated`
- `loading`

Supported account categories:

- customer user
- admin
- staff

Current behavior:

- `AuthProvider` is mounted at the app root and restores stored sessions during initial auth state creation.
- `authStorage.js` owns localStorage keys and auth session persistence.
- `authHelpers.js` normalizes backend login payloads, roles, and permissions.
- `roleHelpers.js` centralizes ADMIN/STAFF/USER roles, route policies, resource action policies, and flexible permission matching.
- `usePermissions.js` and `PermissionGate.jsx` provide reusable permission checks for pages, sidebar items, and action buttons.
- `refreshTokenService.js` validates JWT expiry on startup, refreshes expired access tokens when possible, and logs out when refresh fails.
- `/login` and `/admin/login` submit through `authService.login()`.
- Admin/staff sessions redirect to `/admin/dashboard`; user-shaped sessions redirect to `/`.
- `StaffRoute` protects the `/admin/*` shell for admin/staff sessions.
- `AdminRoute` protects admin-only pages such as users, staff, and roles.
- Admin route policies are shared with the admin sidebar so STAFF does not see Role Management and USER cannot access admin.
- ADMIN has full access; shared admin CRUD actions can be gated by resource permissions without inline role checks.
- `ProtectedRoute` protects authenticated client routes such as `/checkout`.
- `GuestRoute` wraps `/login`, `/register`, and `/admin/login`.
- Unauthenticated redirects preserve the requested route in `location.state.from`.
- Unauthorized authenticated sessions render a guard UI instead of flashing protected content.
- A reusable toast provider shows login success and error notifications.

## First Integration Order

Recommended order:

1. Admin categories.
2. Admin brands.
3. Admin products.
4. Admin variants.
5. Admin media upload.

## Auth Rules

JWT token keys:

```text
accessToken
refreshToken
```

Header:

```text
Authorization: Bearer <token>
```

Frontend should:

- Store token only after successful login.
- Store `refreshToken` only when the backend returns it.
- Store only safe user display metadata, roles, and permissions.
- On app start, restore the stored session and validate the access token expiry.
- When access token refresh succeeds, persist the new token session and retry the original request once.
- Remove the centralized auth session on refresh failure or non-refreshable `401`.
- Redirect to admin login after token removal once route guards are applied.
- Never store passwords.

Admin login response should be normalized through `authHelpers.buildAuthSession()` or passed to `useAuth().setAuthSession()`.

Refresh response should return:

```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "optional-rotated-refresh-token"
}
```

Current backend note:

- The existing Spring Boot admin auth controller currently exposes login/logout.
- The frontend refresh flow is ready for `POST /admin/auth/refresh`, but real refresh requires the backend to return `refreshToken` and implement that endpoint.
- If no `refreshToken` exists or refresh fails, the frontend clears auth and redirects through the route guards.

Current backend auth error handling:

- Invalid credentials return `401`.
- Disabled accounts return `403`.
- Locked/deleted accounts return `423`.
- Network errors should show a retry/connectivity message.

## Error Handling

Centralized files:

```text
frontend/src/api/normalizeApiError.js
frontend/src/api/apiErrorHandler.js
frontend/src/api/errorUtils.js
```

Support both backend error shapes:

- Standard `ErrorResponseDTO`.
- Spring Security unauthorized response.

UI should branch on HTTP status, not localized message text.

Normalized API errors include:

- `status`
- `code`
- `type`
- `message`
- `details`
- `path`
- `method`
- `url`
- `isNetworkError`
- `isTimeout`
- `isUnauthorized`
- `isForbidden`
- `isServerError`

Default frontend messages:

- network/timeout: show a retry/connectivity message.
- `401`: clear auth and redirect through route guards.
- `403`: show a permission/account-status message depending on feature context.
- `500+`: show a generic server error message.

Login-specific feedback remains in `errorUtils.js` and uses `normalizeApiError()` internally.
