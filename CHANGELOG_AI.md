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
