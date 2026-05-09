# NEXT_TASKS

## Purpose

This file tracks the next practical tasks for AI and developer work.

Always update this file after meaningful work.

## Current Phase

```text
Ready for Phase 5 — Admin Dashboard System
```

## Recently Completed

- Completed the Phase 4 backend integration review.
- Added shared CRUD request logic through `frontend/src/api/resourceService.js` and refactored API service modules to use it.
- Hardened refresh-token handling so `401` refresh retries only run when a refresh token exists.
- Tightened redirect sanitization and prevented admin/staff sessions from being remembered into customer-only routes.
- Made `/checkout` and `/profile/*` customer-session-only routes while keeping admin/staff sessions in admin.
- Aligned staff admin module access with resource view permissions in route policies, sidebar filtering, and CRUD view actions.
- Added store/admin-specific route loading states to reduce wrong-surface or unauthorized flashing.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` after the Phase 4 review fixes.
- Marked Phase 4 completed and the project ready for Phase 5 — Admin Dashboard System.
- Added protected storefront account routes `/profile`, `/profile/orders`, and `/profile/settings`.
- Added `ProfileLayout`, `AccountSidebar`, and `OrdersTable` for the dark premium account area.
- Connected account profile fetch/update to real User Profile APIs through `userService` and `useAccountProfile.js`.
- Connected order history and order detail to real Order APIs through `orderService`.
- Added backend `GET/PUT /api/users/{userId}/profile`, `GET /api/orders?userId=...`, and `GET /api/orders/{orderId}?userId=...`.
- Verified `npm run lint`, `npm run build`, and `mvn -q -DskipTests compile` after adding account pages.
- Added backend `POST /api/orders` for authenticated checkout order creation with coupon validation, active-user validation, stock checks, and reservation stock transaction creation.
- Connected the storefront cart drawer, `/cart`, product cards, product detail purchase actions, and `/checkout` to shared cart state under `frontend/src/cart`.
- Connected cart and checkout coupon application to backend Coupon API through `couponService.applyCouponCode()` and `useCheckoutCoupon.js`.
- Connected checkout order creation to backend Order API through `orderService.createOrder()` and `useCheckoutOrder.js`.
- Added checkout profile prefill from User API through `userService.getCurrentUserProfile()` and `useCheckoutProfile.js`.
- Kept VNPay/MoMo as disabled placeholders and did not integrate a real payment gateway.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` after connecting checkout/order creation.
- Connected the storefront product listing page to the real Product API with `useProducts.js`.
- Connected the storefront product detail page to the real Product API with `useProductDetail.js`.
- Added `frontend/src/api/productMapper.js` to normalize flexible Product API response shapes for listing, detail, variants, media, reviews, and pagination metadata.
- Added Product API-backed loading, error, empty, not-found, category filtering, brand filtering, and pagination foundation states.
- Removed the obsolete mock-backed `useProductFilters.js` hook so product listing state has one Product API-backed source.
- Added `VITE_PRODUCT_API_PATH` to configure the Product API endpoint without changing UI components.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after connecting Product API data.
- Added a centralized global feedback system with reusable `ToastProvider`, `GlobalErrorBoundary`, `ApiErrorAlert`, `EmptyState`, and `PermissionDenied` components.
- Extended toast notifications with loading, API-error, and promise-style feedback helpers.
- Added global API error event dispatch/listening for normalized auth, validation, network, timeout, server, and permission errors.
- Reused shared empty and permission-denied states in product listing, admin tables, and route guard fallback UI.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after adding the global feedback system.
- Connected `/login` and `/admin/login` to the backend JWT auth flow through `frontend/src/api/authService.js`.
- Added loading, invalid-credentials, network-error, and disabled-account handling to the login form.
- Added a reusable dark toast notification provider under `frontend/src/components/ui/toast`.
- Added role-based redirect after login: user-shaped sessions go to `/`, admin/staff sessions go to `/admin/dashboard`.
- Applied route guards to protect `/admin/*` and guest-only auth routes.
- Updated backend auth exception handling for invalid credentials and disabled/locked staff accounts.
- Verified `npm run lint`, `npm run build`, and `mvn clean compile -DskipTests`; `mvn test` is blocked by existing backend context issues.
- Hardened the frontend Axios API client with centralized error normalization, response error handling, bearer-token injection, safe-method retry foundation, env timeout config, and reusable `api.*` helpers.
- Verified `npm run lint` and `npm run build` after hardening the Axios API client.
- Completed the protected routing system with `ProtectedRoute`, `AdminRoute`, `StaffRoute`, `GuestRoute`, redirect memory, session restore, loading fallback, and graceful unauthorized UI.
- Protected `/checkout`, the `/admin/*` shell, and admin-only user/staff/role management pages; made `/login`, `/register`, and `/admin/login` guest-only.
- Verified `npm run lint` and `npm run build` after completing protected routing.
- Added frontend refresh-token session persistence with app-start expiry validation, single-flight refresh, original-request retry after `401`, and logout on refresh failure.
- Added `VITE_AUTH_REFRESH_ENDPOINT` configuration and `refreshTokenService`.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after adding refresh-token session persistence.
- Added centralized frontend role/permission policy helpers, `usePermissions`, and `PermissionGate`.
- Applied shared role policies to admin routes and sidebar visibility so STAFF does not see Role Management and USER cannot enter admin.
- Added reusable admin resource action policies for CRUD create/update/delete controls without inline role checks.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after adding the role/permission system.
- Added the centralized JWT-ready frontend auth architecture under `frontend/src/auth`, `frontend/src/guards`, and `frontend/src/store/auth`.
- Wrapped the app with `AuthProvider` while keeping the current homepage and admin mock route behavior unchanged.
- Updated the shared API client and auth service to use centralized auth storage/session helpers.
- Verified `npm run lint` and `npm run build` after the auth architecture setup.
- Completed the full Phase 3 client ecommerce review and polish across PLP, PDP, cart, checkout, auth, wishlist, recently viewed, and search surfaces.
- Normalized repeated storefront stat-card styling with the shared `store-stat-card` utility.
- Tightened mobile checkout/shipping/order-summary layouts to reduce overflow risk.
- Replaced visible developer-facing checkout/auth/search copy with customer-facing placeholder copy.
- Verified `npm run lint`, `git diff --check`, `npm run build`, and client route smoke checks after Phase 3 polish.
- Marked Phase 3 completed and the project ready for Phase 4 — Auth + Backend Integration.
- Added the mock-backed `/products` product listing page with product grid, filter sidebar, sorting, active filters, pagination, breadcrumb, category banner, and responsive mobile filtering.
- Improved `/products` with reusable filter/search state, debounced product search, multi-select filters, collapsible filter groups, mobile filter drawer, and empty state UI.
- Added the mock-backed `/products/:slug` product detail page with gallery, variants, quantity, purchase actions, specs, description, reviews, shipping, stock, and related products.
- Polished the product detail gallery with loading skeletons, smooth image switching, active thumbnails, hover zoom, fullscreen preview, and keyboard preview controls.
- Added a mock-backed cart drawer opened from the storefront header with quantity update, remove item, subtotal, coupon placeholder, continue shopping, checkout action, and animated cart count badge.
- Added the mock-backed `/cart` page with cart item table/grid, quantity updates, remove actions, coupon input, order summary, shipping estimate, continue shopping, checkout CTA, and sticky desktop summary.
- Added the mock-backed `/checkout` page with customer information, shipping address, shipping method, payment method, validation UI, coupon placeholder, and sticky order summary.
- Added the mock-backed `/login` and `/register` ecommerce auth pages with reusable auth layout/forms, social placeholders, remember-me, forgot-password placeholder, and local validation UI.
- Added the localStorage-backed `/wishlist` page with product-card wishlist toggles, recently viewed tracking, and reusable wishlist/recently-viewed hooks.
- Added the mock-backed storefront search overlay with debounced suggestions, recent searches, trending searches, product/category/brand previews, and keyboard navigation behavior.
- Completed responsive audit and scoped responsive fixes for the ecommerce homepage across mobile, tablet, desktop, and ultra-wide viewports.
- Completed Phase 2 design-system cleanup and audit for shared storefront and admin UI consistency.

## Immediate Priorities

1. Preserve the existing homepage layout.
2. Keep the normalized frontend folder structure stable.
3. Start Phase 5 by connecting admin category pages through `frontend/src/api/categoryService.js`.
4. Use centralized feedback components for loading, error, empty, permission, and refresh states before replacing mock admin data.
5. Connect admin CRUD pages to backend APIs one resource at a time.
6. Keep public storefront customer registration, payment gateway, wishlist, homepage products, and search on mock/local state until public API contracts are ready.
7. Move customer auth and account ownership checks to a dedicated public customer auth contract when ready.
8. Resolve existing backend test blockers before relying on `mvn test` as a clean validation gate.
9. Keep AI context docs current.

## Next Recommended Tasks

### Frontend Foundation Maintenance

- Keep client and admin components separated.
- Keep `src/api/client.js` as the only shared Axios client.
- Keep `src/api/apiErrorHandler.js` and `src/api/normalizeApiError.js` as the centralized API error layer.
- Keep `src/api/apiErrorFeedback.js` and `src/api/apiErrorEvents.js` as the global API feedback bridge.
- Keep refresh-token coordination centralized in `src/api/refreshTokenService.js`.
- Keep shared CRUD request logic centralized in `src/api/resourceService.js`.
- Use `api.*` helpers from `src/api/client.js` in API service modules.
- Keep resource API calls centralized through the service modules in `src/api`.
- Keep Product API response normalization centralized in `src/api/productMapper.js`.
- Keep checkout/order/coupon response normalization centralized in `src/api/checkoutMapper.js`.
- Keep route guard behavior centralized in `src/guards`.
- Keep role, permission, route, sidebar, page, and action access policies centralized in `src/auth/roleHelpers.js`.
- Use `src/auth/usePermissions.js` and `src/auth/PermissionGate.jsx` instead of inline role checks in pages/components.
- Keep mock data centralized in the domain modules under `src/data`.
- Keep route definitions centralized in `src/routes/AppRoutes.jsx`.

### Design System Maintenance

- Keep Phase 2 design-system patterns stable while building client ecommerce pages.
- Continue applying typography utilities to new client ecommerce pages.
- Continue applying spacing/layout utilities to new client ecommerce pages.
- Continue applying the shared Framer Motion presets to new client ecommerce cards and CTAs.
- Reuse the polished `ProductCard` pattern on product listing and recommendation sections.
- Reuse the polished storefront header interaction patterns on future client ecommerce pages.
- Reuse the homepage visual depth patterns on future client ecommerce pages without changing their layout structure.
- Reuse `src/components/skeletons` for future mock-backed and API-backed loading states.
- Reuse `src/components/ui` primitives before creating one-off button, badge, price, rating, card, input, or section-title markup.
- Reuse `src/components/ui/feedback` before creating page-specific error, empty, or permission-denied states.
- Keep `frontend/src/styles/theme.js`, `tokens.js`, `globals.css`, and `utilities.css` aligned.

### Client Ecommerce

- Keep Phase 3 client ecommerce UI stable while backend integration begins.
- Keep the register flow local until public customer auth APIs are ready.
- Move storefront customer login to a public customer auth endpoint when the API contract is available.
- Keep `/profile`, `/profile/orders`, and `/profile/settings` behind `ProtectedRoute`.
- Keep account profile/order API calls centralized in `userService.js`, `orderService.js`, and `accountMapper.js`.
- Keep the shared cart provider as the single cart state source for header drawer, cart page, product cards, product detail, and checkout.
- Replace wishlist and recently viewed localStorage placeholders only when customer account/product history APIs are ready.
- Replace homepage product sections, wishlist/recently viewed lookup, and search overlay mock data with real storefront APIs when those contracts are ready.
- Add real online payment gateway handoff only when the payment task starts.
- Add category route/page when the category browsing plan is ready.
- Replace the homepage mock loading timer with real loading state when storefront data integration begins.

### Phase 5 Admin Dashboard System

- Connect admin category pages through `frontend/src/api/categoryService.js` first.
- Add API-backed list loading, error, empty, and refresh states before replacing mock admin data.
- Reuse shared route/sidebar/action permission policies for every admin resource page.
- Keep ADMIN full access and require staff resource view permissions for staff module access.
- Add create/edit/detail/delete workflows one resource at a time.
- Add pagination, search/filter state, form validation, and safe destructive-action confirmations as pages move off mock data.

### Phase 4 Auth + Backend Integration Maintenance

- Maintain the real `/admin/login` backend JWT authentication flow.
- Use the existing auth architecture in `frontend/src/auth`, `frontend/src/guards`, and `frontend/src/store/auth`.
- Preserve protected routing behavior: admin/staff shell access, admin-only management pages, customer-only checkout/account gates, and guest-only auth pages.
- Preserve centralized role/permission behavior: ADMIN full access, STAFF access requires resource view permissions, USER blocked from admin, and admin sidebar/actions filtered by policy.
- Add backend refresh-token endpoint support for the frontend `refreshTokenService` contract when backend auth is extended.

## Blocked Or Not Ready

- Public customer APIs are not complete.
- Public customer auth is not complete; account APIs are authenticated and user-id scoped until a customer-auth principal contract is available.
- Client checkout/account routes are customer-session-only in the frontend, but backend ownership enforcement still needs the future customer-auth principal contract.
- A dedicated backend cart persistence API is not implemented; cart state is shared local frontend state.
- Admin frontend API service modules exist, but pages are not connected to real data yet.
- Backend admin auth currently exposes login/logout; refresh-token endpoint support is not implemented yet.
- Backend `mvn test` currently fails because `AddressMapper` is not registered as a bean for `AdminAddressServiceImpl`.
- Backend startup also reports a database DDL warning for existing null `media.display_order` values.
- Production deployment is not ready.

## Maintenance Reminder

When work is completed, update:

- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `CHANGELOG_AI.md`
