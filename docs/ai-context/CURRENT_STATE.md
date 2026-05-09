# CURRENT_STATE

## Purpose

This file is the current source of truth for project state.

Always update this file after meaningful work.

## Current Phase

```text
Phase 3 — Client Ecommerce Pages completed
```

## Current Summary

ElectronicsManagement has completed Phase 3 client ecommerce pages and polish. The project is ready for Phase 4 — Auth + Backend Integration.

The client storefront now includes the homepage, product listing, product detail, cart, checkout, customer authentication, wishlist, recently viewed, and search overlay experiences using mock/local state. The admin dashboard exists as a mock modern dashboard. Backend admin APIs exist. Frontend admin/staff authentication is now connected to the backend JWT API, but admin CRUD pages are not connected to real backend data yet.

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

The storefront product listing page now exists at `/products` with mock-backed product grid, searchable catalog filtering, filter sidebar, active filters, sorting, pagination, breadcrumb, category banner, and responsive mobile filtering.

The product listing filter/search state now lives in `frontend/src/hooks/useProductFilters.js`.

The storefront product detail page now exists at `/products/:slug` with mock-backed gallery, variants, quantity, purchase actions, specs, description, reviews, shipping information, stock information, and related products.

The product detail gallery now supports loading skeletons, smoother image switching, stronger thumbnail active states, hover zoom, fullscreen preview, and keyboard navigation in preview mode.

The storefront header now includes a mock-backed cart drawer with slide-in animation, blurred backdrop, item quantity updates, remove actions, subtotal, coupon placeholder, continue-shopping action, checkout action, and animated cart count badge.

The storefront cart page now exists at `/cart` with mock-backed cart items, quantity updates, remove actions, coupon input, order summary, shipping estimate, continue-shopping CTA, checkout CTA, and sticky desktop summary.

The storefront checkout page now exists at `/checkout` with mock-backed customer information, shipping address, shipping method, payment method, form validation UI, coupon placeholder, and sticky order summary.

The storefront customer authentication pages now exist at `/login` and `/register` with reusable dark auth layout/forms, social login placeholders, remember-me, forgot-password placeholder, local validation UI, and responsive dark glass styling. The `/login` form now calls the backend JWT auth service; `/register` remains local until customer registration APIs are ready.

The storefront wishlist page now exists at `/wishlist` with localStorage-backed wishlist state, product-card wishlist toggles, recently viewed tracking, and reusable wishlist/recently-viewed hooks.

The storefront header now includes a reusable mock-backed search overlay with debounced live suggestions, recent searches, trending searches, product/category/brand result previews, and keyboard navigation behavior.

Phase 2 cleanup normalized shared/admin visual patterns for cards, borders, shadows, hover states, focus states, icon buttons, typography usage, and responsive behavior without a large rewrite.

Frontend routing now includes client ecommerce routes and admin routes with placeholders for pages that are not implemented yet.

The frontend now has a centralized JWT-ready auth architecture with AuthProvider, auth storage helpers, auth state helpers, reusable route guards, and an auth reducer/store namespace. It supports user/admin/staff session shape, roles, permissions, access token, refresh token, authentication status, loading state, session restore, redirect memory, refresh-on-401 flow, and graceful unauthorized UI, and is now used by the real login flow.

The frontend now has a centralized role/permission system with shared route policies, sidebar filtering, reusable permission hooks, PermissionGate, and resource action policies for admin CRUD controls. ADMIN has full admin access, STAFF is limited to staff-allowed admin areas, and USER cannot access admin routes.

The next phase is:

```text
Phase 4 — Auth + Backend Integration
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

## Phase 4 Auth Foundation Items

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

- Client storefront mock data is split across `frontend/src/data/categories.js`, `products.js`, `promotions.js`, and `services.js`.
- `frontend/src/data/products.js` now includes expanded catalog fields for listing workflows, including `sold` and `createdAt`.
- `frontend/src/data/productDetails.js` now enriches mock catalog products for product detail workflows.
- `frontend/src/data/cart.js` now centralizes mock cart item setup for cart drawer and cart page workflows.
- Admin pages use `frontend/src/data/adminMock.js`.
- Shared data exports live in `frontend/src/data/index.js`.
- API client exists at `frontend/src/api/client.js`.
- API config exists at `frontend/src/api/apiConfig.js`.
- API error handling exists at `frontend/src/api/apiErrorHandler.js` and `frontend/src/api/normalizeApiError.js`.
- API refresh-token handling exists at `frontend/src/api/refreshTokenService.js`.
- API service modules now exist in `frontend/src/api` for auth, categories, brands, products, users, staff, orders, warehouses, coupons, and media.
- API service modules use reusable `api.*` helpers instead of duplicating Axios response parsing.
- The shared API client reads the JWT through `frontend/src/auth/authStorage.js` using localStorage key `accessToken`.
- The shared API client reads `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, and `VITE_AUTH_REFRESH_ENDPOINT`.
- Auth session metadata is centralized through `frontend/src/auth` and currently stores safe user, roles, and permissions metadata only.
- `frontend/.env.example` documents `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, and `VITE_AUTH_REFRESH_ENDPOINT`.
- Admin/staff login is connected to the backend JWT API.
- No admin CRUD page is connected to real backend data yet.

Current frontend structure:

- Route definitions live in `frontend/src/routes/AppRoutes.jsx`.
- Auth context, provider, hook, storage, and helpers live in `frontend/src/auth/`.
- Role/permission policy helpers, permission hooks, and PermissionGate live in `frontend/src/auth/`.
- Route guard components and helper UI live in `frontend/src/guards/`.
- Auth reducer exports live in `frontend/src/store/auth/`.
- Toast notification components live in `frontend/src/components/ui/toast/`.
- Client homepage page lives in `frontend/src/pages/client/Home.jsx`.
- Admin pages live in `frontend/src/pages/admin/`.
- Client homepage components live in `frontend/src/components/home/`.
- Cart drawer and cart page components live in `frontend/src/components/cart/`.
- Checkout components live in `frontend/src/components/checkout/`.
- Customer auth components live in `frontend/src/components/auth/`.
- Search overlay components live in `frontend/src/components/search/`.
- Client layout components live in `frontend/src/components/layout/`.
- Product components live in `frontend/src/components/product/`, including listing filters, search, sorting, active filters, empty state, pagination, detail gallery, product info, variants, quantity, specs, reviews, related products, and reusable product cards.
- Product listing state logic lives in `frontend/src/hooks/useProductFilters.js`.
- Wishlist and recently viewed local state logic lives in `frontend/src/hooks/useWishlist.js` and `frontend/src/hooks/useRecentlyViewed.js`.
- Storefront search overlay logic lives in `frontend/src/hooks/useSearch.js`.
- Skeleton loading components live in `frontend/src/components/skeletons/`.
- Admin layout components live in `frontend/src/components/layout/admin/`.
- Shared reusable UI components live in `frontend/src/components/ui/`.
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
- Header cart button now opens the mock-backed cart drawer and reflects cart count from local mock cart state.
- Header search now opens the mock-backed search overlay on desktop and mobile.
- Homepage background, hero banner, promo cards, category cards, service bar, and section separators now have deeper production ecommerce visual polish.
- Homepage now includes a short mock loading state demo that renders dark shimmer skeletons before showing mock data.
- Homepage responsive audit has been completed across mobile, tablet, desktop, and ultra-wide viewports.
- Mobile homepage keeps the hamburger menu, a compact stacked hero, two-column product/category grids, and tighter product card wrapping.
- Tablet homepage now has a balanced hero, promo, service, and category layout with reduced empty space.
- Desktop and ultra-wide homepage still preserve the three-column hero structure and centered max-width layout.
- `/` still renders the existing homepage.
- `/products` now renders the mock-backed product listing page.
- `/products/:slug` now renders the mock-backed product detail page.
- `/cart` now renders the mock-backed cart page.
- `/checkout` now renders the mock-backed checkout page behind `ProtectedRoute`.
- `/login` now renders the dark auth page and submits through `authService.login()`.
- `/register` still renders the local ecommerce registration page until customer registration APIs exist and is now guest-only.
- `/wishlist` now renders the localStorage-backed wishlist and recently viewed page.
- Client routes beyond homepage, product listing, product detail, cart, checkout, login, register, and wishlist that are not fully implemented render dark ecommerce placeholder pages.
- `/admin/login` now renders the dark premium admin auth page and submits through `authService.login()`.
- `/admin/*` routes are protected by `StaffRoute`; unauthenticated users are redirected to `/admin/login`.
- `/admin/users`, `/admin/staff`, and `/admin/roles` are additionally protected by `AdminRoute`.
- Admin route access, sidebar visibility, page access, and shared CRUD action buttons now use centralized role/permission policies.
- STAFF sessions do not see or access Role Management; USER sessions are blocked from admin routes; ADMIN sessions have full admin access.
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
- `mvn clean compile -DskipTests` passed in `backend/electronics/` after adding auth error handlers.
- `mvn test` failed due existing backend context issues: missing `AddressMapper` bean for `AdminAddressServiceImpl` and a database DDL migration warning for `media.display_order` containing null values.
- Build still reports a Vite chunk-size warning for a JavaScript bundle over 500 kB.

## Known Issues

- Admin CRUD pages still use mock data and are not connected to backend APIs.
- Remaining future client ecommerce routes beyond the implemented homepage, product listing, product detail, cart, checkout, login, register, and wishlist pages are styled placeholders.
- Public storefront APIs for product browsing, cart, checkout, and customer registration are not complete.
- The current real JWT login endpoint is the backend admin/staff auth endpoint; customer login should move to a public customer auth endpoint when that API exists.
- The frontend refresh-token flow is ready, but the current backend admin auth controller only exposes login/logout; real refresh requires backend `refreshToken` response support and `POST /admin/auth/refresh`.
- `/checkout` is frontend-auth protected, but checkout submission and payment remain mock/local until public checkout APIs are ready.
- Backend `mvn test` is blocked by existing ApplicationContext issues unrelated to the login UI integration.
- Build output is valid, but Vite reports a large bundle warning that should be handled later with code splitting.

## Next Phase

```text
Phase 4 — Auth + Backend Integration
```

Next focus:

- Connect admin CRUD pages to backend APIs one resource at a time.
- Start with admin categories through `frontend/src/api/categoryService.js`.
- Keep public storefront customer auth, cart, checkout, payment, wishlist, and search on mock/local state until public storefront API contracts are ready.

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
- Do not assume admin CRUD pages use real API data.
- Do not assume public ecommerce APIs are ready.
- Do not assume checkout backend submission or real payment integration exists.
- Do not assume production deployment is ready.

## Last Updated

2026-05-09
