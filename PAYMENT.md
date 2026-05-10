# PAYMENT

## Purpose

This guide explains the current COD, VNPay Sandbox, and MoMo Sandbox payment setup for ElectronicsManagement.

Backend implementation details are documented in [docs/backend/PAYMENT.md](docs/backend/PAYMENT.md).

## Current Payment Methods

| Method | Current behavior |
| --- | --- |
| COD | Creates the order and shows a local confirmation state. No external payment redirect. |
| VNPay Sandbox | Backend creates a signed VNPay payment URL and redirects the browser to VNPay Sandbox. |
| MoMo Sandbox | Backend creates a signed MoMo payment request and redirects the browser to MoMo Sandbox. |

Payment result pages:

- `/payment/success`
- `/payment/failed`

The frontend result pages verify server-side payment status before showing final paid, failed, or cancelled states.

## Local Sandbox URLs

Default local frontend:

```text
http://localhost:5173
```

Default local backend:

```text
http://localhost:8080/api
```

Backend payment endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/payments/vnpay/create` | Create VNPay Sandbox payment URL. |
| `POST` | `/api/payments/momo/create` | Create MoMo Sandbox payment request. |
| `GET` | `/api/payments/orders/{orderId}/status` | Verify server-side payment state. |
| `GET` | `/api/payments/vnpay-return` | VNPay browser return handler. |
| `GET` | `/api/payments/momo-return` | MoMo browser return handler. |
| `GET` | `/api/system/payment/vnpay-ipn` | VNPay IPN endpoint. |
| `POST` | `/api/system/payment/momo-ipn` | MoMo IPN endpoint. |

## Required Environment Variables

Frontend payment API path:

```env
VITE_PAYMENT_API_PATH=/payments
```

Shared frontend result URLs:

```env
PAYMENT_FRONTEND_SUCCESS_URL=http://localhost:5173/payment/success
PAYMENT_FRONTEND_FAILED_URL=http://localhost:5173/payment/failed
```

VNPay Sandbox:

```env
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_SECRET_KEY=YOUR_SECRET_KEY
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_REFUND_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
VNPAY_RETURN_URL=http://localhost:8080/api/payments/vnpay-return
```

MoMo Sandbox:

```env
MOMO_PARTNER_CODE=MOMO_PARTNER_CODE
MOMO_ACCESS_KEY=MOMO_ACCESS_KEY
MOMO_SECRET_KEY=MOMO_SECRET_KEY
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REFUND_URL=https://test-payment.momo.vn/v2/gateway/api/refund
MOMO_RETURN_URL=http://localhost:8080/api/payments/momo-return
MOMO_NOTIFY_URL=http://localhost:8080/api/system/payment/momo-ipn
```

Do not commit real sandbox or production credentials.

## Checkout Flow

```text
Customer checkout
  -> create order through backend Order API
  -> COD:
       show order confirmation and clear cart snapshot safely
     VNPay/MoMo:
       create backend payment request
       redirect browser to provider sandbox
       provider returns to backend return URL
       backend validates provider payload
       backend redirects to frontend result page
       frontend verifies /payments/orders/{orderId}/status
```

## VNPay Sandbox Flow

1. User selects VNPay in checkout.
2. Frontend calls:

```http
POST /api/payments/vnpay/create
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "orderId": 123,
  "provider": "VNPAY"
}
```

3. Backend creates a signed VNPay Sandbox URL.
4. Browser redirects to VNPay.
5. VNPay returns to:

```text
GET /api/payments/vnpay-return
```

6. Backend validates signature, merchant, amount, local order, and transaction.
7. Backend redirects to `/payment/success` or `/payment/failed`.

## MoMo Sandbox Flow

1. User selects MoMo in checkout.
2. Frontend calls:

```http
POST /api/payments/momo/create
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "orderId": 123,
  "provider": "MOMO"
}
```

3. Backend creates a signed MoMo Sandbox request.
4. Browser redirects to MoMo `payUrl`.
5. MoMo returns to:

```text
GET /api/payments/momo-return
```

6. MoMo may also call:

```text
POST /api/system/payment/momo-ipn
```

7. Backend validates signature, merchant, amount, local order, and transaction.
8. Backend redirects the browser to `/payment/success` or `/payment/failed`.

## Payment States

Backend enums:

```text
PaymentProvider: COD, VNPAY, MOMO
PaymentStatus: PENDING, PAID, FAILED, CANCELLED, REFUNDED
PaymentTransactionStatus: PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED
```

Frontend display states:

```text
pending, paid, failed, cancelled
```

## Local Testing Checklist

1. Start backend and frontend.
2. Confirm `VITE_API_BASE_URL=http://localhost:8080/api`.
3. Confirm payment provider environment variables are set.
4. Login as a customer-shaped account or use an existing authenticated test session.
5. Add products to cart.
6. Go to `/checkout`.
7. Test COD first.
8. Test VNPay Sandbox and confirm redirect/return.
9. Test MoMo Sandbox and confirm redirect/return.
10. Confirm result pages verify server status and do not trust query string success alone.
11. Confirm cart clears only after successful COD or matching paid online payment.

## Security Rules

- Provider secrets belong only on the backend.
- Always validate signatures and amount before marking an order paid.
- Treat browser return parameters as untrusted.
- Keep IPN endpoints public but validation strict.
- Do not expose raw provider payloads in UI.
- Do not log secret keys or signed raw strings.

## Production Notes

Before production:

- Replace sandbox credentials with production provider credentials.
- Use public HTTPS backend return/IPN URLs.
- Use public HTTPS frontend success/failed URLs.
- Confirm provider dashboards point to the exact deployed URLs.
- Add payment callback tests and refund edge-case tests.
- Confirm order state transitions and stock release behavior under failed/cancelled payments.

## Known Gaps

- Final production payment credentials are not configured.
- Customer auth and account ownership contracts still need final production hardening.
- Refund edge cases need broader automated tests.
- Payment/order state machine docs should be tightened before real production launch.
