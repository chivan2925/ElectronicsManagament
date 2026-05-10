# Demo Presentation Guide

This guide prepares ElectronicsManagement for a local demo or presentation run without relying on production data.

## Enable Demo Mode

Create or update `frontend/.env.local`:

```env
VITE_DEMO_MODE=true
VITE_API_BASE_URL=http://localhost:8080/api
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Demo mode is frontend-only and should stay disabled outside local presentations.

## Demo Accounts

All demo accounts use:

```text
Demo@12345
```

| Surface | Email | Role | Suggested Route |
| --- | --- | --- | --- |
| Admin | `demo.admin@electronics.local` | Full admin | `/admin/dashboard` |
| Admin | `demo.ops@electronics.local` | Operations staff | `/admin/dashboard` |
| Storefront | `demo.customer@electronics.local` | Customer | `/` |

Login pages show quick-fill buttons when `VITE_DEMO_MODE=true`.

## Seeded Demo Data

Demo mode seeds local mock API responses for:

- Storefront catalog, product detail, reviews, cart checkout payloads, coupons, account profile, order history, and payment verification.
- Admin categories, brands, products, variants, media, users, staff, roles, permissions, orders, warehouses, coupons, and dashboard analytics.
- VNPay and MoMo handoff URLs that return to the local payment success route.

Useful coupon codes:

| Code | Use Case |
| --- | --- |
| `GAMING05` | General carts from 3,000,000 VND |
| `LAPTOP1M` | Laptop or PC carts from 20,000,000 VND |
| `GEAR10` | Accessories carts from 1,000,000 VND |

## Demo Scenarios

1. Homepage showcase: open `/`, show the dark gaming storefront, hero, promo cards, service bar, featured products, and recommendation sections.
2. Catalog browsing: open `/products?sort=best-seller`, search for `rog`, filter by laptop or accessories, then open a product detail.
3. Cart and checkout: quick-add an in-stock product, login as the customer demo account, apply `GAMING05` or `LAPTOP1M`, then complete COD checkout.
4. Payment handoff: choose VNPay or MoMo in checkout; demo mode creates a local success return URL and verifies the payment state.
5. Order tracking: open `/profile/orders` or `/profile/orders/9001` to show order history, status, timeline, delivery, and payment details.
6. Admin dashboard: login as `demo.admin@electronics.local`, open `/admin/dashboard`, and use the presentation panel plus analytics sections.
7. Admin operations: open `/admin/products`, `/admin/media`, `/admin/orders`, and `/admin/warehouse` to show CRUD-style states without needing a live backend.

## Presentation Checklist

- Start with a clean browser session or clear local storage if cart/order state from a prior rehearsal is distracting.
- Keep one in-stock product ready in the cart before checkout if the presentation window is short.
- Use the admin account for full CRUD visibility; use the operations account only when showing restricted staff access.
- Keep payment provider explanations high level: demo mode simulates the return URL, while production mode uses backend-signed VNPay/MoMo requests and server verification.
- Turn `VITE_DEMO_MODE=false` after the presentation.
