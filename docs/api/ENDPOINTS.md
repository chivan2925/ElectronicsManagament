# ENDPOINTS

## Scope

This file documents the backend endpoints that currently exist in `backend/electronics/src/main/java/org/example/electronics/controller`.

The current backend surface includes admin/staff operations, public customer registration/login, authenticated storefront checkout/account flows, VNPay/MoMo sandbox payment handoff, payment callbacks, media upload, and health probes. Persisted cart and final customer ownership contracts are not complete yet.

## Base URL

Backend base path:

```text
http://localhost:8080/api
```

Frontend should use:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Because the frontend Axios client already includes `/api` in the base URL, frontend service methods should call paths such as `/admin/categories`, not `/api/admin/categories`.

## Authentication

Unless listed as public, endpoints require:

```text
Authorization: Bearer <accessToken>
```

Public endpoints:

- `GET /health`
- `GET /health/readiness`
- `POST /admin/auth/login`
- `POST /auth/login`
- `POST /auth/register`
- `GET /payments/vnpay-return`
- `GET /payments/momo-return`
- `GET /system/payment/vnpay-ipn`
- `POST /system/payment/momo-ipn`
- `/v3/api-docs/**`
- `/swagger-ui/**`
- `/swagger-ui.html`

Remember that these paths are listed relative to the `/api` base path.

## Health

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | None | health summary | Public liveness probe. |
| `GET` | `/health/readiness` | None | readiness summary | Public readiness probe with database connectivity check. |

## Common Query Parameters

Most list endpoints return a Spring `Page<T>` and accept standard pageable query parameters:

| Parameter | Type | Notes |
| --- | --- | --- |
| `page` | number | Zero-based page index. |
| `size` | number | Page size. |
| `sort` | string | Spring sort syntax, for example `updatedAt,desc`. |

Common filters used by many admin list endpoints:

| Parameter | Type | Notes |
| --- | --- | --- |
| `keyword` | string | Search by name/code/id depending on the resource. |
| `status` | enum | Resource-specific status enum. |
| `dateType` | enum | One of `CREATED_AT`, `UPDATED_AT`, `ASSIGNED_AT`, `RESOLVED_AT`, `PAYMENT_TIME`. |
| `fromDate` | date | ISO date, for example `2026-05-09`. |
| `toDate` | date | ISO date, for example `2026-05-31`. |

## Admin Authentication

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/auth/login` | `AdminLoginRequestDTO` | `AdminLoginResponseDTO` | Public. Returns JWT access token and staff profile basics. |
| `POST` | `/admin/auth/logout` | None | string | Requires token. Invalidates the current token id until expiry. |

## Customer Authentication

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | `CustomerLoginRequestDTO` | `CustomerLoginResponseDTO` | Public. Authenticates an `ACTIVE` customer from `users` and returns a customer-scoped JWT session. |
| `POST` | `/auth/register` | `CustomerRegisterRequestDTO` | `CustomerRegisterResponseDTO` | Public. Creates an `ACTIVE` customer account with derived `USER` role metadata. Does not return password/hash or create ADMIN/STAFF roles. |
| `POST` | `/auth/logout` | None | string | Requires customer token. Invalidates the current token id until expiry. |

## Admin Catalog

### Categories

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/categories` | `AdminCategoryRequestDTO` | `AdminCategoryResponseDTO` | Create a root or child category. |
| `PUT` | `/admin/categories/{categoryId}` | `AdminCategoryRequestDTO` | `AdminCategoryResponseDTO` | Update category fields. |
| `PATCH` | `/admin/categories/{categoryId}/status` | `AdminUpdateProductStatusRequestDTO` | `AdminCategoryResponseDTO` | Update category status. |
| `DELETE` | `/admin/categories/{categoryId}` | None | `204 No Content` | Soft delete. |
| `GET` | `/admin/categories` | Query params | `Page<AdminCategoryResponseDTO>` | Lists root categories. Supports `keyword`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/categories/{parentId}/subcategories` | Query params | `Page<AdminCategoryResponseDTO>` | Lists child categories of a parent. |
| `GET` | `/admin/categories/{categoryId}` | None | `AdminDetailCategoryResponseDTO` | Category detail. |

### Brands

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/brands` | `AdminBrandRequestDTO` | `AdminBrandResponseDTO` | Create brand. |
| `PUT` | `/admin/brands/{brandId}` | `AdminBrandRequestDTO` | `AdminBrandResponseDTO` | Update brand. |
| `PATCH` | `/admin/brands/{brandId}/status` | `AdminUpdateProductStatusRequestDTO` | `AdminBrandResponseDTO` | Update brand status. |
| `DELETE` | `/admin/brands/{brandId}` | None | `204 No Content` | Soft delete. |
| `GET` | `/admin/brands` | Query params | `Page<AdminBrandResponseDTO>` | Supports `keyword`, `status`, `featured`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/brands/{brandId}` | None | `AdminBrandResponseDTO` | Brand detail. |

### Products

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/products` | `AdminProductRequestDTO` | `AdminProductResponseDTO` | Create base product. |
| `PUT` | `/admin/products/{productId}` | `AdminProductRequestDTO` | `AdminProductResponseDTO` | Update base product. |
| `PATCH` | `/admin/products/{productId}/status` | `AdminUpdateProductStatusRequestDTO` | `AdminProductResponseDTO` | Update product status. |
| `PATCH` | `/admin/products/{productId}/featured` | `AdminUpdateProductFeaturedRequestDTO` | `AdminProductResponseDTO` | Update featured flag. |
| `DELETE` | `/admin/products/{productId}` | None | `204 No Content` | Soft delete. Blocked when variants still exist. |
| `GET` | `/admin/products` | Query params | `Page<AdminProductResponseDTO>` | Supports `keyword`, `status`, `categoryId`, `brandId`, `featured`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/products/{productId}` | None | `AdminDetailProductResponseDTO` | Product detail with variants. |
| `GET` | `/admin/products/{productId}/reviews` | Query params | `Page<AdminReviewResponseDTO>` | Supports `keyword`, `dateType`, `fromDate`, `toDate`, pageable params. |

### Variants

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/variants` | `AdminVariantRequestDTO` | `AdminVariantResponseDTO` | Create product variant. |
| `PUT` | `/admin/variants/{variantId}` | `AdminVariantRequestDTO` | `AdminVariantResponseDTO` | Update variant. |
| `PATCH` | `/admin/variants/{variantId}/status` | `AdminUpdateProductStatusRequestDTO` | `AdminVariantResponseDTO` | Update variant status. |
| `DELETE` | `/admin/variants/{variantId}` | None | `204 No Content` | Soft delete. |
| `GET` | `/admin/variants` | Query params | `Page<AdminVariantResponseDTO>` | Supports `keyword`, `status`, `productId`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/variants/{variantId}` | None | `AdminDetailVariantResponseDTO` | Variant detail. |

### Media

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/media` | `AdminAddMediaRequestDTO` | `AdminMediaResponseDTO` | Add image to either a product or a variant. |
| `DELETE` | `/admin/media/{mediaId}` | None | `204 No Content` | Hard delete media. |
| `PATCH` | `/admin/media/{mediaId}/primary` | None | `204 No Content` | Set one media item as primary. |
| `PATCH` | `/admin/media/{mediaId}/order` | `AdminUpdateMediaOrderRequestDTO` | `AdminMediaResponseDTO` | Update display order. |
| `POST` | `/admin/media/upload` | multipart `file` | `{ "imageUrl": "...", "publicId": "..." }` | Upload image through the system cloud provider. |

## Admin People And Access

### Users

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `PATCH` | `/admin/users/{userId}/status` | `AdminUpdateUserStatusRequestDTO` | `AdminUserResponseDTO` | Update customer account status. |
| `DELETE` | `/admin/users/{userId}` | None | `204 No Content` | Soft delete customer account. |
| `GET` | `/admin/users` | Query params | `Page<AdminUserResponseDTO>` | Supports `keyword`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/users/{userId}` | None | `AdminUserResponseDTO` | Customer detail. |
| `GET` | `/admin/users/{userId}/addresses` | Pageable params | `Page<AdminAddressResponseDTO>` | Customer address list. |

### Staff

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/staffs` | `AdminCreateStaffRequestDTO` | `AdminStaffResponseDTO` | Create staff account. |
| `PUT` | `/admin/staffs/{staffId}` | `AdminUpdateStaffRequestDTO` | `AdminStaffResponseDTO` | Update staff account. |
| `PATCH` | `/admin/staffs/{staffId}/status` | `AdminUpdateUserStatusRequestDTO` | `AdminStaffResponseDTO` | Block or unblock staff account. |
| `DELETE` | `/admin/staffs/{staffId}` | None | `204 No Content` | Soft delete staff account. |
| `GET` | `/admin/staffs` | Query params | `Page<AdminStaffResponseDTO>` | Supports `keyword`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. Default `dateType` is `ASSIGNED_AT`. |
| `GET` | `/admin/staffs/{staffId}` | None | `AdminStaffResponseDTO` | Staff detail. |
| `POST` | `/admin/staffs/{staffId}/reset-password` | None | string | Generates and returns a temporary plain-text password. Treat the response as sensitive. |

### Roles And Permissions

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/roles` | `AdminRoleRequestDTO` | `AdminRoleResponseDTO` | Create role. |
| `PUT` | `/admin/roles/{roleId}` | `AdminRoleRequestDTO` | `AdminRoleResponseDTO` | Update role. |
| `PATCH` | `/admin/roles/{roleId}/status` | `AdminUpdateUserStatusRequestDTO` | `AdminRoleResponseDTO` | Update role status. |
| `DELETE` | `/admin/roles/{roleId}` | None | `204 No Content` | Soft delete role. Blocked when staff still use the role. |
| `GET` | `/admin/roles` | Query params | `Page<AdminRoleResponseDTO>` | Supports `keyword`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/roles/{roleId}` | None | `AdminDetailRoleResponseDTO` | Role detail. |
| `GET` | `/admin/permissions` | Query params | `Page<AdminPermissionResponseDTO>` | Supports `keyword`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/permissions/{permissionId}` | None | `AdminPermissionResponseDTO` | Permission detail. |

## Storefront Checkout

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/orders` | `UserCreateOrderRequestDTO` | `AdminOrderDetailResponseDTO` | Requires token. Creates a `PENDING` order, validates active user, validates coupon if supplied, checks stock, and creates a reserved stock transaction. Does not create a payment gateway link. |

## Storefront Payments

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/payments/vnpay/create` | payment create request with `orderId` | payment link response | Requires token. Creates a signed VNPay Sandbox payment URL for an existing order. |
| `POST` | `/payments/momo/create` | payment create request with `orderId` | payment link response | Requires token. Creates a signed MoMo Sandbox payment request for an existing order. |
| `GET` | `/payments/orders/{orderId}/status` | None | payment status response | Requires token. Verifies server-side order/payment state for payment result pages. |
| `GET` | `/payments/vnpay-return` | VNPay query string | Redirect | Public browser return endpoint. Validates provider payload and redirects to frontend success/failed route. |
| `GET` | `/payments/momo-return` | MoMo query string | Redirect | Public browser return endpoint. Validates provider payload and redirects to frontend success/failed route. |

## Storefront Account

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/users/{userId}/profile` | None | `AdminUserResponseDTO` | Requires token. Returns customer profile data for the account area and checkout prefill. |
| `PUT` | `/users/{userId}/profile` | `UserUpdateProfileRequestDTO` | `AdminUserResponseDTO` | Requires token. Updates basic customer profile fields and checks username/email/phone uniqueness. |
| `GET` | `/orders?userId={userId}` | Query params | `Page<AdminOrderResponseDTO>` | Requires token. Lists orders for the account area. Supports pageable params. |
| `GET` | `/orders/{orderId}?userId={userId}` | None | `AdminOrderDetailResponseDTO` | Requires token. Returns a single order detail for the account area. |

## Admin Sales

### Orders

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `PATCH` | `/admin/orders/{orderId}` | `AdminUpdateOrderRequestDTO` | `AdminOrderResponseDTO` | Update order, payment, and shipping statuses. Uses authenticated staff context. |
| `GET` | `/admin/orders` | Query params | `Page<AdminOrderResponseDTO>` | Supports `keyword`, `status`, `type`, `paymentStatus`, `provider`, `shippingStatus`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/orders/{orderId}` | None | `AdminOrderDetailResponseDTO` | Order detail. |

### Payments

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/admin/payments` | Query params | `Page<AdminPaymentTransactionResponseDTO>` | Supports `keyword`, `type`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/payments/{paymentTransactionId}` | None | `AdminPaymentTransactionResponseDTO` | Payment transaction detail. |

### Return Requests

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `PATCH` | `/admin/return-requests/{returnRequestId}` | `AdminUpdateReturnRequestStatusRequestDTO` | `AdminReturnRequestResponseDTO` | Update return request status. Uses authenticated staff context. |
| `GET` | `/admin/return-requests` | Query params | `Page<AdminReturnRequestResponseDTO>` | Supports `keyword`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/return-requests/{returnRequestId}` | None | `AdminDetailReturnRequestResponseDTO` | Return request detail. |

### Coupons

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/coupons` | `AdminCouponRequestDTO` | `AdminCouponResponseDTO` | Create coupon. |
| `PUT` | `/admin/coupons/{couponId}` | `AdminCouponRequestDTO` | `AdminCouponResponseDTO` | Update coupon. |
| `PATCH` | `/admin/coupons/{couponId}/status` | `AdminUpdateCouponStatusRequestDTO` | `AdminCouponResponseDTO` | Update coupon status. |
| `DELETE` | `/admin/coupons/{couponId}` | None | `AdminCouponResponseDTO` | Soft delete coupon. |
| `GET` | `/admin/coupons` | Query params | `Page<AdminCouponResponseDTO>` | Supports `keyword`, `timeStatus`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/coupons/{couponId}` | None | `AdminCouponResponseDTO` | Coupon detail. |

## Admin Warehouse

### Warehouses

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/warehouses` | `AdminWarehouseRequestDTO` | `AdminWarehouseResponseDTO` | Create warehouse with optional stock details. |
| `PUT` | `/admin/warehouses/{warehouseId}` | `AdminWarehouseRequestDTO` | `AdminWarehouseResponseDTO` | Update warehouse and stock detail list. |
| `PATCH` | `/admin/warehouses/{warehouseId}` | `AdminUpdateWarehouseStatusRequestDTO` | `AdminWarehouseResponseDTO` | Update warehouse status. |
| `DELETE` | `/admin/warehouses/{warehouseId}` | None | `AdminWarehouseResponseDTO` | Soft delete warehouse. |
| `GET` | `/admin/warehouses` | Query params | `Page<AdminWarehouseResponseDTO>` | Supports `keyword`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/warehouses/{warehouseId}` | None | `AdminWarehouseResponseDTO` | Warehouse detail with stock items. |

### Warehouse Transactions

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/admin/warehouse-transactions` | `AdminWarehouseTransactionRequestDTO` | `AdminWarehouseTransactionResponseDTO` | Create draft stock transaction. Uses authenticated staff context. |
| `PUT` | `/admin/warehouse-transactions/{warehouseTransactionId}` | `AdminWarehouseTransactionRequestDTO` | `AdminWarehouseTransactionResponseDTO` | Update pending stock transaction. |
| `PATCH` | `/admin/warehouse-transactions/{warehouseTransactionId}/status` | `AdminUpdateWarehouseTransactionTypeStatusRequestDTO` | `AdminWarehouseTransactionResponseDTO` | Complete/cancel/fail a transaction and apply stock changes when completed. |
| `DELETE` | `/admin/warehouse-transactions/{warehouseTransactionId}` | None | `AdminWarehouseTransactionResponseDTO` | Mark transaction as deleted/cancelled. |
| `GET` | `/admin/warehouse-transactions` | Query params | `Page<AdminWarehouseTransactionResponseDTO>` | Supports `keyword`, `type`, `status`, `dateType`, `fromDate`, `toDate`, pageable params. |
| `GET` | `/admin/warehouse-transactions/{warehouseTransactionId}` | None | `AdminWarehouseTransactionResponseDTO` | Warehouse transaction detail. |

## System Payment Webhooks

| Method | Path | Body | Response | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/system/payment/vnpay-ipn` | VNPay query string | Provider-specific response | Public endpoint called by VNPay. |
| `POST` | `/system/payment/momo-ipn` | Provider JSON payload | `204 No Content` | Public endpoint called by Momo. |

## Important Enums

| Enum | Values |
| --- | --- |
| `ProductStatus` | `ACTIVE`, `HIDDEN`, `DELETED` |
| `UserStatus` | `ACTIVE`, `BLOCKED`, `DELETED` |
| `CouponStatus` | `ACTIVE`, `INACTIVE`, `DELETED` |
| `CouponTimeStatus` | `VALID`, `EXPIRED` |
| `CouponType` | `PERCENT`, `FIXED` |
| `OrderStatus` | `PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`, `RETURNED`, `REFUNDED` |
| `PaymentStatus` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| `PaymentMethodType` | `CASH`, `DIGITAL` |
| `ShippingProvider` | `GHN`, `GHTK`, `VIETTELPOST`, `VNPOST`, `OTHER` |
| `ShippingStatus` | `PENDING`, `SHIPPING`, `DELIVERED`, `RETURNED`, `CANCELLED` |
| `WarehouseStatus` | `ACTIVE`, `INACTIVE`, `DELETED` |
| `WarehouseTransactionType` | `INTERNAL_TRANSFER`, `RESERVED`, `IMPORT`, `EXPORT`, `RETURN`, `UNRESERVED` |
| `WarehouseTransactionStatus` | `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`, `DELETED` |
| `ReturnRequestStatus` | `PENDING`, `APPROVED`, `COMPLETED`, `REJECTED`, `CANCELLED` |
| `PaymentTransactionType` | `PAYMENT`, `REFUND` |
| `PaymentTransactionStatus` | `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED` |
| `DateFilterType` | `CREATED_AT`, `UPDATED_AT`, `ASSIGNED_AT`, `RESOLVED_AT`, `PAYMENT_TIME` |

## Request Body Field Reference

| DTO | Fields |
| --- | --- |
| `AdminLoginRequestDTO` | `email`, `password` |
| `CustomerLoginRequestDTO` | `email`, `password` |
| `CustomerRegisterRequestDTO` | `fullName`, `email`, optional `phone`, `password`, `confirmPassword` |
| `AdminCategoryRequestDTO` | `name`, `iconUrl`, `slug`, `parentId`, `status` |
| `AdminBrandRequestDTO` | `name`, `slug`, `imageUrl`, `description`, `featured`, `status` |
| `AdminProductRequestDTO` | `name`, `slug`, `categoryId`, `brandId`, `description`, `specsJson`, `warrantyMonths`, `featured`, `media`, `status` |
| `AdminVariantRequestDTO` | `productId`, `media`, `name`, `slug`, `sku`, `color`, `specsJson`, `price`, `totalStock`, `status` |
| `AdminAddMediaRequestDTO` | `productId`, `variantId`, `imageUrl`, `isPrimary`, `displayOrder` |
| `AdminUpdateMediaOrderRequestDTO` | `displayOrder` |
| `AdminCouponRequestDTO` | `categoryId`, `brandId`, `code`, `type`, `value`, `minOrder`, `startDate`, `endDate`, `usageLimit`, `maxDiscount`, `status` |
| `AdminUpdateCouponStatusRequestDTO` | `status` |
| `AdminRoleRequestDTO` | `name`, `permissionIds`, `status` |
| `AdminCreateStaffRequestDTO` | `fullName`, `gender`, `dateOfBirth`, `username`, `avatarUrl`, `email`, `phoneNumber`, `address`, `roleId`, `password`, `status` |
| `AdminUpdateStaffRequestDTO` | `fullName`, `gender`, `dateOfBirth`, `username`, `avatarUrl`, `email`, `phoneNumber`, `address`, `roleId`, `status` |
| `AdminUpdateUserStatusRequestDTO` | `status` |
| `UserUpdateProfileRequestDTO` | `fullName`, `gender`, `dateOfBirth`, `username`, `avatarUrl`, `email`, `phoneNumber` |
| `AdminUpdateOrderRequestDTO` | `trackingCode`, `status`, `paymentStatus`, `shippingProvider`, `shippingStatus` |
| `AdminUpdateReturnRequestStatusRequestDTO` | `status` |
| `AdminWarehouseRequestDTO` | `name`, `line`, `ward`, `district`, `province`, `capacity`, `warehouseDetails`, `status` |
| `AdminWarehouseDetailRequestDTO` | `variantId`, `quantity` |
| `AdminUpdateWarehouseStatusRequestDTO` | `status` |
| `AdminWarehouseTransactionRequestDTO` | `code`, `warehouseId`, `orderId`, `returnRequestId`, `type`, `note`, `warehouseTransactionDetails` |
| `AdminWarehouseTransactionDetailRequestDTO` | `variantId`, `quantity` |
| `AdminUpdateWarehouseTransactionTypeStatusRequestDTO` | `type`, `status` |
