# FRONTEND_STRUCTURE

## Purpose

This document describes the current and recommended frontend structure for the React application in `frontend/`.

The frontend contains two surfaces:

- Client storefront at `/`.
- Admin console under `/admin`.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Axios
- lucide-react
- Recharts

Additional packages are installed, including Ant Design, react-icons, and Swiper, but the current project rules prefer Tailwind CSS and lucide-react for new UI work unless a feature explicitly needs another library.

## Current Source Tree

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
├─ components/
│  ├─ admin/
│  │  ├─ CrudPage.jsx
│  │  ├─ DataTable.jsx
│  │  ├─ PageHeader.jsx
│  │  ├─ Sidebar.jsx
│  │  ├─ StatCard.jsx
│  │  ├─ StatusBadge.jsx
│  │  └─ Topbar.jsx
│  ├─ AnnouncementBar.jsx
│  ├─ CategorySidebar.jsx
│  ├─ FeaturedCategories.jsx
│  ├─ FlashSaleCard.jsx
│  ├─ Header.jsx
│  ├─ HeroBanner.jsx
│  ├─ ProductCard.jsx
│  ├─ PromoCard.jsx
│  └─ ServiceBar.jsx
├─ data/
│  ├─ mockAdminData.js
│  └─ mockData.js
├─ layouts/
│  └─ AdminLayout.jsx
├─ pages/
│  ├─ admin/
│  │  ├─ ActivityLog.jsx
│  │  ├─ BestSellers.jsx
│  │  ├─ Brands.jsx
│  │  ├─ Categories.jsx
│  │  ├─ Coupons.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ Media.jsx
│  │  ├─ Orders.jsx
│  │  ├─ Products.jsx
│  │  ├─ Revenue.jsx
│  │  ├─ Roles.jsx
│  │  ├─ Staff.jsx
│  │  ├─ Users.jsx
│  │  ├─ Variants.jsx
│  │  └─ Warehouse.jsx
│  └─ Home.jsx
├─ utils/
│  └─ formatters.js
├─ App.jsx
├─ index.css
└─ main.jsx
```

## Route Structure

`frontend/src/App.jsx` owns top-level routing.

Client route:

| Route | Page |
| --- | --- |
| `/` | `Home` |

Admin routes:

| Route | Page |
| --- | --- |
| `/admin` | `Dashboard` |
| `/admin/categories` | `Categories` |
| `/admin/brands` | `Brands` |
| `/admin/products` | `Products` |
| `/admin/variants` | `Variants` |
| `/admin/media` | `Media` |
| `/admin/users` | `Users` |
| `/admin/staff` | `Staff` |
| `/admin/roles` | `Roles` |
| `/admin/orders` | `Orders` |
| `/admin/warehouse` | `Warehouse` |
| `/admin/coupons` | `Coupons` |
| `/admin/reports/revenue` | `Revenue` |
| `/admin/reports/best-sellers` | `BestSellers` |
| `/admin/reports/activity` | `ActivityLog` |

Fallback route:

```text
* -> /
```

## Layout Model

Client storefront:

- Currently rendered directly by `Home.jsx`.
- Uses dark e-commerce components under `src/components/`.
- Uses `src/data/mockData.js`.

Admin console:

- Uses nested routing under `AdminLayout.jsx`.
- `AdminLayout` owns sidebar, topbar, and page shell.
- Admin pages use reusable admin components under `src/components/admin/`.
- Uses `src/data/mockAdminData.js`.

## Recommended Future Structure

As the storefront grows, split client and admin more explicitly:

```text
frontend/src/
├─ api/
│  ├─ client.js
│  ├─ authService.js
│  ├─ categoryService.js
│  ├─ brandService.js
│  └─ productService.js
├─ components/
│  ├─ admin/
│  └─ client/
├─ pages/
│  ├─ admin/
│  └─ client/
├─ layouts/
│  ├─ AdminLayout.jsx
│  └─ ClientLayout.jsx
└─ data/
   ├─ mockAdminData.js
   └─ mockData.js
```

Keep this split conservative. Move files only when the additional structure removes confusion.

## API Layer

The shared Axios client is `frontend/src/api/client.js`.

Current behavior:

- Base URL: `VITE_API_BASE_URL` or `http://localhost:8080/api`.
- Timeout: 15 seconds.
- Default content type: `application/json`.
- Reads `accessToken` from `localStorage`.
- Adds `Authorization: Bearer <token>` when a token exists.
- Removes the admin token on `401`.

API integration should use service modules rather than direct axios calls inside large UI components.

Example target pattern:

```text
pages/admin/Categories.jsx
  -> api/categoryService.js
  -> api/client.js
  -> backend /api/admin/categories
```

## Data Strategy

Current state:

- Client mock data: `src/data/mockData.js`.
- Admin mock data: `src/data/mockAdminData.js`.

When replacing mock data:

- Keep DTO shapes close to backend response DTOs.
- Replace data access at the page/service boundary.
- Preserve the same UI components where possible.
- Add loading, error, and empty states before switching pages to real API data.

## Styling Rules

Client storefront:

- Dark theme: `#050B14` / `#07111F`.
- Accent blue: `#005BFF`.
- Dark gradient cards with `#1E293B` borders.
- Product and purchase CTAs should stay visually prominent.

Admin console:

- Sidebar: `#07111F`.
- Main background: `#F6F8FB`.
- Primary blue: `#005BFF`.
- White cards, light borders, soft shadows.
- Work-focused layout with scannable tables and clear actions.

Shared rules:

- Use Tailwind CSS.
- Prefer lucide-react icons.
- Keep components responsive.
- Avoid unnecessary inline styles.

## Component Responsibilities

Pages:

- Compose layout.
- Own page-level state.
- Fetch data through API modules when real APIs are connected.
- Pass normalized props to reusable components.

Reusable components:

- Render focused UI pieces.
- Avoid owning cross-page business logic.
- Receive data and callbacks through props.

Data files:

- Hold mock data only.
- Should be easy to delete or replace once APIs are connected.

## Environment Variables

Use:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Do not hardcode backend hosts in components.

## Commands

Run from `frontend/`:

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Near-Term Frontend Priorities

1. Add admin login page and protected admin route behavior.
2. Connect admin categories, brands, and products to real APIs.
3. Split client components into `components/client/` when more client pages are added.
4. Add client product listing and product detail pages.
5. Add cart and checkout UI after public backend endpoints exist.
