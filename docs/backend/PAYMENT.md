# PAYMENT

## Purpose

This document describes the current payment architecture and flow.

The backend has payment integration code for:

- COD
- VNPay
- Momo

The current implemented surface is mostly system webhook handling and refund strategy code. Full public checkout APIs are not complete yet.

## Main Classes

| Class | Responsibility |
| --- | --- |
| `SystemPaymentTransactionController` | VNPay and Momo IPN endpoints. |
| `SystemPaymentServiceImpl` | Validates IPN payloads and updates payment/order state. |
| `SystemOrderServiceImpl` | Confirms successful payments and order side effects. |
| `PaymentTransactionEntity` | Stores payment and refund records. |
| `VNPayUtils` | VNPay signature and helper utilities. |
| `MomoUtils` | Momo signature and helper utilities. |
| `VNPayRefundStrategy` | VNPay refund behavior. |
| `MomoRefundStrategy` | Momo refund behavior. |
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
PaymentStatus: PENDING, PAID, FAILED, REFUNDED
PaymentTransactionType: PAYMENT, REFUND
PaymentTransactionStatus: PENDING, SUCCESS, FAILED, REFUNDED
```

## Public Webhook Endpoints

VNPay:

```http
GET /api/system/payment/vnpay-ipn
```

Momo:

```http
POST /api/system/payment/momo-ipn
```

These endpoints are public because payment providers call them directly.

## VNPay IPN Flow

```text
VNPay -> GET /api/system/payment/vnpay-ipn
  -> validate signature
  -> locate order
  -> locate payment transaction
  -> reject duplicate successful transaction
  -> verify amount
  -> if response code is 00:
       mark transaction SUCCESS
       confirm successful order payment
     else:
       mark transaction FAILED
       mark order payment FAILED
```

Provider response codes returned by current service:

| Code | Meaning |
| --- | --- |
| `00` | Successfully handled. |
| `01` | Order or transaction not found. |
| `02` | Already confirmed. |
| `04` | Amount mismatch. |
| `97` | Invalid signature. |

## Momo IPN Flow

```text
Momo -> POST /api/system/payment/momo-ipn
  -> validate signature
  -> locate order
  -> locate payment transaction
  -> reject duplicate successful transaction
  -> verify amount
  -> if resultCode is 0:
       mark transaction SUCCESS
       confirm successful order payment
     else:
       mark transaction FAILED
       mark order payment FAILED
```

The current Momo endpoint returns no body on success path.

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
- Move secrets to environment variables before deployment.
- Keep return URLs and notify URLs aligned with actual deployed API paths.

## Known Gaps

- Full client checkout/payment-link APIs are not complete.
- Payment config paths should be reviewed before deployment.
- Refund edge cases need tests.
- Payment state and order state should be documented as a stricter state machine before production.
