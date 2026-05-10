# CURRENT_STATE

## Purpose

This file is the current source of truth for project state.

Always update this file after meaningful work.

## Current Phase

```text
Ready for Phase 6 — Ecommerce Core Features
```

## Current Summary

ElectronicsManagement has completed Phase 5 — Admin Dashboard System and is ready for Phase 6 — Ecommerce Core Features.

The client storefront now includes the homepage, Product API-backed product listing and product detail, shared-cart cart and checkout, customer authentication, wishlist, recently viewed, search overlay, and authenticated account experiences. Checkout now creates real backend orders and validates coupons through backend APIs. Wishlist, recently viewed, search, and homepage product sections still use mock/local state. Frontend admin/staff authentication is connected to the backend JWT API, the admin architecture foundation exists under `frontend/src/admin`, and the `/admin/categories`, `/admin/brands`, `/admin/products`, `/admin/variants`, `/admin/media`, `/admin/orders`, `/admin/warehouse`, `/admin/coupons`, `/admin/users`, `/admin/staff`, and `/admin/roles` modules are connected to real backend APIs with table/grid, search, filters, status controls, detail views, protected actions, and pagination. The admin dashboard and report routes still use mock analytics/report data until reporting APIs are added.

The frontend folder structure has been normalized without changing the current visual UI.

The frontend now has a theme system for shared colors, spacing, radius, shadows, typography, z-index, and transitions.

The storefront typography system now includes display, heading, title, body, caption, price, card-title, and muted text utilities.

The storefront spacing and layout system now includes page, section, grid, and flex utilities for consistent ecommerce rhythm.

The storefront motion system now uses Framer Motion presets for subtle fade, stagger, hover lift, glow, and image zoom interactions.

The storefront product card pattern now has production-style ecommerce polish with improved image framing, discount and stock badges, wishlist toggle, rating treatment, pricing area, and quick-add CTA.

The storefront header now has production-style ecommerce polish with scroll-aware sticky blur, improved search, category dropdown, cart badge motion, and a responsive mobile menu.

The homepage visual system now has stronger production-level depth through layered dark gradients, subtle texture, hero lighting, neon promo accents, and section separation.

The storefront now has a reusable dark skeleton loading system with shimmer placeholders for headers, banners, categories, and product cards.

The frontend now has shared reusable UI primitives for buttons, cards, badges, inputs, section titles, icon buttons, containers, prices, and ratings.

The storefront product listing page now exists at `/products` with Product API-backed product grid, searchable catalog filtering, category/brand filtering, filter sidebar, active filters, sorting, pagination foundation, breadcrumb, category banner, loading, error, and empty states.

The Product API-backed product listing state now lives in `frontend/src/hooks/useProducts.js`.

The storefront product detail page now exists at `/products/:slug` with Product API-backed gallery, variants, quantity, purchase actions, specs, description, reviews, shipping information, stock information, related products, loading, error, and not-found states.

The frontend Product API integration uses `frontend/src/api/productMapper.js` to normalize flexible backend response shapes before they reach UI components.

The product detail gallery now supports loading skeletons, smoother image switching, stronger thumbnail active states, hover zoom, fullscreen preview, and keyboard navigation in preview mode.

The storefront header now includes a shared-cart drawer with slide-in animation, blurred backdrop, item quantity updates, remove actions, subtotal, checkout action, and animated cart count badge.

The storefront cart page now exists at `/cart` with shared local cart items, quantity updates, remove actions, backend coupon validation, order summary, shipping estimate, continue-shopping CTA, checkout CTA, and sticky desktop summary.

The storefront checkout page now exists at `/checkout` with authenticated checkout, customer profile prefill from User API when available, shipping address, shipping method, payment method, form validation UI, backend coupon validation, backend order creation, API loading/error states, and sticky order summary.

The storefront customer authentication pages now exist at `/login` and `/register` with reusable dark auth layout/forms, social login placeholders, remember-me, forgot-password placeholder, local validation UI, and responsive dark glass styling. The `/login` form now calls the backend JWT auth service; `/register` remains local until customer registration APIs are ready.

The storefront wishlist page now exists at `/wishlist` with localStorage-backed wishlist state, product-card wishlist toggles, recently viewed tracking, and reusable wishlist/recently-viewed hooks.

The storefront header now includes an advanced mock-backed search overlay with debounced live suggestions, recent searches, trending searches, product/category/brand result previews, reusable result rows, search highlighting, category-aware and brand-aware scoring, loading/empty states, and keyboard navigation behavior.

The authenticated storefront account area now exists at `/profile`, `/profile/orders`, and `/profile/settings` with real User Profile and User Order API integration, protected routing, profile update, order history/detail, logout, and avatar placeholder UI.

Phase 2 cleanup normalized shared/admin visual patterns for cards, borders, shadows, hover states, focus states, icon buttons, typography usage, and responsive behavior without a large rewrite.

Frontend routing now includes client ecommerce routes and admin routes with placeholders for pages that are not implemented yet.

The frontend now has a centralized JWT-ready auth architecture with AuthProvider, auth storage helpers, auth state helpers, reusable route guards, and an auth reducer/store namespace. It supports user/admin/staff session shape, roles, permissions, access token, refresh token, authentication status, loading state, session restore, redirect memory, refresh-on-401 flow, and graceful unauthorized UI, and is now used by the real login flow.

The frontend now has a centralized role/permission system with shared route policies, sidebar filtering, reusable permission hooks, PermissionGate, and resource action policies for admin CRUD controls. ADMIN has full admin access, STAFF module access requires matching resource view permissions, and USER cannot access admin routes.

The frontend now has a centralized global feedback system with reusable toast notifications, loading toasts, API error alerts, empty states, permission-denied states, and a global React error boundary.

The next phase is:

```text
Phase 6 — Ecommerce Core Features
```

## Phase 1 Completed Items

- Normalized `frontend/src` folder structure.
- Preserved the existing homepage layout and dark gaming ecommerce style.
- Split client, admin, shared UI, routing, styles, data, and API concerns into clear folders.
- Centralized route definitions in `frontend/src/routes/AppRoutes.jsx`.
- Added client routes and admin routes with styled placeholders where workflows are not implemented yet.
- Added shared UI primitives for common buttons, cards, badges, inputs, section titles, icon buttons, containers, prices, and ratings.
- Added design tokens and shared CSS utilities for frontend styling.
- Added a normalized ecommerce theme system with `theme.js`, `globals.css`, and `utilities.css`.
- Added reusable typography utilities for ecommerce hierarchy and dark-theme readability.
- Added reusable spacing/layout utilities for page containers, sections, product grids, category grids, and common flex alignment.
- Added reusable skeleton loading components for storefront loading states.
- Added a shared Axios client and flat API service modules under `frontend/src/api`.
- Modularized mock data under `frontend/src/data`.
- Removed the leftover empty `frontend/src/components/admin` directory during review.

## Phase 2 Completed Items

- Standardized the storefront theme, token, typography, spacing, layout, motion, product card, header, visual polish, and skeleton-loading systems.
- Completed the homepage responsive audit across mobile, tablet, desktop, and ultra-wide viewports while preserving the existing section order and desktop three-column hero.
- Kept the mobile storefront hamburger menu, responsive hero, two-column product grid, and tighter mobile spacing.
- Normalized admin card, border, shadow, icon button, action button, focus ring, and hover treatments across dashboard, CRUD, table, and report surfaces.
- Reused shared primitives for admin cards and added an admin icon button pattern for compact table/topbar actions.
- Improved placeholder page typography and muted text usage so future client ecommerce routes inherit the Phase 2 visual system.
- Verified there was no document-level horizontal overflow in homepage and key admin viewport checks.

## Phase 3 Completed Items

- Added a production-style mock-backed product listing page at `/products`.
- Added reusable listing components: `FilterSidebar`, `SortDropdown`, `ActiveFilters`, and `Pagination`.
- Added `SearchProductsInput`, `EmptyProductsState`, debounced search, multi-select category/brand/price/stock filters, collapsible filter groups, and a mobile filter drawer.
- Expanded storefront mock product data to support category, brand, price, rating, stock, newest, featured, and best-seller listing workflows.
- Added a production-style mock-backed product detail page at `/products/:slug`.
- Added product detail components: `ProductGallery`, `ProductInfo`, `VariantSelector`, `QuantitySelector`, `ProductSpecs`, `ProductReviews`, and `RelatedProducts`.
- Added mock product detail enrichment helpers for gallery, variants, specs, description, reviews, shipping, stock, and related products.
- Polished `ProductGallery` with image loading skeletons, smoother thumbnail transitions, hover zoom, fullscreen preview modal, and keyboard preview controls.
- Added a mock-backed ecommerce cart drawer opened from the storefront header cart button.
- Added reusable cart components: `CartDrawer`, `CartItem`, and `CartSummary`.
- Added a full mock-backed cart page at `/cart` using the reusable cart item and summary components.
- Added a production-style mock-backed checkout page at `/checkout`.
- Added checkout components: `CheckoutForm`, `ShippingMethodSelector`, `PaymentMethodSelector`, and `CheckoutSummary`.
- Added production-style mock-backed ecommerce auth pages at `/login` and `/register`.
- Added auth components: `AuthLayout`, `LoginForm`, and `RegisterForm`.
- Added a localStorage-backed wishlist and recently viewed experience at `/wishlist`.
- Added reusable wishlist/recently viewed hooks: `useWishlist` and `useRecentlyViewed`.
- Added a mock-backed ecommerce search overlay experience to the storefront header.
- Added search components and logic: `SearchOverlay`, `SearchSuggestions`, and `useSearch`.
- Reviewed and polished the full client ecommerce phase across PLP, PDP, cart, checkout, auth, wishlist, recently viewed, and search surfaces.
- Normalized repeated storefront stat-card styling with `store-stat-card`.
- Tightened mobile checkout and order-summary layouts to reduce overflow risk.
- Replaced visible developer-facing checkout/auth/search copy with customer-facing placeholder copy.
- Confirmed Phase 3 is complete and ready for Phase 4 — Auth + Backend Integration.

## Phase 4 Completed Items

- Added centralized auth modules under `frontend/src/auth`.
- Added reusable route guards under `frontend/src/guards`.
- Added auth reducer exports under `frontend/src/store/auth`.
- Wrapped the React app with `AuthProvider` without changing current route access behavior.
- Updated `frontend/src/api/client.js` and `authService.js` to use centralized auth storage/session helpers.
- Added a shared toast notification provider under `frontend/src/components/ui/toast`.
- Wired `/login` and `/admin/login` to `authService.login()` using the backend admin JWT endpoint.
- Added role-based login redirect: user-shaped sessions go to `/`, admin/staff sessions go to `/admin/dashboard`.
- Applied route guards to protect `/admin/*` and keep authenticated users out of guest-only auth routes.
- Added `StaffRoute`, shared route guard loading/unauthorized states, redirect memory, and synchronous auth session restoration.
- Protected `/checkout` with `ProtectedRoute` and made `/login`, `/register`, and `/admin/login` guest-only.
- Guarded admin-only user, staff, and role management pages with `AdminRoute` while the admin shell uses `StaffRoute` for admin/staff access.
- Updated the admin login screen to use the dark premium auth style.
- Added backend auth exception handlers so invalid credentials return `401` and disabled/locked accounts return explicit account-status errors.
- Hardened the frontend Axios API client with env-driven base URL/timeout config, automatic bearer tokens, centralized response error handling, `401` auth cleanup, retry foundation, normalized API errors, and reusable `api.*` request helpers.
- Added frontend refresh-token session persistence with `refreshTokenService`, app-start token expiry validation, single-flight refresh requests, original-request retry after successful refresh, and logout when refresh fails.
- Added centralized role/permission helpers through `frontend/src/auth/roleHelpers.js`, `usePermissions.js`, and `PermissionGate.jsx`.
- Routed admin pages through shared role policies and filtered admin sidebar navigation from the same policy source.
- Added resource action policies to shared admin CRUD controls so create/update/delete buttons can be gated without inline role checks.
- Added centralized feedback components under `frontend/src/components/ui/feedback`.
- Extended the shared toast provider with success, error, warning, info, loading, API-error, and promise-style feedback helpers.
- Added global API error events so normalized auth, validation, network, timeout, server, and permission errors can surface consistently.
- Wrapped the React app in `GlobalErrorBoundary`.
- Connected storefront `/products` and `/products/:slug` to the real Product API through `useProducts.js`, `useProductDetail.js`, and flexible product response mapping.
- Removed the obsolete mock-backed `useProductFilters.js` hook so storefront product listing state has one Product API-backed source.
- Added a shared `frontend/src/cart` cart provider used by the header drawer, cart page, product cards, product detail purchase actions, and checkout page.
- Added checkout API mapping through `frontend/src/api/checkoutMapper.js`.
- Added backend coupon validation through `couponService.applyCouponCode()` and reusable `useCheckoutCoupon.js`.
- Added authenticated checkout order creation through `orderService.createOrder()` and reusable `useCheckoutOrder.js`.
- Added checkout customer profile prefill through `useCheckoutProfile.js` and `userService.getCurrentUserProfile()`.
- Added backend `POST /api/orders` for authenticated order creation with coupon validation and stock reservation, without payment gateway integration.
- Added backend user account APIs: `GET/PUT /api/users/{userId}/profile`, `GET /api/orders?userId=...`, and `GET /api/orders/{orderId}?userId=...`.
- Added protected storefront account routes `/profile`, `/profile/orders`, and `/profile/settings` backed by User Profile and User Order APIs.
- Added reusable `frontend/src/api/resourceService.js` so admin CRUD service modules share the same basic request logic.
- Hardened refresh handling so `401` refresh retries only run when a stored refresh token exists.
- Tightened remembered redirect sanitization and prevented admin/staff sessions from being redirected into customer-only routes.
- Updated `/checkout` and `/profile/*` to use customer-only route policies while admin/staff sessions are redirected back to admin.
- Aligned admin route/sidebar access with resource view permissions so staff module access requires both staff role and the matching `*:view` permission.
- Added store/admin-specific route loading states to reduce unauthorized or wrong-surface flashing during session restore.
- Completed the backend integration review and marked Phase 4 complete.

## Phase 5 Completed Items

- Added `frontend/src/admin/` as the admin dashboard namespace with `components`, `layouts`, `pages`, `hooks`, `services`, `tables`, `forms`, `modals`, and `analytics`.
- Added `useAdminTable`, `useAdminFilters`, `useAdminPagination`, and `useAdminModal` for reusable admin table and modal state.
- Added admin module registry and CRUD service wrappers under `frontend/src/admin/services`.
- Added admin module entries for categories, brands, products, variants, media, users, staff, roles, permissions, orders, warehouses, and coupons.
- Added frontend API service modules for variants, roles, and permissions using the shared resource service pattern.
- Routed admin imports through `frontend/src/admin/pages` and `frontend/src/admin/layouts` without redesigning the existing UI.
- Reused `useAdminTable` in the existing admin `CrudPage` to remove duplicated search/filter logic from the component.
- Rebuilt the admin layout shell under `frontend/src/admin/layouts` with `AdminLayout`, `AdminSidebar`, `AdminTopbar`, `Breadcrumbs`, and `SidebarSection`.
- Added a responsive dark admin sidebar, sticky glass topbar, breadcrumbs, notification placeholder, profile dropdown, collapsed desktop navigation, mobile drawer navigation, and route-aware active states.
- Rebuilt `/admin/dashboard` as a mock analytics dashboard with KPI cards, revenue chart, orders chart, recent orders, top products, low-stock products, sales overview, and recent activity.
- Added reusable admin dashboard analytics components under `frontend/src/admin/components/dashboard`: `StatCard`, `RevenueChart`, `OrdersChart`, `ActivityFeed`, and `AnalyticsCard`.
- Added reusable admin CRUD foundation components under `frontend/src/admin/components/crud`: `AdminTable`, `AdminForm`, `AdminModal`, `AdminDrawer`, `AdminFilters`, `AdminSearch`, `AdminPagination`, `StatusBadge`, `ConfirmDialog`, and `EmptyAdminState`.
- Added CRUD foundation support for sorting, pagination, search controls, filters, bulk actions, row actions, loading states, and empty states.
- Connected `/admin/categories` to real backend Category APIs with reusable admin components, server-side search/filter/pagination, create/update/delete, status patch updates, and API error/loading states.
- Connected `/admin/brands` to real backend Brand APIs with server-side search/filter/pagination, create/update/delete, status toggle, featured toggle, logo URL placeholder, and API error/loading states.
- Extended the backend Brand API contract with `slug`, `description`, and `featured` fields plus featured filtering.
- Connected `/admin/products` to real backend Product, Brand, and Category APIs with a compact ecommerce admin table, create/update drawer, search, category/brand/status/featured filters, featured toggle, status toggle, delete confirmation, and API error/loading states.
- Added reusable Product Management components: `ProductForm.jsx`, `ProductTable.jsx`, and `ProductFilters.jsx`.
- Extended the backend Product API contract with `featured`, category/brand/featured filters, featured patch updates, richer list/detail DTO metadata, and product-level media update support for image URL placeholders.
- Connected `/admin/variants` to real backend Variant and Product APIs with an inventory-style table, create/update drawer, SKU management, stock/price editing, product filter, status filter, status toggle, delete confirmation, and API error/loading states.
- Added reusable Variant Management components: `VariantForm.jsx` and `VariantTable.jsx`.
- Extended the backend Variant API contract with `sku` and product filtering.
- Connected `/admin/media` to real backend Media and Product APIs with a dark asset-manager UI, drag-and-drop Cloudinary upload, upload progress, media grid, image preview modal, product attach flow, primary image action, delete confirmation, pagination, filters, and API error/loading states.
- Added reusable Media Management components: `MediaUploader.jsx`, `MediaGrid.jsx`, and `MediaPreviewModal.jsx`.
- Added `frontend/src/api/mediaMapper.js` and upgraded `mediaService.js` for normalized Media API pages, upload responses, create payloads, primary updates, order updates, and deletes.
- Extended the backend Media API with paginated list/search/filter support, `publicId` support on media create/response DTOs, primary reset handling, and Cloudinary deletion during media delete.
- Connected `/admin/orders` to real backend Order APIs with an ecommerce operations table, order detail drawer, customer/shipping/payment detail sections, status update controls, payment and shipping status controls, and timeline UI.
- Added reusable Order Management components: `OrderTable.jsx`, `OrderDetail.jsx`, and `OrderTimeline.jsx`.
- Added `frontend/src/api/orderMapper.js` and upgraded `orderService.js` for normalized admin Order pages/details and update payloads.
- Connected `/admin/warehouse` to real backend Warehouse and Warehouse Transaction APIs with stock overview, inventory adjustments, low-stock alerts, and stock history placeholder UI.
- Added reusable Warehouse Management components: `WarehouseTable.jsx`, `StockAdjustModal.jsx`, and `LowStockCard.jsx`.
- Added `frontend/src/api/warehouseMapper.js` and upgraded `warehouseService.js` for normalized Warehouse pages, stock rows, transaction pages, and adjustment payloads.
- Fixed backend Warehouse Transaction completion so manual `IMPORT`, `RETURN`, and `UNRESERVED` transactions increase stock while outbound transaction types decrease stock.
- Connected `/admin/coupons` to real backend Coupon APIs with coupon table, create/update drawer, validation UI, date pickers, usage tracking, status controls, search, filters, and pagination.
- Added reusable Coupon Management components: `CouponForm.jsx` and `CouponTable.jsx`.
- Added `frontend/src/api/couponMapper.js` and upgraded `couponService.js` for normalized Coupon pages/details, create/update payloads, and status patch updates.
- Extended the backend Coupon API response with `usedCount` and enforced `usageLimit` during checkout coupon resolution.
- Connected `/admin/roles` to real backend Role and Permission APIs with a role table, permission matrix, assign-permission drawer, staff role assignment panel, status controls, search, filters, and pagination.
- Added reusable Role and Permission Management components: `PermissionMatrix.jsx`, `RoleForm.jsx`, and `RoleTable.jsx`.
- Extended backend Role responses with `permissionCount` and `staffCount` for Role Management list/detail UI.
- Connected `/admin/users` to real backend User APIs with reusable admin components, server-side search/status filtering, role display, account status toggles, detail drawer, protected delete action, and pagination.
- Connected `/admin/staff` to real backend Staff and Role APIs with reusable admin components, server-side search/status filtering, role display, create/update/delete, account status toggles, detail drawer, self-account action protection, and pagination.
- Added `frontend/src/api/adminPeopleMapper.js` to normalize User, Staff, Role, and Permission API page/detail responses for admin people-management pages.
- Extended backend Staff repository search to include staff full name.
- Reviewed and polished the full Admin Dashboard System for CRUD consistency, table actions, spacing, responsive layout, permission handling, loading/error states, drawer/modal behavior, form consistency, chart consistency, and badge/status consistency.
- Added shared debounced admin search handling and permission-aware admin topbar module search.
- Hardened reusable admin CRUD components so legacy page headers do not render dead actions, table row action tones are consistent, forms avoid invalid nested labels, confirm/modal footers fit mobile, and status badges normalize common backend/admin statuses.
- Kept `/admin/dashboard` and `/admin/reports/*` on mock analytics/report data while aligning chart/table styling with the reusable admin dashboard components.

## Frontend State

Current stack:

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- lucide-react
- Recharts

Current client routes:

- `/`
- `/products`
- `/products/:slug`
- `/cart`
- `/checkout`
- `/login`
- `/register`
- `/wishlist`
- `/profile`
- `/profile/orders`
- `/profile/settings`

Current admin routes:

- `/admin`
- `/admin/login`
- `/admin/dashboard`
- `/admin/categories`
- `/admin/brands`
- `/admin/products`
- `/admin/variants`
- `/admin/media`
- `/admin/users`
- `/admin/staff`
- `/admin/roles`
- `/admin/orders`
- `/admin/warehouse`
- `/admin/coupons`
- `/admin/reports/revenue`
- `/admin/reports/best-sellers`
- `/admin/reports/activity`

Current frontend data:

- Client storefront mock data is split across `frontend/src/data/categories.js`, `products.js`, `promotions.js`, and `services.js` for homepage/search/wishlist/local flows that are not API-backed yet.
- `frontend/src/data/products.js` still supports mock/local storefront sections, but `/products` now uses Product API data.
- `frontend/src/data/productDetails.js` remains available for legacy mock detail helpers, but `/products/:slug` now uses Product API data.
- `frontend/src/data/cart.js` remains as legacy mock cart setup, but active cart drawer, `/cart`, and `/checkout` now use `frontend/src/cart`.
- Most admin pages use `frontend/src/data/adminMock.js`; `/admin/categories`, `/admin/brands`, `/admin/products`, `/admin/variants`, `/admin/media`, `/admin/orders`, `/admin/warehouse`, `/admin/coupons`, `/admin/users`, `/admin/staff`, and `/admin/roles` now use real backend data.
- Shared data exports live in `frontend/src/data/index.js`.
- API client exists at `frontend/src/api/client.js`.
- API config exists at `frontend/src/api/apiConfig.js`.
- API error handling exists at `frontend/src/api/apiErrorHandler.js`, `normalizeApiError.js`, `apiErrorFeedback.js`, and `apiErrorEvents.js`.
- Checkout/order/coupon mapping exists at `frontend/src/api/checkoutMapper.js`.
- Account profile/order mapping exists at `frontend/src/api/accountMapper.js`.
- Product API response mapping exists at `frontend/src/api/productMapper.js`.
- Media API response mapping exists at `frontend/src/api/mediaMapper.js`.
- Admin Order API response mapping exists at `frontend/src/api/orderMapper.js`.
- Warehouse API response mapping exists at `frontend/src/api/warehouseMapper.js`.
- Coupon API response mapping exists at `frontend/src/api/couponMapper.js`.
- API refresh-token handling exists at `frontend/src/api/refreshTokenService.js`.
- API service modules now exist in `frontend/src/api` for auth, categories, brands, products, variants, users, staff, roles, permissions, orders, warehouses, coupons, and media.
- API service modules use reusable `api.*` helpers and `resourceService.js` for shared CRUD request logic.
- Admin dashboard foundation helpers live in `frontend/src/admin`.
- The shared API client reads the JWT through `frontend/src/auth/authStorage.js` using localStorage key `accessToken`.
- The shared API client reads `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, and `VITE_AUTH_REFRESH_ENDPOINT`.
- Product API integration reads `VITE_PRODUCT_API_PATH`, defaulting to `/admin/products`.
- Checkout integration reads `VITE_COUPON_API_PATH`, `VITE_ORDER_API_PATH`, and `VITE_USER_API_PATH`.
- Account integration reads `VITE_USER_PROFILE_API_PATH` and `VITE_USER_ORDER_API_PATH`.
- Auth session metadata is centralized through `frontend/src/auth` and currently stores safe user, roles, and permissions metadata only.
- `frontend/.env.example` documents `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_AUTH_REFRESH_ENDPOINT`, `VITE_PRODUCT_API_PATH`, `VITE_COUPON_API_PATH`, `VITE_ORDER_API_PATH`, `VITE_USER_API_PATH`, `VITE_USER_PROFILE_API_PATH`, and `VITE_USER_ORDER_API_PATH`.
- Admin/staff login is connected to the backend JWT API.
- `/admin/categories`, `/admin/brands`, `/admin/products`, `/admin/variants`, `/admin/media`, `/admin/orders`, `/admin/warehouse`, `/admin/coupons`, `/admin/users`, `/admin/staff`, and `/admin/roles` are connected to real backend data; remaining admin modules still use mock data.

Current frontend structure:

- Route definitions live in `frontend/src/routes/AppRoutes.jsx`.
- Admin dashboard architecture lives in `frontend/src/admin/`.
- Admin dashboard analytics components live in `frontend/src/admin/components/dashboard/`.
- Admin CRUD foundation components live in `frontend/src/admin/components/crud/`.
- Role and Permission Management components live in `frontend/src/pages/admin/roles/`.
- Admin table/filter/pagination/modal hooks live in `frontend/src/admin/hooks/`.
- Admin module registry and CRUD service wrappers live in `frontend/src/admin/services/`.
- Admin route imports now go through `frontend/src/admin/pages/` and `frontend/src/admin/layouts/`.
- Auth context, provider, hook, storage, and helpers live in `frontend/src/auth/`.
- Role/permission policy helpers, permission hooks, and PermissionGate live in `frontend/src/auth/`.
- Route guard components and helper UI live in `frontend/src/guards/`.
- Shared storefront cart state lives in `frontend/src/cart/`.
- Auth reducer exports live in `frontend/src/store/auth/`.
- Toast notification components live in `frontend/src/components/ui/toast/`.
- Feedback components live in `frontend/src/components/ui/feedback/`.
- Client homepage page lives in `frontend/src/pages/client/Home.jsx`.
- Admin pages live in `frontend/src/pages/admin/`.
- Client homepage components live in `frontend/src/components/home/`.
- Cart drawer and cart page components live in `frontend/src/components/cart/`.
- Checkout components live in `frontend/src/components/checkout/`.
- Account components live in `frontend/src/components/account/`.
- Customer auth components live in `frontend/src/components/auth/`.
- Search overlay components live in `frontend/src/components/search/`.
- Client layout components live in `frontend/src/components/layout/`.
- Product components live in `frontend/src/components/product/`, including listing filters, search, sorting, active filters, empty state, pagination, detail gallery, product info, variants, quantity, specs, reviews, related products, and reusable product cards.
- Product listing API state logic lives in `frontend/src/hooks/useProducts.js`.
- Product detail API state logic lives in `frontend/src/hooks/useProductDetail.js`.
- Checkout coupon, order creation, and profile prefill logic lives in `frontend/src/hooks/useCheckoutCoupon.js`, `useCheckoutOrder.js`, and `useCheckoutProfile.js`.
- Authenticated account profile state logic lives in `frontend/src/hooks/useAccountProfile.js`.
- Wishlist and recently viewed local state logic lives in `frontend/src/hooks/useWishlist.js` and `frontend/src/hooks/useRecentlyViewed.js`.
- Storefront search overlay logic lives in `frontend/src/hooks/useSearch.js`, with recent-search persistence in `frontend/src/hooks/useRecentSearches.js`.
- Skeleton loading components live in `frontend/src/components/skeletons/`.
- Admin layout components live in `frontend/src/admin/layouts/`, with legacy compatibility exports preserved through `frontend/src/layouts/AdminLayout.jsx`.
- Shared reusable UI components live in `frontend/src/components/ui/`.
- Shared feedback components include `GlobalErrorBoundary`, `ApiErrorAlert`, `EmptyState`, and `PermissionDenied`.
- Admin-specific reusable UI components live in `frontend/src/components/ui/admin/`.
- Design tokens live in `frontend/src/styles/tokens.js`.
- The primary theme object lives in `frontend/src/styles/theme.js`.
- Motion presets live in `frontend/src/styles/animations.js`.
- CSS variables and global defaults live in `frontend/src/styles/globals.css`.
- Reusable utility classes live in `frontend/src/styles/utilities.css`.
- The styles entrypoint remains `frontend/src/styles/index.css`.
- Typography utilities include `text-display`, `text-heading`, `text-section`, `text-card-title`, `text-price`, and `text-muted`.
- Layout utilities include `page-container`, `section-wrapper`, `grid-products`, `grid-categories`, `flex-between`, and `flex-center`.
- Spacing scale uses 8, 12, 16, 20, 24, 32, 40, 48, and 64 pixel steps.
- Motion presets include `fadeIn`, `fadeUp`, `staggerContainer`, `hoverLift`, `hoverGlow`, and `imageZoom`.
- Skeleton components include `HeaderSkeleton`, `BannerSkeleton`, `CategorySkeleton`, `ProductCardSkeleton`, and shared `SkeletonBlock`.
- Skeleton styling uses the `skeleton-shimmer` and `skeleton-card` utilities.
- No empty source directories were found after the Phase 1 review cleanup.

Homepage state:

- Existing homepage layout must be preserved.
- Dark gaming ecommerce style is active.
- Blue accent is active.
- Premium hover/glow/glass visual polish has been applied.
- Folder restructuring did not intentionally change homepage visuals.
- The homepage shell now uses the shared `store-page-shell` utility with the same dark radial background.
- Homepage now uses shared UI primitives where appropriate without intentionally changing layout.
- Homepage now receives mock categories, products, promotions, and service data from `src/data`.
- Shared primitives now use the normalized `container-default` and `transition-default` utilities where appropriate.
- Homepage hero title, section headings, product names, prices, flash sale text, and service bar copy now use the shared typography utilities.
- Homepage page container, section rhythm, category grid, product grid, flash sale header, and hero media alignment now use shared layout utilities.
- Homepage product cards, category cards, hero buttons, promo cards, flash sale card, and service cards now use subtle Framer Motion interactions.
- Homepage product cards now include polished image stages, wishlist placeholders, stock badges, stronger pricing treatment, and quick-add CTAs.
- Flash sale card now shares the polished badge, stock, image glow, and CTA treatment.
- Header now uses a sticky scroll-aware blurred background, premium search bar, desktop category dropdown, animated cart badge, and responsive mobile menu.
- Header cart button now opens the shared-cart drawer and reflects cart count from `frontend/src/cart`.
- Header search now opens the advanced mock-backed search overlay on desktop and mobile.
- Homepage background, hero banner, promo cards, category cards, service bar, and section separators now have deeper production ecommerce visual polish.
- Homepage now includes a short mock loading state demo that renders dark shimmer skeletons before showing mock data.
- Homepage responsive audit has been completed across mobile, tablet, desktop, and ultra-wide viewports.
- Mobile homepage keeps the hamburger menu, a compact stacked hero, two-column product/category grids, and tighter product card wrapping.
- Tablet homepage now has a balanced hero, promo, service, and category layout with reduced empty space.
- Desktop and ultra-wide homepage still preserve the three-column hero structure and centered max-width layout.
- `/` still renders the existing homepage.
- `/products` now renders the Product API-backed product listing page.
- `/products/:slug` now renders the Product API-backed product detail page.
- `/cart` now renders the shared-cart cart page with backend coupon validation.
- `/checkout` now renders the authenticated customer checkout page behind `ProtectedRoute` and creates backend orders through `POST /api/orders`.
- `/login` now renders the dark auth page and submits through `authService.login()`.
- `/register` still renders the local ecommerce registration page until customer registration APIs exist and is now guest-only.
- `/wishlist` now renders the localStorage-backed wishlist and recently viewed page.
- `/profile`, `/profile/orders`, and `/profile/settings` now render the protected customer account area with real profile/order APIs.
- Client routes beyond homepage, product listing, product detail, cart, checkout, login, register, wishlist, and profile routes that are not fully implemented render dark ecommerce placeholder pages.
- `/admin/login` now renders the dark premium admin auth page and submits through `authService.login()`.
- `/admin/*` routes are protected by `StaffRoute`; unauthenticated users are redirected to `/admin/login`.
- `/admin/users`, `/admin/staff`, and `/admin/roles` are additionally protected by `AdminRoute`.
- Admin route access, sidebar visibility, page access, and shared CRUD action buttons now use centralized role/permission policies.
- STAFF sessions need matching resource view permissions for module access; USER sessions are blocked from admin routes; ADMIN sessions have full admin access.
- `/admin` redirects to `/admin/dashboard` after admin route authentication passes.

Latest validation:

- Responsive viewport checks passed for mobile, tablet, desktop, and ultra-wide homepage layouts after the responsive audit.
- Document-level overflow checks passed for `/`, `/admin/dashboard`, and `/admin/products` after the Phase 2 cleanup.
- `npm run lint` passed in `frontend/` after the Phase 2 cleanup and audit.
- `npm run build` passed in `frontend/` after the Phase 2 cleanup and audit.
- `npm run lint` passed in `frontend/` after adding the product listing page.
- `npm run build` passed in `frontend/` after adding the product listing page.
- `npm run lint` passed in `frontend/` after improving product listing filter/search UX.
- `npm run build` passed in `frontend/` after improving product listing filter/search UX.
- `npm run lint` passed in `frontend/` after adding the product detail page.
- `npm run build` passed in `frontend/` after adding the product detail page.
- `npm run lint` passed in `frontend/` after polishing the product detail gallery.
- `npm run build` passed in `frontend/` after polishing the product detail gallery.
- `npm run lint` passed in `frontend/` after adding the cart drawer.
- `npm run build` passed in `frontend/` after adding the cart drawer.
- `npm run lint` passed in `frontend/` after adding the full cart page.
- `npm run build` passed in `frontend/` after adding the full cart page.
- `npm run lint` passed in `frontend/` after adding the checkout page.
- `npm run build` passed in `frontend/` after adding the checkout page.
- `npm run lint` passed in `frontend/` after adding the ecommerce auth pages.
- `npm run build` passed in `frontend/` after adding the ecommerce auth pages.
- `npm run lint` passed in `frontend/` after adding the wishlist and recently viewed experience.
- `npm run build` passed in `frontend/` after adding the wishlist and recently viewed experience.
- `npm run lint` passed in `frontend/` after adding the ecommerce search overlay.
- `npm run build` passed in `frontend/` after adding the ecommerce search overlay.
- `npm run lint` passed in `frontend/` after the full client ecommerce Phase 3 polish.
- `git diff --check` passed after the full client ecommerce Phase 3 polish.
- `npm run build` passed in `frontend/` after the full client ecommerce Phase 3 polish.
- Route smoke checks returned `200` for `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/login`, `/register`, and `/wishlist` on the local Vite dev server.
- `npm run lint` passed in `frontend/` after adding the centralized auth architecture.
- `npm run build` passed in `frontend/` after adding the centralized auth architecture.
- `npm run lint` passed in `frontend/` after connecting real login and protected admin routes.
- `npm run build` passed in `frontend/` after connecting real login and protected admin routes.
- `npm run lint` passed in `frontend/` after hardening the Axios API client.
- `npm run build` passed in `frontend/` after hardening the Axios API client.
- `npm run lint` passed in `frontend/` after completing the protected routing system.
- `npm run build` passed in `frontend/` after completing the protected routing system.
- `npm run lint` passed in `frontend/` after adding refresh-token session persistence.
- `npm run build` passed in `frontend/` after adding refresh-token session persistence.
- `git diff --check` passed after adding refresh-token session persistence.
- `npm run lint`, `npm run build`, and `git diff --check` passed after adding the role/permission system.
- `npm run lint`, `npm run build`, and `git diff --check` passed after adding the global feedback system.
- `npm run lint`, `npm run build`, and `git diff --check` passed after connecting storefront product listing/detail to Product API data.
- `npm run lint`, `npm run build`, and `git diff --check` passed after connecting cart/checkout/order creation.
- `mvn -q -DskipTests compile` passed in `backend/electronics/` after adding checkout order creation.
- `npm run lint`, `npm run build`, and `mvn -q -DskipTests compile` passed after adding the authenticated account pages and user profile/order APIs.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after the Phase 4 backend integration review.
- `npm run lint`, `npm run build`, and `git diff --check` passed after adding the Phase 5 admin architecture foundation.
- `npm run lint` and `npm run build` passed in `frontend/` after rebuilding the production admin layout. Build still reports the existing Vite chunk-size warning.
- `npm run lint` and `npm run build` passed in `frontend/` after rebuilding the admin dashboard analytics page. Build still reports the existing Vite chunk-size warning.
- `npm run lint` and `npm run build` passed in `frontend/` after adding the reusable admin CRUD foundation. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke checks returned `200` for `/cart` and `/checkout` after connecting checkout/order creation.
- `mvn clean compile -DskipTests` passed in `backend/electronics/` after adding auth error handlers.
- `mvn test` failed due existing backend context issues: missing `AddressMapper` bean for `AdminAddressServiceImpl` and a database DDL migration warning for `media.display_order` containing null values.
- Backend payment startup placeholders were aligned so `VNPayUtils` and `MomoUtils` read `payment.*` keys (with fallback to legacy `electronics.app.*` keys), removing the previous missing-placeholder startup crash.
- `mvn clean spring-boot:run` now reaches web-server startup, but local run still fails on machines where port `8080` is already used by another process.
- `mvn spring-boot:run --server.port=8081` was verified to start successfully; `http://localhost:8081/swagger-ui/index.html` returned `200`.
- Backend security now includes CORS config for localhost frontend origins and returns `Access-Control-Allow-Origin` for dev preflight requests.
- Local PostgreSQL admin-auth schema was patched to match current entities (`staffs`, `roles`, `permissions`) and admin login now returns `200` with `admin@shop.com`.
- `npm run lint` and `npm run build` passed in `frontend/` after integrating real Category Management on `/admin/categories`. Build still reports the existing Vite chunk-size warning.
- `npm run lint`, `npm run build`, and `git diff --check` passed after integrating real Brand Management on `/admin/brands`. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke check returned `200` for `/admin/brands` after Brand Management integration.
- `npm run lint`, `npm run build`, and `git diff --check` passed after integrating real User Management and Staff Management on `/admin/users` and `/admin/staff`. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke checks returned `200` for `/admin/users` and `/admin/staff` after User/Staff Management integration.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after integrating real Product Management on `/admin/products`. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke check returned `200` for `/admin/products` after Product Management integration.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after integrating real Variant Management on `/admin/variants`. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke check returned `200` for `/admin/variants` after Variant Management integration.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after integrating real Media Management on `/admin/media`. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke check returned `200` for `/admin/media` after Media Management integration.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after integrating real Order Management on `/admin/orders`. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke check returned `200` for `/admin/orders` after Order Management integration.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after integrating real Warehouse Management on `/admin/warehouse`. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke check returned `200` for `/admin/warehouse` after Warehouse Management integration.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after integrating real Coupon Management on `/admin/coupons`. Build still reports the existing Vite chunk-size warning.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after integrating real Role and Permission Management on `/admin/roles`. Build still reports the existing Vite chunk-size warning.
- `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile` passed after the Phase 5 Admin Dashboard System polish and completion review. Build still reports the existing Vite chunk-size warning.
- `mvn -q -DskipTests compile` passed after removing custom backend Jackson version overrides from `backend/electronics/pom.xml`.
- `npm run lint`, `npm run build`, and `git diff --check` passed after upgrading the advanced ecommerce search system. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.
- `mvn spring-boot:run` reached Tomcat startup after the Jackson fix; the verification process was stopped after confirming startup.
- Backend startup still logs local PostgreSQL `ddl-auto` warnings for legacy/non-null schema drift in `media`, `products`, `users`, `variants`, and `warehouse_*` tables.
- Build still reports a Vite chunk-size warning for a JavaScript bundle over 500 kB.

## Known Issues

- Admin CRUD modules are API-backed; `/admin/dashboard` and `/admin/reports/*` still use mock analytics/report data until reporting APIs exist.
- Remaining future client ecommerce routes beyond the implemented homepage, product listing, product detail, cart, checkout, login, register, and wishlist pages are styled placeholders.
- A dedicated public storefront product browsing endpoint is still not separate from the configured Product API path.
- A dedicated backend cart persistence API is not implemented; the active cart is shared local frontend state and checkout creates backend orders.
- Public customer registration is not complete.
- The current real JWT login endpoint is the backend admin/staff auth endpoint; customer login should move to a public customer auth endpoint when that API exists.
- Client checkout/profile routes are customer-session only in the frontend; backend account ownership enforcement should still be tightened when public customer auth is implemented.
- The frontend refresh-token flow is ready, but the current backend admin auth controller only exposes login/logout; real refresh requires backend `refreshToken` response support and `POST /admin/auth/refresh`.
- `/checkout` is frontend-auth protected and creates backend orders, but real online payment gateway submission remains out of scope.
- Backend `mvn test` is blocked by existing ApplicationContext issues unrelated to the login UI integration.
- Backend local startup may fail if port `8080` is occupied by another local service; run on another port or free `8080`.
- Existing local PostgreSQL schema is partially legacy and still needs controlled migration/backfill for non-auth tables instead of relying on Hibernate `ddl-auto:update`.
- Backend Category API currently does not expose `description` in request/response DTOs; category description in admin UI is session-level until backend contract is extended.
- Build output is valid, but Vite reports a large bundle warning that should be handled later with code splitting.

## Next Phase

```text
Phase 6 — Ecommerce Core Features
```

Next focus:

- Build public storefront ecommerce APIs and connect customer-facing browsing flows.
- Add cart persistence, real checkout/payment handoff, and customer order tracking.
- Keep the completed admin CRUD system stable while Phase 6 expands storefront workflows.

## Backend State

Backend location:

```text
backend/electronics
```

Backend admin APIs exist for:

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

Backend also includes:

- Admin auth with JWT.
- Payment transaction APIs.
- Return request APIs.
- VNPay and Momo webhooks.
- Cloudinary upload support.

Backend gaps:

- Public storefront APIs are not complete.
- Customer auth APIs are not complete.
- Cart APIs are not complete.
- Checkout APIs are not complete.
- Production secret management is not ready.

## Documentation State

Standard AI context files:

- `AGENTS.md`
- `ROADMAP.md`
- `CHANGELOG_AI.md`
- `docs/ai-context/PROJECT_CONTEXT.md`
- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `docs/ai-context/CODING_RULES.md`
- `docs/ai-context/FRONTEND_GUIDE.md`
- `docs/ai-context/UI_REFERENCE.md`
- `docs/ai-context/API_INTEGRATION_GUIDE.md`

## Do Not Assume

- Do not assume customer registration or public customer login APIs are implemented.
- Do not assume every admin CRUD page uses real API data.
- Do not assume public ecommerce APIs are ready.
- Do not assume checkout backend submission or real payment integration exists.
- Do not assume production deployment is ready.

## Last Updated

2026-05-10
