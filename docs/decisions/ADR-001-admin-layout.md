# ADR-001: Admin Layout

## Status

Accepted.

## Date

2026-05-09

## Context

The project needs an admin console for staff to manage an electronics and gaming e-commerce store.

The admin surface includes:

- Dashboard.
- Category management.
- Brand management.
- Product and variant management.
- Media management.
- User, staff, role, and permission management.
- Order, warehouse, and coupon management.
- Reports.

The same React application also contains a client storefront. The admin UI must not inherit the storefront dark commerce style because staff workflows need clarity, density, and repeated-use ergonomics.

## Decision

Use a SaaS-style admin layout:

- Fixed dark navy sidebar on the left.
- Light topbar above the page content.
- Light gray main background.
- White cards and tables.
- Blue primary actions.
- Nested `/admin` route layout through `AdminLayout`.

Core layout files:

- `frontend/src/layouts/AdminLayout.jsx`
- `frontend/src/components/admin/Sidebar.jsx`
- `frontend/src/components/admin/Topbar.jsx`

Core admin route pattern:

```text
/admin
/admin/categories
/admin/brands
/admin/products
/admin/variants
/admin/media
/admin/users
/admin/staff
/admin/roles
/admin/orders
/admin/warehouse
/admin/coupons
/admin/reports/*
```

## Consequences

Positive:

- Admin pages share one predictable navigation and page shell.
- CRUD pages can reuse table, header, and badge components.
- Client storefront and admin console stay visually separate.
- Future auth protection can wrap the admin layout route.

Tradeoffs:

- The admin layout is less expressive than the storefront.
- Admin-specific components need to stay in `components/admin`.
- Mobile admin behavior needs explicit care because dense tables do not naturally fit small screens.

## Rules

- Admin content must use the light admin surface, not the dark storefront theme.
- Sidebar should remain dark navy `#07111F`.
- Main background should remain `#F6F8FB`.
- Primary action color should remain `#005BFF`.
- CRUD pages should use consistent page header, search, table, status badge, and row action patterns.
- Reports can use charts, but should remain work-focused.

## Future Follow-Up

- Add `/admin/login`.
- Add protected admin routing.
- Connect admin layout to staff profile data.
- Add permission-aware menu visibility after backend authorization is formalized.
