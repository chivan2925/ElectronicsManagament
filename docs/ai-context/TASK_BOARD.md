# TASK_BOARD

## In Progress

- Stabilize AI docs/context and the working workflow.
- Keep the client homepage and admin dashboard separated.
- Document the current backend API surface in `docs/api/`.

## Done

- Mock Admin Dashboard at `/admin`.
- Mock admin CRUD routes:
  - categories
  - brands
  - products
  - variants
  - media
  - users
  - staff
  - roles
  - orders
  - warehouse
  - coupons
- Dark e-commerce client homepage at `/`.
- Gaming/electronics mock categories.
- Axios client prepared for JWT authentication.
- Normalized frontend folder structure under `frontend/src`.
- Moved client homepage to `src/pages/client/Home.jsx`.
- Centralized route definitions in `src/routes/AppRoutes.jsx`.
- Added shared reusable UI primitives in `src/components/ui`.
- Refactored homepage buttons, badges, cards, section titles, prices, ratings, container, and search input to use shared primitives where appropriate.
- Added standard React Router routes for client ecommerce and admin management pages.
- Added styled placeholder pages for unfinished client routes and `/admin/login`.
- Added the shared Axios API layer and flat resource service modules under `frontend/src/api`.
- Split mock data into domain modules under `frontend/src/data`.
- Mock product listing page at `/products`.
- Mock product detail page at `/products/:slug`.
- Mock cart drawer opened from the storefront header.
- Mock full cart page at `/cart`.
- Mock checkout page at `/checkout`.
- Protected routing system with `ProtectedRoute`, `AdminRoute`, `StaffRoute`, and `GuestRoute`.
- Redirect memory, auth session restore, loading fallback, and unauthorized guard UI.
- Frontend refresh-token persistence and single-flight refresh retry flow.

## Near-Term Work

1. Connect admin category pages to `categoryService`.
2. Connect admin brand pages to `brandService`.
3. Connect admin product pages to `productService`.
4. Add backend refresh-token endpoint support if long-lived admin sessions are required.
5. Tighten customer-owned account/order/cart/wishlist checks using the customer auth principal.
6. Wire storefront cart and checkout flows into shared state when ready.

## Backend Notes

- Cloudinary dependency/config should be checked when running backend context tests.
- Payment config utilities currently use key paths that differ from `application.yml`.
- Public client e-commerce APIs are not fully available yet.
- Move secrets to environment variables before serious deployment or commits.

## Notes

- Update this file whenever a large feature is added.
- When adding a new rule, create a dedicated file in `docs/ai-context/` and add a summary to `AGENTS.md` if the rule applies repository-wide.
