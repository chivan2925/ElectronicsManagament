# ADMIN_REFERENCE

## Purpose

This document is the design reference for the admin console.

Admin is a work interface for staff. Prioritize clarity, speed, scanning, and repeated operations.

## Visual Direction

| Token | Value |
| --- | --- |
| Sidebar | `#07111F` |
| Primary | `#005BFF` |
| Main background | `#F6F8FB` |
| Card background | `#FFFFFF` |
| Border | Light gray |
| Radius | 12-16px |

## Layout

Required layout:

- Fixed sidebar on the left.
- Topbar above content.
- Main content area with light background.
- White cards and tables.
- Consistent page padding.

Do not use storefront dark theme inside admin content.

## Sidebar

Menu groups:

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

Sidebar rules:

- Active item should be visually obvious.
- Collapsed state should preserve icon navigation.
- Bottom area may include store info and logout.

## Topbar

Topbar should include:

- Sidebar collapse button.
- Search box.
- Theme icon or mode control.
- Notification icon.
- Admin avatar/profile area.

Keep topbar height stable across pages.

## Dashboard

Dashboard should include:

- KPI cards.
- Revenue line chart.
- Order status donut/pie chart.
- Best-selling products.
- Latest orders.
- Latest products.

Dashboard cards should summarize operational health, not act as marketing sections.

## CRUD Page Pattern

Every CRUD page should include:

- Page header with title, subtitle, and primary action.
- Search input.
- Optional filters.
- Table.
- Status badge.
- Row actions: view, edit, delete.

Primary action label:

```text
Add new
```

Use Vietnamese labels in UI if the app language is Vietnamese, but keep docs in English.

## Table Actions

Preferred action style:

- Icon button for view.
- Icon button for edit.
- Icon button for delete.
- Tooltip or accessible label for icon-only buttons.

Danger actions:

- Use red styling.
- Ask for confirmation before destructive actions.

## Product Admin Requirements

Product table should include:

- Product image.
- Product name.
- Category.
- Brand.
- Price.
- Stock.
- Status.
- Variant/media management actions.

## Empty States

Empty states should:

- Explain what is empty in one short sentence.
- Provide the relevant primary action if useful.
- Avoid large decorative artwork in dense admin pages.

## Loading States

Use:

- Skeleton rows for tables.
- Small spinner for buttons.
- Disabled submit state during requests.

## Error States

Use:

- Inline field errors for validation.
- Toast or alert for request failure.
- Clear retry action for load failures.

Do not display stack traces or raw backend exception names.

## Avoid

- Oversized hero banners.
- Nested cards inside cards.
- Dark storefront gradients inside admin content.
- Long text-only action controls when icons are clearer.
- UI that shifts layout when data loads.
