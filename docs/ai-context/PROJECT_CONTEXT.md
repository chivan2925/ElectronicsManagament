# PROJECT_CONTEXT

## Overview

`ElectronicsManagament` is an electronics and gaming e-commerce project.

Current product scope:

- Phones
- Laptops
- Headphones
- Mice
- Keyboards
- Mouse pads
- Gaming PCs
- Prebuilt desktops
- PC components
- Gaming chairs
- Gaming accessories

## Product Goals

The system includes:

- A client e-commerce storefront for customers to browse and buy products.
- An admin console for staff to manage categories, brands, products, users, staff, orders, warehouse, and coupons.
- A Spring Boot REST API that will become the real data source.

## Current State

Frontend:

- Mock Admin Dashboard exists at `/admin`.
- Mock Client Homepage exists at `/`.
- Mock data lives in:
  - `frontend/src/data/mockAdminData.js`
  - `frontend/src/data/mockData.js`
- The shared Axios client lives in `frontend/src/api/client.js`.

Backend:

- Spring Boot project lives in `backend/electronics`.
- Admin endpoints exist for category, brand, product, variant, media, user, staff, order, warehouse, and coupon management.
- Public/client endpoints for cart, checkout, and customer auth are not complete yet.
- Local PostgreSQL database: `electronics_management`.

## Main Routes

Client:

- `/`: homepage.

Admin:

- `/admin`: dashboard.
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

## Important Notes

- Keep client and admin UI, routing, mock data, and components separate.
- When API integration begins, replace mock data through API service modules rather than scattering fetch/axios calls across large components.
- The backend currently contains secrets in `application.yml`; do not copy secrets into new docs or code.
