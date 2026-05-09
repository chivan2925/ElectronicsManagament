# RULES_INDEX

This is the index of active repository context and rule files.

## Core Context

- `PROJECT_CONTEXT.md`: product overview, routes, and current state.
- `FRONTEND_GUIDE.md`: frontend structure, commands, and component rules.
- `CODING_RULES.md`: code, git, API, and validation rules.
- `TASK_BOARD.md`: current work status and near-term priorities.

## UI Rules

- `ADMIN_UI_SPEC.md`: style and patterns for the admin console.
- `CLIENT_UI_SPEC.md`: style and patterns for the client e-commerce storefront.

## API Documentation

- `../api/ENDPOINTS.md`: current backend endpoint inventory.
- `../api/AUTH.md`: admin JWT authentication rules.
- `../api/ERROR_FORMAT.md`: current API error response shapes.

## Architecture Documentation

- `../architecture/SYSTEM_ARCHITECTURE.md`: high-level system architecture and runtime flows.
- `../architecture/FRONTEND_STRUCTURE.md`: React frontend structure, routes, data flow, and growth plan.
- `../architecture/BACKEND_STRUCTURE.md`: Spring Boot backend layers, packages, modules, and conventions.

## Database Documentation

- `../database/DATABASE_SCHEMA.md`: current database tables, schema groups, enums, and maintenance rules.
- `../database/RELATIONSHIPS.md`: entity relationship map, ownership, composite keys, and relationship risks.

## Frontend Documentation

- `../frontend/COMPONENT_GUIDE.md`: component responsibilities, page patterns, props, styling, and accessibility.
- `../frontend/ROUTING.md`: frontend route map, route boundaries, protected route plan, and URL naming rules.
- `../frontend/STATE_MANAGEMENT.md`: local state, server state, auth state, table state, and mock data transition plan.

## Backend Documentation

- `../backend/SECURITY.md`: Spring Security, JWT, password, role, permission, and secret-management rules.
- `../backend/FILE_UPLOAD.md`: media upload, Cloudinary, media ownership, primary image, and cleanup rules.
- `../backend/PAYMENT.md`: payment providers, IPN flow, refund strategies, and payment safety rules.

## UI/UX Documentation

- `../ui-ux/DESIGN_SYSTEM.md`: shared colors, typography, radius, shadows, icons, buttons, inputs, and accessibility.
- `../ui-ux/ADMIN_REFERENCE.md`: admin layout and CRUD UI reference.
- `../ui-ux/STORE_REFERENCE.md`: storefront homepage, category, hero, product card, and responsive reference.
- `../ui-ux/SPACING_RULES.md`: spacing scale, page padding, cards, tables, forms, buttons, and grids.

## Workflow Documentation

- `../workflows/ORDER_FLOW.md`: order, payment, shipping, warehouse, and return/refund lifecycle.
- `../workflows/PRODUCT_FLOW.md`: category, brand, product, variant, media, and warehouse stock workflow.

## Architecture Decision Records

- `../decisions/ADR-001-admin-layout.md`: decision record for the admin layout direction.

## Rule Authoring

- `RULES_TEMPLATE.md`: template for new rule files.

## Future Rule Files

When adding a new rule, create a dedicated file in `docs/ai-context/` and add it to this index.

Examples:

- `CLIENT_PRODUCT_RULES.md`
- `ADMIN_FORM_RULES.md`
- `API_INTEGRATION_RULES.md`
- `GIT_WORKFLOW_RULES.md`
- `DATABASE_SEED_RULES.md`
