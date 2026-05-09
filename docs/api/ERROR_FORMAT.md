# ERROR_FORMAT

## Scope

This file documents the current backend error response shapes for the Spring Boot API.

There are currently two important shapes:

- Standard application errors handled by `GlobalExceptionHandler`.
- Authentication errors handled by `JwtAuthEntryPoint`.

Frontend code should support both.

## Standard Error Shape

Most application errors use this shape:

```json
{
  "timestamp": "2026-05-09T10:15:30.123",
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Human-readable error message.",
  "details": null
}
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `timestamp` | string | Backend local date-time. |
| `statusCode` | number | HTTP status code. |
| `error` | string | HTTP reason phrase. |
| `message` | string | Human-readable message. May be localized. |
| `details` | object or null | Extra data, most often validation field errors. |

## Validation Error Shape

Validation errors also use the standard shape, with `details` containing field-level messages:

```json
{
  "timestamp": "2026-05-09T10:15:30.123",
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Input data is invalid.",
  "details": {
    "email": "Email is required.",
    "password": "Password is required."
  }
}
```

The backend may currently return localized messages. Frontend code should display the message, but should not use it for business logic.

## Authentication Error Shape

Authentication errors are written directly by the JWT authentication entry point:

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication is required or the token is invalid.",
  "path": "/api/admin/categories"
}
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `status` | number | HTTP status code. |
| `error` | string | Authentication error label. |
| `message` | string | Human-readable message. May be localized. |
| `path` | string | Request path. |

## Current Handler Mapping

| Exception or case | HTTP status | Shape | Notes |
| --- | --- | --- | --- |
| `IllegalArgumentException` | `400 Bad Request` | Standard | Invalid input or business argument. |
| `MethodArgumentNotValidException` | `400 Bad Request` | Standard with `details` | Bean validation field errors. |
| `EntityNotFoundException` | `404 Not Found` | Standard | Requested entity does not exist. |
| `IllegalStateException` | `409 Conflict` | Standard | State conflict, for example invalid lifecycle transition. |
| Missing/invalid/expired JWT | `401 Unauthorized` | Auth shape | Handled before controller logic. |
| Unhandled exception | `500 Internal Server Error` | Standard | Logs the server-side exception. |

## Success Responses With No Body

Some endpoints intentionally return no body:

- `204 No Content` for deletes or state-only operations.
- `204 No Content` for `POST /api/system/payment/momo-ipn`.

Frontend code should treat `204` as success and avoid trying to read `response.data` as an object.

## Frontend Error Normalization

Recommended normalized shape for UI code:

```js
function normalizeApiError(error) {
  const data = error.response?.data;

  return {
    status: data?.statusCode ?? data?.status ?? error.response?.status ?? 0,
    message: data?.message ?? "Something went wrong.",
    details: data?.details ?? null,
    path: data?.path ?? null,
  };
}
```

UI rules:

- Use HTTP status or normalized `status` for branching.
- Show `message` to the user when appropriate.
- Use `details` to render field-level validation errors.
- On `401`, remove `admin_access_token` and send the admin user back to login.
- Avoid showing raw stack traces or backend exception class names.
