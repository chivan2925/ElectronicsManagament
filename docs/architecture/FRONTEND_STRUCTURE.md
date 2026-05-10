# FRONTEND_STRUCTURE

## Purpose

This document describes the current React frontend structure under `frontend/`.

The frontend has two main surfaces:

- Customer storefront.
- Admin/staff dashboard.

## Stack

- React 19
- Vite/Rolldown
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- lucide-react
- Recharts

## Source Tree

```text
frontend/src/
├─ admin/              Admin components, hooks, layouts, analytics, services
├─ api/                Axios client, API services, mappers, shared mapper utilities
├─ auth/               Auth provider, storage, roles, permissions
├─ cart/               Shared cart provider and cart utilities
├─ components/         Storefront, shared UI, feedback, payment, account components
├─ data/               Mock/local data used where APIs are not finalized
├─ guards/             Route guards for auth/admin/staff/guest access
├─ hooks/              Storefront and API-backed feature hooks
├─ layouts/            Compatibility layout exports
├─ monitoring/         Client logging/error/API/payment tracking helpers
├─ pages/              Client pages and admin pages
├─ realtime/           Realtime notification abstractions
├─ routes/             Lazy routes and route preload helpers
├─ seo/                Metadata and structured-data helpers
├─ store/              Store namespaces
├─ styles/             Global and utility CSS
├─ utils/              Formatters, product identity, payment status, tracking
└─ wishlist/           Wishlist provider and persistence logic
```

## Route Structure

Client routes:

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/products` | Product listing |
| `/categories/:categorySlug` | Category listing |
| `/products/:slug` | Product detail |
| `/cart` | Cart |
| `/checkout` | Protected checkout |
| `/payment/success` | Payment success/result |
| `/payment/failed` | Payment failed/cancelled/result |
| `/login` | Login |
| `/register` | Register placeholder |
| `/wishlist` | Wishlist |
| `/profile` | Account overview |
| `/profile/orders` | Order history |
| `/profile/orders/:id` | Order detail/tracking |
| `/profile/settings` | Profile settings |

Admin routes:

| Route | Page |
| --- | --- |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard |
| `/admin/categories` | Categories |
| `/admin/brands` | Brands |
| `/admin/products` | Products |
| `/admin/variants` | Variants |
| `/admin/media` | Media |
| `/admin/users` | Users |
| `/admin/staff` | Staff |
| `/admin/roles` | Roles and permissions |
| `/admin/orders` | Orders |
| `/admin/warehouse` | Warehouse |
| `/admin/coupons` | Coupons |
| `/admin/reports/revenue` | Revenue report |
| `/admin/reports/best-sellers` | Best sellers report |
| `/admin/reports/activity` | Activity log |

## API Layer

API access is centralized in:

```text
frontend/src/api/client.js
frontend/src/api/resourceService.js
frontend/src/api/*Service.js
frontend/src/api/*Mapper.js
frontend/src/api/mapperUtils.js
```

Rules:

- UI components should not duplicate Axios request logic.
- Services own endpoint paths and request config.
- Mappers normalize flexible backend wrappers and DTO variants.
- `mapperUtils.js` owns common helpers for payload unwrap, page items, page metadata, number conversion, status normalization, and query cleanup.

## Auth And Permissions

Important files:

```text
frontend/src/auth/AuthProvider.jsx
frontend/src/auth/authStorage.js
frontend/src/auth/authHelpers.js
frontend/src/auth/roleHelpers.js
frontend/src/auth/usePermissions.js
frontend/src/guards/
```

Current behavior:

- Admin/staff login calls the backend JWT login API.
- Customer-shaped sessions are supported by route policy and UI state, while public registration APIs remain incomplete.
- Admin shell is protected by staff/admin route guards.
- Admin-only modules use `AdminRoute`.
- Resource actions can be gated through shared permission helpers.

## State Strategy

| Area | State owner |
| --- | --- |
| Auth | `AuthProvider` and auth storage helpers |
| Cart | `frontend/src/cart` |
| Wishlist | `frontend/src/wishlist` with optional backend sync |
| Products | `useProducts`, `useProductDetail`, API mappers |
| Checkout | `useCheckoutCoupon`, `useCheckoutOrder`, `useCheckoutProfile` |
| Payment result | `usePaymentResult` and payment status helpers |
| Admin tables | Shared admin components and hooks such as `useAdminServerTableState` |
| Notifications | `useNotifications`, realtime notification helpers |

## Styling Rules

Storefront:

- Dark gaming ecommerce style.
- Primary blue accent `#005BFF`.
- Product-focused premium visuals.
- Preserve homepage layout.

Admin:

- Work-focused SaaS dashboard style.
- Dark navy sidebar.
- Light content background.
- Dense, scannable tables and forms.

Shared:

- Prefer Tailwind CSS.
- Prefer lucide-react icons.
- Keep responsive layouts stable.
- Avoid hardcoded backend URLs in components.

## Performance Structure

The frontend uses:

- Route-level lazy loading.
- Route preload helpers for common next navigations.
- Deferred below-fold storefront sections.
- Optimized image handling.
- Vendor chunking for React, Router, Motion, and HTTP code.
- API GET deduplication and opt-in TTL caching.

## Current Known Gaps

- Homepage product sections and search overlay still use mock/local data.
- Dashboard/report analytics use mock analytics data until reporting APIs exist.
- Customer registration API contract is not finalized.
- Public wishlist backend integration remains optional.

## Commands

Run from `frontend/`:

```bash
npm install
npm run dev
npm run lint
npm run build
```
