# API_INTEGRATION_GUIDE

## Purpose

This guide defines how frontend API integration should be done later.

Current phase:

```text
Phase 1 — Frontend Foundation
```

The frontend is not yet connected to real admin APIs.

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
- Reads `admin_access_token` from `localStorage`.
- Sends `Authorization: Bearer <token>` when available.
- Removes token on `401`.

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
├─ admin/
│  ├─ authApi.js
│  ├─ categoriesApi.js
│  ├─ brandsApi.js
│  ├─ productsApi.js
│  ├─ variantsApi.js
│  ├─ mediaApi.js
│  ├─ usersApi.js
│  ├─ staffApi.js
│  ├─ rolesApi.js
│  ├─ ordersApi.js
│  ├─ warehouseApi.js
│  └─ couponsApi.js
└─ storefront/
   ├─ productsApi.js
   ├─ cartApi.js
   └─ checkoutApi.js
```

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

Admin token key:

```text
admin_access_token
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
