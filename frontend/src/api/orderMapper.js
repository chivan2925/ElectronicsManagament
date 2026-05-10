import { firstDefined, getPageItems, getPageMeta, toArray, toNumber, unwrapApiPayload } from "./mapperUtils";

export const ORDER_STAGE = Object.freeze({
  cancelled: "cancelled",
  confirmed: "confirmed",
  delivered: "delivered",
  pending: "pending",
  shipping: "shipping",
});

function normalizeEnum(value, fallback = "") {
  return String(value ?? fallback).trim().toUpperCase();
}

function getStageFromStatuses(orderStatus, shippingStatus) {
  const status = normalizeEnum(orderStatus);
  const shipping = normalizeEnum(shippingStatus);

  if (status === "CANCELLED" || shipping === "CANCELLED") {
    return ORDER_STAGE.cancelled;
  }

  if (status === "COMPLETED" || shipping === "DELIVERED") {
    return ORDER_STAGE.delivered;
  }

  if (shipping === "SHIPPING") {
    return ORDER_STAGE.shipping;
  }

  if (status === "PROCESSING") {
    return ORDER_STAGE.confirmed;
  }

  return ORDER_STAGE.pending;
}

function getStageLabel(stage) {
  const labels = {
    [ORDER_STAGE.cancelled]: "Cancelled",
    [ORDER_STAGE.confirmed]: "Confirmed",
    [ORDER_STAGE.delivered]: "Delivered",
    [ORDER_STAGE.pending]: "Pending",
    [ORDER_STAGE.shipping]: "Shipping",
  };

  return labels[stage] ?? "Pending";
}

export function getStageTone(stage) {
  const tones = {
    [ORDER_STAGE.cancelled]: "rose",
    [ORDER_STAGE.confirmed]: "blue",
    [ORDER_STAGE.delivered]: "emerald",
    [ORDER_STAGE.pending]: "amber",
    [ORDER_STAGE.shipping]: "violet",
  };

  return tones[stage] ?? "slate";
}

export function mapStageToBackend(stage, current = {}) {
  const normalizedStage = String(stage ?? "").toLowerCase();

  if (normalizedStage === ORDER_STAGE.cancelled) {
    return {
      shippingStatus: "CANCELLED",
      status: "CANCELLED",
    };
  }

  if (normalizedStage === ORDER_STAGE.delivered) {
    return {
      shippingStatus: "DELIVERED",
      status: "COMPLETED",
    };
  }

  if (normalizedStage === ORDER_STAGE.shipping) {
    return {
      shippingStatus: "SHIPPING",
      status: "PROCESSING",
    };
  }

  if (normalizedStage === ORDER_STAGE.confirmed) {
    return {
      shippingStatus: normalizeEnum(current.shippingStatus || "PENDING"),
      status: "PROCESSING",
    };
  }

  return {
    shippingStatus: "PENDING",
    status: "PENDING",
  };
}

export function normalizeAdminOrderItem(raw = {}) {
  const price = toNumber(firstDefined(raw.price, raw.unitPrice, raw.salePrice), 0);
  const quantity = toNumber(raw.quantity, 0);

  return {
    lineTotal: price * quantity,
    price,
    productName: firstDefined(raw.productName, raw.product?.name, raw.variant?.product?.name, raw.name, raw.variantName, "Sản phẩm"),
    quantity,
    raw,
    variantId: firstDefined(raw.variantId, raw.variant?.id, raw.id, null),
    variantName: firstDefined(raw.variantName, raw.variant?.name, raw.productName, "Phiên bản"),
  };
}

export function normalizeAdminOrderSummary(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const status = normalizeEnum(firstDefined(source.status, "PENDING"));
  const shippingStatus = normalizeEnum(firstDefined(source.shippingStatus, "PENDING"));
  const paymentStatus = normalizeEnum(firstDefined(source.paymentStatus, "PENDING"));
  const stage = getStageFromStatuses(status, shippingStatus);

  return {
    code: firstDefined(source.code, source.orderCode, source.id, ""),
    createdAt: firstDefined(source.createdAt, source.created_at, ""),
    customerName: firstDefined(source.userFullName, source.customerName, source.shippingName, "Khách hàng"),
    id: firstDefined(source.id, source.orderId, null),
    itemCount: toNumber(firstDefined(source.itemCount, source.itemsCount, source.totalItems), 0),
    paymentMethod: normalizeEnum(firstDefined(source.paymentMethod, source.paymentMethodType, "CASH")),
    paymentStatus,
    raw: source,
    shippingName: firstDefined(source.shippingName, source.userFullName, ""),
    shippingPhone: firstDefined(source.shippingPhone, source.userPhoneNumber, ""),
    shippingProvider: normalizeEnum(firstDefined(source.shippingProvider, "OTHER")),
    shippingStatus,
    stage,
    stageLabel: getStageLabel(stage),
    status,
    total: toNumber(source.total, 0),
    updatedAt: firstDefined(source.updatedAt, source.updated_at, source.createdAt, source.created_at, ""),
    userFullName: firstDefined(source.userFullName, source.shippingName, ""),
    userId: firstDefined(source.userId, null),
  };
}

export function normalizeAdminOrderDetail(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const summary = normalizeAdminOrderSummary(source);
  const items = toArray(source.orderDetails ?? source.items ?? source.details).map(normalizeAdminOrderItem);

  return {
    ...summary,
    couponCode: firstDefined(source.couponCode, ""),
    discount: toNumber(source.discount, 0),
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    items,
    note: firstDefined(source.note, ""),
    paidAt: firstDefined(source.paidAt, ""),
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

export function normalizeAdminOrderPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeAdminOrderSummary);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function buildAdminOrderUpdatePayload(values = {}) {
  const stageMapping = mapStageToBackend(values.stage, values);

  return {
    paymentStatus: normalizeEnum(values.paymentStatus || "PENDING"),
    shippingProvider: normalizeEnum(values.shippingProvider || "OTHER"),
    shippingStatus: normalizeEnum(values.shippingStatus || stageMapping.shippingStatus),
    status: normalizeEnum(values.status || stageMapping.status),
    trackingCode: values.trackingCode?.trim() || null,
  };
}

export function getOrderStageFilterParams(stage) {
  const normalizedStage = String(stage ?? "").toLowerCase();

  if (normalizedStage === ORDER_STAGE.cancelled) {
    return { status: "CANCELLED" };
  }

  if (normalizedStage === ORDER_STAGE.delivered) {
    return { status: "COMPLETED", shippingStatus: "DELIVERED" };
  }

  if (normalizedStage === ORDER_STAGE.shipping) {
    return { status: "PROCESSING", shippingStatus: "SHIPPING" };
  }

  if (normalizedStage === ORDER_STAGE.confirmed) {
    return { status: "PROCESSING", shippingStatus: "PENDING" };
  }

  if (normalizedStage === ORDER_STAGE.pending) {
    return { status: "PENDING" };
  }

  return {};
}
