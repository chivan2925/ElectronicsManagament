# CODING_RULES

## Purpose

These rules keep ElectronicsManagement changes consistent and safe.

## Project Baseline

- Project name: ElectronicsManagement.
- Product type: electronics and gaming e-commerce website.
- Current phase: `Phase 8 — Production + Deploy (Completed showcase)`.
- Frontend stack: React + Vite + Tailwind CSS.
- Backend stack: Spring Boot REST API.
- Do not break the existing homepage layout.

## Documentation Rules

- Keep Markdown documentation in English.
- Use ElectronicsManagement as the project name.
- After meaningful work, always update:
  - `docs/ai-context/CURRENT_STATE.md`
  - `docs/ai-context/NEXT_TASKS.md`
  - `CHANGELOG_AI.md`
- Do not add secrets to documentation.

## Homepage Rule

Do not break the existing homepage layout.

Allowed:

- Visual refinements.
- Hover states.
- Transitions.
- Glass effects.
- Typography improvements.
- Responsive fixes that keep the same structure.

Not allowed without explicit approval:

- Removing homepage sections.
- Reordering homepage sections.
- Replacing the main hero layout.
- Mixing admin dashboard style into the client storefront.

## Git And Files

- Do not revert user changes unless explicitly requested.
- Do not commit or track build outputs:
  - `frontend/node_modules/`
  - `frontend/dist/`
  - `backend/electronics/target/`
- Run npm commands inside `frontend/`.
- The repository root should not contain `package-lock.json` unless the root also has `package.json`.

## Frontend Rules

- Use React + Vite + Tailwind CSS.
- Use lucide-react for icons when possible.
- Use React Router for routes.
- Use Axios through `src/api/client.js`.
- Do not hardcode API URLs inside components.
- Keep client and admin concerns separate.
- Keep mock data in `src/data` until real API integration begins.
- Keep UI components focused and prop-driven.

## Backend Rules

- Backend lives in `backend/electronics`.
- Prefer the existing controller-service-repository-dto-mapper pattern.
- Do not add new secrets to `application.yml`.
- Keep admin API docs in sync when backend endpoint behavior changes.

## Validation

Frontend validation:

```bash
cd frontend
npm run lint
npm run build
```

Backend validation:

```bash
cd backend/electronics
mvn test
```

If validation cannot run, document the reason in the final response.
