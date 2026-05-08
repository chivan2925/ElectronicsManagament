# ADMIN_UI_SPEC

## Purpose

The admin console is a work interface for staff managing the electronics/gaming shop. Prioritize clarity, scanability, fast operations, and consistency.

## Visual Direction

- Sidebar: dark navy `#07111F`.
- Primary: blue `#005BFF`.
- Main background: `#F6F8FB`.
- Cards: white, light borders, soft shadows, 12-16px radius.
- Text: `#111827` for headings, gray for supporting text.
- Icons: lucide-react.

## Layout

- Fixed sidebar on the left.
- Topbar with collapse button, search, dark mode icon, notification, and avatar.
- Content area uses consistent padding.
- Avoid nesting cards inside cards unless it is a modal or a truly framed tool.
- Dashboard should include KPI cards, charts, and tables.

## Sidebar Groups

- Overview
- Management
  - Categories
  - Brands
  - Products
  - Variants
  - Media
- User Management
  - Users
  - Staff
  - Roles / Permissions
- Sales
  - Orders
  - Warehouse
  - Coupons
- Reports
  - Revenue
  - Best-selling products
  - Activity log

## CRUD Page Pattern

Every CRUD page should include:

- Header: title, subtitle, and "Add new" button.
- Search input.
- Table.
- Status badge.
- Action buttons: view, edit, delete.

## Product Admin Columns

The product admin page should include:

- Product image
- Product name
- Category
- Brand
- Price
- Stock
- Status
- Variant/media management actions

## Avoid

- Do not use marketing-style hero sections in admin.
- Do not make oversized cards for data-table pages.
- Do not mix the dark client storefront theme into admin content areas.
- Do not use long text-only action buttons when a familiar icon is clearer.
