# ROADMAP

## Purpose

This roadmap defines the planned phases for ElectronicsManagement.

The project status is:

```text
Phase 8 — Production + Deploy completed as a production-ready showcase
```

## Product Scope

ElectronicsManagement is built for an electronics and gaming catalog with these primary categories:

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

## Phase Overview

| Phase | Name | Status | Goal |
| --- | --- | --- | --- |
| 1 | Phase 1 — Frontend Foundation | Completed | Stabilize frontend structure, homepage, UI direction, and AI context docs. |
| 2 | Design System | Completed | Formalize reusable UI patterns for client and admin. |
| 3 | Client Ecommerce | Completed | Build product listing, product detail, cart, checkout UI, and customer flows. |
| 4 | Auth + API | Completed | Add admin login, protected routes, API modules, and real data integration. |
| 5 | Admin Dashboard | Completed | Convert mock admin pages into authenticated API-backed CRUD workflows. |
| 6 | Ecommerce Core | Completed | Implement real browsing, cart, checkout, payment, and order tracking foundations. |
| 7 | Advanced Features & Production Systems | Completed | Add mature ecommerce features and harden production-facing systems. |
| 8 | Production + Deploy | Completed | Harden config, secrets, migrations, testing, performance, and deployment-readiness foundations. |

## Phase 1 — Frontend Foundation

Goals:

- Preserve the current homepage layout.
- Keep client and admin UI separated.
- Standardize AI context documentation.
- Keep React + Vite + Tailwind foundation clean.
- Prepare API integration conventions without connecting everything too early.

Current work:

- Client homepage exists at `/`.
- Admin mock dashboard exists at `/admin`.
- Mock data exists for client and admin.
- Axios client exists.
- Dark gaming ecommerce visual direction is established.
- Admin modern dashboard direction is established.

Exit criteria:

- `AGENTS.md`, `ROADMAP.md`, `CHANGELOG_AI.md`, and `docs/ai-context/*` are accurate.
- Homepage layout is stable.
- Frontend command flow is documented.
- Next tasks are clear.

## Phase 2 — Design System

Goals:

- Extract and document reusable UI patterns.
- Stabilize colors, spacing, typography, cards, buttons, badges, forms, and tables.
- Ensure client UI keeps dark gaming ecommerce style.
- Ensure admin UI keeps modern dashboard style.

Key tasks:

- Review shared visual utilities.
- Normalize admin CRUD page patterns.
- Normalize client product/card/section patterns.
- Add consistent loading, empty, and error state patterns.

## Phase 3 — Client Ecommerce

Goals:

- Build customer-facing ecommerce pages with mock data first.
- Keep the storefront premium, dark, and product-focused.

Key tasks:

- Product listing page.
- Product detail page.
- Category/product filtering UI.
- Cart page.
- Checkout UI shell.
- Order tracking UI shell.
- Mobile storefront refinements.

## Phase 4 — Auth + API

Goals:

- Add real authentication and API integration foundations.

Key tasks:

- Admin login page.
- Protected admin routes.
- API service modules under `frontend/src/api`.
- Real admin category API integration.
- Real admin brand API integration.
- Real admin product API integration.
- Loading, empty, and error states.

## Phase 5 — Admin Dashboard

Goals:

- Turn the current mock admin dashboard into a real management console.

Key tasks:

- Connect Category, Brand, Product, Variant, Staff, User, Role/Permission, Order, Warehouse, Coupon, and Media APIs.
- Add create/edit/detail/delete workflows.
- Add table pagination and filters.
- Add form validation.
- Add safe destructive-action confirmations.

## Phase 6 — Ecommerce Core

Goals:

- Implement the real customer shopping workflow.

Key tasks:

- Public product APIs.
- Product listing/detail integration.
- Cart persistence.
- Checkout.
- Order creation.
- Payment flow.
- Order tracking.

## Phase 7 — Advanced Features & Production Systems

Goals:

- Add features expected from a mature ecommerce system and harden production-facing systems.

Key tasks:

- Reviews.
- Returns/refunds UI.
- Notification and loyalty backend integration.
- Advanced search, recommendations, and personalization depth.
- Real online payment handoff and payment state hardening.
- Customer auth/account ownership hardening.
- Critical-flow tests, migrations, deployment config, and observability.

## Phase 8 — Production + Deploy

Goals:

- Prepare the project for production deployment.
- Keep the completed Phase 7 ecommerce production-ready foundation stable while real infrastructure is prepared.

Key tasks:

- Move secrets to environment variables.
- Add production config profiles.
- Add database migration strategy.
- Review CORS and security.
- Add tests for critical flows.
- Optimize frontend bundle splitting.
- Document deployment.

## Current Priority

1. Keep the finalized ecommerce showcase stable for portfolio/demo presentation.
2. Preserve the homepage layout and client/admin separation.
3. Reuse Phase 2 design-system primitives and visual patterns for maintenance work.
4. Keep AI context files up to date.
5. Treat real hosting, TLS, external secrets, backups, production payment credentials, and migration automation as deployment handoff tasks outside committed code.
