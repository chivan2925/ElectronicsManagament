# CURRENT_STATE

## Purpose

This file is the current source of truth for project state.

Always update this file after meaningful work.

## Current Phase

```text
Phase 2 — Design System completed
```

## Current Summary

ElectronicsManagement has completed Phase 2 design-system cleanup and audit. The project is ready for Phase 3 — Client Ecommerce Pages.

The client homepage exists and has a dark gaming ecommerce visual direction. The admin dashboard exists as a mock modern dashboard. Backend admin APIs exist, but the frontend is not connected to real backend APIs yet.

The frontend folder structure has been normalized without changing the current visual UI.

The frontend now has a theme system for shared colors, spacing, radius, shadows, typography, z-index, and transitions.

The storefront typography system now includes display, heading, title, body, caption, price, card-title, and muted text utilities.

The storefront spacing and layout system now includes page, section, grid, and flex utilities for consistent ecommerce rhythm.

The storefront motion system now uses Framer Motion presets for subtle fade, stagger, hover lift, glow, and image zoom interactions.

The storefront product card pattern now has production-style ecommerce polish with improved image framing, discount and stock badges, wishlist placeholder, rating treatment, pricing area, and quick-add CTA.

The storefront header now has production-style ecommerce polish with scroll-aware sticky blur, improved search, category dropdown, cart badge motion, and a responsive mobile menu.

The homepage visual system now has stronger production-level depth through layered dark gradients, subtle texture, hero lighting, neon promo accents, and section separation.

The storefront now has a reusable dark skeleton loading system with shimmer placeholders for headers, banners, categories, and product cards.

The frontend now has shared reusable UI primitives for buttons, cards, badges, inputs, section titles, icon buttons, containers, prices, and ratings.

Phase 2 cleanup normalized shared/admin visual patterns for cards, borders, shadows, hover states, focus states, icon buttons, typography usage, and responsive behavior without a large rewrite.

Frontend routing now includes client ecommerce routes and admin routes with placeholders for pages that are not implemented yet.

The next phase is:

```text
Phase 3 — Client Ecommerce Pages
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

- Client homepage mock data is split across `frontend/src/data/categories.js`, `products.js`, `promotions.js`, and `services.js`.
- Admin pages use `frontend/src/data/adminMock.js`.
- Shared data exports live in `frontend/src/data/index.js`.
- API client exists at `frontend/src/api/client.js`.
- API service modules now exist in `frontend/src/api` for auth, categories, brands, products, users, staff, orders, warehouses, coupons, and media.
- The shared API client reads the JWT from localStorage key `accessToken`.
- `frontend/.env.example` documents `VITE_API_BASE_URL`.
- No admin page is connected to real backend data yet.

Current frontend structure:

- Route definitions live in `frontend/src/routes/AppRoutes.jsx`.
- Client homepage page lives in `frontend/src/pages/client/Home.jsx`.
- Admin pages live in `frontend/src/pages/admin/`.
- Client homepage components live in `frontend/src/components/home/`.
- Client layout components live in `frontend/src/components/layout/`.
- Product components live in `frontend/src/components/product/`.
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
- Homepage background, hero banner, promo cards, category cards, service bar, and section separators now have deeper production ecommerce visual polish.
- Homepage now includes a short mock loading state demo that renders dark shimmer skeletons before showing mock data.
- Homepage responsive audit has been completed across mobile, tablet, desktop, and ultra-wide viewports.
- Mobile homepage keeps the hamburger menu, a compact stacked hero, two-column product/category grids, and tighter product card wrapping.
- Tablet homepage now has a balanced hero, promo, service, and category layout with reduced empty space.
- Desktop and ultra-wide homepage still preserve the three-column hero structure and centered max-width layout.
- `/` still renders the existing homepage.
- Client routes that are not fully implemented render dark ecommerce placeholder pages.
- `/admin/login` renders an admin auth placeholder page.
- `/admin` redirects to `/admin/dashboard`.

Latest validation:

- Responsive viewport checks passed for mobile, tablet, desktop, and ultra-wide homepage layouts after the responsive audit.
- Document-level overflow checks passed for `/`, `/admin/dashboard`, and `/admin/products` after the Phase 2 cleanup.
- `npm run lint` passed in `frontend/` after the Phase 2 cleanup and audit.
- `npm run build` passed in `frontend/` after the Phase 2 cleanup and audit.
- Build still reports a Vite chunk-size warning for a JavaScript bundle over 500 kB.

## Known Issues

- Admin authentication is still a placeholder UI and is not wired to `authService`.
- Admin routes are not protected yet.
- Admin CRUD pages still use mock data and are not connected to backend APIs.
- Client ecommerce routes beyond the homepage are styled placeholders.
- Public storefront APIs for product browsing, cart, checkout, and customer auth are not complete.
- Build output is valid, but Vite reports a large bundle warning that should be handled later with code splitting.

## Next Phase

```text
Phase 3 — Client Ecommerce Pages
```

Next focus:

- Build real mock-backed client ecommerce pages for product listing and product detail first.
- Add category browsing and filtering UI using the established storefront patterns.
- Extend cart, checkout, login, and register flows with mock data while public APIs are incomplete.
- Keep admin API integration prepared but do not connect homepage to live APIs yet.

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

- Do not assume frontend auth is implemented.
- Do not assume admin routes are protected.
- Do not assume admin CRUD pages use real API data.
- Do not assume public ecommerce APIs are ready.
- Do not assume checkout exists.
- Do not assume production deployment is ready.

## Last Updated

2026-05-09
