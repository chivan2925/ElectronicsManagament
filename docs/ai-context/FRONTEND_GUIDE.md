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

Admin:

- `/admin`
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
│  └─ client.js
├─ components/
│  ├─ admin/
│  └─ client homepage components
├─ data/
│  ├─ mockAdminData.js
│  └─ mockData.js
├─ layouts/
│  └─ AdminLayout.jsx
├─ pages/
│  ├─ admin/
│  └─ Home.jsx
├─ utils/
│  └─ formatters.js
├─ App.jsx
├─ main.jsx
└─ index.css
```

## Client UI Direction

- Dark gaming ecommerce.
- Premium product-focused feel.
- Blue accent.
- Strong product cards and CTA states.
- Existing homepage layout must be preserved.

## Admin UI Direction

- Modern dashboard.
- Dark navy sidebar.
- Light content area.
- KPI cards, charts, CRUD tables, badges, and action icons.

## Component Rules

- Pages compose layout and data flow.
- Components should be focused and reusable.
- Use props instead of importing data inside small reusable components.
- Keep API calls out of presentational components.
- Add API modules later under `src/api`.

## Future Structure

When the client storefront grows, prefer:

```text
src/components/client/
src/pages/client/
src/api/client/
src/api/admin/
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
