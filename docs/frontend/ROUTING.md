# ROUTING

## Purpose

This document defines frontend route conventions for the React application.

Routes are owned by:

```text
frontend/src/App.jsx
```

## Current Routes

Client:

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `Home` | Dark e-commerce homepage. |

Admin:

| Route | Component | Notes |
| --- | --- | --- |
| `/admin` | `Dashboard` | Admin dashboard index route. |
| `/admin/categories` | `Categories` | Category CRUD page. |
| `/admin/brands` | `Brands` | Brand CRUD page. |
| `/admin/products` | `Products` | Product CRUD page. |
| `/admin/variants` | `Variants` | Variant CRUD page. |
| `/admin/media` | `Media` | Media management page. |
| `/admin/users` | `Users` | Customer management page. |
| `/admin/staff` | `Staff` | Staff management page. |
| `/admin/roles` | `Roles` | Role and permission management page. |
| `/admin/orders` | `Orders` | Order management page. |
| `/admin/warehouse` | `Warehouse` | Warehouse management page. |
| `/admin/coupons` | `Coupons` | Coupon management page. |
| `/admin/reports/revenue` | `Revenue` | Revenue report page. |
| `/admin/reports/best-sellers` | `BestSellers` | Best-selling products report page. |
| `/admin/reports/activity` | `ActivityLog` | Activity log report page. |

Fallback:

```text
* -> /
```

## Route Boundaries

Client routes:

- Customer-facing.
- Should use storefront visual language.
- Should not render admin layout components.

Admin routes:

- Staff-facing.
- Should be nested under `AdminLayout`.
- Should use admin visual language.
- Should be protected once admin login is added.

## Adding A Client Route

Recommended future pattern:

```text
src/pages/client/ProductList.jsx
src/pages/client/ProductDetail.jsx
src/pages/client/Cart.jsx
src/pages/client/Checkout.jsx
```

Suggested routes:

| Route | Purpose |
| --- | --- |
| `/products` | Product listing. |
| `/products/:slug` | Product detail. |
| `/cart` | Cart. |
| `/checkout` | Checkout. |
| `/orders/track` | Order tracking. |
| `/login` | Customer login. |
| `/register` | Customer registration. |

## Adding An Admin Route

Steps:

1. Create the page in `src/pages/admin/`.
2. Add the route under the `/admin` nested route in `App.jsx`.
3. Add the sidebar item in `src/components/admin/Sidebar.jsx` when it should be navigable.
4. Add mock data in `src/data/mockAdminData.js` if the API is not ready.
5. Add an API module later when the backend endpoint exists.

## Protected Routes

Admin protection is not implemented yet.

Expected future behavior:

- `/admin/login` is public.
- `/admin/*` requires `admin_access_token`.
- Missing or expired token redirects to `/admin/login`.
- `401` responses remove `admin_access_token`.

Suggested structure:

```text
AdminProtectedRoute
  -> checks token
  -> renders AdminLayout
  -> redirects to /admin/login when unauthenticated
```

## URL Naming Rules

- Use lowercase route segments.
- Use hyphenated multi-word route segments.
- Keep admin routes under `/admin`.
- Prefer plural nouns for collection pages.
- Use `:id` for admin detail/edit routes when added.
- Use `:slug` for client product/category SEO routes when added.

Examples:

```text
/admin/products
/admin/products/:id
/admin/reports/best-sellers
/products/:slug
/categories/:slug
```

## Backend API Path Reminder

Frontend route paths are not API paths.

The frontend Axios base URL already includes:

```text
http://localhost:8080/api
```

Frontend API calls should use:

```text
/admin/categories
```

Not:

```text
/api/admin/categories
```
