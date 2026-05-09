# API_INTEGRATION_GUIDE

## Purpose

This guide defines how frontend API integration should be done later.

Current phase:

```text
Phase 1 — Frontend Foundation
```

The shared frontend API layer exists, but pages are not yet connected to real admin APIs.

## Backend API Scope

Backend Spring Boot admin APIs exist for:

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

Catalog integration must preserve the storefront category labels:

- điện thoại
- laptop
- tai nghe
- chuột
- bàn phím
- lót chuột
- PC Gaming
- máy bộ
- linh kiện PC
- ghế gaming
- phụ kiện gaming

Other backend areas:

- Admin auth.
- Payment transactions.
- Return requests.
- VNPay and Momo webhooks.
- Cloudinary media upload.

## Frontend API Client

Shared Axios client:

```text
frontend/src/api/client.js
```

Current behavior:

- Uses `VITE_API_BASE_URL`.
- Falls back to `http://localhost:8080/api`.
- Reads `accessToken` from `localStorage`.
- Sends `Authorization: Bearer <token>` when available.
- Removes token on `401`.
- Dispatches `auth:unauthorized` on `401` for future route/auth handling.

Environment example:

```text
frontend/.env.example
```

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Integration Rules

- Do not call axios directly inside many UI components.
- Add API modules under `frontend/src/api`.
- Keep request/response shapes close to backend DTOs.
- Add loading, error, and empty states before replacing mock data.
- Replace mock data one resource at a time.

## Recommended API Module Structure

```text
frontend/src/api/
├─ client.js
├─ authService.js
├─ categoryService.js
├─ brandService.js
├─ productService.js
├─ userService.js
├─ staffService.js
├─ orderService.js
├─ warehouseService.js
├─ couponService.js
└─ mediaService.js
```

Resource services expose basic CRUD helpers:

- `getAll(params)`
- `getById(id)`
- `create(payload)`
- `update(id, payload)`
- `remove(id)`

`authService.js` owns login/logout and `accessToken` helpers.

The homepage must continue using mock data until storefront API integration is explicitly started.

## First Integration Order

Recommended order:

1. Admin auth.
2. Protected admin routes.
3. Admin categories.
4. Admin brands.
5. Admin products.
6. Admin variants.
7. Admin media upload.

## Auth Rules

JWT token key:

```text
accessToken
```

Header:

```text
Authorization: Bearer <token>
```

Frontend should:

- Store token only after successful login.
- Remove token on `401`.
- Redirect to admin login after token removal once protected routes exist.
- Never store passwords.

## Error Handling

Support both backend error shapes:

- Standard `ErrorResponseDTO`.
- Spring Security unauthorized response.

UI should branch on HTTP status, not localized message text.
