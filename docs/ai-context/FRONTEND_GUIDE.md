# FRONTEND_GUIDE

## Purpose

This guide describes the frontend direction for ElectronicsManagement.

Current phase:

```text
Phase 1 — Frontend Foundation
```

## Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- lucide-react
- Recharts

## Current Routes

Client:

- `/`
- `/products`
- `/products/:slug`
- `/cart`
- `/checkout`
- `/login`
- `/register`

Admin:

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

## Current Structure

```text
frontend/src/
├─ api/
│  ├─ client.js
│  ├─ authService.js
│  ├─ categoryService.js
│  ├─ brandService.js
│  ├─ productService.js
│  ├─ userService.js
│  ├─ staffService.js
│  ├─ orderService.js
│  ├─ warehouseService.js
│  ├─ couponService.js
│  └─ mediaService.js
├─ assets/
├─ components/
│  ├─ common/
│  ├─ home/
│  ├─ layout/
│  │  └─ admin/
│  ├─ product/
│  └─ ui/
│     ├─ Badge.jsx
│     ├─ Button.jsx
│     ├─ Card.jsx
│     ├─ Container.jsx
│     ├─ IconButton.jsx
│     ├─ Input.jsx
│     ├─ Price.jsx
│     ├─ Rating.jsx
│     ├─ SectionTitle.jsx
│     └─ admin/
├─ constants/
├─ data/
│  ├─ adminMock.js
│  ├─ categories.js
│  ├─ index.js
│  ├─ products.js
│  ├─ promotions.js
│  └─ services.js
├─ hooks/
├─ layouts/
│  └─ AdminLayout.jsx
├─ pages/
│  ├─ admin/
│  │  ├─ AdminLogin.jsx
│  │  └─ Dashboard.jsx
│  └─ client/
│     ├─ Cart.jsx
│     ├─ Checkout.jsx
│     ├─ Home.jsx
│     ├─ Login.jsx
│     ├─ ProductDetail.jsx
│     ├─ Products.jsx
│     └─ Register.jsx
├─ routes/
│  └─ AppRoutes.jsx
├─ services/
├─ styles/
│  ├─ tokens.js
│  └─ index.css
├─ utils/
│  └─ formatters.js
├─ App.jsx
└─ main.jsx
```

## Client UI Direction

- Dark gaming ecommerce.
- Premium product-focused feel.
- Blue accent.
- Strong product cards and CTA states.
- Existing homepage layout must be preserved.

## Design Tokens

Token sources:

- `src/styles/tokens.js`: JavaScript design tokens used by Tailwind config and future JS-driven UI logic.
- `src/styles/index.css`: CSS custom properties and shared utilities such as `store-page-shell`, `store-glass`, `store-glass-soft`, `neon-blue-glow`, and `premium-transition`.

Token groups:

- colors
- spacing
- radius
- shadows
- typography
- zIndex
- transitions

Use tokens for new shared UI work. Avoid broad rewrites of stable components when token adoption would not improve maintainability.

## Admin UI Direction

- Modern dashboard.
- Dark navy sidebar.
- Light content area.
- KPI cards, charts, CRUD tables, badges, and action icons.

## Component Rules

- Pages compose layout and data flow.
- Components should be focused and reusable.
- Use props instead of importing data inside small reusable components.
- Keep mock data grouped by domain under `src/data`.
- Keep API calls out of presentational components.
- Keep API calls centralized through service modules under `src/api`.
- Prefer shared primitives in `src/components/ui` before duplicating button, card, badge, input, price, rating, or section-title markup.

## Routing Rules

- Keep route definitions centralized in `src/routes/AppRoutes.jsx`.
- `/` must continue to render the existing homepage.
- `/admin` should redirect to `/admin/dashboard`.
- `/admin/login` stays outside `AdminLayout`.
- Placeholder pages are acceptable while API and page-specific workflows are not ready, but they should be styled and informative.

## Reusable UI Primitives

Shared frontend primitives live in `src/components/ui`:

- `Button.jsx`: primary, outline, and ghost variants with sm, md, and lg sizes.
- `Card.jsx`: shared card shell variants for store, glass, product, flash, and admin surfaces.
- `Badge.jsx`: compact label/status badges for ecommerce UI.
- `Input.jsx`: dark and light input shells.
- `SectionTitle.jsx`: repeated storefront section heading/action pattern.
- `IconButton.jsx`: icon-only action buttons.
- `Container.jsx`: page-width container helper.
- `Price.jsx`: currency display with optional old price.
- `Rating.jsx`: star rating with optional review count.

Use these primitives for new frontend work unless a feature needs a clearly different interaction pattern.

## Future Structure

When the client storefront grows, keep the current structure and add files inside the existing domain folders:

```text
src/components/home/
src/components/product/
src/pages/client/
src/routes/
src/services/
```

Do not move files just for neatness. Move them when it reduces confusion.

## Commands

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run build
```
