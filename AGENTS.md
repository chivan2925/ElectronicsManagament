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

- Điện thoại
- Laptop
- Tai nghe
- Chuột
- Bàn phím
- Lót chuột
- PC Gaming
- Máy bộ
- Linh kiện PC
- Ghế gaming
- Phụ kiện gaming

## Current Phase

Current phase:

```text
Phase 8 — Production + Deploy (Completed showcase)
```

Post-Phase 8 focus:

- Keeping the finalized production-ready ecommerce showcase stable.
- Preserving homepage layout, admin/client separation, and existing architecture.
- Treating real hosting, TLS, external secrets, backups, production payment credentials, public customer auth, account ownership, and rollout policy as deployment handoff tasks.
- Keeping the completed Phase 5 admin dashboard, Phase 6 ecommerce foundations, Phase 7 production-ready foundation, and Phase 8 showcase stable.

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
