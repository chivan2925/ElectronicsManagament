# AGENTS.md

## Purpose

This is the root instruction file for working in the `ElectronicsManagament` repository.
Before making code changes, read this file and the files in `docs/ai-context/` to preserve the current architecture, style direction, and priorities.

The project is an electronics and gaming e-commerce website with two main surfaces:

- Client e-commerce: homepage, product listing, product details, cart, checkout.
- Admin console: dashboard and CRUD management for categories, brands, products, users, staff, orders, warehouse, and coupons.

## Required Reading Before Work

For any code-related task, quickly read:

- `docs/ai-context/PROJECT_CONTEXT.md`
- `docs/ai-context/FRONTEND_GUIDE.md`
- `docs/ai-context/ADMIN_UI_SPEC.md`
- `docs/ai-context/CLIENT_UI_SPEC.md`
- `docs/ai-context/CODING_RULES.md`
- `docs/ai-context/TASK_BOARD.md`
- `docs/ai-context/RULES_INDEX.md`

For rule creation or rule updates, also read:

- `docs/ai-context/RULES_TEMPLATE.md`

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

## Current Structure

Root:

- `frontend/`: React application.
- `backend/electronics/`: Spring Boot backend.
- `database/`: legacy SQL/schema documents.
- `docs/`: working documentation, context, UI rules, workflow notes.
- `Diagrams/`: diagrams.

Frontend:

- `src/App.jsx`: route definitions.
- `src/pages/Home.jsx`: client homepage.
- `src/pages/admin/`: admin pages.
- `src/components/`: client components.
- `src/components/admin/`: admin components.
- `src/layouts/AdminLayout.jsx`: admin layout.
- `src/data/mockData.js`: client mock data.
- `src/data/mockAdminData.js`: admin mock data.
- `src/api/client.js`: Axios client prepared for API/JWT integration.

## Main Routes

Client:

- `/`: dark-theme e-commerce homepage.

Admin:

- `/admin`
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

Notes:

- Run npm commands inside `frontend/`, not at the repo root.
- The root should not have `package-lock.json` unless it also has a root `package.json`.
- Do not commit build outputs such as `frontend/dist/`, `frontend/node_modules/`, or `backend/electronics/target/`.

## Working Principles

- Do not delete or modify files outside the task scope unless necessary.
- Do not revert user changes unless explicitly asked.
- If the worktree contains unfamiliar changes, inspect them and work with them.
- Prefer small, clear code that can swap mock data for real API data later.
- When adding a route, add a sidebar/menu item if needed and mock data if the API is not ready.
- When changing UI, keep it consistent with the existing admin/client style.
- If a task may break structure, explain the risk briefly before proceeding.

## Frontend Rules

- Keep client and admin concerns separate.
- Reusable components belong in `src/components` or `src/components/admin`.
- Pages belong in `src/pages` or `src/pages/admin`.
- API logic belongs in `src/api`.
- Mock data belongs in `src/data`.
- Do not hardcode API base URLs in components; use `src/api/client.js` and environment variables.
- Client pages must be responsive across desktop, tablet, and mobile.
- Use lucide-react icons when available.
- Use Tailwind CSS and avoid unnecessary inline styles.

## Admin UI Rules

- Sidebar dark navy: `#07111F`.
- Primary blue: `#005BFF`.
- Main background: `#F6F8FB`.
- Cards should be white with light borders, soft shadows, and 12-16px radius.
- Data tables should include search, status badges, and action icons.
- Admin is a work interface: prioritize clarity, scanning, and efficient repeated actions over marketing visuals.

## Client UI Rules

- Client homepage/shop theme uses `#050B14` / `#07111F`.
- Accent blue: `#005BFF`.
- Cards use dark gradients, `#1E293B` borders, and white/light-gray text.
- Client pages must support shopping flows: categories, hero, promos, services, product cards, cart CTA.
- Do not let admin styling leak into the client storefront.

## API/JWT Rules

- Use `src/api/client.js`.
- Admin token localStorage key: `admin_access_token`.
- Request header:

```text
Authorization: Bearer <token>
```

- If backend APIs are not ready, use mock data while keeping the data shape close to backend DTOs.

## Security

- Do not commit new secrets.
- If secrets are found in config files, inform the user and recommend moving them to `.env`.
- Do not add passwords, JWT secrets, Cloudinary secrets, or payment secrets to new documentation or code.

## Near-Term Priority

1. Stabilize the docs/context structure.
2. Complete client layout/pages.
3. Add admin login and auth flow.
4. Integrate admin category/brand/product APIs.
5. Integrate user/staff/order/warehouse/coupon APIs.
6. Add client API integration when public/user backend endpoints exist.

## Adding New Rules

Create or update a file in `docs/ai-context/` using `RULES_TEMPLATE.md`.
If the rule affects the whole repository, also add a short summary to `AGENTS.md`.

File names should clearly communicate scope:

- `CLIENT_PRODUCT_RULES.md`
- `ADMIN_FORM_RULES.md`
- `API_INTEGRATION_RULES.md`
- `GIT_WORKFLOW_RULES.md`

Each rule file should include:

- Purpose
- Scope
- Required practices
- Prohibited practices
- Good/bad examples when useful
