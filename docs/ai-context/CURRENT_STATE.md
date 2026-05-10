# CURRENT_STATE

## Purpose

This file is the current source of truth for project state.

Always update this file after meaningful work.

## Current Phase

```text
Phase 8 — Production + Deploy (Completed showcase)
```

## Current Summary

ElectronicsManagement has completed Phase 8 — Production + Deploy as a production-ready graduation showcase. The ecommerce platform is finalized for portfolio/demo presentation across storefront UX, admin operations, backend integration, payment hardening, monitoring, Docker, CI checks, deployment readiness, and final visual polish, while real hosting, TLS, external secret injection, backups, and provider credentials remain environment-specific deployment work.

The final graduation showcase polish pass improved the premium ecommerce feel, PDP presentation, checkout trust UX, admin analytics quality, subtle motion, hover states, panel depth, and micro-interactions while preserving the homepage layout, frontend architecture, and admin/client separation.

The backend now exposes public customer registration and login at `POST /api/auth/register` and `POST /api/auth/login`. Registration creates `ACTIVE` `users` records with BCrypt password hashing, optional unique phone handling, generated usernames, and safe `USER` role metadata. Customer login authenticates against `users`, returns a customer-scoped JWT session with `accountType=CUSTOMER`, and supports customer logout at `POST /api/auth/logout` without changing the existing admin/staff JWT login flow. Customer cart persistence now exists at `/api/cart` for customer JWT sessions. Admin reporting APIs now exist at `/api/admin/reports/*` for dashboard totals, revenue series, order-status breakdowns, and top products. User password reset remains future work.

The PostgreSQL demo seed in `database/test.sql` now resets and repopulates the current Hibernate-backed schema with fuller showcase data, including title-case product categories, customer carts, staff permissions matching the backend `PERM:*` contract, expanded catalog/brand coverage, order/report data, payment transactions, returns, reviews, media, and warehouse stock. Seeded carts now target active users and active in-stock variants so customer cart tests do not start with unavailable cart items.

The client storefront now includes the homepage, Product API-backed product listing and product detail, shared-cart cart and checkout, customer authentication, wishlist, recently viewed, product recommendations, order tracking, search overlay, notifications, loyalty/reward UI, and authenticated account experiences. Checkout now creates real backend orders and validates coupons through backend APIs. Wishlist now uses persistent product snapshots, optimistic UI, optional backend sync, wishlist count, move-to-cart, remove, and loading/error states. Recently viewed now uses lightweight localStorage product snapshots, duplicate prevention, clear/remove support, API-backed identity filtering, legacy mock snapshot cleanup, and a reusable responsive recommendation slider on homepage, PDP, wishlist, and profile surfaces. Product recommendations now use reusable carousel and section foundations for related products, frequently bought together, trending products, best sellers, and a recommended-for-you placeholder. The homepage hero/product grid/flash sale/trending/best-seller sections and storefront search product suggestions now use the public Product API catalog endpoint instead of hardcoded storefront product data. Frontend admin/staff authentication is connected to the backend JWT API, the admin architecture foundation exists under `frontend/src/admin`, and the `/admin/categories`, `/admin/brands`, `/admin/products`, `/admin/variants`, `/admin/media`, `/admin/orders`, `/admin/warehouse`, `/admin/coupons`, `/admin/users`, `/admin/staff`, and `/admin/roles` modules are connected to real backend APIs with table/grid, search, filters, status controls, detail views, protected actions, and pagination. The admin dashboard, revenue report, best-sellers report, and activity report now read real backend data from `/api/admin/reports/*` and `/api/admin/orders`.

<<<<<<< HEAD
The admin analytics system now includes reusable `AnalyticsFilters`, `RevenueAnalytics`, `CustomerAnalytics`, and `InventoryAnalytics` widgets with date range filters, export controls, API-backed revenue analytics, top-selling products, order status breakdowns, recent order activity, sales report breakdowns, and responsive Recharts line, area, pie, and bar charts. Dedicated customer and inventory analytics panels remain available as UI components but are not shown on the DB-backed dashboard until matching backend endpoints exist.
=======
Storefront add-to-cart now resolves real variant ids for catalog, recommendation, and wishlist product snapshots. Product catalog responses expose `defaultVariantId`, and `CartProvider` falls back to Product API detail when a product snapshot does not include a variant identity, preventing product ids from being sent as cart variant ids. Authenticated customer carts persist through `/api/cart` using the buyer id from the JWT customer principal, while guest quick-add remains local-first and is no longer blocked by customer cart-sync variant validation. Cart fetch joins avoid SQL `DISTINCT` over PostgreSQL `json` columns so adding items no longer fails with `could not identify an equality operator for type json`.

The admin analytics system now includes reusable `AnalyticsFilters`, `RevenueAnalytics`, `CustomerAnalytics`, and `InventoryAnalytics` widgets with date range filters, export placeholders, revenue analytics, top-selling products, customer analytics, conversion placeholders, inventory analytics, order trends, sales report breakdowns, and responsive Recharts line, area, pie, and bar charts.
>>>>>>> c48fa6f22f68a287cf66052c08460589e30d59a8

The storefront now has a client-side SEO foundation with reusable `SEOHead`, centralized metadata helpers, dynamic titles/descriptions, canonical URLs, Open Graph tags, Twitter cards, product metadata, JSON-LD structured data, and category routes at `/categories/:categorySlug` while keeping the homepage layout intact.

The ecommerce image system now uses an upgraded `OptimizedImage` component with shared loading state, lazy/responsive image defaults, Cloudinary `srcSet` generation, blur-up placeholders, skeleton overlays, and data-URI fallback images for product, media, brand, category, avatar, and review imagery.

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

The storefront product detail page now exists at `/products/:slug` with Product API-backed gallery, variants, quantity, purchase actions, specs, description, an advanced reviews system, shipping information, stock information, related products, loading, error, and not-found states.

The storefront product reviews system now includes reusable rating summary, review card, and review form components with review filters, sorting, authenticated write-review UI, image review placeholders, verified purchase badges, helpful vote placeholders, empty states, and load-more pagination foundation.

The frontend Product API integration uses `frontend/src/api/productMapper.js` to normalize flexible backend response shapes before they reach UI components.

The product detail gallery now supports loading skeletons, smoother image switching, stronger thumbnail active states, hover zoom, fullscreen preview, and keyboard navigation in preview mode.

The storefront header now includes a shared-cart drawer with slide-in animation, blurred backdrop, item quantity updates, remove actions, subtotal, checkout action, and animated cart count badge.

The storefront cart page now exists at `/cart` with shared local cart items, animated quantity updates, remove feedback, backend coupon validation, coupon clear/apply UX, free-shipping progress, shipping estimate, stock validation, mini recommendations, continue-shopping CTA, checkout CTA, and sticky desktop summary.

The storefront checkout page now exists at `/checkout` with authenticated checkout, customer profile prefill from User API when available, shipping address, shipping method, payment method, form validation UI, backend coupon validation, backend order creation, API loading/error states, stock validation, free-shipping progress, shipping estimate, and sticky trust-focused order summary.

Checkout now supports VNPay Sandbox and MoMo Sandbox payment handoff with signed backend payment URL/request creation, browser return handling, IPN validation, server-side status verification, paid/failed/cancelled transaction states, and customer result pages at `/payment/success` and `/payment/failed`.

The payment experience now has reusable storefront payment UI for provider trust indicators, payment processing state, transaction summaries, payment timelines, retry guidance, and COD order confirmation. Payment result pages share the `usePaymentResult` hook and `paymentStatus` helpers so COD, VNPay, and MoMo status copy and timeline logic are centralized.

The storefront customer authentication pages now exist at `/login` and `/register` with reusable dark auth layout/forms, social login placeholders, remember-me, forgot-password placeholder, local validation UI, and responsive dark glass styling. The `/login` form now calls the public customer login API outside demo mode, while `/register` calls the public customer registration API outside demo mode and keeps a local demo success path when `VITE_DEMO_MODE=true`. `/admin/login` remains on the separate admin/staff JWT endpoint.

The storefront wishlist page now exists at `/wishlist` with persistent localStorage-backed product snapshots, optional backend wishlist sync through `VITE_WISHLIST_API_PATH`, optimistic add/remove/clear behavior, move-to-cart actions, wishlist count, loading/error states, product-card quick toggles, recently viewed tracking, and reusable wishlist/recently-viewed hooks.

The storefront recently viewed system now uses `useRecentlyViewed.js` and `RecentlyViewedSection.jsx` for persistent API-backed product snapshots, duplicate prevention, legacy mock snapshot cleanup, clear history, responsive product sliders, and reuse on homepage, PDP, wishlist, and profile pages.

The storefront recommendation foundation now uses `ProductCarousel.jsx`, `RecommendationSection.jsx`, `TrendingProducts.jsx`, and `BestSellerSection.jsx` for premium ecommerce carousels, smooth scrolling controls, loading/empty/placeholder states, homepage trending/best-seller sections, PDP related/frequently-bought sections, and a profile recommended-for-you placeholder.

The storefront header now includes an advanced Product API-backed search overlay with debounced live suggestions, recent searches, trending searches, product/category/brand result previews, reusable result rows, search highlighting, category-aware and brand-aware scoring, loading/empty states, and keyboard navigation behavior.

The storefront notification foundation now includes a responsive dark header dropdown, animated unread badge, reusable notification rows, localStorage-backed `useNotifications.js`, order notifications, payment notifications, coupon notifications, a system notification placeholder, filters, and mark-as-read actions.

The frontend realtime notification foundation now includes `useRealtime.js`, `useRealtimeNotifications.js`, normalized realtime event abstractions, notification event handlers, WebSocket-first connection support through `VITE_REALTIME_WS_URL`, polling/local-event fallback, realtime toast handling, an admin notification dropdown, an admin realtime operations panel, and local event publishing from checkout, payment result, order update, and warehouse stock flows.

The authenticated storefront account area now exists at `/profile`, `/profile/orders`, `/profile/orders/:id`, and `/profile/settings` with real User Profile and User Order API integration, protected routing, profile update, order history/detail, order tracking timeline, shipment progress, estimated delivery, activity history, logout, and avatar placeholder UI.

The profile overview now includes a loyalty/reward UI foundation with `LoyaltyCard.jsx`, `RewardsWidget.jsx`, and `CouponWallet.jsx` for reward points, loyalty level, coupon wallet, special offers, and membership card placeholders without backend loyalty logic.

The customer ecommerce experience now has a reusable trust-signal foundation, stronger CTA/hover/focus interactions, shared store empty-state trust hints, improved PLP/PDP skeletons, and consistent trust indicators across homepage, PLP, PDP, cart, checkout, and profile without a homepage redesign.

The ecommerce UI/UX production polish pass now standardizes storefront hero/surface/action panels and admin page/panel/control/table treatments across homepage-adjacent ecommerce flows, PLP, PDP support sections, cart, checkout, profile, dashboard, CRUD, media, order, warehouse, role, coupon, and analytics pages while preserving the existing homepage layout.

The responsive audit now tightens laptop storefront header fit, mobile auth width containment, and admin CRUD table behavior. Admin tables now render mobile card rows below tablet widths while retaining desktop tables, and the audited client/auth/checkout/product/account/admin routes avoid document-level horizontal overflow across phone, tablet, laptop, and ultra-wide checks.

The ecommerce accessibility foundation now includes skip-to-main navigation, storefront main landmarks, reusable focus trapping for search/cart/mobile filters/product gallery overlays, clearer dialog/drawer labelling, inert collapsed menus/filters, checkout form error associations, radio semantics for shipping/payment/variants, and stronger keyboard focus states while preserving the dark theme and homepage layout.

The ecommerce loading/error/empty-state foundation now includes reusable `LoadingState`, `ProductGridSkeleton`, analytics loading skeletons, smoother route/auth loading, reduced PLP refresh flashing, improved payment verification feedback, cleaner API retry actions, and more consistent storefront/admin empty states across product, account, payment, media, warehouse, CRUD, realtime, and analytics surfaces.

The ecommerce form UX foundation now includes reusable `FormFieldMessage` and form validation helpers for inline feedback, touched/submit-attempt visibility, first-invalid-field focus, `aria-describedby` associations, and consistent disabled/submitting states across auth, checkout, profile, admin CRUD, product, coupon, variant, role, brand, and warehouse adjustment forms.

The ecommerce QA flow audit tightened customer/admin route behavior without a large rewrite. Admin/staff login redirects no longer land on customer-only checkout/account paths, category pages ignore stale category query params and route category filter controls navigate consistently, cart coupon context can carry into checkout, empty cart and invalid payment order ids are blocked before API calls, COD success clears the cart while preserving the confirmation snapshot, and paid VNPay/MoMo returns clear only the matching pending checkout cart.

The codebase maintainability cleanup centralized repeated frontend API mapper helpers and service query cleanup in `frontend/src/api/mapperUtils.js`. Admin server table pagination/reload state now has a reusable `useAdminServerTableState` hook used by Brands, Categories, Media, Orders, and Users to reduce duplicated table state without changing admin flows or the homepage.

The project documentation pass now provides a professional onboarding set across `README.md`, `DEPLOYMENT.md`, `PAYMENT.md`, `SECURITY.md`, `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/SETUP.md`, `docs/ENVIRONMENT.md`, and refreshed API/architecture/workflow docs so Phase 8 setup, routes, environment variables, payment sandbox, deployment, and security guidance are easier to follow.

The project now has a frontend demo/presentation mode gated by `VITE_DEMO_MODE=true`. Demo mode provides seeded local mock API responses for catalog browsing, checkout, payment verification, account order tracking, and admin CRUD-style screens, adds demo account quick-fill on login pages, adds an admin dashboard presentation panel, documents demo scenarios in `docs/DEMO_PRESENTATION.md`, and keeps production/default backend integration unchanged when the flag is disabled.

The frontend now has production-oriented route loading with route-level lazy loading, route preloading hooks, shared route/deferred-section loading boundaries, deferred header search/cart overlays, below-fold storefront section splitting, an optimized image component foundation, and targeted memoization for repeated ecommerce rows/carousels. The shared API client now has in-flight GET request deduplication plus opt-in TTL caching, and catalog product listing/detail flows avoid N+1 detail fetches. The production build emits route/vendor chunks instead of one large JavaScript bundle.

The frontend and backend now have a no-SaaS logging and monitoring foundation. Frontend monitoring lives under `frontend/src/monitoring` with structured client logs, a local monitoring buffer, global error tracking, API failure tracking, payment error tracking, route preload/error tracking, route-change hooks, and `X-Request-Id` propagation from the shared API client. Backend monitoring lives under `backend/electronics/src/main/java/org/example/electronics/monitoring` with structured key-value logging helpers and request correlation through `X-Request-Id`/MDC. Auth, order, payment, webhook, unauthorized, and exception flows now emit reusable structured events.

The ecommerce security hardening review added backend admin role/permission enforcement, normalized `ROLE_*` and `PERM:*` authorities, JSON `403` handling, safer JWT validation logging, no-store headers for sensitive auth/reset responses, environment-driven secrets, stricter payment callback validation, stricter media upload validation, safer frontend auth persistence, and root `SECURITY.md` documentation.

The Docker deployment foundation now includes production-oriented frontend/backend Dockerfiles, unprivileged Nginx SPA serving with `/api` proxying, root `docker-compose.yml` for frontend/backend/Postgres, a separate `docker-compose.dev.yml` for live-mounted development containers, root `.env.example`, environment-driven backend runtime settings, and root `DEPLOYMENT.md` documentation. No real deployment has been performed.

The CI/CD foundation now includes GitHub Actions workflows for frontend and backend checks under `.github/workflows/`. Frontend CI installs npm dependencies, runs lint, keeps an optional test-script placeholder, and builds the Vite app. Backend CI runs Maven wrapper tests on Java 21 with a PostgreSQL service. The workflows use path filters, concurrency, dependency caching, manual dispatch, and read-only repository permissions, with no production deployment step.

The Phase 8 production build audit tightened environment separation and build/runtime configs. Frontend production builds now default to `/api` when `VITE_API_BASE_URL` is omitted, expose production SEO/monitoring env templates, use npm consistently, and split Recharts into a lazy `charts-vendor` chunk. Docker/Compose now passes demo, SEO, monitoring, and source-map build args; Nginx enables gzip and forwards proxy headers. Backend now has `application-docker.yml`, `application-prod.yml`, production compression/graceful shutdown defaults, and a `prod` profile validator that rejects placeholder secrets, localhost/example URLs, sandbox payment endpoints, non-`validate` DDL, SQL logging, Swagger exposure, weak JWT secrets, and missing Cloudinary/payment credentials. CI now builds the frontend with production env shape, runs backend `verify`, and validates Docker Compose config in a deployment-config workflow.

The final QA stability pass verified storefront, auth, payment result, account, checkout, admin analytics, CRUD routes, and media upload flows through Vite preview demo smoke checks across desktop/mobile route coverage. Wishlist backend sync is now opt-in through `VITE_WISHLIST_API_PATH`; leaving it empty keeps the local-first wishlist stable and avoids default `/api/wishlist` 404 console noise while public wishlist APIs are not available.

The production audit added a minimal backend health/readiness API at `/api/health` and `/api/health/readiness`, wired the production backend container healthcheck to readiness, made the production Compose frontend wait for a healthy backend, hardened storefront payment result parsing for missing/invalid callback identifiers, sanitized payment callback query text before display, restricted frontend payment provider normalization to supported providers, and improved route loading fallback accessibility/responsive safety.

The Phase 6 completion review tightened customer ecommerce UX consistency across search, reviews, wishlist, recommendations, cart, checkout, order tracking, notifications, responsive behavior, animations, and performance without a large redesign. Internal storefront header and notification navigation now stays within React Router, search and wishlist states reuse cleaner shared patterns, product identity matching is centralized, PLP search normalization handles punctuation and Vietnamese/no-accent queries more consistently, and cart recommendations use the optimized image foundation.

Phase 2 cleanup normalized shared/admin visual patterns for cards, borders, shadows, hover states, focus states, icon buttons, typography usage, and responsive behavior without a large rewrite.

Frontend routing now includes client ecommerce routes and admin routes with placeholders for pages that are not implemented yet.

The frontend now has a centralized JWT-ready auth architecture with AuthProvider, auth storage helpers, auth state helpers, reusable route guards, and an auth reducer/store namespace. It supports user/admin/staff session shape, roles, permissions, access token, refresh token, authentication status, loading state, session restore, redirect memory, refresh-on-401 flow, and graceful unauthorized UI, and is now used by the real login flow.

The frontend now has a centralized role/permission system with shared route policies, sidebar filtering, reusable permission hooks, PermissionGate, and resource action policies for admin CRUD controls. ADMIN has full admin access, STAFF module access requires matching resource view permissions, and USER cannot access admin routes.

The frontend now has a centralized global feedback system with reusable toast notifications, loading toasts, loading states, API error alerts, empty states, permission-denied states, and a global React error boundary.

The completed production showcase milestone is:

```text
Phase 8 — Production + Deploy
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
- At Phase 5 completion, kept `/admin/dashboard` and `/admin/reports/*` on mock analytics/report data while aligning chart/table styling with the reusable admin dashboard components; those primary report screens were later wired to backend report APIs.

## Phase 6 Completed Items

- Built and reviewed the customer ecommerce core across search, reviews, wishlist, recommendations, cart, checkout, order tracking, notifications, loyalty placeholders, responsive polish, and performance.
- Kept the existing homepage layout intact while adding customer ecommerce polish and recommendation sections.
- Added route-level lazy loading, route loading boundaries, deferred header overlays, optimized image handling, and targeted memoization so the production build emits route chunks without the previous Vite chunk-size warning.
- Tightened Phase 6 consistency by keeping storefront header and notification links inside React Router, closing notification/mobile surfaces after navigation, improving search overlay scroll containment, and aligning PLP search normalization for Vietnamese/no-accent queries.
- Centralized reusable product identity matching in `frontend/src/utils/productIdentity.js` for recently viewed and recommendation flows.
- Reused shared store empty-state and optimized-image foundations in wishlist and cart recommendation surfaces.
- Marked Phase 6 completed and set the project ready for Phase 7 — Advanced Features & Production Systems.

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
- `/profile/orders/:id`
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

- Client storefront mock data is split across `frontend/src/data/categories.js`, `products.js`, `promotions.js`, and `services.js` for homepage/search/local flows that are not API-backed yet.
- `frontend/src/data/products.js` is retained for demo-mode seed data only; active storefront catalog surfaces use Product API data.
- `frontend/src/data/productDetails.js` remains available for legacy mock detail helpers, but `/products/:slug` now uses Product API data.
- `frontend/src/data/cart.js` remains as legacy mock cart setup, but active cart drawer, `/cart`, and `/checkout` now use `frontend/src/cart`.
- Shared cart UX helpers now live in `frontend/src/cart/cartInsights.js` for free shipping, shipping estimates, and stock validation.
- Most admin pages use `frontend/src/data/adminMock.js`; `/admin/categories`, `/admin/brands`, `/admin/products`, `/admin/variants`, `/admin/media`, `/admin/orders`, `/admin/warehouse`, `/admin/coupons`, `/admin/users`, `/admin/staff`, and `/admin/roles` now use real backend data.
- Shared data exports live in `frontend/src/data/index.js`.
- API client exists at `frontend/src/api/client.js`.
- API config exists at `frontend/src/api/apiConfig.js`.
- API error handling exists at `frontend/src/api/apiErrorHandler.js`, `normalizeApiError.js`, `apiErrorFeedback.js`, and `apiErrorEvents.js`.
- Checkout/order/coupon mapping exists at `frontend/src/api/checkoutMapper.js`.
- Account profile/order mapping exists at `frontend/src/api/accountMapper.js`.
- Product API response mapping exists at `frontend/src/api/productMapper.js`.
- Wishlist API response mapping exists at `frontend/src/api/wishlistMapper.js`.
- Media API response mapping exists at `frontend/src/api/mediaMapper.js`.
- Admin Order API response mapping exists at `frontend/src/api/orderMapper.js`.
- Warehouse API response mapping exists at `frontend/src/api/warehouseMapper.js`.
- Coupon API response mapping exists at `frontend/src/api/couponMapper.js`.
- API refresh-token handling exists at `frontend/src/api/refreshTokenService.js`.
- API service modules now exist in `frontend/src/api` for auth, categories, brands, products, variants, users, staff, roles, permissions, orders, warehouses, coupons, wishlist, and media.
- API service modules use reusable `api.*` helpers and `resourceService.js` for shared CRUD request logic.
- Admin dashboard foundation helpers live in `frontend/src/admin`.
- The shared API client reads the JWT through `frontend/src/auth/authStorage.js` using localStorage key `accessToken`.
- The shared API client reads `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, and `VITE_AUTH_REFRESH_ENDPOINT`.
- Product API integration reads `VITE_PRODUCT_API_PATH`, defaulting to the public `/products` storefront endpoint while admin CRUD stays on `/admin/products`.
- Checkout integration reads `VITE_COUPON_API_PATH`, `VITE_ORDER_API_PATH`, and `VITE_USER_API_PATH`.
- Account integration reads `VITE_USER_PROFILE_API_PATH` and `VITE_USER_ORDER_API_PATH`.
- Wishlist sync reads `VITE_WISHLIST_API_PATH`, defaulting to `/wishlist`.
- Auth session metadata is centralized through `frontend/src/auth` and currently stores safe user, roles, and permissions metadata only.
- `frontend/.env.example` documents `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_AUTH_REFRESH_ENDPOINT`, `VITE_PRODUCT_API_PATH`, `VITE_COUPON_API_PATH`, `VITE_ORDER_API_PATH`, `VITE_USER_API_PATH`, `VITE_USER_PROFILE_API_PATH`, `VITE_USER_ORDER_API_PATH`, and `VITE_WISHLIST_API_PATH`.
- Admin/staff login is connected to the backend JWT API.
- `/admin/categories`, `/admin/brands`, `/admin/products`, `/admin/variants`, `/admin/media`, `/admin/orders`, `/admin/warehouse`, `/admin/coupons`, `/admin/users`, `/admin/staff`, `/admin/roles`, `/admin/dashboard`, `/admin/reports/revenue`, `/admin/reports/best-sellers`, and `/admin/reports/activity` are connected to real backend data.

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
- Shared storefront wishlist state lives in `frontend/src/wishlist/`.
- Auth reducer exports live in `frontend/src/store/auth/`.
- Toast notification components live in `frontend/src/components/ui/toast/`.
- Feedback components live in `frontend/src/components/ui/feedback/`.
- Client homepage page lives in `frontend/src/pages/client/Home.jsx`.
- Admin pages live in `frontend/src/pages/admin/`.
- Client homepage components live in `frontend/src/components/home/`.
- Cart drawer and cart page components live in `frontend/src/components/cart/`, including reusable free-shipping progress, stock validation, and cart recommendation components.
- Checkout components live in `frontend/src/components/checkout/`.
- Account components live in `frontend/src/components/account/`.
- Customer auth components live in `frontend/src/components/auth/`.
- Search overlay components live in `frontend/src/components/search/`.
- Client layout components live in `frontend/src/components/layout/`.
- Product components live in `frontend/src/components/product/`, including listing filters, search, sorting, active filters, empty state, pagination, detail gallery, product info, variants, quantity, specs, reviews, rating summary, review cards, review form, related products, recommendation carousels, and reusable product cards.
- Product listing API state logic lives in `frontend/src/hooks/useProducts.js`.
- Product detail API state logic lives in `frontend/src/hooks/useProductDetail.js`.
- Checkout coupon, order creation, and profile prefill logic lives in `frontend/src/hooks/useCheckoutCoupon.js`, `useCheckoutOrder.js`, and `useCheckoutProfile.js`.
- Authenticated account profile state logic lives in `frontend/src/hooks/useAccountProfile.js`.
- Wishlist state access lives in `frontend/src/hooks/useWishlist.js`, backed by `frontend/src/wishlist/WishlistProvider.jsx`; recently viewed local state logic lives in `frontend/src/hooks/useRecentlyViewed.js`.
- Reusable recently viewed UI lives in `frontend/src/components/product/RecentlyViewedSection.jsx`.
- Reusable recommendation UI lives in `frontend/src/components/product/ProductCarousel.jsx`, `RecommendationSection.jsx`, `TrendingProducts.jsx`, and `BestSellerSection.jsx`.
- Storefront search overlay logic lives in `frontend/src/hooks/useSearch.js`, with recent-search persistence in `frontend/src/hooks/useRecentSearches.js`.
- Skeleton loading components live in `frontend/src/components/skeletons/`.
- Admin layout components live in `frontend/src/admin/layouts/`, with legacy compatibility exports preserved through `frontend/src/layouts/AdminLayout.jsx`.
- Shared reusable UI components live in `frontend/src/components/ui/`.
- Shared feedback components include `GlobalErrorBoundary`, `ApiErrorAlert`, `EmptyState`, and `PermissionDenied`.
- Admin-specific reusable UI components live in `frontend/src/components/ui/admin/`.
- Design tokens live in `frontend/src/styles/tokens.js`.
- The primary theme object lives in `frontend/src/styles/theme.js`.
- Motion presets live in `frontend/src/styles/animations.js`.
- Shared product identity helpers live in `frontend/src/utils/productIdentity.js`.
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
- Header search now opens the advanced Product API-backed search overlay on desktop and mobile.
- Homepage background, hero banner, promo cards, category cards, service bar, and section separators now have deeper production ecommerce visual polish.
- Homepage now includes a short mock loading state demo that renders dark shimmer skeletons before showing mock data.
- Homepage responsive audit has been completed across mobile, tablet, desktop, and ultra-wide viewports.
- Mobile homepage keeps the hamburger menu, a compact stacked hero, two-column product/category grids, and tighter product card wrapping.
- Tablet homepage now has a balanced hero, promo, service, and category layout with reduced empty space.
- Desktop and ultra-wide homepage still preserve the three-column hero structure and centered max-width layout.
- `/` still renders the existing homepage.
- `/products` now renders the Product API-backed product listing page.
- `/products/:slug` now renders the Product API-backed product detail page.
- `/cart` now renders the shared-cart cart page with backend coupon validation, animated quantity interactions, free-shipping progress, shipping estimate, stock validation, mini recommendations, and a sticky summary.
- `/checkout` now renders the authenticated customer checkout page behind `ProtectedRoute`, creates backend orders through `POST /api/orders`, and includes free-shipping progress, stock validation, shipping estimate, improved coupon UX, and a sticky trust-focused summary.
- `/login` now renders the dark auth page and submits through `authService.login()` to `POST /api/auth/login`.
- `/register` is guest-only and now submits customer account creation to `POST /api/auth/register` outside demo mode; demo mode keeps local success behavior for presentations.
- `/wishlist` now renders the production-style persistent wishlist and recently viewed page with optional backend sync, optimistic actions, move-to-cart, remove item, clear, sync status, loading states, and API error fallback.
- The homepage, PDP, wishlist page, and profile overview now render the reusable recently viewed products slider when local history exists, with an empty-state placeholder when appropriate.
- The homepage now appends trending and best-seller recommendation carousels after the existing storefront sections without changing the hero or core homepage layout.
- The PDP now renders reusable recommendation carousels for related products and frequently bought together products.
- The profile overview now includes a recommended-for-you placeholder using the shared recommendation section foundation.
- `/profile`, `/profile/orders`, `/profile/orders/:id`, and `/profile/settings` now render the protected customer account area with real profile/order APIs and a dedicated order tracking detail experience.
- Client routes beyond homepage, product listing, product detail, cart, checkout, payment result, login, register, wishlist, and profile routes that are not fully implemented render dark ecommerce placeholder pages.
- `/admin/login` now renders the dark premium admin auth page and submits through `authService.login()` to `POST /api/admin/auth/login`.
- `/admin/*` routes are protected by `StaffRoute`; unauthenticated users are redirected to `/admin/login`.
- `/admin/users`, `/admin/staff`, and `/admin/roles` are additionally protected by `AdminRoute`.
- Admin route access, sidebar visibility, page access, and shared CRUD action buttons now use centralized role/permission policies.
- STAFF sessions need matching resource view permissions for module access; USER sessions are blocked from admin routes; ADMIN sessions have full admin access.
- `/admin` redirects to `/admin/dashboard` after admin route authentication passes.

Latest validation:

- `mvn test`, `npm run lint`, `npm run build`, and `git diff --check` passed after adding the separate customer login/logout API and frontend customer/admin auth split. `mvn test` still printed the known local PostgreSQL `media.display_order` DDL warning; `git diff --check` reported only CRLF normalization warnings.
- `npm run lint`, `npm run build`, and `git diff --check` passed after the final graduation showcase polish. `git diff --check` reported only existing CRLF normalization warnings for edited files.
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
- Earlier backend test runs exposed ApplicationContext/schema issues; the latest `mvn test` validation now passes, while the local PostgreSQL `media.display_order` DDL warning remains.
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
- `npm run lint`, `npm run build`, and `git diff --check` passed after building the Product Reviews System. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build`, and `git diff --check` passed after upgrading the Wishlist System. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Local Vite route smoke checks returned `200` for `/wishlist` and `/products` after upgrading the Wishlist System.
- `npm run lint`, `npm run build`, and `git diff --check` passed after building the Recently Viewed Products system. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Local Vite route smoke checks returned `200` for `/`, `/products/:slug`, `/profile`, and `/wishlist` after adding the reusable recently viewed slider.
- `npm run lint`, `npm run build`, and `git diff --check` passed after building the Product Recommendation System foundation. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Local Vite route smoke checks returned `200` for `/`, `/products/:slug`, and `/profile` after adding recommendation carousels and placeholders.
- `npm run lint` and `npm run build` passed after upgrading Cart & Checkout UX. Build still reports the existing Vite chunk-size warning.
- Local Vite route smoke checks returned `200` for `/cart` and `/checkout` after upgrading Cart & Checkout UX.
- `npm run lint`, `npm run build`, and `git diff --check` passed after building the Order Tracking experience. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- Local Vite route smoke checks returned `200` for `/profile/orders` and `/profile/orders/1` after adding the order tracking detail route.
- `mvn spring-boot:run` reached Tomcat startup after the Jackson fix; the verification process was stopped after confirming startup.
- Backend startup still logs local PostgreSQL `ddl-auto` warnings for legacy/non-null schema drift in `media`, `products`, `users`, `variants`, and `warehouse_*` tables.
- Build still reports a Vite chunk-size warning for a JavaScript bundle over 500 kB.
- `npm run lint`, `npm run build`, and `git diff --check` passed after building the Notification System foundation. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.
- `npm run lint` and `npm run build` passed after building the customer loyalty/reward UI foundation. Build still reports the existing Vite chunk-size warning.
- `npm run lint`, `npm run build`, `git diff --check`, and local route smoke checks passed for `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, and `/profile` after customer ecommerce experience polish. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build`, `git diff --check`, dependency duplication checks with `npm ls`, and local route smoke checks passed after frontend performance optimization. The main production JS chunk is about 496 kB, route chunks are emitted, and the previous Vite chunk-size warning is gone.
- `npm run lint`, `npm run build`, `git diff --check`, targeted dependency duplication checks with `npm ls react react-dom framer-motion lucide-react`, and local route smoke checks passed after the Phase 6 ecommerce review and completion polish. `git diff --check` still reports only CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build`, and `mvn -q -DskipTests compile` passed after integrating the VNPay Sandbox payment flow.
- `npm run lint`, `npm run build`, `mvn -q -DskipTests compile`, and `git diff --check` passed after integrating the MoMo Sandbox payment flow.
- `npm run lint` and `npm run build` passed after polishing the storefront payment experience.
- `npm run lint` and `npm run build` passed after building the realtime notification foundation.
- `npm run lint`, `npm run build`, and `git diff --check` passed after upgrading the Admin Analytics System. The build completed without the Vite chunk-size warning after analytics mock data was isolated in an admin lazy chunk; `git diff --check` reported only CRLF normalization warnings for edited files.
- `npm run lint`, `npm run build`, and `git diff --check` passed after adding the storefront SEO foundation. `git diff --check` reported only CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build`, `git diff --check`, and local route smoke checks passed after upgrading the ecommerce image system. Smoke checks returned `200` for `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/admin/media`, and `/admin/products`; `git diff --check` reported only CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build`, `git diff --check`, targeted dependency duplication checks with `npm ls react react-dom framer-motion lucide-react recharts axios`, and local route smoke checks passed after the production frontend architecture optimization. The main app chunk is about 105 kB, React/router/motion/http are cacheable vendor chunks, Product Detail route chunk is about 34 kB, and PLP/PDP catalog flows no longer issue per-product detail requests for listing cards.
- `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and `mvn test` passed after adding the frontend/backend logging and monitoring foundation. `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning.
- `npm run lint`, `npm run build`, `mvn -q -DskipTests compile`, and `mvn test` passed after the ecommerce security hardening review. `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning.
- Docker Compose config validation now covers the production-like `docker-compose.yml` and development `docker-compose.dev.yml` files through `.env.example`; `npm run build`, `mvn -q -DskipTests compile`, `mvn test`, and `git diff --check` also passed after the Docker deployment foundation. Docker image build was blocked because the local Docker Desktop Linux engine was not running.
- GitHub Actions CI workflow files were added for frontend and backend checks; local validation covered Prettier workflow YAML checking, frontend lint/test-placeholder/build, backend tests, and `git diff --check`.
- The Phase 7 production audit completed with backend health/readiness probes, Docker backend readiness healthcheck wiring, safer payment result callback parsing/display, supported-provider frontend payment normalization, accessible route loading fallback polish, and Phase 7 completion documentation.
- `npm run lint`, `npm run build`, `mvn -q -DskipTests compile`, `mvn test`, and production `docker compose --env-file .env.example config` passed after the Phase 7 production audit. `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning.
- `npm run lint`, `npm run build`, and `git diff --check` passed after the ecommerce UI/UX production polish pass. `git diff --check` reported only CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build`, `git diff --check`, and Playwright responsive smoke checks passed after the full responsive experience audit. `git diff --check` reported only CRLF normalization warnings for edited frontend files.
- `npm run lint` and `npm run build` passed after the ecommerce accessibility foundation pass.
- `npm run lint` and `npm run build` passed after the loading/error/empty-state foundation audit.
- `npm run lint`, `npm run build`, and `git diff --check` passed after the system form UX audit. `git diff --check` reported only CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build`, `git diff --check`, and Vite preview route smoke checks passed after the ecommerce QA flow audit. Smoke checks returned `200` for storefront, auth, checkout/payment, profile, and admin routes; `git diff --check` reported only CRLF normalization warnings for edited frontend files.
- `npm run lint`, `npm run build:production`, `mvn test`, `mvn -DskipTests package`, production/development `docker compose config`, and `git diff --check` passed after the Phase 8 production build audit. Maven commands required network/cache access outside the sandbox to resolve dependencies, `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning, and Docker Compose config printed a local Docker credential-file access warning while returning success.
- `npm run lint`, `npm run build:production`, `mvn test`, production/development Docker Compose config rendering, `git diff --check`, and Playwright-powered Vite preview smoke checks passed after the final QA pass. Smoke coverage included storefront, auth, payment result, account, checkout, admin analytics, admin CRUD routes, category create, and media upload; `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning.
- `mvn -q -DskipTests compile`, `mvn test`, `npm run lint`, `npm run build`, `git diff --check`, and local dev server smoke checks passed after adding customer cart persistence. A no-auth request to `GET /api/cart` returns `401` as expected.
- `mvn -q -DskipTests compile`, `mvn test`, `git diff --check`, and no-token `GET /api/admin/reports/dashboard` returning `401` passed after adding backend admin reporting APIs.
- `npm run lint`, `npm run build`, and `git diff --check` passed after expanding `database/test.sql` and updating title-case category labels. Local `psql` is not installed, so the seed script was not executed through PostgreSQL CLI in this environment.
- `mvn -q -DskipTests compile`, `mvn test`, `npm run lint`, `npm run build`, and `git diff --check` passed after adding the public storefront product catalog endpoint and replacing homepage/search product data with Product API data. `git diff --check` reported only LF-to-CRLF normalization warnings.
- `npm run lint`, `npm run build`, and `git diff --check` passed after removing the recently viewed hardcoded/mock fallback and adding legacy localStorage snapshot cleanup. `git diff --check` reported only LF-to-CRLF normalization warnings.
- `npm run lint`, `npm run build`, and `git diff --check` passed after wiring admin dashboard, revenue, best-sellers, and activity report pages to Admin Report and Order APIs. `git diff --check` reported only LF-to-CRLF normalization warnings.

## Known Issues

- Admin dashboard, revenue, best-sellers, and activity report pages are API-backed; deeper customer and inventory analytics still need dedicated backend report endpoints before those panels can show real DB data.
- Backend audit and follow-up implementation confirm Customer Register exists at `POST /api/auth/register`, Customer Login exists at `POST /api/auth/login`, Customer Cart exists at `/api/cart`, and Admin Reports exist at `/api/admin/reports/*`; User Password Reset does not exist yet.
- Remaining future client ecommerce routes beyond the implemented homepage, product listing, product detail, cart, checkout, login, register, and wishlist pages are styled placeholders.
- Public storefront product browsing now exists at `GET /api/products`, `GET /api/products/{productId}`, and `GET /api/products/{productId}/reviews`; customer-owned resource contracts beyond catalog browsing still need tightening.
- Customer cart persistence is implemented for customer JWT sessions; production deployments still need controlled database migration/backfill for the new `carts` and `cart_items` tables when using `ddl-auto=validate`.
- A dedicated backend wishlist persistence API is not implemented in the current backend; the frontend wishlist uses local persistence and optional sync when `VITE_WISHLIST_API_PATH` points to a compatible API.
- Product recommendation sections currently use local/mock heuristics only; no real recommendation API or AI recommendation engine is connected.
- Public customer registration/login exists; customer-owned resource checks still need tightening across checkout, profile, orders, cart, and wishlist contracts.
- Client checkout/profile routes are customer-session only in the frontend; backend account ownership enforcement should still be tightened now that public customer JWT tokens exist.
- The frontend refresh-token flow is ready, but the current backend admin auth controller only exposes login/logout; real refresh requires backend `refreshToken` response support and `POST /admin/auth/refresh`.
- `/checkout` is frontend-auth protected and creates backend orders with VNPay Sandbox and MoMo Sandbox handoff; production payment credentials, deployed return URLs, and customer-auth ownership enforcement are not production-ready.
- Backend config now uses environment placeholders for secrets, but real production secret injection and rotation are not configured.
- A backend `prod` profile validator now rejects placeholder/sandbox/local production configuration, but real production secrets, provider credentials, TLS hosts, and external secret injection are still deployment-time work.
- Backend local startup may fail if port `8080` is occupied by another local service; run on another port or free `8080`.
- Existing local PostgreSQL schema is partially legacy and still needs controlled migration/backfill for non-auth tables instead of relying on Hibernate `ddl-auto:update`.
- Backend Category API currently does not expose `description` in request/response DTOs; category description in admin UI is session-level until backend contract is extended.
- Build output is valid after route splitting; Recharts remains isolated in the lazy admin analytics/report chunk instead of the storefront entry path.
- A production realtime backend endpoint is not connected yet; the frontend realtime foundation uses `VITE_REALTIME_WS_URL` when available and otherwise falls back to local queued events/polling.
- SEO metadata is client-side only in the current SPA; SSR/prerendering is not implemented yet, and the default Open Graph image remains a placeholder until final brand assets exist.

## Next Phase

```text
Post-Phase 8 — Showcase Maintenance + Deployment Handoff
```

Next focus:

- Keep the finalized ecommerce showcase stable for portfolio/demo presentation.
- Treat real production hosting, TLS, external secrets, backups, and production payment credentials as environment handoff tasks.
- Continue future customer ownership, wishlist persistence, password reset, and dedicated customer/inventory analytics API work without destabilizing the finalized showcase.

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
- Reports / Analytics

Backend also includes:

- Admin auth with JWT.
- Customer auth and persisted cart APIs.
- Admin report APIs for dashboard totals, revenue series, order status breakdowns, and top products.
- Payment transaction APIs.
- Return request APIs.
- VNPay and Momo webhooks.
- VNPay Sandbox and MoMo Sandbox checkout handoff APIs.
- Cloudinary upload support.
- Structured logging helpers and request correlation through `X-Request-Id`/MDC for production observability groundwork.
- Public health/readiness probes at `/api/health` and `/api/health/readiness`.
- Docker and production Spring profiles with fail-fast production configuration validation.

Backend gaps:

- Public storefront APIs are not complete.
- Customer registration/login APIs and customer cart persistence APIs exist; password reset APIs are not complete.
- Customer cart APIs are available at `/api/cart` for customer JWT sessions.
- Customer register/login, cart persistence, and admin reports exist as dedicated backend modules; user password reset is not implemented as a dedicated backend module yet.
- VNPay Sandbox and MoMo Sandbox handoff exist for checkout orders; production payment credentials, deployed return URLs, and public checkout ownership contracts are not complete.
- Production secret values and deployment-time secret injection still need environment-specific setup, even though the `prod` profile now rejects obvious placeholders and sandbox/local URLs.
- Docker Compose can run local production-like and development stacks, but real production deployment has not been performed.

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

- Do not assume customer-owned resource checks are complete; public customer registration/login exists at `POST /api/auth/register` and `POST /api/auth/login`.
- Do not assume every admin CRUD page uses real API data.
- Do not assume public ecommerce APIs are ready.
- Do not assume production payment integration or customer-owned resource checks are complete.
- Do not assume production deployment is ready beyond the local Docker foundation.

## Last Updated

2026-05-11
