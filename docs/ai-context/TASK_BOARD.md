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

## Near-Term Work

1. Normalize the client structure:
   - Consider moving client components into `src/components/client/`.
   - Consider moving client pages into `src/pages/client/`.
2. Create the admin login page.
3. Connect admin category APIs.
4. Connect admin brand APIs.
5. Connect admin product APIs.
6. Create mock public/client product listing and product detail pages.
7. Create mock cart and checkout flows.

## Backend Notes

- Cloudinary dependency/config should be checked when running backend context tests.
- Payment config utilities currently use key paths that differ from `application.yml`.
- Public client e-commerce APIs are not fully available yet.
- Move secrets to environment variables before serious deployment or commits.

## Notes

- Update this file whenever a large feature is added.
- When adding a new rule, create a dedicated file in `docs/ai-context/` and add a summary to `AGENTS.md` if the rule applies repository-wide.
