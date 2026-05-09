# STATE_MANAGEMENT

## Purpose

This document defines the current and recommended frontend state management approach.

The project is still mostly mock-data based, so state should stay simple until real API integration creates a clear need for more tooling.

## Current State Model

| State type | Current approach |
| --- | --- |
| Page UI state | React local state. |
| Mock data | Imported from `src/data`. |
| Auth token | `localStorage` keys `accessToken` and optional `refreshToken`. |
| API request state | To be added per page/service integration. |
| Global app state | Not needed yet. |

## Default Rule

Use the smallest state scope that works.

Preferred order:

1. Component local state.
2. Page-level state.
3. Context provider for repeated cross-tree state.
4. Dedicated server-state library only when API complexity justifies it.

## Local UI State

Use local state for:

- Search inputs.
- Sidebar collapsed state.
- Active tabs.
- Open/closed dropdowns.
- Modal state.
- Form draft values.
- Client-side filters for mock data.

Keep local state close to where it is used.

## Server State

When real APIs are connected, each data page should handle:

- `loading`
- `error`
- `data`
- `empty`
- `pagination`
- `filters`

Suggested page state shape:

```js
const [state, setState] = useState({
  data: [],
  loading: false,
  error: null,
  page: 0,
  size: 10,
  totalElements: 0,
});
```

If server-state needs grow, consider a dedicated library later. Do not add one before there is repeated query caching or invalidation pain.

## Auth State

Current token key:

```text
accessToken
refreshToken
```

Rules:

- Store only tokens and safe display metadata.
- Do not store passwords.
- Do not display raw JWT values.
- Try centralized refresh on eligible `401` responses when `refreshToken` is available.
- Remove the auth session when refresh fails.
- Redirect to login through protected route guards after token removal.

## Forms

For simple forms:

- Use local component state.
- Validate required fields before submit.
- Show field-level backend validation errors from `details`.

For larger admin forms later:

- Keep request DTO shape close to backend DTOs.
- Normalize select values to backend enum strings.
- Avoid mixing display labels with submitted enum values.

## Table State

Admin tables should eventually keep:

- `keyword`
- `status`
- `dateType`
- `fromDate`
- `toDate`
- `page`
- `size`
- `sort`

These map directly to backend pageable/filter parameters.

## Error State

Normalize backend errors before rendering:

```js
function normalizeApiError(error) {
  const data = error.response?.data;

  return {
    status: data?.statusCode ?? data?.status ?? error.response?.status ?? 0,
    message: data?.message ?? "Something went wrong.",
    details: data?.details ?? null,
  };
}
```

UI behavior:

- `401`: remove admin token and redirect to login later.
- `400`: show validation errors.
- `404`: show not-found state.
- `409`: show conflict message.
- `500`: show a generic retry message.

## Mock Data Transition Plan

When replacing mock data with APIs:

1. Create a domain API module.
2. Keep UI component props stable.
3. Fetch data in the page or a page-level hook.
4. Add loading/error/empty states.
5. Keep mock data available only for pages not yet integrated.

Example:

```text
mockAdminData.categories
  -> api/categoryService.js
  -> GET /admin/categories
```

## What Not To Do

- Do not introduce Redux or another global store for simple page state.
- Do not store backend entities directly in many unrelated components.
- Do not duplicate server data in multiple global locations.
- Do not branch business logic on localized backend messages.
- Do not call axios directly from many small presentational components.
