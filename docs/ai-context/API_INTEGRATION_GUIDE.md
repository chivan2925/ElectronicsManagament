# API_INTEGRATION_GUIDE

## Purpose

This guide defines how frontend API integration should be done later.

Current phase:

```text
Phase 8 — Production + Deploy (Completed showcase)
```

The shared frontend API layer and centralized auth architecture exist. Admin/staff login is connected to the backend JWT API, storefront product listing/detail pages are connected to Product API data, authenticated checkout creates backend orders with Coupon/User API support, and authenticated account pages use User Profile/User Order APIs including the `/profile/orders/:id` tracking detail route. Core admin CRUD modules are connected to backend APIs. Phase 8 focuses on production/deploy preparation, migrations, public customer ownership contracts, and real infrastructure readiness.

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
- Reports / Analytics

Catalog integration must preserve the storefront category labels:

- Điện thoại
- Laptop
- Tai nghe
- Chuột
- Bàn phím
- Lót chuột
- PC Gaming
- Máy bộ
- Linh kiện PC
- Ghế gaming
- Phụ kiện gaming

Other backend areas:

- Admin auth.
- Payment transactions.
- Return requests.
- VNPay and Momo webhooks.
- Cloudinary media upload.
- Admin reporting endpoints under `/admin/reports/*`.

## Frontend API Client

Shared Axios client:

```text
frontend/src/api/client.js
frontend/src/api/apiConfig.js
frontend/src/api/apiErrorHandler.js
frontend/src/api/normalizeApiError.js
frontend/src/api/apiErrorFeedback.js
frontend/src/api/apiErrorEvents.js
frontend/src/api/refreshTokenService.js
```

Current behavior:

- Uses `VITE_API_BASE_URL`.
- Uses `VITE_API_TIMEOUT`.
- Uses `VITE_AUTH_TOKEN_STORAGE` to choose `sessionStorage` or `localStorage` for browser auth persistence.
- Uses `VITE_AUTH_REFRESH_ENDPOINT`.
- Product catalog services use `VITE_PRODUCT_API_PATH`, defaulting to the public `/products` storefront endpoint.
- Checkout services use `VITE_COUPON_API_PATH`, `VITE_ORDER_API_PATH`, and `VITE_USER_API_PATH`.
- Payment services use `VITE_PAYMENT_API_PATH`.
- Realtime notification bridge uses `VITE_REALTIME_WS_URL` when a compatible WebSocket endpoint exists.
- Account services use `VITE_USER_PROFILE_API_PATH` and `VITE_USER_ORDER_API_PATH`.
- Wishlist sync uses `VITE_WISHLIST_API_PATH` only when a compatible backend endpoint is configured.
- Falls back to `http://localhost:8080/api`.
- Defaults request timeout to `15000` ms.
- Reads `accessToken` through `frontend/src/auth/authStorage.js`.
- Adds `Authorization: Bearer <token>` automatically when a token is available.
- Adds `X-Request-Id` automatically so frontend API failures can be correlated with backend structured logs.
- Supports `skipAuth` for requests that must not send a bearer token.
- Uses a shared response interceptor for normalized errors, retry handling, refresh handling, and `401` auth cleanup.
- Attempts a single shared refresh-token request on eligible `401` responses only when a stored refresh token exists, then retries the original request once.
- Avoids duplicate concurrent refresh calls through `refreshTokenService`.
- Avoids infinite refresh loops with `__isRetryAfterRefresh` and `skipAuthRefresh`.
- Clears the centralized auth session when refresh fails or no refresh token is available.
- Supports `skipUnauthorizedHandler` for requests that should not trigger auth cleanup.
- Dispatches `auth:unauthorized` on handled `401` responses for AuthProvider handling.
- Retries safe idempotent requests (`GET`, `HEAD`, `OPTIONS`) once by default on network, timeout, or server errors.
- Keeps unsafe request retries opt-in through request config.
- Exposes reusable data-returning API helpers through `api.get`, `api.post`, `api.put`, `api.patch`, `api.delete`, and `api.request`.
- Attaches normalized error details to Axios errors as `error.apiError` and `error.normalizedError`.
- Dispatches global API error events for shared toast and alert feedback unless `skipGlobalErrorHandler` is set.
- Logs final API failures through `frontend/src/monitoring/errorTracking.js` without integrating a real SaaS monitoring service.

Environment example:

```text
frontend/.env.example
```

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=15000
VITE_AUTH_TOKEN_STORAGE=session
VITE_AUTH_REFRESH_ENDPOINT=/admin/auth/refresh
VITE_PRODUCT_API_PATH=/products
VITE_COUPON_API_PATH=/admin/coupons
VITE_ORDER_API_PATH=/orders
VITE_PAYMENT_API_PATH=/payments
VITE_REALTIME_WS_URL=
VITE_USER_API_PATH=/admin/users
VITE_USER_PROFILE_API_PATH=/users
VITE_USER_ORDER_API_PATH=/orders
VITE_CART_API_PATH=/cart
VITE_WISHLIST_API_PATH=
```

## Integration Rules

- Do not call axios directly inside many UI components.
- Add API modules under `frontend/src/api`.
- Keep request/response shapes close to backend DTOs.
- Add loading, error, and empty states before replacing mock data.
- Replace mock data one resource at a time.
- Normalize API response wrappers in the service/mapper layer before data reaches UI components.

## Recommended API Module Structure

```text
frontend/src/api/
├─ client.js
├─ apiConfig.js
├─ apiErrorHandler.js
├─ normalizeApiError.js
├─ apiErrorFeedback.js
├─ apiErrorEvents.js
├─ resourceService.js
├─ checkoutMapper.js
├─ paymentMapper.js
├─ accountMapper.js
├─ productMapper.js
├─ wishlistMapper.js
├─ refreshTokenService.js
├─ authService.js
├─ categoryService.js
├─ brandService.js
├─ productService.js
├─ variantService.js
├─ userService.js
├─ staffService.js
├─ roleService.js
├─ permissionService.js
├─ orderService.js
├─ paymentService.js
├─ warehouseService.js
├─ couponService.js
├─ wishlistService.js
├─ cartService.js
├─ reportService.js
└─ mediaService.js
```

Resource services expose basic CRUD helpers:

- `getAll(params)`
- `getById(id)`
- `create(payload)`
- `update(id, payload)`
- `remove(id)`

Basic CRUD modules should use `createResourceService()` so request logic stays centralized.

Admin dashboard API orchestration lives under `frontend/src/admin/services`:

- `adminModuleRegistry.js` maps admin modules to labels, routes, permission resources, and API services.
- `adminCrudService.js` provides generic list/detail/create/update/remove wrappers so pages do not duplicate CRUD calls.
- Registered admin modules are categories, brands, products, variants, media, users, staff, roles, permissions, orders, warehouses, and coupons.
- Admin reporting can now be wired from the upgraded mock analytics widgets to `/admin/reports/dashboard`, `/admin/reports/revenue`, `/admin/reports/order-status`, and `/admin/reports/top-products`.

`authService.js` owns login/logout/register and token helpers. It calls `POST /auth/login` for storefront customer login, `POST /admin/auth/login` for admin/staff login, and `POST /auth/register` for public customer registration outside demo mode.

Homepage product sections, storefront search overlay product suggestions, storefront recommendation sections, PLP, and PDP catalog reads use Product API data from the configured catalog endpoint. Wishlist and recently viewed remain local snapshot systems for customer convenience, while demo mode can still serve seeded mock catalog data when `VITE_DEMO_MODE=true`. Cart syncs to `/cart` for authenticated customer sessions and remains local for guests/demo/admin sessions; checkout creates backend orders through the configured Order API.

## Product Catalog Integration

Current storefront product routes:

- `/products`
- `/products/:slug`

Catalog files:

```text
frontend/src/api/productService.js
frontend/src/api/productMapper.js
frontend/src/hooks/useProducts.js
frontend/src/hooks/useProductDetail.js
```

Current behavior:

- `productService.js` keeps Product API calls centralized.
- `productMapper.js` unwraps flexible response wrappers and normalizes listing, detail, variant, media, review, and pagination data for UI components.
- `useProducts.js` owns listing fetch state, loading/error/empty states, category filtering, brand filtering, search, sorting, and pagination foundation.
- `useProductDetail.js` owns detail fetch state, review/detail normalization, related products, loading, error, and not-found states.
- Category and brand filters are derived from Product API data instead of duplicated constants in the listing page.
- `VITE_PRODUCT_API_PATH` controls the storefront catalog endpoint and currently defaults to `/products`.

Do not hardcode a single backend response shape in pages or presentational components. The backend exposes a public read-only storefront product endpoint at `/api/products`; keep response adaptation inside `productMapper.js` if this contract evolves.

## Checkout And Payment Integration

Current storefront checkout routes:

- `/cart`
- `/checkout`

Checkout files:

```text
frontend/src/cart/
frontend/src/api/checkoutMapper.js
frontend/src/api/paymentMapper.js
frontend/src/api/couponService.js
frontend/src/api/orderService.js
frontend/src/api/paymentService.js
frontend/src/api/userService.js
frontend/src/hooks/useCheckoutCoupon.js
frontend/src/hooks/useCheckoutOrder.js
frontend/src/hooks/useCheckoutProfile.js
```

Current behavior:

- `frontend/src/cart` is the single shared cart state source for header drawer, cart page, product cards, product detail actions, and checkout.
- `couponService.applyCouponCode()` searches active/valid coupons through the configured Coupon API path and validates min order, time/status, and product eligibility in the mapper layer before UI feedback.
- `orderService.createOrder()` posts checkout payloads to `VITE_ORDER_API_PATH`, defaulting to `/orders`.
- `userService.getCurrentUserProfile()` can prefill checkout contact fields from the configured User API path.
- `userService.getCurrentUserProfile()` reads the account profile endpoint configured by `VITE_USER_PROFILE_API_PATH`, defaulting to `/users`.
- `checkoutMapper.js` builds create-order payloads and normalizes coupon/order responses before they reach UI components.
- `/checkout` remains protected by `ProtectedRoute` and customer-only route policy; unauthorized users are redirected through the auth route guard.
- VNPay Sandbox handoff is implemented through `POST /payments/vnpay/create`, backend secure hash signing, VNPay browser return handling at `/payments/vnpay-return`, and result verification through `GET /payments/orders/{orderId}/status`.
- MoMo Sandbox handoff is implemented through `POST /payments/momo/create`, backend HMAC-SHA256 signing, MoMo browser return handling at `/payments/momo-return`, MoMo IPN handling at `/api/system/payment/momo-ipn`, and the same result verification endpoint.
- Frontend routes `/payment/success` and `/payment/failed` verify the server-side payment state before showing paid, failed, or cancelled feedback.
- Payment result UI is provider-aware for VNPay and MoMo and uses lowercase storefront statuses: `pending`, `paid`, `failed`, and `cancelled`.

## Account Integration

Current authenticated account routes:

- `/profile`
- `/profile/orders`
- `/profile/orders/:id`
- `/profile/settings`

Account files:

```text
frontend/src/api/accountMapper.js
frontend/src/api/userService.js
frontend/src/api/orderService.js
frontend/src/hooks/useAccountProfile.js
frontend/src/utils/orderTracking.js
frontend/src/components/account/
frontend/src/pages/client/ProfileOverview.jsx
frontend/src/pages/client/ProfileOrders.jsx
frontend/src/pages/client/ProfileOrderDetail.jsx
frontend/src/pages/client/ProfileSettings.jsx
```

Current behavior:

- `/profile` and its child routes are protected by `ProtectedRoute` and customer-only route policy.
- Profile fetch/update uses `GET/PUT /users/{userId}/profile`.
- Order history uses `GET /orders?userId=...` with pageable query params.
- Order detail uses `GET /orders/{orderId}?userId=...`.
- `accountMapper.js` normalizes profile, order page, order summary, order detail, and order item response shapes before data reaches UI components.
- `/profile/orders/:id` uses the same order detail endpoint and maps backend order/shipping statuses into customer-facing tracking states: `pending`, `confirmed`, `preparing`, `shipping`, `delivered`, and `cancelled`.
- `orderTracking.js` owns fallback estimated delivery labels and activity history derivation until the backend exposes a dedicated shipment event history contract.
- Account logout uses the existing `authService.logout()` flow.

## Wishlist Integration

Current storefront wishlist route:

- `/wishlist`

Wishlist files:

```text
frontend/src/wishlist/
frontend/src/hooks/useWishlist.js
frontend/src/api/wishlistMapper.js
frontend/src/api/wishlistService.js
frontend/src/pages/client/WishlistPage.jsx
```

Current behavior:

- `WishlistProvider` is mounted at the app root and is the single wishlist state source for Header, ProductCard, ProductInfo, and `/wishlist`.
- Wishlist items persist product snapshots in localStorage so API-backed products survive reloads.
- Mutations use optimistic UI with rollback on real sync errors.
- When a compatible backend endpoint exists, set `VITE_WISHLIST_API_PATH` and `wishlistService.js` uses it for `GET`, `PUT`, item add/remove, and clear operations.
- Missing or unauthorized wishlist APIs are treated as local fallback so the storefront remains usable until public wishlist APIs are implemented.

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
- `/login` submits through `authService.login()` to `POST /auth/login`; `/admin/login` submits through the same service to `POST /admin/auth/login`.
- Admin/staff sessions redirect to `/admin/dashboard`; user-shaped sessions redirect to `/`.
- `StaffRoute` protects the `/admin/*` shell for admin/staff sessions.
- `AdminRoute` protects admin-only pages such as users, staff, and roles.
- Admin route policies are shared with the admin sidebar so STAFF module access requires the matching resource view permission and USER cannot access admin.
- ADMIN has full access; shared admin CRUD actions can be gated by resource permissions without inline role checks.
- `ProtectedRoute` protects authenticated customer routes such as `/checkout` and `/profile/*`.
- `GuestRoute` wraps `/login`, `/register`, and `/admin/login`.
- Unauthenticated redirects preserve the requested route in `location.state.from`.
- Unauthorized authenticated sessions render a guard UI instead of flashing protected content.
- A reusable toast provider shows login success, error, loading, and global API error notifications.

## Completed Admin Integration Order

Phase 5 completed the core admin integration in this order:

1. Admin categories.
2. Admin brands.
3. Admin products.
4. Admin variants.
5. Admin media upload.

Phase 8 should focus on deployment-safe API contracts, public customer ownership, tests, migrations, production payment configuration, and real infrastructure readiness.

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
- Prefer `VITE_AUTH_TOKEN_STORAGE=session` for safer token persistence when long-lived browser sessions are not required.
- Store `refreshToken` only when the backend returns it.
- Store only safe user display metadata, roles, and permissions.
- On app start, restore the stored session and validate the access token expiry.
- When access token refresh succeeds, persist the new token session and retry the original request once.
- Remove the centralized auth session on refresh failure or non-refreshable `401`.
- Redirect to admin login after token removal once route guards are applied.
- Never store passwords.

Customer and admin login responses should be normalized through `authHelpers.buildAuthSession()` or passed to `useAuth().setAuthSession()`.

Refresh response should return:

```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "optional-rotated-refresh-token"
}
```

Current backend note:

- The Spring Boot auth controllers currently expose customer login/register/logout and admin login/logout.
- The frontend refresh flow is ready for `POST /admin/auth/refresh`, but real refresh requires the backend to return `refreshToken` and implement a refresh endpoint.
- If no `refreshToken` exists, the frontend treats `401` as non-refreshable; if refresh fails, the frontend clears auth and redirects through the route guards.

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
frontend/src/api/apiErrorFeedback.js
frontend/src/api/apiErrorEvents.js
frontend/src/api/errorUtils.js
frontend/src/components/ui/feedback/ApiErrorAlert.jsx
frontend/src/components/ui/feedback/EmptyState.jsx
frontend/src/components/ui/feedback/PermissionDenied.jsx
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
- `requestId`
- `isNetworkError`
- `isTimeout`
- `isUnauthorized`
- `isForbidden`
- `isValidationError`
- `isServerError`

Default frontend messages:

- network/timeout: show a retry/connectivity message.
- `401`: clear auth and redirect through route guards.
- `403`: show a permission/account-status message depending on feature context.
- `500+`: show a generic server error message.

Login-specific feedback remains in `errorUtils.js` and uses `normalizeApiError()` internally.
Global UI feedback should use `apiErrorFeedback.js`, `apiErrorEvents.js`, `ApiErrorAlert`, and `ToastProvider` instead of duplicating status-specific messages in pages.

Frontend monitoring helpers live in `frontend/src/monitoring`. Use `trackApiFailure`, `trackPaymentError`, `trackGlobalError`, and `trackRouteError` for reusable structured monitoring events, and keep any future SaaS transport behind the monitoring abstraction.
