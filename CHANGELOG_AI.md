# CHANGELOG_AI

## Purpose

This changelog records AI-assisted project context, documentation, and implementation changes.

Always update this file after meaningful work.

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
