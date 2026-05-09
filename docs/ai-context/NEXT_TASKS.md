# NEXT_TASKS

## Purpose

This file tracks the next practical tasks for AI and developer work.

Always update this file after meaningful work.

## Current Phase

```text
Phase 3 — Client Ecommerce Pages
```

## Recently Completed

- Added the mock-backed `/products` product listing page with product grid, filter sidebar, sorting, active filters, pagination, breadcrumb, category banner, and responsive mobile filtering.
- Improved `/products` with reusable filter/search state, debounced product search, multi-select filters, collapsible filter groups, mobile filter drawer, and empty state UI.
- Added the mock-backed `/products/:slug` product detail page with gallery, variants, quantity, purchase actions, specs, description, reviews, shipping, stock, and related products.
- Polished the product detail gallery with loading skeletons, smooth image switching, active thumbnails, hover zoom, fullscreen preview, and keyboard preview controls.
- Added a mock-backed cart drawer opened from the storefront header with quantity update, remove item, subtotal, coupon placeholder, continue shopping, checkout action, and animated cart count badge.
- Added the mock-backed `/cart` page with cart item table/grid, quantity updates, remove actions, coupon input, order summary, shipping estimate, continue shopping, checkout CTA, and sticky desktop summary.
- Added the mock-backed `/checkout` page with customer information, shipping address, shipping method, payment method, validation UI, coupon placeholder, and sticky order summary.
- Completed responsive audit and scoped responsive fixes for the ecommerce homepage across mobile, tablet, desktop, and ultra-wide viewports.
- Completed Phase 2 design-system cleanup and audit for shared storefront and admin UI consistency.

## Immediate Priorities

1. Preserve the existing homepage layout.
2. Keep the normalized frontend folder structure stable.
3. Build the remaining client ecommerce pages with mock data.
4. Reuse Phase 2 design-system primitives and visual patterns.
5. Keep modular catalog mock data aligned with the electronics/gaming category list.
6. Keep AI context docs current.

## Next Recommended Tasks

### Frontend Foundation Maintenance

- Keep client and admin components separated.
- Keep `src/api/client.js` as the only shared Axios client.
- Keep resource API calls centralized through the service modules in `src/api`.
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

- Replace login and register placeholders with real mock flows after product, cart, and checkout pages.
- Wire product detail purchase actions, cart drawer, cart page, and checkout page into shared cart state when the cart flow moves beyond local mock state.
- Replace checkout mock submission and payment placeholders only when public checkout/payment APIs are ready.
- Add category route/page when the category browsing plan is ready.
- Wire product cards and header links into the new client routes.
- Replace the homepage mock loading timer with real loading state when storefront data integration begins.

### Auth + API Preparation

- Replace the `/admin/login` placeholder with real admin authentication.
- Add protected admin route wrapper.
- Wire `frontend/src/api/authService.js` into the admin login page.
- Connect admin category pages through `frontend/src/api/categoryService.js` first.
- Add loading, error, empty, and optimistic refresh states before replacing mock admin data.

## Blocked Or Not Ready

- Public customer APIs are not complete.
- Cart and checkout backend APIs are not complete.
- Admin frontend API service modules exist, but pages are not connected to real data yet.
- Production deployment is not ready.

## Maintenance Reminder

When work is completed, update:

- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `CHANGELOG_AI.md`
