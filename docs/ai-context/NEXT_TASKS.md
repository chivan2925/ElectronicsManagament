# NEXT_TASKS

## Purpose

This file tracks the next practical tasks for AI and developer work.

Always update this file after meaningful work.

## Current Phase

```text
Next phase — Design System + Client Ecommerce pages
```

## Immediate Priorities

1. Preserve the existing homepage layout.
2. Keep the normalized frontend folder structure stable.
3. Tighten design-system consistency without broad rewrites.
4. Build client ecommerce pages with mock data.
5. Keep modular catalog mock data aligned with the electronics/gaming category list.
6. Keep AI context docs current.

## Next Recommended Tasks

### Frontend Foundation Maintenance

- Keep client and admin components separated.
- Keep `src/api/client.js` as the only shared Axios client.
- Keep resource API calls centralized through the service modules in `src/api`.
- Keep mock data centralized in the domain modules under `src/data`.
- Keep route definitions centralized in `src/routes/AppRoutes.jsx`.

### Design System Preparation

- Expand usage of the theme utilities where it reduces repeated classes without changing UI.
- Continue applying typography utilities to new client ecommerce pages.
- Continue applying spacing/layout utilities to new client ecommerce pages.
- Continue applying the shared Framer Motion presets to new client ecommerce cards and CTAs.
- Reuse the polished `ProductCard` pattern on product listing and recommendation sections.
- Reuse the polished storefront header interaction patterns on future client ecommerce pages.
- Reuse the homepage visual depth patterns on future client ecommerce pages without changing their layout structure.
- Reuse `src/components/skeletons` for future mock-backed and API-backed loading states.
- Reuse `src/components/ui` primitives before creating one-off button, badge, price, rating, card, input, or section-title markup.
- Normalize section headings.
- Define reusable client product card patterns.
- Define reusable admin table/action patterns.
- Keep `frontend/src/styles/theme.js`, `tokens.js`, `globals.css`, and `utilities.css` aligned.

### Client Ecommerce

- Replace client placeholder routes with real mock pages for product listing and product detail first.
- Replace cart, checkout, login, and register placeholders with real mock flows after product pages.
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
