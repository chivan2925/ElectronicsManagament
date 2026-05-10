# NEXT_TASKS

## Purpose

This file tracks the next practical tasks for AI and developer work.

Always update this file after meaningful work.

## Current Phase

```text
Ready for Phase 6 — Ecommerce Core Features
```

## Recently Completed

- Built the Order Tracking experience at `/profile/orders/:id` using the existing User Order API detail endpoint.
- Added reusable tracking components: `OrderTrackingTimeline.jsx`, `OrderStatusBadge.jsx`, and `ShipmentProgress.jsx`, plus shared `orderTracking.js` status/date/activity helpers.
- Added visual order progress, shipment steps, estimated delivery, order activity history, responsive detail layout, and tracking links from the account order list.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and route smoke checks for `/profile/orders` and `/profile/orders/1` after the Order Tracking build. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Upgraded Cart & Checkout UX with animated cart item quantity/total transitions, remove feedback, free-shipping progress, shipping estimates, stock validation UI, coupon apply/clear UX, mini recommendations in cart, and sticky trust-focused summaries.
- Added reusable cart UX helpers/components: `cartInsights.js`, `FreeShippingProgress.jsx`, `StockValidationPanel.jsx`, and `CartRecommendations.jsx`.
- Verified `npm run lint`, `npm run build`, and route smoke checks for `/cart` and `/checkout` after the Cart & Checkout UX upgrade. Build still reports the existing Vite chunk-size warning.
- Built the frontend Product Recommendation System foundation with reusable `ProductCarousel.jsx`, `RecommendationSection.jsx`, `TrendingProducts.jsx`, and `BestSellerSection.jsx`.
- Added homepage trending and best-seller recommendation carousels, PDP related/frequently-bought carousels, and a profile recommended-for-you placeholder without changing the homepage hero or core section structure.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and route smoke checks for `/`, `/products/:slug`, and `/profile` after adding recommendation sections. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Built the Recently Viewed Products system with a lightweight localStorage snapshot store, duplicate prevention, remove/clear behavior, and cross-tab sync in `useRecentlyViewed.js`.
- Added reusable `RecentlyViewedSection.jsx` with a responsive product slider, empty state, and clear-history action for homepage, PDP, wishlist, and profile overview surfaces.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and route smoke checks for `/`, `/products/:slug`, `/profile`, and `/wishlist` after adding recently viewed. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Upgraded the storefront Wishlist System into a production-style persistent wishlist with `WishlistProvider`, product snapshots, optimistic UI, optional backend sync, loading/error states, sync status, wishlist count, quick heart transitions, move-to-cart, remove item, and clear actions.
- Added `frontend/src/api/wishlistService.js`, `wishlistMapper.js`, `frontend/src/wishlist/`, and `VITE_WISHLIST_API_PATH` for future backend wishlist integration while keeping local persistence as the fallback.
- Updated ProductCard, ProductInfo, Header, and `/wishlist` to use the shared wishlist state, animated heart transitions, item pending states, toasts, and premium ecommerce interactions.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and local `/wishlist` + `/products` route smoke checks after the wishlist upgrade. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Built the storefront Product Reviews System on the product detail page with reusable `RatingSummary.jsx`, `ReviewCard.jsx`, `ReviewForm.jsx`, and upgraded `ProductReviews.jsx`.
- Added review filters, sorting, authenticated write-review UI, image review placeholders, verified purchase badges, helpful vote placeholders, empty states, and load-more pagination foundation.
- Extended product review normalization for backend `photosJson`, `orderId`, `userId`, helpful count, verified purchase, and review pagination metadata.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after the reviews system. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.
- Upgraded the storefront search overlay into an advanced mock-backed ecommerce search system with reusable `SearchResultItem.jsx`, `useRecentSearches.js`, category-aware and brand-aware scoring, search highlighting, loading/empty states, recent searches, trending searches, debounce, and keyboard navigation.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after the search upgrade. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.
- Removed custom backend Jackson version overrides from `backend/electronics/pom.xml`, returning Jackson dependency management to Spring Boot 4.0.3 defaults.
- Verified `mvn -q -DskipTests compile` and confirmed `mvn spring-boot:run` reaches Tomcat startup after the Jackson fix.
- Confirmed remaining backend startup noise is local PostgreSQL schema drift from legacy populated tables, not the Jackson `JsonMapper` startup crash.
- Completed Phase 5 — Admin Dashboard System and marked the project ready for Phase 6 — Ecommerce Core Features.
- Reviewed and polished admin CRUD consistency, table/action states, spacing, responsive layout, permission handling, loading/error states, modal/drawer behavior, form consistency, chart consistency, and shared badges.
- Added permission-aware admin topbar module search, shared debounced admin search handling, safer legacy page actions, normalized status badges, mobile-fit modal/form footers, and consistent row action hover tones.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/roles` to real backend Role and Permission APIs with a Role & Permission Management module.
- Added `frontend/src/pages/admin/roles/PermissionMatrix.jsx`, `RoleForm.jsx`, and `RoleTable.jsx`.
- Added role table, reusable grouped permission matrix, assign-permission drawer, staff role assignment panel, status controls, validation UI, search/filter/pagination, loading states, API error handling, and soft-delete confirmation.
- Upgraded `frontend/src/api/adminPeopleMapper.js`, `roleService.js`, and `permissionService.js` for normalized Role/Permission list/detail responses, Role create/update payloads, status updates, and permission grouping data.
- Extended backend Role responses with `permissionCount` and `staffCount` for admin security dashboard UI.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/coupons` to real backend Coupon APIs with a Coupon Management module.
- Added `frontend/src/pages/admin/coupons/CouponForm.jsx` and `CouponTable.jsx`.
- Added coupon table, create/update drawer, native date/time pickers, validation UI, status controls, status/time/date filters, usage progress, loading states, API error handling, and soft-delete confirmation.
- Added `frontend/src/api/couponMapper.js` and upgraded `couponService.js` for normalized Coupon list/detail responses, create/update payloads, status updates, and checkout coupon validation with usage counts.
- Extended backend Coupon responses with `usedCount` from orders and enforced `usageLimit` when checkout resolves a coupon.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/warehouse` to real backend Warehouse and Warehouse Transaction APIs with an inventory operations module.
- Added `frontend/src/pages/admin/warehouse/WarehouseTable.jsx`, `StockAdjustModal.jsx`, and `LowStockCard.jsx`.
- Added stock overview, inventory adjustment modal, low-stock alerts, status/stock filters, loading states, API error handling, and stock history placeholder UI.
- Added `frontend/src/api/warehouseMapper.js` and upgraded `warehouseService.js` for normalized Warehouse list/detail responses, transaction list responses, and create/complete adjustment flows.
- Fixed backend Warehouse Transaction completion so inbound manual transactions increase stock and outbound transactions decrease stock.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/warehouse` route smoke check. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/orders` to real backend Order APIs with an ecommerce operations dashboard module.
- Added `frontend/src/pages/admin/orders/OrderTable.jsx`, `OrderDetail.jsx`, and `OrderTimeline.jsx`.
- Added order table, order detail drawer, customer info, shipping address, order items, payment summary, status update controls, payment status controls, shipping status controls, and timeline UI.
- Added `frontend/src/api/orderMapper.js` and upgraded `orderService.js` for normalized admin Order list/detail responses and update payloads.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/orders` route smoke check. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/media` to real backend Media and Product APIs with a dark asset-manager module.
- Added `frontend/src/pages/admin/media/MediaUploader.jsx`, `MediaGrid.jsx`, and `MediaPreviewModal.jsx`.
- Added drag-and-drop Cloudinary upload, upload progress UI, product attach flow, media grid, preview modal, primary image action, delete confirmation, filters, pagination, loading states, and API error handling.
- Added `frontend/src/api/mediaMapper.js` and upgraded `mediaService.js` for normalized Media API list/upload/create/delete flows.
- Extended backend Media API support for paginated list/search/filter, `publicId` on create/response DTOs, primary reset handling, and Cloudinary deletion on media delete.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/media` route smoke check. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/variants` to real backend Variant and Product APIs with reusable variant-specific components.
- Added `frontend/src/pages/admin/variants/VariantForm.jsx` and `VariantTable.jsx`.
- Added real variant management flows: list with server pagination, search, product filter, status filter, create, update, soft delete, status toggle, SKU management, stock management, price override, and dynamic attribute fields.
- Added `frontend/src/api/variantMapper.js` and upgraded `variantService.js` for normalized Variant API list/detail responses, Variant create/update payloads, and status patch updates.
- Extended backend Variant API support for `sku`, product filtering, SKU search, and SKU uniqueness checks.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/variants` route smoke check. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/products` to real backend Product, Brand, and Category APIs with reusable product-specific components.
- Added `frontend/src/pages/admin/products/ProductForm.jsx`, `ProductTable.jsx`, and `ProductFilters.jsx`.
- Added real product management flows: list with server pagination, search, category filter, brand filter, status filter, featured filter, create, update, soft delete, status toggle, and featured toggle.
- Added image URL preview placeholder UX in Product Form while keeping real media upload for the Media module.
- Upgraded `frontend/src/api/productService.js` and `productMapper.js` for normalized Product API list/detail responses, Product create/update payloads, status patch updates, and featured patch updates.
- Extended backend Product API support for `featured`, category/brand/featured filters, richer list/detail DTO fields, product-level media placeholder updates, and Cloudinary dependency wiring for clean backend compile.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/products` route smoke check. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/users` to real backend User APIs with reusable `AdminTable`, `AdminSearch`, `AdminFilters`, `AdminDrawer`, `StatusBadge`, and `ConfirmDialog`.
- Added real user management flows: list with server pagination, search, status filter, role display, detail drawer, account activate/deactivate, and protected delete action.
- Connected `/admin/staff` to real backend Staff and Role APIs with reusable admin CRUD components and role-aware action gating.
- Added real staff management flows: list with server pagination, search, status filter, role display, create, update, delete, detail drawer, and account activate/deactivate.
- Added `frontend/src/api/adminPeopleMapper.js` and upgraded `userService.js`, `staffService.js`, and `roleService.js` for normalized people-management responses and payloads.
- Protected current-staff self actions in Staff Management so admins cannot deactivate, edit, or delete their own active session account from the table.
- Extended backend staff search to include full name in `StaffRepository`.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and local `/admin/users` + `/admin/staff` route smoke checks. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/brands` to real backend Brand APIs with reusable `AdminTable`, `AdminSearch`, `AdminFilters`, `AdminDrawer`, `AdminForm`, and `ConfirmDialog`.
- Added real brand CRUD flows: list (server pagination), create, update, soft delete, status update via `PATCH /admin/brands/{id}/status`, and featured toggle through the update API.
- Added backend-aware brand API mapping in `frontend/src/api/brandMapper.js` and upgraded `frontend/src/api/brandService.js` for normalized page/detail/status methods.
- Extended backend Brand DTO/entity/repository/service support for `slug`, `description`, `featured`, and featured filtering.
- Added a logo URL field with upload placeholder UX for Brand Management.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and a local `/admin/brands` route smoke check after Brand Management integration. Build still reports the existing Vite chunk-size warning.
- Connected `/admin/categories` to real backend Category APIs with reusable `AdminTable`, `AdminSearch`, `AdminFilters`, `AdminDrawer`, `AdminForm`, and `ConfirmDialog`.
- Added real category CRUD flows: list (server pagination), create, update, soft delete, and status update via `PATCH /admin/categories/{id}/status`.
- Added backend-aware category API mapping in `frontend/src/api/categoryMapper.js` and upgraded `frontend/src/api/categoryService.js` for normalized page/detail/status methods.
- Added optimistic UI for category status toggling with rollback on API failure.
- Verified `npm run lint` and `npm run build` after Category Management integration.
- Added backend CORS configuration for localhost dev origins in `SecurityConfig` and enabled CORS in the Spring Security filter chain.
- Verified preflight responses now include `Access-Control-Allow-Origin` for `http://localhost:5173`.
- Confirmed admin authentication reads `staffs` (email login), not `users`.
- Patched local PostgreSQL admin-auth schema drift for `staffs`, `roles`, and `permissions` (including `permissions.code`/`updated_at`) and verified `POST /api/admin/auth/login` returns `200` for `admin@shop.com`.
- Fixed backend payment property binding in `VNPayUtils` and `MomoUtils` to read `payment.*` keys with fallback to legacy `electronics.app.*` keys, removing the missing-placeholder crash on startup.
- Verified backend startup reaches web-server boot; local failures now reproduce as port binding conflict when `8080` is already occupied.
- Verified backend can run with an alternate port using `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081`.
- Added reusable admin CRUD foundation components under `frontend/src/admin/components/crud`: `AdminTable`, `AdminForm`, `AdminModal`, `AdminDrawer`, `AdminFilters`, `AdminSearch`, `AdminPagination`, `StatusBadge`, `ConfirmDialog`, and `EmptyAdminState`.
- Added reusable table sorting, pagination, search, filters, bulk actions, row actions, loading states, and empty states for future admin modules.
- Kept legacy admin UI imports compatible by bridging existing table/status components to the new CRUD foundation.
- Verified `npm run lint` and `npm run build` after adding the reusable admin CRUD foundation.
- Rebuilt `/admin/dashboard` as a responsive mock analytics dashboard with KPI cards, revenue chart, orders chart, recent orders, top products, low-stock products, sales overview, and recent activity.
- Added reusable dashboard analytics components under `frontend/src/admin/components/dashboard`: `StatCard`, `RevenueChart`, `OrdersChart`, `ActivityFeed`, and `AnalyticsCard`.
- Added realistic dashboard mock analytics data in `frontend/src/data/adminMock.js`.
- Verified `npm run lint` and `npm run build` after rebuilding the admin dashboard analytics page.
- Rebuilt the production admin layout under `frontend/src/admin/layouts` with `AdminLayout`, `AdminSidebar`, `AdminTopbar`, `Breadcrumbs`, and `SidebarSection`.
- Added a dark responsive admin sidebar, sticky glass topbar, breadcrumbs, notification placeholder, admin profile dropdown, desktop collapsed mode, mobile drawer behavior, and route-aware active states.
- Preserved the existing homepage layout and kept admin UI changes scoped to the admin shell.
- Verified `npm run lint` and `npm run build` after rebuilding the admin layout.
- Added the Phase 5 admin dashboard architecture foundation under `frontend/src/admin`.
- Added admin subfolders for components, layouts, pages, hooks, services, tables, forms, modals, and analytics.
- Added reusable admin hooks: `useAdminTable`, `useAdminFilters`, `useAdminPagination`, and `useAdminModal`.
- Added an admin module registry and CRUD service wrappers for categories, brands, products, variants, media, users, staff, roles, permissions, orders, warehouses, and coupons.
- Added `variantService.js`, `roleService.js`, and `permissionService.js` using the shared resource service pattern.
- Routed admin layout/page imports through the new `frontend/src/admin` namespace without redesigning existing admin UI.
- Updated existing admin `CrudPage` to use `useAdminTable` so search/filter state is no longer duplicated in the page component.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after adding the admin architecture foundation.
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
3. Start Phase 6 by defining public storefront API contracts for customer auth, browsing, cart, checkout, payment, and customer-owned order tracking.
4. Keep the completed admin CRUD system stable while storefront ecommerce APIs are expanded.
5. Use centralized feedback components for loading, error, empty, permission, and refresh states in new ecommerce workflows.
6. Move customer auth and account ownership checks to a dedicated public customer auth contract when ready.
7. Resolve existing backend test blockers before relying on `mvn test` as a clean validation gate.
8. Add controlled PostgreSQL migration/backfill scripts for legacy non-auth tables before relying on a clean backend startup log.
9. Keep AI context docs current.

## Next Recommended Tasks

### Frontend Foundation Maintenance

- Keep client and admin components separated.
- Keep `src/api/client.js` as the only shared Axios client.
- Keep `src/api/apiErrorHandler.js` and `src/api/normalizeApiError.js` as the centralized API error layer.
- Keep `src/api/apiErrorFeedback.js` and `src/api/apiErrorEvents.js` as the global API feedback bridge.
- Keep refresh-token coordination centralized in `src/api/refreshTokenService.js`.
- Keep shared CRUD request logic centralized in `src/api/resourceService.js`.
- Keep reusable admin page state in `src/admin/hooks`.
- Keep admin module metadata and CRUD wrappers in `src/admin/services`.
- Keep admin route/page entrypoints under `src/admin/pages` and `src/admin/layouts`.
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

- Use Phase 6 to move customer-facing ecommerce workflows from mock/local state to public backend APIs.
- Keep the register flow local until public customer auth APIs are ready.
- Move storefront customer login to a public customer auth endpoint when the API contract is available.
- Keep `/profile`, `/profile/orders`, and `/profile/settings` behind `ProtectedRoute`.
- Keep account profile/order API calls centralized in `userService.js`, `orderService.js`, and `accountMapper.js`.
- Keep the shared cart provider as the single cart state source for header drawer, cart page, product cards, product detail, and checkout.
- Connect the production-ready wishlist sync layer to a real public wishlist API when the backend contract is ready; keep recently viewed local until product history APIs exist.
- Replace homepage product sections, wishlist/recently viewed lookup, and search overlay mock data with real storefront APIs when those contracts are ready.
- Add real online payment gateway handoff when the payment task starts.
- Add category route/page when the category browsing plan is ready.
- Replace the homepage mock loading timer with real loading state when storefront data integration begins.

### Phase 6 Ecommerce Core Features

- Add or formalize public storefront product browsing endpoints separate from admin Product APIs.
- Add public category browsing and product discovery flows without changing the existing homepage layout.
- Add customer registration and customer login contracts separate from admin/staff auth.
- Add cart persistence APIs and connect the existing shared cart provider to backend state.
- Add checkout/payment handoff for COD and online gateways when backend contracts are ready.
- Harden customer order tracking when backend exposes richer shipment history or public customer ownership contracts.
- Connect wishlist, recently viewed, homepage product sections, and search overlay to matching public APIs when those contracts exist.

### Admin Dashboard Maintenance

- Keep the completed API-backed admin modules stable.
- Reuse `useAdminTable`, `useAdminFilters`, `useAdminPagination`, `useAdminModal`, and `useDebouncedValue` instead of adding local duplicated table/search state.
- Reuse admin module registry metadata for resource labels, routes, permissions, and service selection.
- Reuse shared route/sidebar/action permission policies for every admin resource page.
- Keep ADMIN full access and require staff resource view permissions for staff module access.
- Keep admin dashboard and report mock data isolated until reporting APIs exist.

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
- A dedicated backend wishlist persistence API is not implemented; wishlist state is local-first with optional frontend sync support through `VITE_WISHLIST_API_PATH`.
- Admin CRUD modules are API-backed; `/admin/dashboard` and `/admin/reports/*` still use mock analytics/report data until reporting APIs exist.
- Category API currently has no `description` field in request/response DTOs, so category description is UI-session only until backend contract is extended.
- Backend admin auth currently exposes login/logout; refresh-token endpoint support is not implemented yet.
- Backend `mvn test` currently fails because `AddressMapper` is not registered as a bean for `AdminAddressServiceImpl`.
- Backend startup also reports a database DDL warning for existing null `media.display_order` values.
- Backend local startup on default port may fail when another process already binds `8080`.
- Local PostgreSQL still contains legacy drift in non-auth modules, including non-null columns and warehouse transaction foreign keys, and should be migrated with controlled SQL scripts instead of relying on `ddl-auto` alone.
- Production deployment is not ready.

## Maintenance Reminder

When work is completed, update:

- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `CHANGELOG_AI.md`
