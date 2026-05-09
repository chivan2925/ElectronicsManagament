# CODING_RULES

## Git And Files

- Do not revert user changes unless explicitly requested.
- Do not commit build outputs:
  - `frontend/node_modules/`
  - `frontend/dist/`
  - `backend/electronics/target/`
- Run npm commands inside `frontend/`.
- The repository root should not contain `package-lock.json` unless it also contains a root `package.json`.

## Frontend

- Use Tailwind CSS for styling.
- Use lucide-react for icons.
- Use Recharts for charts.
- Use React Router for routing.
- Use the Axios client from `src/api/client.js`.
- Do not hardcode API URLs inside components.
- Do not put complex business logic inside UI components.
- Do not duplicate components when props can express the variation clearly.

## Mock Data

- Keep mock data in `src/data`.
- Keep mock data shapes close to backend DTOs so API replacement is easier later.
- When adding new mock data, use names that clearly describe the context.

## API

- Read the API base URL from `VITE_API_BASE_URL`, with fallback `http://localhost:8080/api`.
- Use `admin_access_token` as the admin token localStorage key.
- When integrating real APIs, handle loading, error, and empty states.

## Backend

- The backend is the Spring Boot app in `backend/electronics`.
- Prefer the existing controller-service-repository-dto-mapper pattern.
- Do not add new secrets to `application.yml`.
- If adding migrations or seed data, prefer a clear file under `docs/database` or a migration folder if the project later adopts Flyway or Liquibase.

## Validation Before Completion

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend/electronics
mvn test
```

If validation cannot run because of the local environment, state the reason clearly.

## Communication

- Keep replies concise and focused.
- If files changed, mention important paths.
- If build or tests fail, mention the root error and the next repair step.
