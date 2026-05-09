# NEXT_TASKS

## Purpose

This file tracks the next practical tasks for AI and developer work.

Always update this file after meaningful work.

## Current Phase

```text
Ready for Phase 4 — Auth + Backend Integration
```

## Recently Completed

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
3. Connect admin category pages through `frontend/src/api/categoryService.js`.
4. Add loading, error, empty, and refresh states before replacing mock admin data.
5. Connect admin CRUD pages to backend APIs one resource at a time.
6. Keep public storefront customer registration, cart, checkout, payment, wishlist, and search on mock/local state until public API contracts are ready.
7. Resolve existing backend test blockers before relying on `mvn test` as a clean validation gate.
8. Keep AI context docs current.

## Next Recommended Tasks

### Frontend Foundation Maintenance

- Keep client and admin components separated.
- Keep `src/api/client.js` as the only shared Axios client.
- Keep `src/api/apiErrorHandler.js` and `src/api/normalizeApiError.js` as the centralized API error layer.
- Keep refresh-token coordination centralized in `src/api/refreshTokenService.js`.
- Use `api.*` helpers from `src/api/client.js` in API service modules.
- Keep resource API calls centralized through the service modules in `src/api`.
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
- Keep `frontend/src/styles/theme.js`, `tokens.js`, `globals.css`, and `utilities.css` aligned.

### Client Ecommerce

- Keep Phase 3 client ecommerce UI stable while backend integration begins.
- Keep the register flow local until public customer auth APIs are ready.
- Move storefront customer login to a public customer auth endpoint when the API contract is available.
- Wire product detail purchase actions, cart drawer, cart page, and checkout page into shared cart state when the cart flow moves beyond local mock state.
- Replace wishlist and recently viewed localStorage placeholders only when customer account/product history APIs are ready.
- Replace search overlay mock data with a real storefront search API only when the public search/catalog API is ready.
- Replace checkout mock submission and payment placeholders only when public checkout/payment APIs are ready.
- Add category route/page when the category browsing plan is ready.
- Replace the homepage mock loading timer with real loading state when storefront data integration begins.

### Phase 4 Auth + Backend Integration

- Maintain the real `/admin/login` backend JWT authentication flow.
- Use the existing auth architecture in `frontend/src/auth`, `frontend/src/guards`, and `frontend/src/store/auth`.
- Preserve protected routing behavior: admin/staff shell access, admin-only management pages, checkout auth gate, and guest-only auth pages.
- Preserve centralized role/permission behavior: ADMIN full access, STAFF limited admin access, USER blocked from admin, and admin sidebar/actions filtered by policy.
- Add backend refresh-token endpoint support for the frontend `refreshTokenService` contract when backend auth is extended.
- Connect admin category pages through `frontend/src/api/categoryService.js` first.
- Add loading, error, empty, and optimistic refresh states before replacing mock admin data.

## Blocked Or Not Ready

- Public customer APIs are not complete.
- Cart and checkout backend APIs are not complete.
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
