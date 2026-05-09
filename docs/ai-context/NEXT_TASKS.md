# NEXT_TASKS

## Purpose

This file tracks the next practical tasks for AI and developer work.

Always update this file after meaningful work.

## Current Phase

```text
Phase 1 — Frontend Foundation
```

## Immediate Priorities

1. Preserve the existing homepage layout.
2. Keep AI context docs current.
3. Review client component structure before adding more ecommerce pages.
4. Prepare Phase 2 design-system cleanup.
5. Prepare Phase 3 client ecommerce pages with mock data.
6. Keep catalog mock data aligned with the electronics/gaming category list.

## Next Recommended Tasks

### Frontend Foundation

- Review current homepage components for reusable patterns.
- Keep client and admin components separated.
- Move client components into `src/components/client/` later only if it reduces confusion.
- Keep `src/api/client.js` as the only shared Axios client.

### Design System Preparation

- Identify repeated button/card/badge styles.
- Normalize section headings.
- Define reusable client product card patterns.
- Define reusable admin table/action patterns.

### Client Ecommerce

- Add product listing mock page.
- Add product detail mock page.
- Add category route/page.
- Add cart page shell.
- Add checkout page shell.

### Auth + API Preparation

- Add admin login page after frontend foundation is stable.
- Add protected admin route wrapper.
- Add `frontend/src/api/admin/authApi.js`.
- Add `frontend/src/api/admin/categoriesApi.js`.
- Connect admin category API first.

## Blocked Or Not Ready

- Public customer APIs are not complete.
- Cart and checkout backend APIs are not complete.
- Admin frontend API integration is not started.
- Production deployment is not ready.

## Maintenance Reminder

When work is completed, update:

- `docs/ai-context/CURRENT_STATE.md`
- `docs/ai-context/NEXT_TASKS.md`
- `CHANGELOG_AI.md`
