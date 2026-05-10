# PAYMENT

## Purpose

This document describes the current payment architecture and flow.

The backend has payment integration code for:

- COD
- VNPay
- MoMo

The current implemented surface includes VNPay Sandbox checkout handoff, MoMo Sandbox checkout handoff, browser return handling, VNPay IPN handling, MoMo IPN handling, and refund strategy code.

## Main Classes

| Class | Responsibility |
| --- | --- |
| `UserPaymentController` | Storefront payment URL/request creation, VNPay/MoMo return redirects, and payment status verification. |
| `SystemPaymentTransactionController` | VNPay and MoMo IPN endpoints. |
| `SystemPaymentServiceImpl` | Validates provider payloads and updates payment/order state. |
| `PaymentGatewayService` | Shared storefront payment handoff abstraction. |
| `VNPayPaymentGatewayService` | VNPay Sandbox payment URL signing. |
| `MomoPaymentGatewayService` | MoMo Sandbox payment request signing and pay URL creation. |
| `SystemOrderServiceImpl` | Confirms successful payments and order side effects. |
| `PaymentTransactionEntity` | Stores payment and refund records. |
| `VNPayUtils` | VNPay signature and helper utilities. |
| `MomoUtils` | MoMo signature and helper utilities. |
| `VNPayRefundStrategy` | VNPay refund behavior. |
| `MomoRefundStrategy` | MoMo refund behavior. |
| `CodRefundStrategy` | COD refund recording behavior. |

## Payment Tables

Main table:

```text
payment_transactions
```

Important fields:

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

## Payment Enums

```text
PaymentProvider: COD, VNPAY, MOMO
PaymentMethodType: CASH, DIGITAL
PaymentStatus: PENDING, PAID, FAILED, CANCELLED, REFUNDED
PaymentTransactionType: PAYMENT, REFUND
PaymentTransactionStatus: PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED
```

Storefront status labels use lowercase equivalents:

```text
pending, paid, failed, cancelled
```

## Storefront Payment Endpoints

Create VNPay Sandbox payment URL:

```http
POST /api/payments/vnpay/create
```

Request:

```json
{
  "orderId": 123,
  "provider": "VNPAY"
}
```

Verify payment status:

```http
GET /api/payments/orders/{orderId}/status
```

Create MoMo Sandbox payment request:

```http
POST /api/payments/momo/create
```

Request:

```json
{
  "orderId": 123,
  "provider": "MOMO"
}
```

VNPay browser return URL:

```http
GET /api/payments/vnpay-return
```

MoMo browser return URL:

```http
GET /api/payments/momo-return
```

Return handling validates the provider signature, merchant code and amount, updates the transaction/order state, then redirects the browser to:

- `/payment/success` for paid payments.
- `/payment/failed` for failed or cancelled payments.

## Public Webhook Endpoints

VNPay:

```http
GET /api/system/payment/vnpay-ipn
```

MoMo:

```http
POST /api/system/payment/momo-ipn
```

These endpoints are public because payment providers call them directly.

## VNPay IPN Flow

```text
VNPay -> GET /api/system/payment/vnpay-ipn
  -> validate signature
  -> validate merchant code
  -> locate order
  -> locate payment transaction
  -> reject duplicate successful transaction
  -> verify amount
  -> if response code is 00:
       mark transaction SUCCESS
       confirm successful order payment
     else if response code is 24:
       mark transaction CANCELLED
       close unpaid order as CANCELLED
     else:
       mark transaction FAILED
       close unpaid order as FAILED
```

Provider response codes returned by current service:

| Code | Meaning |
| --- | --- |
| `00` | Successfully handled. |
| `01` | Order or transaction not found. |
| `02` | Already confirmed. |
| `04` | Amount mismatch. |
| `97` | Invalid signature. |

## MoMo IPN Flow

```text
MoMo -> POST /api/system/payment/momo-ipn
  -> validate signature
  -> validate merchant code
  -> locate order
  -> locate payment transaction
  -> reject duplicate successful transaction
  -> verify amount
  -> if resultCode is 0:
       mark transaction SUCCESS
       confirm successful order payment
     else if resultCode is 1006:
       mark transaction CANCELLED
       close unpaid order as CANCELLED
     else:
       mark transaction FAILED
       close unpaid order as FAILED
```

The current MoMo endpoint returns no body on success path.

## Refund Strategy

Refunds use a strategy pattern by provider:

| Provider | Strategy |
| --- | --- |
| `COD` | `CodRefundStrategy` |
| `MOMO` | `MomoRefundStrategy` |
| `VNPAY` | `VNPayRefundStrategy` |

Shared behavior:

- Create a `REFUND` payment transaction.
- Link it to the original order.
- Link it to the return request.
- Mark successful provider refunds as `SUCCESS`.

## Order Payment Side Effects

Successful payment should:

- Mark the payment transaction as `SUCCESS`.
- Move order payment state forward.
- Trigger system order confirmation behavior.
- Coordinate warehouse reservation/export behavior where implemented.

Failed payment should:

- Mark the payment transaction as `FAILED`.
- Mark order payment status as `FAILED`.
- Close unpaid pending orders and release reserved stock.

Cancelled payment should:

- Mark the payment transaction as `CANCELLED`.
- Mark order payment status as `CANCELLED`.
- Close unpaid pending orders and release reserved stock.

## Security Rules

- Always validate provider signatures.
- Always verify amount from provider against local transaction amount.
- Reject duplicate successful callbacks.
- Do not trust client-provided payment success data.
- Keep provider secrets on the backend only.
- Do not log secrets or raw signed secret values.

## Configuration

Provider configuration currently lives in backend application config.

Rules:

- Use placeholders in docs.
- VNPay payment URL creation is sandbox-only and rejects non-sandbox pay URLs.
- MoMo payment request creation is sandbox-only and rejects non-`test-payment.momo.vn` endpoints.
- Move secrets to environment variables before deployment.
- Keep return URLs and notify URLs aligned with actual deployed API paths.

## Known Gaps

- Payment config paths should be reviewed before deployment.
- Refund edge cases need tests.
- Payment state and order state should be documented as a stricter state machine before production.
- Customer auth and account ownership checks still need a dedicated public customer principal contract before production.
