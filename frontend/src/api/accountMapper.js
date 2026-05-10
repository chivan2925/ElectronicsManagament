import { firstDefined, getPageItems, getPageMeta, toArray, toNumber, unwrapApiPayload } from "./mapperUtils";

export function normalizePhoneNumber(value) {
  const digits = String(value ?? "").replace(/[^0-9]/g, "");

  if (digits.startsWith("84") && digits.length === 11) {
    return `0${digits.slice(2)}`;
  }

  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function normalizeAccountProfile(raw = {}, fallback = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const phoneNumber = firstDefined(source.phoneNumber, source.phone, fallback.phoneNumber, fallback.phone, "");

  return {
    avatarUrl: firstDefined(source.avatarUrl, source.avatar, fallback.avatarUrl, ""),
    createdAt: firstDefined(source.createdAt, fallback.createdAt, null),
    dateOfBirth: firstDefined(source.dateOfBirth, fallback.dateOfBirth, ""),
    email: firstDefined(source.email, fallback.email, ""),
    fullName: firstDefined(source.fullName, source.name, fallback.fullName, ""),
    gender: firstDefined(source.gender, fallback.gender, "PREFER_NOT_TO_SAY"),
    id: firstDefined(source.id, source.userId, fallback.id, fallback.userId, null),
    phone: phoneNumber,
    phoneNumber,
    raw: source,
    status: firstDefined(source.status, fallback.status, "ACTIVE"),
    updatedAt: firstDefined(source.updatedAt, fallback.updatedAt, null),
    username: firstDefined(source.username, fallback.username, ""),
  };
}

export function buildUpdateProfilePayload(values = {}) {
  return {
    avatarUrl: values.avatarUrl?.trim() || null,
    dateOfBirth: values.dateOfBirth || null,
    email: values.email?.trim() ?? "",
    fullName: values.fullName?.trim() ?? "",
    gender: values.gender || "PREFER_NOT_TO_SAY",
    phoneNumber: normalizePhoneNumber(values.phoneNumber ?? values.phone),
    username: values.username?.trim() ?? "",
  };
}

export function normalizeOrderItem(raw = {}) {
  return {
    price: toNumber(firstDefined(raw.price, raw.unitPrice, raw.salePrice), 0),
    productName: firstDefined(raw.productName, raw.product?.name, raw.name, raw.variantName, "Sản phẩm"),
    quantity: toNumber(raw.quantity, 0),
    raw,
    variantId: firstDefined(raw.variantId, raw.id, null),
    variantName: firstDefined(raw.variantName, raw.variant?.name, raw.productName, "Phiên bản"),
  };
}

export function normalizeOrderSummary(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};

  return {
    code: firstDefined(source.code, source.orderCode, source.id, ""),
    createdAt: firstDefined(source.createdAt, null),
    id: firstDefined(source.id, source.orderId, null),
    paymentMethod: firstDefined(source.paymentMethod, source.paymentMethodType, null),
    paymentStatus: firstDefined(source.paymentStatus, null),
    raw: source,
    shippingName: firstDefined(source.shippingName, source.userFullName, ""),
    shippingPhone: firstDefined(source.shippingPhone, source.userPhoneNumber, ""),
    shippingProvider: firstDefined(source.shippingProvider, null),
    shippingStatus: firstDefined(source.shippingStatus, null),
    status: firstDefined(source.status, null),
    total: toNumber(source.total, 0),
    updatedAt: firstDefined(source.updatedAt, null),
    userFullName: firstDefined(source.userFullName, source.shippingName, ""),
    userId: firstDefined(source.userId, null),
  };
}

export function normalizeOrderDetail(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const summary = normalizeOrderSummary(source);

  return {
    ...summary,
    activityHistory: toArray(source.activityHistory ?? source.activities ?? source.timeline ?? source.statusHistory ?? source.histories),
    cancelledAt: firstDefined(source.cancelledAt, null),
    couponCode: firstDefined(source.couponCode, null),
    deliveredAt: firstDefined(source.deliveredAt, null),
    discount: toNumber(source.discount, 0),
    estimatedDelivery: firstDefined(source.estimatedDelivery, source.estimatedDeliveryAt, source.deliveryDate, source.deliveryEta, null),
    items: toArray(source.orderDetails ?? source.items ?? source.details).map(normalizeOrderItem),
    note: firstDefined(source.note, ""),
    paidAt: firstDefined(source.paidAt, null),
    shippingAddress: {
      district: firstDefined(source.shippingDistrict, ""),
      line: firstDefined(source.shippingLine, ""),
      province: firstDefined(source.shippingProvince, ""),
      ward: firstDefined(source.shippingWard, ""),
    },
    shippingFee: toNumber(source.shippingFee, 0),
    subtotal: toNumber(source.subtotal, 0),
    trackingCode: firstDefined(source.trackingCode, ""),
    userEmail: firstDefined(source.userEmail, ""),
    userPhoneNumber: firstDefined(source.userPhoneNumber, summary.shippingPhone, ""),
  };
}

export function normalizeOrderPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeOrderSummary);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}
