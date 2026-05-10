import { unwrapApiPayload } from "./productMapper";

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function normalizeStatus(value) {
  return String(value ?? "pending").trim().toLowerCase();
}

export function normalizePaymentLinkResponse(response = {}) {
  const source = unwrapApiPayload(response) ?? {};

  return {
    deeplink: firstDefined(source.deeplink, source.deepLink, ""),
    message: firstDefined(source.message, ""),
    orderId: firstDefined(source.orderId, source.order?.id, null),
    paymentUrl: firstDefined(source.paymentUrl, source.payUrl, source.url, source.deeplink, ""),
    provider: String(firstDefined(source.provider, "VNPAY")).toUpperCase(),
    qrCodeUrl: firstDefined(source.qrCodeUrl, source.qrUrl, ""),
    raw: source,
    responseCode: firstDefined(source.responseCode, source.resultCode, source.code, ""),
    status: normalizeStatus(source.status),
    transactionId: firstDefined(source.transactionId, source.paymentTransactionId, null),
  };
}

export function normalizePaymentStatusResponse(response = {}) {
  const source = unwrapApiPayload(response) ?? {};

  return {
    amount: toNumber(source.amount, 0),
    message: firstDefined(source.message, ""),
    orderCode: firstDefined(source.orderCode, source.code, ""),
    orderId: firstDefined(source.orderId, source.order?.id, null),
    paymentStatus: String(firstDefined(source.paymentStatus, "")).toUpperCase(),
    provider: String(firstDefined(source.provider, "VNPAY")).toUpperCase(),
    providerPaymentId: firstDefined(source.providerPaymentId, source.transactionNo, ""),
    raw: source,
    redirectUrl: firstDefined(source.redirectUrl, ""),
    responseCode: firstDefined(source.responseCode, source.code, ""),
    status: normalizeStatus(source.status),
    transactionId: firstDefined(source.transactionId, source.paymentTransactionId, null),
    transactionStatus: String(firstDefined(source.transactionStatus, "")).toUpperCase(),
    verified: Boolean(source.verified),
  };
}
