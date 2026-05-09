# PROJECT_CONTEXT

## Project Name

ElectronicsManagement

Repository folder:

```text
ElectronicsManagament
```

The folder name currently contains a spelling mismatch, but documentation should refer to the product as ElectronicsManagement.

## Product Type

ElectronicsManagement is an ecommerce website for electronics and gaming products.

Main surfaces:

- Client ecommerce storefront.
- Admin dashboard.
- Spring Boot backend API.

## Product Categories

Primary category display labels:

- điện thoại
- laptop
- tai nghe
- chuột
- bàn phím
- lót chuột
- PC Gaming
- máy bộ
- linh kiện PC
- ghế gaming
- phụ kiện gaming

## Current Phase

```text
Ready for Phase 5 — Admin Dashboard System
```

Focus:

- Preserve the homepage while building API-backed admin workflows.
- Keep frontend structure clean.
- Keep context docs accurate.
- Convert mock admin pages into authenticated API-backed CRUD workflows.

## Frontend Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- lucide-react
- Recharts

## Backend Stack

- Spring Boot REST API
- Spring Security + JWT
- JPA/Hibernate
- PostgreSQL

## Backend Admin API Scope

The backend has admin APIs for:

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

Additional backend areas:

- Admin authentication.
- Payment transactions.
- Return requests.
- VNPay and Momo system payment webhooks.
- Cloudinary media upload.

## Current Frontend State

- Client homepage exists at `/`.
- Admin dashboard exists at `/admin`.
- Admin CRUD mock pages exist.
- Client catalog, checkout, and account routes have partial real API integration.
- Admin pages still use mock data.
- `frontend/src/api/client.js`, `resourceService.js`, service modules, and the `frontend/src/admin` architecture foundation are ready for Phase 5 admin API integration.

## UI Direction

Client:

- Dark gaming ecommerce.
- Blue accent.
- Premium product-focused feel.
- Preserve existing homepage layout.

Admin:

- Modern dashboard.
- Dark navy sidebar.
- Light content canvas.
- Tables, KPI cards, charts, badges, and CRUD actions.

## Important Constraint

Do not break the existing homepage layout.

Allowed:

- Visual polish.
- Hover states.
- Transitions.
- Typography improvements.
- Responsive fixes that keep the same structure.

Not allowed without explicit user approval:

- Removing major homepage sections.
- Reordering major homepage sections.
- Replacing the hero layout structure.
- Converting client homepage to admin-style UI.
