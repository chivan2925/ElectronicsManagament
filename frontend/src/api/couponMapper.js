import { unwrapApiPayload } from "./productMapper";

export const COUPON_STATUS = Object.freeze({
  active: "ACTIVE",
  deleted: "DELETED",
  inactive: "INACTIVE",
});

export const COUPON_TIME_STATUS = Object.freeze({
  expired: "EXPIRED",
  scheduled: "SCHEDULED",
  valid: "VALID",
});

export const COUPON_TYPE = Object.freeze({
  fixed: "FIXED",
  percent: "PERCENT",
});

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  return [];
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeEnum(value, fallback = "") {
  return String(firstDefined(value, fallback)).trim().toUpperCase();
}

function getPageItems(response) {
  const payload = unwrapApiPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isPlainObject(payload)) {
    return [];
  }

  return toArray(
    payload.content ??
      payload.items ??
      payload.coupons ??
      payload.records ??
      payload.results ??
      payload.list ??
      payload.rows ??
      payload.data,
  );
}

function getPageMeta(response, items) {
  const payload = unwrapApiPayload(response);
  const source = isPlainObject(payload) ? payload : {};
  const page = source.page ?? source.pagination ?? {};
  const pageNumber = firstDefined(source.number, source.pageNumber, source.currentPage, page.number, page.page, page.currentPage, 0);
  const pageSize = firstDefined(source.size, source.pageSize, page.size, page.pageSize, items.length);
  const totalItems = firstDefined(source.totalElements, source.totalItems, source.total, page.totalElements, page.totalItems, page.total, items.length);
  const totalPages = firstDefined(
    source.totalPages,
    page.totalPages,
    Math.max(1, Math.ceil(toNumber(totalItems, items.length) / Math.max(toNumber(pageSize, items.length || 1), 1))),
  );

  return {
    page: toNumber(pageNumber, 0),
    size: toNumber(pageSize, items.length),
    totalItems: toNumber(totalItems, items.length),
    totalPages: Math.max(1, toNumber(totalPages, 1)),
  };
}

export function toDatetimeLocalValue(value) {
  if (!value) {
    return "";
  }

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text)) {
    return text.slice(0, 16);
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function toApiLocalDateTime(value) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) {
    return `${text}:00`;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(text)) {
    return text.slice(0, 19);
  }

  return text;
}

export function getCouponLifecycle(coupon = {}) {
  const status = normalizeEnum(coupon.status, COUPON_STATUS.active);
  const now = Date.now();
  const startTime = coupon.startDate ? new Date(coupon.startDate).getTime() : null;
  const endTime = coupon.endDate ? new Date(coupon.endDate).getTime() : null;

  if (status === COUPON_STATUS.deleted) {
    return "deleted";
  }

  if (status === COUPON_STATUS.inactive) {
    return "inactive";
  }

  if (Number.isFinite(startTime) && startTime > now) {
    return "scheduled";
  }

  if (coupon.timeStatus === COUPON_TIME_STATUS.expired || (Number.isFinite(endTime) && endTime < now)) {
    return "expired";
  }

  return "active";
}

export function normalizeCoupon(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const usageLimit = toNullableNumber(firstDefined(source.usageLimit, source.usage_limit));
  const usedCount = toNumber(firstDefined(source.usedCount, source.used, source.usageCount, source.orderCount), 0);

  return {
    brandId: firstDefined(source.brandId, source.brand?.id, null),
    categoryId: firstDefined(source.categoryId, source.category?.id, null),
    code: String(firstDefined(source.code, source.couponCode, "")).trim(),
    createdAt: firstDefined(source.createdAt, source.created_at, null),
    endDate: firstDefined(source.endDate, source.endsAt, source.validUntil, null),
    id: firstDefined(source.id, source.couponId, source.code, null),
    maxDiscount: toNumber(firstDefined(source.maxDiscount, source.max_discount), 0),
    minOrder: toNumber(firstDefined(source.minOrder, source.minimumOrder, source.min_order), 0),
    raw: source,
    startDate: firstDefined(source.startDate, source.startsAt, source.validFrom, null),
    status: normalizeEnum(source.status, COUPON_STATUS.active),
    timeStatus: source.timeStatus ? normalizeEnum(source.timeStatus) : null,
    type: normalizeEnum(firstDefined(source.type, source.discountType), COUPON_TYPE.fixed),
    updatedAt: firstDefined(source.updatedAt, source.updated_at, null),
    usageLimit,
    usageRate: usageLimit ? Math.min(100, Math.round((usedCount / usageLimit) * 100)) : 0,
    usedCount,
    value: toNumber(firstDefined(source.value, source.amount, source.discountValue), 0),
  };
}

export function normalizeCouponPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeCoupon).filter((coupon) => coupon.code);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function buildCouponPayload(values = {}) {
  return {
    brandId: toNullableNumber(values.brandId),
    categoryId: toNullableNumber(values.categoryId),
    code: String(values.code ?? "").trim().toUpperCase(),
    endDate: toApiLocalDateTime(values.endDate),
    maxDiscount: toNullableNumber(values.maxDiscount),
    minOrder: toNumber(values.minOrder, 0),
    startDate: toApiLocalDateTime(values.startDate),
    status: normalizeEnum(values.status, COUPON_STATUS.active),
    type: normalizeEnum(values.type, COUPON_TYPE.fixed),
    usageLimit: toNullableNumber(values.usageLimit),
    value: toNumber(values.value, 0),
  };
}
