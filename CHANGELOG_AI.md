# CHANGELOG_AI

## Purpose

This changelog records AI-assisted project context, documentation, and implementation changes.

Always update this file after meaningful work.

## 2026-05-11

### Admin Report Frontend API Wiring

- Connected `/admin/dashboard`, `/admin/reports/revenue`, `/admin/reports/best-sellers`, and `/admin/reports/activity` to real Admin Report and Order APIs.
- Added `reportService`, `reportMapper`, and `useAdminReportDashboard` for API-backed dashboard KPIs, revenue analytics, top products, status mix, recent orders, and order-derived activity.
- Removed mock analytics imports from the admin dashboard/report page entrypoints while preserving loading, error, retry, and empty states.
- Verified `npm run lint`, `npm run build`, and `git diff --check`; `git diff --check` reported only LF-to-CRLF normalization warnings.

### Recently Viewed Hardcoded Cleanup

- Removed the remaining hardcoded/mock catalog fallback from `useRecentlyViewed.js`.
- Added filtering and storage cleanup for legacy `P001`-style localStorage product snapshots so the homepage "Tiếp tục xem sản phẩm" section only keeps API-backed product identities.
- Verified `npm run lint`, `npm run build`, and `git diff --check`; `git diff --check` reported only LF-to-CRLF normalization warnings.

## 2026-05-10

### Storefront Product Catalog API

- Added public read-only storefront product catalog endpoints at `GET /api/products`, `GET /api/products/{productId}`, and `GET /api/products/{productId}/reviews`, restricted to ACTIVE products.
- Split storefront catalog reads from admin Product Management so frontend catalog defaults to `/products` while admin CRUD stays on `/admin/products`.
- Replaced hardcoded storefront product usage on the homepage hero/product grid/flash sale/trending/best-seller sections, search product suggestions, PDP bundle fallback, and cart recommendations with Product API data.
- Kept `frontend/src/data/products.js` only for demo-mode seeding when `VITE_DEMO_MODE=true`.
- Verified `mvn -q -DskipTests compile`, `mvn test`, `npm run lint`, `npm run build`, and `git diff --check`; `git diff --check` reported only existing LF-to-CRLF normalization warnings.

### Database Seed Expansion

- Expanded `database/test.sql` into a fuller PostgreSQL reset seed for the current Hibernate schema, including customer carts, cart items, richer permissions, staff role permission mappings, 25 users, 24 brands, 138 products, 138 variants, media rows, warehouse stock, 55 orders, generated reviews, return requests, and payment transactions.
- Updated storefront/admin/demo category display labels to title-case Vietnamese labels while preserving slugs and homepage layout.
- Added title-case category aliases to product mapping fallbacks and refreshed AI context category label references.
- Verified `npm run lint`, `npm run build`, and `git diff --check`; local `psql` is not installed, so the seed file was reviewed statically but not executed through PostgreSQL CLI in this environment.

### Admin Report API

- Added backend Admin Report APIs at `/api/admin/reports/dashboard`, `/api/admin/reports/revenue`, `/api/admin/reports/order-status`, and `/api/admin/reports/top-products`.
- Added `AdminReportController`, `AdminReportService`, report response DTOs, `ReportGroupBy`, and a report-focused `OrderRepository` query with order detail/product/category/brand fetches.
- Added dashboard totals, day/month/year revenue buckets, order-status breakdowns, and top-product aggregates based on completed or paid revenue-eligible orders.
- Updated Spring Security so report endpoints are available to ADMIN and staff with dashboard, revenue report, best-seller report, or order view permissions.
- Updated API/context docs to reflect that backend reporting APIs now exist while the current frontend analytics widgets still need wiring.
- Verified `mvn -q -DskipTests compile`, `mvn test`, `git diff --check`, and no-token `GET /api/admin/reports/dashboard` returning `401`.

### Customer Cart Persistence API

- Added persisted customer cart backend support with `carts` and `cart_items` entities, `CartRepository`, request/response DTOs, `UserCartService`, and `/api/cart` endpoints for get, replace, add, update, remove, and clear.
- Protected `/api/cart` with customer JWT authorities while preserving existing admin/staff security rules.
- Added `frontend/src/api/cartMapper.js` and `cartService.js`, plus `VITE_CART_API_PATH=/cart` env defaults.
- Updated `CartProvider` so guest/demo/admin carts stay local while authenticated customer carts merge local and remote items and sync to the backend.
- Verified `mvn -q -DskipTests compile`, `mvn test`, `npm run lint`, `npm run build`, `git diff --check`, and local dev servers on `8081`/`5185` after implementation.

### Customer Login API

- Added separate public `POST /api/auth/login` for storefront customer accounts and `POST /api/auth/logout` for customer token invalidation.
- Added customer login request/response DTOs, `CustomerDetails`, `CustomerDetailsService`, customer-only authorities, and JWT `accountType` handling so customer tokens load the customer principal while existing admin/staff tokens remain supported.
- Updated Spring Security to keep customer login/register public, protect customer logout with customer authorities, and leave admin/staff auth rules unchanged.
- Updated `authService.login()` so `/login` calls the customer endpoint and `/admin/login` keeps `POST /api/admin/auth/login`; demo mode now keeps customer/admin surfaces separate.
- Added focused customer login service tests and refreshed auth/API/security docs.
- Verified `mvn test`, `npm run lint`, `npm run build`, and `git diff --check`; Maven still prints the known local PostgreSQL `media.display_order` DDL warning.

### Customer Registration API

- Added public `POST /api/auth/register` for customer self-registration without changing the existing admin/staff JWT login flow.
- Added customer register request/response DTOs, customer auth controller/service, BCrypt password hashing, generated unique usernames, email/phone uniqueness checks, optional phone handling, and safe `USER` role metadata in the response.
- Updated Spring Security to permit the customer register endpoint publicly under `/api/auth/register`.
- Connected the storefront `/register` form to the new API outside demo mode while preserving demo-mode local success behavior.
- Added focused customer registration service tests and verified `mvn test`; the run still prints the known local PostgreSQL `media.display_order` DDL warning.

### Backend API Gap Audit

- Audited the Spring Boot backend for Customer Register, Customer Cart, User Password Reset, and Analytics/Report API coverage after reading the required project and AI context docs.
- Confirmed at audit time that no dedicated customer registration endpoint, cart persistence endpoint, user password reset endpoint, or analytics/report controller/service/repository/DTO module existed yet.
- Identified related existing foundations: User/Profile/Order APIs, admin user/staff management, admin staff reset-password, order/payment/warehouse/coupon data models, and admin list/filter APIs.
- Documented that future implementation should preserve existing admin JWT auth, add public customer auth rules carefully, and keep frontend demo mode untouched.

### Final Graduation Showcase Polish

- Added a final production-quality visual polish pass across the storefront, PDP, checkout, admin dashboard, and admin analytics without restructuring the homepage or changing frontend/admin architecture.
- Improved premium ecommerce depth through shared sheen/lighting utilities, subtle hover states, reduced-motion safety, homepage hero trust cues, promo/category/service card micro-interactions, and stronger product-card presentation.
- Polished PDP and checkout trust UX with refined gallery/info/spec panels, verified-payment messaging, checkout progress cues, stronger order-summary hierarchy, and richer selector feedback.
- Polished admin SaaS quality with a softer app background, elevated admin panels, dashboard showcase status, improved analytics filters/cards, KPI hover polish, and clearer metric scanability.
- Marked Phase 8 completed, the ecommerce platform finalized, and the production-ready showcase completed.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after the polish pass; `git diff --check` reported only CRLF normalization warnings for edited files.

### Final QA Stability Pass

- Ran a final QA pass across client ecommerce, admin dashboard, auth, payment result pages, uploads, CRUD flows, analytics, and responsive route coverage without redesigning the homepage.
- Made wishlist backend sync opt-in through `VITE_WISHLIST_API_PATH`; empty env values now keep wishlist local-first and avoid default `/api/wishlist` 404 console noise before a public wishlist API exists.
- Updated root/frontend env templates, Docker Compose build args, `docs/ENVIRONMENT.md`, and `docs/ai-context/API_INTEGRATION_GUIDE.md` to document the optional wishlist backend path.
- Verified Vite preview smoke checks for 35 storefront/customer/admin routes with no console/page/runtime errors, plus category create and media upload demo flows.
- Verified `npm run lint`, `npm run build:production`, `mvn test`, production/development Docker Compose config rendering, and `git diff --check`; `mvn test` still printed the known local PostgreSQL `media.display_order` DDL warning.

### Production Build Audit

- Audited frontend build, backend build, bundle size, env handling, Docker configs, CI configs, API URLs, Cloudinary config, and VNPay/MoMo payment config for Phase 8 production readiness.
- Added root and frontend `.env.production.example` templates, expanded local env examples, and kept production secrets as explicit placeholders only.
- Changed frontend production API fallback to `/api`, added production build scripts, optional source-map handling, configurable site/OG metadata env, and npm-only lockfile usage.
- Split Recharts into a lazy `charts-vendor` chunk, reducing the admin analytics mock chunk from about 432 kB to about 43 kB while keeping charts lazy-loaded.
- Added backend `application-docker.yml`, `application-prod.yml`, and a `prod` profile validator for placeholder secrets, non-HTTPS/local/example URLs, sandbox payment endpoints, Cloudinary credentials, CORS, Swagger, SQL logging, JWT strength, and `ddl-auto=validate`.
- Updated Docker/Compose/Nginx with production build args for demo/SEO/monitoring/source maps, gzip, and forwarded proxy headers.
- Updated GitHub Actions so frontend CI builds with production env shape, backend CI runs Maven `verify`, and deployment config CI validates Docker Compose rendering.
- Fixed the Windows Maven wrapper symlink-target check and removed the stale `pnpm-lock.yaml`.
- Verified `npm run lint`, `npm run build:production`, `mvn test`, `mvn -DskipTests package`, Docker Compose config rendering, and `git diff --check`; Maven needed network/cache access outside the sandbox, `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning, and Docker config rendering printed a local Docker credential-file warning while returning success.

### Demo Presentation Mode

- Added a frontend demo/presentation mode gated by `VITE_DEMO_MODE=true`.
- Added seeded local mock API handling for storefront catalog browsing, product detail/reviews, checkout, coupon validation, VNPay/MoMo-style payment success verification, account profile/order tracking, and admin CRUD-style demo resources.
- Added demo customer/admin/staff accounts with login quick-fill buttons and an admin dashboard presentation runbook panel.
- Added `docs/DEMO_PRESENTATION.md`, updated README/environment examples, and refreshed AI context docs.
- Verified `npm run lint` and `npm run build`.

### Project Documentation Pass

- Rebuilt `README.md` into a professional onboarding guide with project overview, tech stack, screenshots placeholders, setup/run commands, client/admin route maps, API links, and payment sandbox notes.
- Expanded root `DEPLOYMENT.md`, `SECURITY.md`, and added root `PAYMENT.md` for production-like local deployment, security posture, and VNPay/MoMo sandbox workflows.
- Added `docs/SETUP.md`, `docs/ENVIRONMENT.md`, `docs/API.md`, and `docs/ARCHITECTURE.md` as focused onboarding entry points.
- Refreshed `docs/api/ENDPOINTS.md`, `docs/api/AUTH.md`, `docs/api/ERROR_FORMAT.md`, architecture docs, backend security docs, and workflow docs to match the current Phase 8 state.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified documentation consistency with targeted `rg` checks and `git diff --check`.

### Codebase Maintainability Cleanup

- Audited frontend/backend code organization for duplicated API mapper helpers, repeated service query cleanup, oversized admin CRUD pages, and repeated server table state.
- Added `frontend/src/api/mapperUtils.js` and moved common unwrap, page-item/page-meta, array, number, status, and `cleanParams` helpers out of individual mappers/services.
- Updated product, category, brand, variant, media, coupon, order, account, wishlist, payment, warehouse, and admin people mappers/services to reuse the shared API utilities.
- Added `useAdminServerTableState` for admin server pagination, page-size resets, page metadata, and reload handling.
- Applied the shared table state hook to Brands, Categories, Media, Orders, and Users while preserving existing flows and UI layout.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build`.

### Ecommerce QA Flow Audit

- Audited customer ecommerce and admin flows across register, login, search, product browsing, cart, checkout, payment result, order tracking routes, admin CRUD, media upload, and permissions.
- Fixed login redirect handling so admin/staff sessions do not return to customer-only checkout/account routes after authentication.
- Fixed category route browsing so `/categories/:categorySlug` wins over stale `category` query params and category filter controls navigate consistently.
- Carried applied cart coupons into checkout, blocked empty-cart order payloads, and rejected invalid payment order ids before opening VNPay/MoMo sessions.
- Cleared cart state after COD success while preserving the visible order confirmation snapshot, and clear carts after paid VNPay/MoMo returns only when they match the pending checkout order.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and Vite preview route smoke checks; `git diff --check` reported only CRLF normalization warnings for edited frontend files.

### System Form UX Audit

- Audited login/register, checkout, admin CRUD, product, coupon, profile, role, variant, and warehouse adjustment forms.
- Added reusable `FormFieldMessage` and form validation helpers for inline feedback, touched/submit-attempt visibility, `aria-describedby`, and first-invalid-field focus.
- Improved submit loading, disabled states, focus states, and modal/drawer labelling without changing the homepage layout or dark storefront theme.
- Preserved the existing frontend/admin architecture and applied the pattern through existing form components instead of rewriting flows.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, and `git diff --check`; `git diff --check` reported only CRLF normalization warnings for edited frontend files.

### Loading Error Empty State Foundation

- Audited API, product, auth, payment, admin, and analytics loading/error/empty states.
- Added reusable `LoadingState`, `ProductGridSkeleton`, and admin analytics skeleton foundations.
- Improved route/auth loading, PLP refresh transitions, product/account loading semantics, payment verification feedback, API retry actions, admin table loading copy, and shared empty states.
- Preserved the dark storefront theme, admin styling, and existing homepage layout.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build`.

### Ecommerce Accessibility Foundation

- Audited storefront semantic structure, headings, buttons, form labels, keyboard navigation, focus states, contrast-sensitive helpers, and modal/drawer behavior.
- Added skip-to-main navigation and main landmarks across customer ecommerce pages.
- Added reusable focus trapping for storefront search, cart drawer, mobile filters, and product gallery preview.
- Improved dialog/drawer labelling, inert collapsed mobile menus and filter groups, checkout/auth form error associations, and radio semantics for shipping, payment, variants, and filters.
- Preserved the dark storefront design and existing homepage layout.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build`.

### Responsive Experience Audit

- Audited client, auth, checkout, product, account, and admin routes across phone, tablet, laptop, and ultra-wide viewports.
- Fixed laptop storefront header crowding by using compact labels/icon-only secondary actions at narrower desktop widths.
- Fixed mobile auth width containment so long admin/auth titles and forms do not clip horizontally.
- Added mobile card rendering to shared admin CRUD tables while preserving desktop table layouts.
- Added shared button text safety for tighter mobile and tablet controls.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and Playwright responsive smoke checks; `git diff --check` reported only CRLF normalization warnings for edited frontend files.

### Ecommerce UI UX Production Polish

- Reviewed storefront and admin UI/UX as a production design audit covering spacing, typography, hover states, animation consistency, color, shadows, borders, hierarchy, trust cues, and ecommerce quality.
- Added shared storefront hero/surface/action panel utilities for consistent dark premium ecommerce surfaces without changing the homepage layout.
- Added shared admin page/panel/control/table utilities for cleaner SaaS dashboard rhythm, hover/focus behavior, borders, and shadows.
- Polished PLP, PDP support sections, cart, checkout, profile, wishlist, admin dashboard, CRUD pages, media management, order detail, warehouse, roles, coupons, and analytics surfaces.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, and `git diff --check`; `git diff --check` reported only CRLF normalization warnings for edited frontend files.

### Phase 7 Production Audit And Completion

- Reviewed the ecommerce platform as a production audit across frontend architecture, backend integration, payment flows, admin system, ecommerce UX, performance, security, responsive quality, duplication, error handling, loading states, consistency, and deployment readiness.
- Added backend `/api/health` and `/api/health/readiness` probes with no sensitive config exposure.
- Allowed health probes through Spring Security and wired the production backend Docker healthcheck to readiness.
- Made production `docker-compose.yml` wait for a healthy backend before starting the frontend service.
- Hardened storefront payment result handling for missing/invalid callback order ids, sanitized callback query text before display, and restricted frontend payment provider normalization to supported providers.
- Improved route loading fallback accessibility and responsive text safety without changing large sections or the homepage layout.
- Updated AI context docs, `ROADMAP.md`, `AGENTS.md`, and `DEPLOYMENT.md`.
- Marked Phase 7 completed and the ecommerce platform production-ready foundation completed.
- Verified `npm run lint`, `npm run build`, `mvn -q -DskipTests compile`, `mvn test`, and production `docker compose --env-file .env.example config`. `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning.

### CI CD Foundation

- Added `.github/workflows/frontend-ci.yml` for frontend dependency install, lint, optional test script placeholder, and production build.
- Added `.github/workflows/backend-ci.yml` for backend Maven wrapper tests on Java 21 with a PostgreSQL service.
- Added GitHub Actions concurrency, path filters, manual dispatch, read-only repository permissions, and dependency caching for a scalable CI structure.
- Kept the workflows limited to checks only; no production deployment step was added.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run test --if-present`, `npm run build`, `mvn test`, Prettier workflow YAML check, and `git diff --check`.

### Docker Deployment Foundation

- Added production-oriented Dockerfiles for the React/Vite frontend and Spring Boot backend.
- Added unprivileged Nginx serving for the frontend with SPA fallback, static asset caching, security headers, and `/api` proxying to the backend service.
- Added root `docker-compose.yml` for frontend, backend, and Postgres, plus `docker-compose.dev.yml` for live-mounted development containers.
- Added root `.env.example` for Docker environment management without committing real secrets.
- Made backend server port, JPA DDL mode, SQL logging, CORS origins, SpringDoc exposure, and payment frontend URLs configurable through environment variables.
- Added `DEPLOYMENT.md` with local production-like and development Docker usage notes, environment guidance, and production readiness caveats.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified production and development Docker Compose config rendering with `.env.example`, `npm run build`, `mvn -q -DskipTests compile`, `mvn test`, and `git diff --check`.
- Docker image build was not completed because the local Docker Desktop Linux engine was not running.

### Ecommerce Security Hardening

- Added backend admin role/permission enforcement with normalized `ROLE_STAFF`, inferred `ROLE_ADMIN`, and `PERM:*` authorities.
- Added JSON `403` handling, no-store headers for sensitive auth/reset responses, safer JWT setting validation, and reduced JWT validation log detail.
- Removed `hashedPassword` from staff API responses and sanitized frontend auth user metadata before persistence.
- Added `VITE_AUTH_TOKEN_STORAGE=session` support for safer frontend token storage while keeping centralized auth flow intact.
- Hardened VNPay and MoMo callback handling with required-field checks, signature/merchant/amount validation, local transaction ownership checks, and duplicate provider transaction id rejection.
- Hardened Cloudinary media uploads with JPG/PNG/WEBP-only validation, 5MB limits, extension and magic-byte checks, and safer upload options.
- Moved backend database, JWT, payment, and Cloudinary config values to environment-driven placeholders in `application.yml`.
- Added root `SECURITY.md` and updated backend security, payment, and file-upload documentation.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, `mvn -q -DskipTests compile`, and `mvn test`. `mvn test` still printed the existing local PostgreSQL `media.display_order` DDL warning.

### Logging And Monitoring Foundation

- Added `frontend/src/monitoring` with structured client logging, local buffering, global error tracking, API failure tracking, payment error tracking, route preload/error tracking, and optional route-change tracking.
- Added frontend `X-Request-Id` propagation from the shared Axios client and normalized API errors now include request ids when available.
- Added backend `MonitoringLogger` and `RequestMonitoringFilter` for structured key-value logs, MDC request correlation, and `X-Request-Id` response headers.
- Added structured backend events for auth login/logout/unauthorized/JWT failures, order creation/admin updates/system payment transitions, payment link creation, VNPay/MoMo callback outcomes, payment return/IPN failures, and handled/unhandled exceptions.
- Improved backend error responses with `path` and `requestId` fields while keeping the existing status/message/details shape.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, `FRONTEND_GUIDE.md`, and `API_INTEGRATION_GUIDE.md`.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and `mvn test`.

### Frontend Production Architecture Optimization

- Added `frontend/src/api/apiCache.js` and wired the shared Axios helper for in-flight GET request deduplication, opt-in TTL caching, and cache invalidation after successful mutations.
- Added route loader/preload foundations with `frontend/src/routes/routeLoaders.js` and `lazyRoutes.jsx`, and preloaded likely next routes from header/product interactions.
- Added `DeferredSectionBoundary` and lazy-loaded below-fold homepage/PDP sections while preserving the existing homepage layout.
- Removed PLP/PDP catalog N+1 detail fetching for listing cards; PLP now uses the product page response directly and PDP related products use listing data.
- Added focused memoization for product carousels, recommendation/recently-viewed sections, product card handlers, product detail derived values, and category count derivation.
- Tuned Vite manual chunking for React, React Router, Framer Motion, and Axios vendor caching while keeping Recharts out of the storefront entry path.
- Verified `npm run lint`, `npm run build`, `git diff --check`, targeted `npm ls` dependency duplication checks, and route smoke checks for `/`, `/products`, `/products/:slug`, `/cart`, `/wishlist`, and `/admin/login`.
- Measured production build output: main app chunk is about 105 kB, Product Detail route chunk is about 34 kB, and PLP no longer performs up to 72 extra detail requests after the catalog list request.

### Ecommerce Image System

- Upgraded `OptimizedImage` with shared loading state, lazy/eager loading defaults, Cloudinary responsive `srcSet` generation, blur-up placeholders, skeleton overlays, and fallback image handling.
- Added `frontend/src/hooks/useImageLoading.js` and `frontend/src/utils/imageFallbacks.js` for reusable image status and data-URI fallback images.
- Applied optimized images to storefront product cards, product gallery, cart, checkout, wishlist, search results, review photos, account avatars, and admin product/variant thumbnails.
- Optimized admin media grid and preview modal rendering, and added upload queue image previews with object URL cleanup.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and route smoke checks for `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/admin/media`, and `/admin/products`. `git diff --check` reported only CRLF normalization warnings for edited frontend files.

### Storefront SEO Foundation

- Added `SEOHead` and centralized metadata helpers for dynamic titles, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, product metadata, and JSON-LD structured data.
- Added SEO metadata coverage for the homepage, product listing, product detail, loading/error/not-found product states, and category pages.
- Added `/categories/:categorySlug` and updated storefront category links to use canonical category URLs.
- Improved listing/detail semantic structure, breadcrumb accessibility, and heading anchors without changing the homepage layout.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint`, `npm run build`, and `git diff --check`. `git diff --check` reported only CRLF normalization warnings for edited frontend files.

### Admin Analytics System

- Added reusable admin analytics widgets: `AnalyticsFilters`, `RevenueAnalytics`, `CustomerAnalytics`, and `InventoryAnalytics`.
- Upgraded `/admin/dashboard` and `/admin/reports/revenue` with revenue analytics, top-selling products, customer analytics, conversion metrics placeholder, inventory analytics, order trends, and sales report breakdowns.
- Added responsive Recharts area, line, pie, and bar chart compositions for dense SaaS analytics layouts.
- Added date range filters, channel/segment filters, and export placeholders for future reporting APIs.
- Added `frontend/src/data/adminAnalyticsMock.js` for admin-only analytics mock data so the storefront main bundle stays below the Vite chunk-size warning threshold.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, and `git diff --check`. `git diff --check` reported only CRLF normalization warnings for edited files.

### Realtime Notification Foundation

- Added a frontend realtime foundation with `useRealtime.js`, `useRealtimeNotifications.js`, normalized realtime event types, and notification event handlers.
- Added WebSocket-first connection handling through `VITE_REALTIME_WS_URL` with polling/local-event fallback for sandbox and development use.
- Extended the storefront notification dropdown with payment notifications, live/fallback connection status, and realtime toast handling.
- Replaced the admin topbar notification placeholder with a live notification dropdown and added a dashboard realtime operations panel for order, payment, admin, and stock alerts.
- Published local realtime events from checkout order creation, payment result verification, admin order updates, and warehouse low-stock/replenishment flows.
- Updated `CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build`.

### Payment Experience Polish

- Polished checkout payment selection for COD, VNPay, and MoMo with richer trust copy, selected-method guidance, and provider-specific trust indicators.
- Added reusable storefront payment components: payment timeline, transaction summary, retry panel, payment processing state, trust indicators, and COD order confirmation.
- Added `usePaymentResult` and expanded `paymentStatus` helpers so payment result pages share provider/status normalization, copy, and timeline logic.
- Updated `/payment/success` and `/payment/failed` with transaction summaries, payment timelines, clearer verification feedback, and retry guidance.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint` and `npm run build`.

### MoMo Sandbox Payment Flow

- Added a reusable backend payment gateway abstraction for storefront online payment handoff.
- Integrated MoMo Sandbox payment request creation, browser return handling, IPN signature validation, merchant/amount validation, and paid/failed/cancelled transaction handling.
- Added `/api/payments/momo/create` and `/api/payments/momo-return`, and aligned the MoMo notify URL with `/api/system/payment/momo-ipn`.
- Enabled MoMo Sandbox in checkout with shared payment API helpers, provider-aware loading states, and provider-aware payment result pages.
- Added frontend payment status helpers for `pending`, `paid`, `failed`, and `cancelled`.
- Updated `docs/backend/PAYMENT.md`, `CURRENT_STATE.md`, and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, `mvn -q -DskipTests compile`, and `git diff --check`.

### VNPay Sandbox Payment Flow

- Integrated VNPay Sandbox checkout handoff for ecommerce orders.
- Added backend `POST /api/payments/vnpay/create`, `GET /api/payments/vnpay-return`, and `GET /api/payments/orders/{orderId}/status`.
- Added secure VNPay hash verification, merchant/amount validation, sandbox-only payment URL creation, and paid/failed/cancelled transaction state handling.
- Added unpaid order close and reserved-stock release behavior for failed or cancelled online payments.
- Enabled VNPay in checkout, added payment loading/redirect states, and added `/payment/success` plus `/payment/failed` result pages with server-side status verification.
- Updated `docs/backend/PAYMENT.md`, `CURRENT_STATE.md`, and `NEXT_TASKS.md`.
- Verified `npm run lint`, `npm run build`, and `mvn -q -DskipTests compile`.

### Phase 6 Ecommerce Review And Completion

- Reviewed Phase 6 customer ecommerce surfaces across search, reviews, wishlist, recommendations, cart, checkout, order tracking, notifications, performance, responsive quality, and animation consistency.
- Kept the homepage layout intact and made focused UX fixes instead of a large redesign.
- Converted storefront header and notification internal navigation to React Router links and closed mobile/notification surfaces after navigation.
- Improved search overlay scroll containment, removed duplicated result-pick logic, memoized derived trending searches, and aligned PLP search normalization for punctuation plus Vietnamese/no-accent matching.
- Added `frontend/src/utils/productIdentity.js` to centralize product alias matching across recently viewed and recommendation flows.
- Reused the shared store empty-state foundation on wishlist and applied `OptimizedImage` to cart mini recommendations.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `npm ls react react-dom framer-motion lucide-react`, and local route smoke checks for key customer routes.
- Marked Phase 6 completed and the project ready for Phase 7 — Advanced Features & Production Systems.

### Frontend Performance Optimization

- Added lazy route splitting through `lazyRoutes.jsx` and `RouteLoadingBoundary.jsx` for client and admin route pages.
- Deferred heavy header overlays by lazy-loading search overlay and cart drawer only when opened.
- Added `OptimizedImage.jsx` with lazy/eager loading controls, async decoding, fetch priority, sizing, and Cloudinary srcset support.
- Applied optimized images to hero, promo, product card, product gallery, cart, checkout, wishlist, PLP hero cards, and search result imagery.
- Added targeted render optimizations for repeated product/search result rows and rAF-throttled header scroll state updates.
- Verified `npm run lint`, `npm run build`, `git diff --check`, dependency duplication with `npm ls`, and local route smoke checks for `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/wishlist`, `/profile`, and `/admin/login`.
- Production build now emits route chunks; the main JS chunk is about 496 kB instead of the previous single about 1.53 MB bundle, and the previous Vite chunk-size warning is gone.

### Customer Ecommerce Experience Polish

- Added reusable `TrustSignalBar.jsx` for consistent trust indicators across PLP, PDP, cart, checkout, and profile surfaces.
- Polished customer ecommerce interactions with stronger CTA routing, hover/focus states, shared empty-state trust hints, improved PLP/PDP skeletons, and subtle service/hero micro interactions.
- Kept the existing homepage structure intact and avoided a large redesign.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and local route smoke checks for `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, and `/profile`. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.

### Customer Loyalty Reward UI Foundation

- Added reusable account widgets: `LoyaltyCard.jsx`, `RewardsWidget.jsx`, and `CouponWallet.jsx`.
- Added the profile overview loyalty foundation with reward points, loyalty level progress, coupon wallet, special offers, copied-code feedback, and a premium membership card placeholder.
- Kept the implementation mock/local-only with no backend loyalty logic.
- Verified `npm run lint` and `npm run build`. Build still reports the existing Vite chunk-size warning.

### Notification System Foundation

- Added `frontend/src/hooks/useNotifications.js` with localStorage-backed notification state, cross-tab sync, unread counts, mark-as-read actions, and seeded order/coupon/system notification shapes.
- Added `frontend/src/components/notification/NotificationDropdown.jsx` with a responsive dark dropdown, unread badge, notification type filters, mark-all-read action, and subtle Framer Motion transitions.
- Added `frontend/src/components/notification/NotificationItem.jsx` for reusable order, coupon, and system notification rows.
- Wired the storefront header to show the notification dropdown without changing the homepage layout.
- Verified `npm run lint`, `npm run build`, and `git diff --check`. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.

### Order Tracking Experience

- Added the protected order tracking route `/profile/orders/:id` using the existing User Order API detail flow.
- Added reusable account tracking components: `OrderTrackingTimeline.jsx`, `OrderStatusBadge.jsx`, and `ShipmentProgress.jsx`.
- Added shared `orderTracking.js` helpers for backend order/shipping status mapping, estimated delivery labels, tracking dates, shipment steps, and fallback activity history.
- Built a responsive order detail page with visual progress, shipment metadata, delivery address, item summary, payment summary, loading state, error state, and refresh action.
- Added tracking links and shared order status badges to the account order history table/mobile cards.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and local route smoke checks for `/profile/orders` and `/profile/orders/1`. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.

### Cart And Checkout UX Upgrade

- Upgraded cart item interactions with animated quantity and line-total transitions, clearer stock state UI, max-stock feedback, and remove feedback.
- Added reusable cart UX helpers/components: `cartInsights.js`, `FreeShippingProgress.jsx`, `StockValidationPanel.jsx`, and `CartRecommendations.jsx`.
- Improved cart summary and checkout summary with free-shipping progress, shipping estimates, stock validation, coupon apply/clear UX, loading states, and trust-focused sticky summary content.
- Added mini recommendations in the cart page for quick complementary product adds.
- Verified `npm run lint`, `npm run build`, and local route smoke checks for `/cart` and `/checkout`. Build still reports the existing Vite chunk-size warning.

### Product Recommendation System Foundation

- Added reusable recommendation components: `ProductCarousel.jsx`, `RecommendationSection.jsx`, `TrendingProducts.jsx`, and `BestSellerSection.jsx`.
- Rebuilt related products on PDP to use the shared recommendation carousel foundation and added a frequently bought together carousel.
- Added homepage trending and best-seller recommendation carousels while preserving the existing homepage hero and core section structure.
- Added a recommended-for-you placeholder on the profile overview using the shared recommendation section foundation.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and route smoke checks for `/`, `/products/:slug`, and `/profile`. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.

### Recently Viewed Products System

- Rebuilt `useRecentlyViewed.js` with lightweight localStorage product snapshots, duplicate prevention across `id`/`apiId`/`slug`, remove, clear, count, and cross-tab sync behavior.
- Added reusable `frontend/src/components/product/RecentlyViewedSection.jsx` with a responsive horizontal product slider, empty state, clear-history action, and storefront recommendation styling.
- Displayed recently viewed products on the homepage, product detail pages, wishlist page, and account profile overview placeholder.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and route smoke checks for `/`, `/products/:slug`, `/profile`, and `/wishlist`. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.

### Production Wishlist System

- Upgraded the storefront wishlist from ID-only local storage to a shared `WishlistProvider` with persistent product snapshots, optimistic add/remove/clear actions, item pending state, and cross-tab sync.
- Added optional backend sync through `frontend/src/api/wishlistService.js`, `wishlistMapper.js`, and `VITE_WISHLIST_API_PATH`, with local fallback when no compatible API exists.
- Rebuilt `/wishlist` with sync status, loading/error states, move-to-cart, remove item, clear all, premium item cards, and recently viewed continuity.
- Updated ProductCard, ProductInfo, and Header with shared wishlist state, animated heart transitions, toasts, and a live wishlist count.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and local `/wishlist` + `/products` route smoke checks. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited files.

### Product Reviews System

- Rebuilt the product detail reviews area into a modern dark ecommerce review system.
- Added reusable review components: `RatingSummary.jsx`, `ReviewCard.jsx`, and `ReviewForm.jsx`.
- Upgraded `ProductReviews.jsx` with review filters, sorting, rating summary, authenticated write-review UI, image review placeholders, verified purchase badges, helpful vote placeholders, empty states, and load-more pagination foundation.
- Extended Product API review normalization for `photosJson`, `orderId`, `userId`, helpful counts, verified purchase flags, and review pagination metadata.
- Verified `npm run lint`, `npm run build`, and `git diff --check`. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.

### Advanced Ecommerce Search System

- Upgraded the storefront search overlay into an advanced mock-backed ecommerce search experience while preserving the homepage layout.
- Added `frontend/src/components/search/SearchResultItem.jsx` for reusable product/category/brand result rows with dark premium styling and search highlighting.
- Added `frontend/src/hooks/useRecentSearches.js` for localStorage-backed recent searches with add, remove, clear, dedupe, and cross-tab sync behavior.
- Reworked `frontend/src/hooks/useSearch.js` with debounced query state, category-aware and brand-aware scoring, detected context chips, trending search derivation, loading state, empty state support, and keyboard navigation state.
- Reworked `SearchSuggestions.jsx` and `SearchOverlay.jsx` for responsive overlay UX, skeleton loading rows, empty suggestions, recent/trending searches, highlighted results, and product/category/brand grouping.
- Verified `npm run lint`, `npm run build`, and `git diff --check`. Build still reports the existing Vite chunk-size warning, and `git diff --check` reported CRLF normalization warnings for edited frontend files.

### Backend Startup Jackson Fix

- Removed custom Jackson BOM/core overrides from `backend/electronics/pom.xml` so Spring Boot 4.0.3 manages compatible Jackson 3 and Jackson 2 dependency sets.
- Fixed the startup crash caused by `tools.jackson.databind.json.JsonMapper$Builder` failing to initialize with missing `JsonSerializeAs`.
- Verified `mvn -q -DskipTests compile` and confirmed `mvn spring-boot:run` reaches Tomcat startup after the dependency fix.
- Confirmed remaining backend startup warnings come from local PostgreSQL schema drift in populated legacy tables and need controlled SQL migration/backfill.

### Phase 5 Admin Dashboard Polish And Completion

- Reviewed and polished the full Admin Dashboard System across CRUD consistency, table actions, spacing, responsive layout, permissions, loading/error states, modal/drawer behavior, forms, charts, and badges.
- Added permission-aware admin topbar module search and shared debounced admin search handling.
- Hardened reusable admin CRUD components: legacy headers no longer render dead actions, row action hover tones are consistent, `StatusBadge` normalizes common statuses, forms avoid invalid nested labels, and modal/form footers fit mobile.
- Aligned the revenue report chart with shared dashboard analytics card, tooltip, axis, and spacing patterns.
- Marked Phase 5 completed and the project ready for Phase 6 — Ecommerce Core Features.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`. Build still reports the existing Vite chunk-size warning.

### Admin Role And Permission Management API Integration

- Rebuilt `frontend/src/pages/admin/Roles.jsx` into a real API-backed Role & Permission Management module at `/admin/roles`.
- Added reusable Role and Permission Management components: `PermissionMatrix.jsx`, `RoleForm.jsx`, and `RoleTable.jsx`.
- Added role table, grouped permission matrix, assign-permission drawer, staff role assignment panel, status controls, validation UI, loading states, API error handling, and soft-delete confirmation.
- Upgraded `frontend/src/api/adminPeopleMapper.js`, `roleService.js`, and `permissionService.js` for normalized Role/Permission API pages/details, Role create/update payloads, status patch updates, and permission grouping data.
- Extended backend Role responses with `permissionCount` and `staffCount` for list/detail UI.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`. Build still reports the existing Vite chunk-size warning.

### Admin Coupon Management API Integration

- Rebuilt `frontend/src/pages/admin/Coupons.jsx` into a real API-backed Coupon Management module at `/admin/coupons`.
- Added reusable Coupon Management components: `CouponForm.jsx` and `CouponTable.jsx`.
- Added coupon table, create/update drawer, native date/time pickers, validation UI, discount type handling, status controls, status/time/date filters, usage progress, loading states, API error handling, and soft-delete confirmation.
- Added `frontend/src/api/couponMapper.js` and upgraded `couponService.js` for normalized Coupon API pages/details, create/update payloads, status patch updates, and checkout coupon validation with usage counts.
- Extended backend Coupon responses with `usedCount` from orders and enforced `usageLimit` when checkout resolves a coupon.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`. Build still reports the existing Vite chunk-size warning.

### Admin Warehouse Management API Integration

- Rebuilt `frontend/src/pages/admin/Warehouse.jsx` into a real API-backed inventory operations module at `/admin/warehouse`.
- Added reusable Warehouse Management components: `WarehouseTable.jsx`, `StockAdjustModal.jsx`, and `LowStockCard.jsx`.
- Added stock overview, clean inventory table, status/stock filters, low-stock alerts, loading states, API error handling, and stock history placeholder UI.
- Added inventory adjustment flow that creates and completes Warehouse Transaction API records for stock in, stock out, and returns.
- Added `frontend/src/api/warehouseMapper.js` and upgraded `warehouseService.js` for normalized Warehouse pages, stock rows, transaction pages, and adjustment payloads.
- Fixed backend Warehouse Transaction completion so manual inbound transactions increase stock and outbound transactions decrease stock.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/warehouse` route smoke check. Build still reports the existing Vite chunk-size warning.

### Admin Order Management API Integration

- Rebuilt `frontend/src/pages/admin/Orders.jsx` into a real API-backed operations module at `/admin/orders`.
- Added reusable Order Management components: `OrderTable.jsx`, `OrderDetail.jsx`, and `OrderTimeline.jsx`.
- Added order table, order detail drawer, customer info, shipping address, order items, payment summary, status update controls, payment status controls, shipping status controls, and timeline UI.
- Added `frontend/src/api/orderMapper.js` and upgraded `orderService.js` for normalized admin Order list/detail responses and update payloads.
- Mapped UI order stages `pending`, `confirmed`, `shipping`, `delivered`, and `cancelled` to the backend Order and Shipping status enums.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/orders` route smoke check. Build still reports the existing Vite chunk-size warning.

### Admin Media Management API Integration

- Rebuilt `frontend/src/pages/admin/Media.jsx` into a real API-backed asset manager at `/admin/media`.
- Added reusable Media Management components: `MediaUploader.jsx`, `MediaGrid.jsx`, and `MediaPreviewModal.jsx`.
- Added drag-and-drop Cloudinary upload, per-file upload progress, product attach flow, dark media grid, image preview modal, primary image action, and media delete confirmation.
- Added `frontend/src/api/mediaMapper.js` and upgraded `mediaService.js` for normalized Media API list, upload, create, primary, order, and delete flows.
- Extended backend Media API support for paginated list/search/filter, `publicId` on create/response DTOs, primary reset handling, and Cloudinary deletion during media delete.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/media` route smoke check. Build still reports the existing Vite chunk-size warning.

### Admin Variant Management API Integration

- Rebuilt `frontend/src/pages/admin/Variants.jsx` into a real API-backed inventory module at `/admin/variants`.
- Added reusable Variant Management components: `VariantForm.jsx` and `VariantTable.jsx`.
- Added real variant list/table with server-side search, product filter, status filter, pagination, loading state, API error handling, status toggle, and protected actions.
- Added Variant create/update drawer with product linking, SKU management, stock management, price override, color/size fields, dynamic attributes, and image URL preview placeholder UX.
- Added `frontend/src/api/variantMapper.js` and upgraded `variantService.js` for normalized Variant API responses and payloads.
- Extended backend Variant API support for `sku`, product filtering, SKU search, SKU uniqueness checks, and `sku` fields in list/detail DTOs.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/variants` route smoke check. Build still reports the existing Vite chunk-size warning.

### Admin Product Management API Integration

- Rebuilt `frontend/src/pages/admin/Products.jsx` into a real API-backed admin module at `/admin/products`.
- Added reusable Product Management components: `ProductForm.jsx`, `ProductTable.jsx`, and `ProductFilters.jsx`.
- Added real product list/table with server-side search, category filter, brand filter, status filter, featured filter, pagination, loading state, API error handling, status toggle, featured toggle, and protected actions.
- Added Product create/update drawer using reusable admin form patterns with image URL preview placeholder UX.
- Upgraded `frontend/src/api/productMapper.js` and `productService.js` for normalized Product API responses, Product create/update payloads, status patch updates, and featured patch updates.
- Extended backend Product API support for `featured`, category/brand/featured filters, featured patch updates, richer product list/detail DTO metadata, product-level media placeholder updates, and variant stock in variant responses.
- Added the Cloudinary Java SDK dependency and removed the duplicate MapStruct primary-image mapping conflict so backend compile can pass.
- Verified `npm run lint`, `npm run build`, `git diff --check`, `mvn -q -DskipTests compile`, and a local `/admin/products` route smoke check. Build still reports the existing Vite chunk-size warning.

### Admin User And Staff Management API Integration

- Rebuilt `frontend/src/pages/admin/Users.jsx` into a real API-backed admin module at `/admin/users`.
- Added real user list/table with server-side search, status filter, role display, account status controls, pagination, loading state, API error handling, detail drawer, and protected delete action.
- Rebuilt `frontend/src/pages/admin/Staff.jsx` into a real API-backed admin module at `/admin/staff`.
- Added real staff list/table with server-side search, status filter, role display, account status controls, pagination, loading state, API error handling, detail drawer, create, update, and delete flows.
- Added Staff create/update forms using reusable `AdminDrawer` + `AdminForm` and live Role API options.
- Added role-aware and protected actions through centralized permission policies, including current-staff self-action protection.
- Added `frontend/src/api/adminPeopleMapper.js` and upgraded `userService.js`, `staffService.js`, and `roleService.js` for normalized User, Staff, and Role API responses and payloads.
- Extended backend staff search in `StaffRepository` to include full name.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and local `/admin/users` + `/admin/staff` route smoke checks. Build still reports the existing Vite chunk-size warning.

### Admin Brand Management API Integration

- Rebuilt `frontend/src/pages/admin/Brands.jsx` into a real API-backed admin module at `/admin/brands`.
- Added real brand list/table with server-side search, status filter, featured filter, pagination, loading state, and API error handling.
- Added brand create/update flows using reusable `AdminDrawer` + `AdminForm`.
- Added soft-delete flow using reusable `ConfirmDialog`.
- Added brand status toggle via backend `PATCH /admin/brands/{id}/status`.
- Added featured toggle through the Brand update API.
- Added logo URL entry with upload placeholder UX.
- Added `frontend/src/api/brandMapper.js` and upgraded `frontend/src/api/brandService.js` for normalized Brand API responses and payloads.
- Extended backend Brand entity, DTOs, repository, service, and controller support for `slug`, `description`, `featured`, and featured filtering.
- Updated Brand API and database schema documentation.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and a local `/admin/brands` route smoke check. Build still reports the existing Vite chunk-size warning.

## 2026-05-09

### Context Standardization

- Standardized AI context documentation around ElectronicsManagement.
- Set current phase to `Phase 1 — Frontend Foundation`.
- Added `docs/ai-context/CURRENT_STATE.md`.
- Added `docs/ai-context/NEXT_TASKS.md`.
- Added `docs/ai-context/UI_REFERENCE.md`.
- Added `docs/ai-context/API_INTEGRATION_GUIDE.md`.
- Updated `AGENTS.md` with required reading and always-update rules.
- Updated `ROADMAP.md` with the eight-phase project plan.
- Updated `README.md` with an AI Context section.
- Removed the old hyphenated `docs/ai-context/CURRENT-STATE.md` context file in favor of `CURRENT_STATE.md`.
- Normalized category display labels to Vietnamese storefront labels.
- Added category scope and current-phase baseline across the AI context files.

### Frontend State Note

- The homepage layout must not be broken or restructured without explicit user approval.
- Client UI direction remains dark gaming ecommerce.
- Admin UI direction remains modern dashboard.

### Frontend Structure Normalization

- Normalized `frontend/src` around `api`, `assets`, `components`, `constants`, `data`, `hooks`, `layouts`, `pages`, `routes`, `services`, `styles`, and `utils`.
- Moved the client homepage to `frontend/src/pages/client/Home.jsx`.
- Moved homepage components into `frontend/src/components/home/`, layout components into `frontend/src/components/layout/`, product components into `frontend/src/components/product/`, and admin reusable UI into `frontend/src/components/ui/admin/`.
- Moved app route definitions into `frontend/src/routes/AppRoutes.jsx`.
- Moved the stylesheet entrypoint to `frontend/src/styles/index.css`.
- Verified `npm run lint` and `npm run build` pass after the restructure.

### Design Token System

- Added `frontend/src/styles/tokens.js` with colors, spacing, radius, shadows, typography, z-index, and transition tokens.
- Updated `frontend/tailwind.config.js` to read shared values from the token system.
- Added CSS custom properties and shared store utilities in `frontend/src/styles/index.css`.
- Refactored the client homepage shell to use `store-page-shell` without changing the visual layout.
- Verified `npm run lint` and `npm run build` pass after adding tokens.

### Reusable UI Components

- Added shared primitives in `frontend/src/components/ui`: `Button`, `Card`, `Badge`, `Input`, `SectionTitle`, `IconButton`, `Container`, `Price`, and `Rating`.
- Added `frontend/src/utils/classNames.js` for safe class composition.
- Refactored homepage usage of buttons, icon buttons, cards, badges, section titles, prices, ratings, the page container, and the header search input to use shared primitives where appropriate.
- Kept the existing dark gaming ecommerce layout and visual direction intact.
- Verified `npm run lint` and `npm run build` pass after the refactor.

### Routing Setup

- Updated `frontend/src/routes/AppRoutes.jsx` with standard client routes: `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/login`, and `/register`.
- Added admin routes for `/admin/login`, `/admin/dashboard`, and existing admin CRUD pages.
- Added styled client placeholder pages for unfinished ecommerce routes.
- Added a styled `/admin/login` placeholder outside `AdminLayout`.
- Updated admin sidebar dashboard navigation to `/admin/dashboard`.
- Kept the existing homepage at `/` unchanged.
- Verified `npm run lint` and `npm run build` pass after the routing setup.

### API Layer Setup

- Updated `frontend/src/api/client.js` to read JWT tokens from localStorage key `accessToken`.
- Added `Authorization: Bearer <token>` request handling and `401` token cleanup/event handling in the shared Axios client.
- Added flat API service modules under `frontend/src/api` for auth, categories, brands, products, users, staff, orders, warehouses, coupons, and media.
- Added `frontend/.env.example` with `VITE_API_BASE_URL=http://localhost:8080/api`.
- Kept homepage data on mock data and did not connect homepage components to live APIs.
- Updated API integration context for the new service-layer convention.
- Updated related auth/API documentation to use the `accessToken` localStorage key.
- Verified `npm run lint` and `npm run build` pass after the API layer setup.

### Mock Data Modularization

- Replaced the old combined mock files with `frontend/src/data/categories.js`, `products.js`, `promotions.js`, `services.js`, `adminMock.js`, and `index.js`.
- Updated storefront mock products with electronics/gaming fields: `id`, `name`, `slug`, `category`, `brand`, `price`, `oldPrice`, `discount`, `rating`, `reviews`, `stock`, `image`, and `tags`.
- Refactored homepage data flow so home components receive categories, products, promotions, and services from `src/data`.
- Updated admin pages to read mock data from `frontend/src/data/adminMock.js`.
- Kept the existing homepage visual structure unchanged.
- Verified `npm run lint` and `npm run build` pass after the mock data split.

### Phase 1 Frontend Foundation Review

- Reviewed the Phase 1 frontend structure, component boundaries, imports, routing, API client, mock data placement, and AI context docs.
- Confirmed homepage routing still renders `frontend/src/pages/client/Home.jsx` at `/` and keeps the existing homepage section order.
- Confirmed client/admin route definitions are centralized in `frontend/src/routes/AppRoutes.jsx`.
- Confirmed API client uses `VITE_API_BASE_URL`, localStorage key `accessToken`, bearer-token request handling, and `401` token cleanup.
- Confirmed mock data is centralized under `frontend/src/data`.
- Removed the leftover empty `frontend/src/components/admin` directory.
- Documented Phase 1 completed items, known issues, and the next phase in `docs/ai-context/CURRENT_STATE.md`.
- Updated `docs/ai-context/NEXT_TASKS.md` toward Design System + Client Ecommerce pages.
- Verified `npm run lint` and `npm run build` pass after the review. Build still reports the existing Vite chunk-size warning.

### Theme System Standardization

- Added `frontend/src/styles/theme.js` as the primary ecommerce theme source for colors, shadows, radius, and transitions.
- Split global CSS into `frontend/src/styles/globals.css` and reusable utilities into `frontend/src/styles/utilities.css`.
- Kept `frontend/src/styles/index.css` as the single stylesheet entrypoint imported by `src/main.jsx`.
- Added reusable storefront utility classes: `card-dark`, `card-hover`, `blue-glow`, `section-spacing`, `container-default`, and `transition-default`.
- Updated `frontend/src/styles/tokens.js` to derive Tailwind-facing values from `theme.js`.
- Lightly refactored shared `Button`, `IconButton`, `Card`, and `Container` primitives to use the normalized utility classes where appropriate.
- Preserved the existing homepage layout and visual direction.
- Updated `docs/ai-context/UI_REFERENCE.md`, `CURRENT_STATE.md`, `FRONTEND_GUIDE.md`, and `NEXT_TASKS.md` for the normalized theme system.
- Verified `npm run lint` and `npm run build` pass after the theme update. Build still reports the existing Vite chunk-size warning.

### Typography System Standardization

- Added storefront typography scale support for display, heading, title, body, caption, muted text, card title, and price styles.
- Added reusable typography utilities in `frontend/src/styles/utilities.css`: `text-display`, `text-heading`, `text-section`, `text-card-title`, `text-price`, and `text-muted`.
- Added typography values to `frontend/src/styles/theme.js`, `tokens.js`, and CSS variables in `globals.css`.
- Refactored homepage hero title, section titles, product names, flash sale text, service bar text, and shared price rendering to use typography utilities.
- Preserved homepage layout and dark gaming theme.
- Updated `docs/ai-context/UI_REFERENCE.md`, `CURRENT_STATE.md`, and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the typography update. Build still reports the existing Vite chunk-size warning.

### Spacing And Layout System

- Added storefront spacing scale values for 8, 12, 16, 20, 24, 32, 40, 48, and 64 pixel steps.
- Added reusable layout utilities in `frontend/src/styles/utilities.css`: `page-container`, `section-wrapper`, `grid-products`, `grid-categories`, `flex-between`, and `flex-center`.
- Updated `frontend/src/styles/theme.js`, `tokens.js`, and `globals.css` with the normalized spacing/layout values.
- Lightly refactored the homepage container, section rhythm, product grid, category grid, flash sale header, and hero media alignment to use shared layout utilities.
- Preserved the existing homepage visual direction and section structure.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, and `UI_REFERENCE.md`.
- Verified `npm run lint` and `npm run build` pass after the spacing/layout update. Build still reports the existing Vite chunk-size warning.

### Motion System

- Added `framer-motion` to the frontend dependencies.
- Added reusable motion presets in `frontend/src/styles/animations.js`: `fadeIn`, `fadeUp`, `staggerContainer`, `hoverLift`, `hoverGlow`, and `imageZoom`.
- Applied subtle motion to homepage product cards, category cards, hero buttons, promo cards, flash sale card, and service cards.
- Kept hover effects lightweight with small translate, glow, and image zoom interactions.
- Preserved the existing homepage layout and section order.
- Updated `docs/ai-context/UI_REFERENCE.md`, `CURRENT_STATE.md`, and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the motion update. Build still reports the existing Vite chunk-size warning.

### Product Card Polish

- Polished `frontend/src/components/product/ProductCard.jsx` for a more production-ready gaming ecommerce card.
- Improved product image framing, glow treatment, hover behavior, discount badge, rating section, and pricing area.
- Added wishlist button placeholder, stock badge placeholder, primary tag chip, and quick-add CTA without changing product data shape.
- Lightly polished `frontend/src/components/home/FlashSaleCard.jsx` to align with the upgraded product card treatment.
- Preserved the homepage section structure and dark storefront theme.
- Updated `docs/ai-context/CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the product card polish. Build still reports the existing Vite chunk-size warning.

### Header And Navbar Polish

- Polished `frontend/src/components/layout/Header.jsx` for a more production-ready ecommerce navbar.
- Added scroll-aware sticky header styling with dark transparent background, stronger backdrop blur, smooth transition, and premium shadow treatment.
- Improved search bar spacing, dark input quality, and subtle focus glow.
- Added a desktop category dropdown using the existing catalog mock data.
- Added subtle cart badge animation with Framer Motion.
- Added a responsive mobile menu with mobile search, category shortcuts, tracking, and account links.
- Preserved the existing homepage layout and dark gaming storefront style.
- Updated `docs/ai-context/CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the header polish. Build still reports the existing Vite chunk-size warning.

### Homepage Visual Polish

- Polished the homepage visual quality for a more production-ready gaming ecommerce feel.
- Improved `store-page-shell` with layered dark gradients, subtle grid texture, and deeper lighting.
- Improved `HeroBanner` depth with richer radial gradients, directional lighting, product spotlighting, and stronger CTA focus.
- Improved promo cards with richer gradients, neon accents, framed product imagery, and tighter ecommerce typography.
- Added subtle section separation and deeper visual hierarchy for service, category, and product sections.
- Preserved the existing homepage layout, section order, and dark gaming ecommerce identity.
- Updated `docs/ai-context/UI_REFERENCE.md`, `CURRENT_STATE.md`, and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the homepage visual polish. Build still reports the existing Vite chunk-size warning.

### Skeleton Loading System

- Added reusable dark storefront skeleton components under `frontend/src/components/skeletons/`.
- Added `ProductCardSkeleton`, `CategorySkeleton`, `BannerSkeleton`, `HeaderSkeleton`, and shared `SkeletonBlock`.
- Added `skeleton-shimmer` and `skeleton-card` utilities for realistic dark-theme shimmer loading placeholders.
- Refactored the homepage to show a short mock loading state demo before rendering mock data.
- Kept the demo local to the frontend and did not add real API calls.
- Updated `docs/ai-context/CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the skeleton loading system update. Build still reports the existing Vite chunk-size warning.

### Homepage Responsive Audit

- Audited the ecommerce homepage across mobile, tablet, desktop, and ultra-wide viewports.
- Tightened mobile header spacing while preserving the hamburger menu.
- Made the hero more compact on mobile and balanced on tablet without changing the desktop three-column homepage structure.
- Improved tablet promo/service wrapping to avoid half-empty rows.
- Adjusted product card, rating, price, and skeleton wrapping for two-column mobile product grids.
- Tuned the featured category grid for mobile, tablet, desktop, and ultra-wide widths.
- Preserved the existing homepage section order and dark gaming storefront design.
- Updated `docs/ai-context/CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the responsive audit. Build still reports the existing Vite chunk-size warning.

### Phase 2 Cleanup And Audit

- Reviewed Phase 2 UI consistency across storefront and admin surfaces without a large rewrite.
- Tightened shared button, icon button, badge, card, rating, placeholder, and admin table/action treatments.
- Normalized small shadow, border, hover, focus, spacing, typography, and icon sizing inconsistencies.
- Added a reusable admin icon button pattern for topbar and table actions.
- Confirmed homepage responsive work remains intact and document-level overflow checks pass for key storefront/admin routes.
- Marked Phase 2 as completed and set the next project phase to `Phase 3 — Client Ecommerce Pages`.
- Updated `docs/ai-context/CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint`, `git diff --check`, and `npm run build` pass after the cleanup. Build still reports the existing Vite chunk-size warning.

### Product Listing Page

- Added `frontend/src/pages/client/ProductListingPage.jsx` and wired `/products` to the new mock-backed listing page.
- Added reusable product listing components: `FilterSidebar`, `SortDropdown`, `ActiveFilters`, and `Pagination`.
- Built product grid, category banner, breadcrumb, active filters, sorting, pagination, responsive mobile filtering, and desktop sticky filter sidebar.
- Expanded storefront mock product data with additional electronics/gaming products plus `sold` and `createdAt` fields for listing sort behavior.
- Kept the storefront dark gaming ecommerce direction and did not change the homepage layout.
- Updated `docs/ai-context/CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the listing page. Build still reports the existing Vite chunk-size warning.

### Product Listing Filter Search UX

- Added `frontend/src/hooks/useProductFilters.js` to centralize mock-backed listing filter, search, sort, pagination, active-chip, and URL query state.
- Added `SearchProductsInput` with debounced product search across name, brand, category, slug, and tags.
- Added `EmptyProductsState` for no-result listing states with clear-filter action.
- Improved `FilterSidebar` with collapsible filter sections, multi-select category/brand/price/stock filters, rating threshold filter, and reusable clear actions.
- Replaced the mobile inline filter panel with a responsive bottom drawer while keeping the desktop sticky filter sidebar.
- Updated product listing docs in `CURRENT_STATE.md`, `NEXT_TASKS.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint` and `npm run build` pass after the filter/search UX update. Build still reports the existing Vite chunk-size warning.

### Product Detail Page

- Replaced the `/products/:slug` placeholder with a production-style mock-backed product detail page.
- Added product detail components: `ProductGallery`, `ProductInfo`, `VariantSelector`, `QuantitySelector`, `ProductSpecs`, `ProductReviews`, and `RelatedProducts`.
- Added `frontend/src/data/productDetails.js` to enrich catalog products with gallery images, variants, specs, description, reviews, shipping info, stock info, and related products.
- Added image gallery thumbnails, hover zoom, product info hierarchy, variant selection, quantity controls, add-to-cart, buy-now, wishlist, specs, description, reviews, shipping, stock, and related product sections.
- Made product listing cards link to the new product detail route from product image and title.
- Kept the storefront dark gaming ecommerce direction and did not change the homepage layout.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, `FRONTEND_GUIDE.md`, and `TASK_BOARD.md`.
- Verified `npm run lint` and `npm run build` pass after the product detail page. Build still reports the existing Vite chunk-size warning.

### Product Gallery Polish

- Polished `ProductGallery` for a more premium product detail image experience.
- Added main image loading skeletons, smoother image switching animations, stronger active thumbnail states, thumbnail hover transitions, and refined hover zoom.
- Added a fullscreen preview modal with dark ecommerce styling, subtle glow, modal thumbnails, close/previous/next controls, and Escape/arrow-key navigation support.
- Kept the gallery reusable and did not add an external carousel dependency.
- Updated `docs/ai-context/CURRENT_STATE.md` and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the gallery polish. Build still reports the existing Vite chunk-size warning.

### Cart Drawer Experience

- Added reusable cart drawer components under `frontend/src/components/cart/`: `CartDrawer`, `CartItem`, and `CartSummary`.
- Wired the storefront header cart button to open a mock-backed slide-in drawer with blurred backdrop and smooth open/close animation.
- Added mini cart preview, quantity update controls, remove item action, subtotal, coupon placeholder, continue-shopping action, checkout action, and mobile-friendly drawer layout.
- Updated the header cart badge to reflect local mock cart count with the existing animated badge treatment.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, `FRONTEND_GUIDE.md`, and `TASK_BOARD.md`.
- Verified `npm run lint` and `npm run build` pass after the cart drawer. Build still reports the existing Vite chunk-size warning.

### Full Cart Page

- Replaced the `/cart` placeholder with a production-style mock-backed cart page.
- Added a responsive cart item table/grid, quantity updates, remove item actions, coupon input, order summary, shipping estimate, continue-shopping CTA, and checkout CTA.
- Extended `CartItem` and `CartSummary` so the cart drawer and full cart page share reusable cart UI patterns.
- Added `frontend/src/data/cart.js` to centralize mock cart item setup for the drawer and page.
- Kept the storefront dark premium ecommerce direction and did not call real backend APIs.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, `FRONTEND_GUIDE.md`, and `TASK_BOARD.md`.
- Verified `npm run lint` and `npm run build` pass after the cart page. Build still reports the existing Vite chunk-size warning.

### Checkout Page

- Replaced the `/checkout` placeholder with a production-style mock-backed checkout page.
- Added checkout components under `frontend/src/components/checkout/`: `CheckoutForm`, `ShippingMethodSelector`, `PaymentMethodSelector`, and `CheckoutSummary`.
- Added customer information, shipping address, shipping method, payment method, form validation UI, coupon placeholder, sticky order summary, and mobile-friendly layout.
- Added COD, VNPay placeholder, and MoMo placeholder payment options without real payment integration.
- Reused the mock cart item shape and kept checkout state local until shared cart state or storefront checkout APIs are ready.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, `FRONTEND_GUIDE.md`, and `TASK_BOARD.md`.
- Verified `npm run lint` and `npm run build` pass after the checkout page. Build still reports the existing Vite chunk-size warning.

### Customer Auth Pages

- Replaced the `/login` and `/register` placeholders with production-style mock-backed ecommerce auth pages.
- Added auth components under `frontend/src/components/auth/`: `AuthLayout`, `LoginForm`, and `RegisterForm`.
- Added login form validation, register form validation, password strength UI, remember-me UI, forgot-password placeholder, and social login placeholders.
- Kept the auth pages local-only without real customer auth API or OAuth integration.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint` and `npm run build` pass after the auth pages. Build still reports the existing Vite chunk-size warning.

### Wishlist And Recently Viewed

- Added `frontend/src/pages/client/WishlistPage.jsx` and wired `/wishlist` into client routing.
- Added `frontend/src/hooks/useWishlist.js` and `frontend/src/hooks/useRecentlyViewed.js` for localStorage-backed mock persistence.
- Wired wishlist toggles into product cards and product detail purchase actions.
- Added recently viewed tracking from product card/detail navigation and a recently viewed section on the wishlist page.
- Added a wishlist link to the storefront header desktop and mobile navigation.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint` and `npm run build` pass after the wishlist experience. Build still reports the existing Vite chunk-size warning.

### Ecommerce Search Experience

- Added `frontend/src/components/search/SearchOverlay.jsx` and `SearchSuggestions.jsx`.
- Added `frontend/src/hooks/useSearch.js` with debounce, mock products/categories/brands search, recent searches, trending searches, and keyboard navigation state.
- Replaced the static storefront header search input with a desktop/mobile search overlay trigger.
- Added live result previews for products, categories, and brands using mock storefront data only.
- Updated `docs/ai-context/CURRENT_STATE.md`, `NEXT_TASKS.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint` and `npm run build` pass after the search experience. Build still reports the existing Vite chunk-size warning.

### Phase 3 Client Ecommerce Polish And Completion

- Reviewed and polished Phase 3 client ecommerce surfaces across PLP, PDP, cart, checkout, auth, wishlist, recently viewed, and search.
- Added the shared `store-stat-card` utility and reused it across client ecommerce stat/trust cards.
- Tightened ProductCard height consistency, out-of-stock quick-add behavior, wishlist action clarity, and recently viewed/wishlist polish.
- Improved checkout mobile behavior for shipping options, order-summary item rows, and delivery notes.
- Replaced visible developer-facing checkout/auth/search copy with customer-facing placeholder copy while keeping flows mock/local only.
- Verified `npm run lint`, `git diff --check`, `npm run build`, and route smoke checks for `/`, `/products`, `/products/:slug`, `/cart`, `/checkout`, `/login`, `/register`, and `/wishlist`.
- Marked Phase 3 as completed and set the project ready for Phase 4 — Auth + Backend Integration.

### Frontend Auth Architecture

- Added centralized JWT-ready auth modules under `frontend/src/auth`: `AuthContext`, `AuthProvider`, `useAuth`, `authStorage`, and `authHelpers`.
- Added reusable guard components under `frontend/src/guards`: `ProtectedRoute`, `AdminRoute`, and `GuestRoute`.
- Added auth reducer exports under `frontend/src/store/auth` for centralized auth state transitions.
- Updated `frontend/src/main.jsx` to mount `AuthProvider` without changing current route access behavior.
- Updated `frontend/src/api/client.js` and `authService.js` to use centralized auth storage/session helpers and auth events.
- Documented the auth architecture in `CURRENT_STATE.md`, `NEXT_TASKS.md`, `API_INTEGRATION_GUIDE.md`, and `FRONTEND_GUIDE.md`.
- Verified `npm run lint` and `npm run build` pass after the auth architecture setup. Build still reports the existing Vite chunk-size warning.

### Real Login Integration

- Connected `/login` and `/admin/login` to the backend Spring Boot JWT login endpoint through `frontend/src/api/authService.js`.
- Added role-based login redirects: user-shaped sessions go to `/`, admin/staff sessions go to `/admin/dashboard`.
- Added loading, invalid credentials, network error, and disabled-account handling to the login form.
- Added reusable dark toast notifications under `frontend/src/components/ui/toast`.
- Applied `AdminRoute` to protect `/admin/*` and `GuestRoute` to login routes.
- Updated the admin login page to use the dark premium auth style.
- Updated admin topbar display data from the authenticated user session and wired admin logout to `authService.logout()`.
- Added backend handlers for `BadCredentialsException`, `DisabledException`, and `LockedException`.
- Updated auth/API docs for login error statuses.
- Verified `npm run lint`, `npm run build`, and `mvn clean compile -DskipTests`. `mvn test` is still blocked by existing backend ApplicationContext issues.

### Production Axios API Client

- Added `frontend/src/api/apiErrorHandler.js` for centralized response error handling, `401` auth cleanup, and retry foundation.
- Added `frontend/src/api/normalizeApiError.js` for normalized API error parsing and clean frontend messages.
- Updated `frontend/src/api/client.js` with env-driven base URL/timeout config, automatic bearer token injection, safe-method retry defaults, and reusable `api.*` request helpers.
- Updated API service modules to use the shared `api.*` helpers instead of duplicating Axios response parsing.
- Added `VITE_API_TIMEOUT` to `frontend/.env.example`.
- Updated `docs/ai-context/API_INTEGRATION_GUIDE.md`, `CURRENT_STATE.md`, and `NEXT_TASKS.md`.
- Verified `npm run lint` and `npm run build` pass after the API client hardening.

### Protected Routing System

- Added `frontend/src/guards/StaffRoute.jsx`, `RouteGuardState.jsx`, `routeGuardUtils.jsx`, and guard barrel exports.
- Updated `ProtectedRoute`, `AdminRoute`, and `GuestRoute` with default loading fallback, redirect memory, role/permission checks, and graceful unauthorized UI.
- Updated `AuthProvider` to restore stored auth sessions during initial state creation to reduce protected-content flashing.
- Added auth helper support for admin-only and staff/admin session checks.
- Protected `/checkout`, the `/admin/*` shell, and admin-only user/staff/role management pages.
- Made `/login`, `/register`, and `/admin/login` guest-only.
- Updated `LoginForm` to redirect back to the remembered protected route when the authenticated session is allowed to open it.
- Updated protected routing documentation in `CURRENT_STATE.md`, `NEXT_TASKS.md`, `FRONTEND_GUIDE.md`, and `API_INTEGRATION_GUIDE.md`.
- Verified `npm run lint`, `npm run build`, and `git diff --check` pass after the protected routing update.

### JWT Session Refresh Flow

- Added `frontend/src/api/apiConfig.js` for shared API base URL, timeout, and auth refresh endpoint config.
- Added `frontend/src/api/refreshTokenService.js` for app-start session restore, JWT expiry checks, single-flight refresh calls, and logout on refresh failure.
- Extended auth storage, auth session normalization, and auth reducer state to support `refreshToken`.
- Updated the Axios response interceptor to refresh on eligible `401` responses, retry the original request once, and avoid infinite refresh loops.
- Updated `AuthProvider` to validate/restore stored sessions on app start before releasing protected routes from loading state.
- Added `VITE_AUTH_REFRESH_ENDPOINT=/admin/auth/refresh` to `frontend/.env.example`.
- Documented that the current backend admin auth controller exposes login/logout only; real refresh requires backend refresh-token response and endpoint support.
- Updated `API_INTEGRATION_GUIDE.md`, `FRONTEND_GUIDE.md`, `CURRENT_STATE.md`, `NEXT_TASKS.md`, and `TASK_BOARD.md`.
- Verified `npm run lint`, `npm run build`, and `git diff --check` pass after the refresh-token flow update.

### Frontend Role And Permission System

- Added centralized role and permission helpers in `frontend/src/auth/roleHelpers.js` for ADMIN, STAFF, USER, route policies, resource action policies, and permission normalization.
- Added reusable `frontend/src/auth/usePermissions.js` and `frontend/src/auth/PermissionGate.jsx`.
- Updated route guards and admin routes to consume shared access policies.
- Filtered the admin sidebar from centralized policies so STAFF does not see Role Management and USER cannot enter admin routes.
- Gated shared admin CRUD create/update/delete actions through resource action policies while keeping ADMIN full access.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after adding the role/permission system.

### Global Feedback System

- Added centralized feedback components: `GlobalErrorBoundary`, `ApiErrorAlert`, `EmptyState`, and `PermissionDenied`.
- Extended `ToastProvider` with loading toasts, API-error feedback, toast updates, and promise-style feedback helpers.
- Added `apiErrorFeedback.js` and `apiErrorEvents.js` for global normalized API error feedback.
- Wired the Axios error handler to dispatch global auth, validation, network, timeout, server, and permission errors.
- Reused shared empty and permission-denied states in product listing, admin tables, and route guard fallback UI.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after the feedback system update.

### Product API Ecommerce Integration

- Connected storefront `/products` to real Product API data through `frontend/src/hooks/useProducts.js`.
- Connected storefront `/products/:slug` to real Product API data through `frontend/src/hooks/useProductDetail.js`.
- Added `frontend/src/api/productMapper.js` to normalize flexible Product API listing, detail, variant, media, review, and pagination response shapes before data reaches UI components.
- Extended `frontend/src/api/productService.js` with catalog listing, detail, review, slug lookup, and detail-enrichment helpers while preserving existing admin CRUD exports.
- Replaced the old mock-backed listing hook with Product API-backed fetching, category filtering, brand filtering, loading, error, empty, and pagination foundation states.
- Added `VITE_PRODUCT_API_PATH` to configure the Product API endpoint.
- Preserved the existing PLP/PDP dark ecommerce UI and layout while replacing direct mock product data usage in those routes.
- Verified `npm run lint`, `npm run build`, and `git diff --check` after connecting Product API data.

### Cart Checkout And Order API Integration

- Added backend `POST /api/orders` for authenticated checkout order creation with active-user validation, coupon validation, stock checks, and stock reservation.
- Added `frontend/src/cart` with `CartProvider` and `useCart` as the single shared cart state for header drawer, cart page, product cards, product detail actions, and checkout.
- Added `frontend/src/api/checkoutMapper.js` for create-order payload mapping, coupon validation, discount calculation, and order response normalization.
- Extended `couponService.js`, `orderService.js`, and `userService.js` for checkout coupon application, order creation, and profile prefill.
- Added reusable checkout hooks: `useCheckoutCoupon.js`, `useCheckoutOrder.js`, and `useCheckoutProfile.js`.
- Connected `/cart` and `/checkout` to backend coupon/order flows with loading, invalid coupon, unauthorized checkout, out-of-stock/API error handling, and success feedback.
- Kept VNPay and MoMo as disabled placeholders; no real payment gateway was integrated.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`.

### Authenticated Account Pages

- Added protected storefront account routes `/profile`, `/profile/orders`, and `/profile/settings`.
- Added account components `ProfileLayout`, `AccountSidebar`, and `OrdersTable` with dark premium ecommerce styling, avatar placeholder, logout, responsive navigation, and order-detail expansion.
- Added `frontend/src/api/accountMapper.js`, `useAccountProfile.js`, and account methods in `userService.js` and `orderService.js`.
- Added backend User Profile APIs `GET/PUT /api/users/{userId}/profile`.
- Added backend User Order APIs `GET /api/orders?userId=...` and `GET /api/orders/{orderId}?userId=...`.
- Updated the storefront header account and order links to point to the protected profile area for authenticated sessions.
- Verified `npm run lint`, `npm run build`, and `mvn -q -DskipTests compile`.

### Phase 4 Backend Integration Review

- Added `frontend/src/api/resourceService.js` and refactored CRUD API service modules to use shared request logic.
- Hardened refresh-token handling so `401` refresh retries only run when a stored refresh token exists.
- Tightened remembered redirect sanitization and kept admin/staff sessions out of customer-only checkout/account routes.
- Aligned staff admin module access with resource view permissions across route policies, sidebar filtering, and CRUD view actions.
- Added store/admin-specific route loading states to reduce wrong-surface and unauthorized flashing during session restore.
- Reused account profile normalization in checkout profile prefill and reset account order state when no customer user id is available.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, and API context to mark Phase 4 completed.
- Marked the project ready for Phase 5 — Admin Dashboard System.
- Verified `npm run lint`, `npm run build`, `git diff --check`, and `mvn -q -DskipTests compile`.

### Admin Dashboard Architecture Foundation

- Added `frontend/src/admin/` with `components`, `layouts`, `pages`, `hooks`, `services`, `tables`, `forms`, `modals`, and `analytics` namespaces.
- Added reusable admin hooks: `useAdminTable`, `useAdminFilters`, `useAdminPagination`, and `useAdminModal`.
- Added admin module registry and CRUD service wrappers for categories, brands, products, variants, media, users, staff, roles, permissions, orders, warehouses, and coupons.
- Added `variantService.js`, `roleService.js`, and `permissionService.js` under `frontend/src/api` using the shared resource-service pattern.
- Routed admin layout and page imports through `frontend/src/admin` bridge exports without redesigning existing UI.
- Updated admin `CrudPage` to use `useAdminTable` and moved shared table actions into `frontend/src/admin/tables`.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, frontend guide, and API integration notes.
- Verified `npm run lint`, `npm run build`, and `git diff --check`.

### Production Admin Layout

- Rebuilt the admin shell under `frontend/src/admin/layouts` with `AdminLayout`, `AdminSidebar`, `AdminTopbar`, `Breadcrumbs`, and `SidebarSection`.
- Added a dark responsive sidebar, sticky glass topbar, breadcrumbs, notification placeholder, profile dropdown, desktop collapsed mode, mobile drawer behavior, and route-aware sidebar active states.
- Kept the legacy `frontend/src/layouts/AdminLayout.jsx` path as a compatibility bridge to the new admin layout namespace.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, and this changelog.
- Verified `npm run lint` and `npm run build`. Build still reports the existing Vite chunk-size warning.

### Admin Dashboard Analytics Page

- Rebuilt `/admin/dashboard` as a responsive ecommerce SaaS analytics dashboard.
- Added KPI cards, revenue chart, orders chart, recent orders, top products, low-stock products, sales overview, and recent activity sections.
- Added reusable dashboard components under `frontend/src/admin/components/dashboard`: `StatCard`, `RevenueChart`, `OrdersChart`, `ActivityFeed`, and `AnalyticsCard`.
- Added realistic mock analytics data to `frontend/src/data/adminMock.js`.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, and this changelog.
- Verified `npm run lint` and `npm run build`. Build still reports the existing Vite chunk-size warning.

### Admin CRUD Foundation

- Added reusable CRUD foundation components under `frontend/src/admin/components/crud`: `AdminTable`, `AdminForm`, `AdminModal`, `AdminDrawer`, `AdminFilters`, `AdminSearch`, `AdminPagination`, `StatusBadge`, `ConfirmDialog`, and `EmptyAdminState`.
- Added reusable support for table sorting, pagination, search controls, filters, bulk actions, row actions, loading states, and empty states.
- Bridged existing admin `DataTable`, `CrudPage`, and `StatusBadge` imports toward the new CRUD foundation for compatibility.
- Updated `CURRENT_STATE.md`, `NEXT_TASKS.md`, and this changelog.
- Verified `npm run lint` and `npm run build`. Build still reports the existing Vite chunk-size warning.

### Backend Startup Stabilization

- Fixed payment utility property binding so `VNPayUtils` and `MomoUtils` read `payment.*` config keys, with fallback support for legacy `electronics.app.*` keys.
- Removed the backend startup crash caused by unresolved placeholder `electronics.app.vnpay.secretKey`.
- Verified `mvn clean spring-boot:run` now progresses to web-server startup.
- Confirmed local startup can still fail when port `8080` is occupied; verified successful startup using `--server.port=8081` and `200` response at `/swagger-ui/index.html`.

### Backend Admin Login Debug

- Added backend CORS configuration in `SecurityConfig` for localhost frontend origins (`localhost` and `127.0.0.1` with any port), and enabled `.cors()` in the security filter chain.
- Verified preflight requests now return `Access-Control-Allow-Origin` and related CORS headers for `http://localhost:5173`.
- Confirmed admin auth uses `staffs` (email-based login), not `users`.
- Confirmed current PostgreSQL schema drift causes admin login `500`: `staffs` is missing `full_name` and `username`; `roles` is missing `status` and `updated_at`.

### Backend Admin Login Schema Patch

- Investigated new login `500` stacktrace and identified another schema mismatch in `permissions` (`code` and `updated_at` missing).
- Patched local PostgreSQL schema for admin-auth tables (`staffs`, `roles`, `permissions`) and backfilled required values.
- Verified `POST /api/admin/auth/login` returns `200` with `admin@shop.com` after schema patch.
- Verified CORS preflight for `/api/admin/auth/login` still returns `Access-Control-Allow-Origin` for `http://localhost:5173`.

### Admin Category Management API Integration

- Rebuilt `frontend/src/pages/admin/Categories.jsx` into a real API-backed admin module at `/admin/categories`.
- Added real category list/table with server-side search, status filter, pagination, loading state, and API error handling.
- Added create and update flows using reusable `AdminDrawer` + `AdminForm`.
- Added soft-delete flow using reusable `ConfirmDialog`.
- Added status toggle using backend `PATCH /admin/categories/{id}/status` with optimistic UI and rollback on failure.
- Added `frontend/src/api/categoryMapper.js` to normalize category page/detail responses and standardize request payload mapping.
- Upgraded `frontend/src/api/categoryService.js` with normalized `getAll/getById/create/update/remove/updateStatus` methods for the Category module.
- Verified `npm run lint` and `npm run build` in `frontend/`. Build still reports the existing Vite chunk-size warning.
