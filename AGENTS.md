# AGENTS.md

## Purpose

This is the root instruction file for AI and developer work in the ElectronicsManagement project.

The repository folder is currently named `ElectronicsManagament`, but the product/project name used in documentation is ElectronicsManagement.

Before making code changes, read the AI context files in `docs/ai-context/` and keep the current homepage layout intact unless the user explicitly asks for a layout change.

## Project Summary

ElectronicsManagement is an electronics and gaming e-commerce website.

Main surfaces:

- Client ecommerce storefront for customers.
- Admin dashboard for staff and managers.
- Spring Boot backend API for admin operations and future ecommerce workflows.

Product category display labels:

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

Current phase:

```text
Ready for Phase 6 — Ecommerce Core Features
```

Phase 6 focuses on:

- Public storefront ecommerce APIs.
- Product browsing and category workflows.
- Cart persistence.
- Checkout, payment handoff, and order tracking.
- Keeping the completed admin dashboard stable.

## Required Reading Before Work

For every code-related task, quickly read:

- `docs/ai-context/PROJECT_CONTEXT.md`
- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `docs/ai-context/CODING_RULES.md`
- `docs/ai-context/FRONTEND_GUIDE.md`
- `docs/ai-context/UI_REFERENCE.md`
- `docs/ai-context/API_INTEGRATION_GUIDE.md`

For roadmap or planning work, also read:

- `ROADMAP.md`
- `CHANGELOG_AI.md`

## Always Update

After meaningful work, always update these files:

- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `CHANGELOG_AI.md`

Use short, factual entries. Do not turn these files into long narratives.

## Tech Stack

Frontend:

- React + Vite
- Tailwind CSS
- React Router
- Axios
- lucide-react
- Recharts

Backend:

- Spring Boot REST API
- Spring Security + JWT
- JPA/Hibernate
- PostgreSQL

## Backend API Scope

The backend currently includes admin APIs for:

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

Payment and system webhook code also exists for VNPay and Momo.

Public storefront APIs for customer auth, product browsing, cart, and checkout are not complete yet.

## UI Direction

Client storefront:

- Dark gaming ecommerce style.
- Primary blue accent `#005BFF`.
- Premium product-focused feel.
- Preserve the existing homepage layout structure.

Admin dashboard:

- Modern SaaS dashboard style.
- Dark navy sidebar.
- Light content background.
- Clean tables, KPI cards, charts, status badges, and CRUD actions.

## Critical Layout Rule

Do not break or restructure the existing homepage layout.

Allowed without explicit approval:

- Visual polish.
- Hover states.
- Transitions.
- Color, shadow, border, and typography refinements.
- Responsive bug fixes that preserve the same content structure.

Not allowed without explicit approval:

- Removing homepage sections.
- Reordering major homepage sections.
- Replacing the three-column hero structure.
- Mixing admin UI style into the client storefront.

## Common Commands

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run build
```

Backend:

```bash
cd backend/electronics
mvn test
mvn spring-boot:run
```

## Working Rules

- Do not revert user changes unless explicitly requested.
- Do not commit build outputs.
- Do not add secrets to docs or code.
- Keep frontend API calls centralized under `src/api`.
- Use mock data while APIs are not connected, but keep shapes close to backend DTOs.
- Keep client and admin components separate.
- Prefer Tailwind CSS and lucide-react for frontend UI.
