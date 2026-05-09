# DATABASE_SCHEMA

## Purpose

This document describes the current database schema represented by the Spring Boot JPA entities in `backend/electronics`.

The active source of truth is the entity model, not the legacy `database/db.sql` file. The backend currently uses Hibernate `ddl-auto: update`, so schema changes are driven by entity annotations during local development.

## Database

Local database name:

```text
electronics_management
```

Database engine:

```text
PostgreSQL
```

## Schema Groups

| Group | Tables |
| --- | --- |
| Catalog | `categories`, `brands`, `products`, `variants`, `media` |
| People and access | `users`, `addresses`, `staffs`, `roles`, `permissions`, `role_permissions` |
| Sales | `orders`, `order_details`, `coupons`, `reviews`, `return_requests` |
| Payments | `payment_transactions` |
| Warehouse | `warehouses`, `warehouse_details`, `warehouse_transactions`, `warehouse_transaction_details` |
| Security | `invalidated_tokens` |

## Catalog Tables

### `categories`

Stores product categories and subcategories.

Important columns:

- `id`
- `name`
- `icon_url`
- `slug`
- `parent_id`
- `status`
- `created_at`
- `updated_at`

Notes:

- `slug` is unique.
- `parent_id` points back to `categories.id`.
- `status` uses `ProductStatus`.

### `brands`

Stores product brands.

Important columns:

- `id`
- `name`
- `slug`
- `image_url`
- `description`
- `featured`
- `status`
- `created_at`
- `updated_at`

Notes:

- `name` is unique.
- `slug` is unique when present.
- `featured` marks brands for highlighted admin/storefront placement.
- `status` uses `ProductStatus`.

### `products`

Stores base product records.

Important columns:

- `id`
- `name`
- `slug`
- `category_id`
- `brand_id`
- `description`
- `specs_json`
- `rating_star`
- `rating_count`
- `warranty_months`
- `featured`
- `status`
- `created_at`
- `updated_at`

Notes:

- `slug` is unique.
- `category_id` is required.
- `brand_id` is required.
- `specs_json` stores flexible product specifications.
- `featured` marks products for highlighted admin/storefront placement.
- Rating and warranty fields have non-negative/range checks.

### `variants`

Stores sellable product variants.

Important columns:

- `id`
- `product_id`
- `name`
- `slug`
- `sku`
- `color`
- `specs_json`
- `price`
- `total_stock`
- `status`
- `created_at`
- `updated_at`

Notes:

- `product_id` is required.
- `slug` is unique.
- `sku` is unique when present and is used for inventory and order reconciliation.
- `price` and `total_stock` must be non-negative.
- `total_stock` is the aggregate stock across warehouses.

### `media`

Stores product or variant images.

Important columns:

- `id`
- `product_id`
- `variant_id`
- `public_id`
- `image_url`
- `is_primary`
- `display_order`
- `created_at`
- `updated_at`

Notes:

- `public_id` is unique and maps to the cloud media provider.
- A media record should belong to either a product or a variant, not both.
- The current model allows nullable `product_id` and `variant_id`; service validation enforces ownership.

## People And Access Tables

### `users`

Stores customer accounts.

Important columns:

- `id`
- `full_name`
- `gender`
- `date_of_birth`
- `username`
- `avatar_url`
- `email`
- `phone_number`
- `hashed_password`
- `status`
- `created_at`
- `updated_at`

Notes:

- `username`, `email`, and `phone_number` are unique.
- `status` uses `UserStatus`.

### `addresses`

Stores customer shipping addresses.

Important columns:

- `id`
- `user_id`
- `label`
- `line`
- `ward`
- `district`
- `province`
- `note`
- `is_default`
- `created_at`
- `updated_at`

### `staffs`

Stores admin/staff accounts.

Important columns:

- `id`
- `full_name`
- `gender`
- `date_of_birth`
- `username`
- `avatar_url`
- `email`
- `phone_number`
- `address`
- `role_id`
- `hashed_password`
- `status`
- `assigned_at`
- `updated_at`

Notes:

- `role_id` is required.
- `username`, `email`, and `phone_number` are unique.
- `status` uses `UserStatus`.

### `roles`

Stores staff roles.

Important columns:

- `id`
- `name`
- `status`
- `created_at`
- `updated_at`

Notes:

- `name` is unique.
- Permissions are connected through `role_permissions`.

### `permissions`

Stores permission definitions.

Important columns:

- `id`
- `code`
- `name`
- `description`
- `created_at`
- `updated_at`

Notes:

- `code` and `name` are unique.

### `role_permissions`

Join table between roles and permissions.

Important columns:

- `role_id`
- `permission_id`

## Sales Tables

### `orders`

Stores customer orders.

Important columns:

- `id`
- `user_id`
- `coupon_id`
- `code`
- `shipping_name`
- `shipping_phone`
- `shipping_line`
- `shipping_ward`
- `shipping_district`
- `shipping_province`
- `tracking_code`
- `status`
- `payment_method`
- `payment_status`
- `discount`
- `shipping_fee`
- `subtotal`
- `total`
- `note`
- `shipping_provider`
- `shipping_status`
- `paid_at`
- `created_at`
- `updated_at`

Notes:

- `code` is unique.
- `tracking_code` is unique when present.
- Money fields use `BigDecimal`.
- Status fields use order, payment, and shipping enums.

### `order_details`

Join table between orders and variants.

Important columns:

- `order_id`
- `variant_id`
- `price`
- `quantity`

Notes:

- Composite primary key: `order_id`, `variant_id`.
- `quantity` must be positive.
- `price` must be non-negative.

### `coupons`

Stores discount codes.

Important columns:

- `id`
- `category_id`
- `brand_id`
- `code`
- `type`
- `value`
- `min_order`
- `start_date`
- `end_date`
- `usage_limit`
- `max_discount`
- `status`
- `created_at`
- `updated_at`

Notes:

- `code` is unique.
- A coupon may apply globally, to a category, to a brand, or a combination depending on service rules.

### `reviews`

Stores product reviews.

Important columns:

- `id`
- `product_id`
- `user_id`
- `order_id`
- `rating_star`
- `content`
- `photos_json`
- `created_at`
- `updated_at`

Notes:

- `rating_star` must be between 1 and 5.
- `photos_json` stores review media references.

### `return_requests`

Stores return, exchange, and warranty requests.

Important columns:

- `id`
- `user_id`
- `order_id`
- `variant_id`
- `quantity`
- `handled_by_staff_id`
- `type`
- `reason`
- `refund_amount`
- `refund_method`
- `evidence_json`
- `status`
- `created_at`
- `updated_at`
- `resolved_at`

## Payment Tables

### `payment_transactions`

Stores payment and refund transactions.

Important columns:

- `id`
- `order_id`
- `return_request_id`
- `type`
- `provider`
- `provider_payment_id`
- `amount`
- `note`
- `status`
- `payment_time`
- `payload_json`
- `created_at`

Notes:

- `amount` must be positive.
- `payload_json` stores provider-specific metadata.
- Refund transactions can reference a return request.

## Warehouse Tables

### `warehouses`

Stores warehouse locations and capacity.

Important columns:

- `id`
- `name`
- `line`
- `ward`
- `district`
- `province`
- `capacity`
- `current_stock`
- `status`
- `created_at`
- `updated_at`

Notes:

- `capacity` and `current_stock` must be non-negative.
- `current_stock` must not exceed `capacity`.

### `warehouse_details`

Join table between warehouses and variants.

Important columns:

- `warehouse_id`
- `variant_id`
- `quantity`

Notes:

- Composite primary key: `warehouse_id`, `variant_id`.
- `quantity` must be non-negative.

### `warehouse_transactions`

Stores stock movement documents.

Important columns:

- `id`
- `code`
- `warehouse_id`
- `staff_id`
- `order_id`
- `return_request_id`
- `type`
- `status`
- `note`
- `created_at`
- `updated_at`

Notes:

- `code` is unique.
- `status` starts as `PENDING`.
- Completed transactions are used to update stock counts.

### `warehouse_transaction_details`

Join table between warehouse transactions and variants.

Important columns:

- `warehouse_transaction_id`
- `variant_id`
- `quantity`

Notes:

- Composite primary key: `warehouse_transaction_id`, `variant_id`.
- `quantity` must be positive.

## Security Tables

### `invalidated_tokens`

Stores JWT token ids that were logged out before expiry.

Important columns:

- `id`
- `expiry_time`
- `created_at`

Notes:

- `id` is the JWT token id.
- Cleanup should remove expired records.

## Enum Storage

Enums are stored as strings.

Important enums:

- `ProductStatus`: `ACTIVE`, `HIDDEN`, `DELETED`
- `UserStatus`: `ACTIVE`, `BLOCKED`, `DELETED`
- `OrderStatus`: `PENDING`, `PROCESSING`, `COMPLETED`, `CANCELLED`, `RETURNED`, `REFUNDED`
- `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`
- `PaymentProvider`: `COD`, `VNPAY`, `MOMO`
- `PaymentTransactionStatus`: `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`
- `PaymentTransactionType`: `PAYMENT`, `REFUND`
- `ShippingProvider`: `GHN`, `GHTK`, `VIETTELPOST`, `VNPOST`, `OTHER`
- `ShippingStatus`: `PENDING`, `SHIPPING`, `DELIVERED`, `RETURNED`, `CANCELLED`
- `WarehouseStatus`: `ACTIVE`, `INACTIVE`, `DELETED`
- `WarehouseTransactionType`: `INTERNAL_TRANSFER`, `RESERVED`, `IMPORT`, `EXPORT`, `RETURN`, `UNRESERVED`
- `WarehouseTransactionStatus`: `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`, `DELETED`
- `CouponStatus`: `ACTIVE`, `INACTIVE`, `DELETED`
- `CouponType`: `PERCENT`, `FIXED`
- `ReturnRequestType`: `RETURN`, `EXCHANGE`, `WARRANTY`
- `ReturnRequestStatus`: `PENDING`, `APPROVED`, `COMPLETED`, `REJECTED`, `CANCELLED`

## Schema Maintenance Rules

- Prefer explicit migrations later with Flyway or Liquibase before production.
- Keep entity fields, DTOs, and API docs in sync.
- Do not rely on `ddl-auto: update` for production deployments.
- Use status-based soft delete where the domain already follows that model.
- Keep monetary values as decimal types, not floating point.
