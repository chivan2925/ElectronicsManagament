import { unwrapApiPayload } from "./productMapper";

export function createApiClientError(message, options = {}) {
  const status = options.status ?? 400;
  const type = options.type ?? (status === 401 ? "unauthorized" : status === 403 ? "forbidden" : "client");
  const error = new Error(message);

  error.apiError = {
    code: options.code ?? null,
    details: options.details ?? null,
    isForbidden: status === 403,
    isNetworkError: false,
    isServerError: status >= 500,
    isTimeout: false,
    isUnauthorized: status === 401,
    isValidationError: [400, 409, 422].includes(Number(status)),
    message,
    method: options.method ?? null,
    path: options.path ?? null,
    status,
    type,
    url: options.url ?? null,
  };
  error.normalizedError = error.apiError;

  return error;
}

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

export function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
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

export function normalizeCoupon(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};

  return {
    brandId: firstDefined(source.brandId, source.brand?.id, null),
    categoryId: firstDefined(source.categoryId, source.category?.id, null),
    code: String(firstDefined(source.code, source.couponCode, "")).trim(),
    endDate: firstDefined(source.endDate, source.endsAt, source.validUntil, null),
    id: firstDefined(source.id, source.couponId, source.code, null),
    maxDiscount: toNumber(firstDefined(source.maxDiscount, source.max_discount), 0),
    minOrder: toNumber(firstDefined(source.minOrder, source.minimumOrder, source.min_order), 0),
    raw: source,
    startDate: firstDefined(source.startDate, source.startsAt, source.validFrom, null),
    status: String(firstDefined(source.status, "ACTIVE")).toUpperCase(),
    timeStatus: source.timeStatus ? String(source.timeStatus).toUpperCase() : null,
    type: String(firstDefined(source.type, source.discountType, "FIXED")).toUpperCase(),
    usageLimit: firstDefined(source.usageLimit, source.usage_limit, null),
    usedCount: toNumber(firstDefined(source.usedCount, source.used, source.usageCount), 0),
    value: toNumber(firstDefined(source.value, source.amount, source.discountValue), 0),
  };
}

export function normalizeCouponPage(response) {
  return {
    items: getPageItems(response).map(normalizeCoupon).filter((coupon) => coupon.code),
    raw: unwrapApiPayload(response),
  };
}

function isDateBeforeNow(value) {
  return value ? new Date(value).getTime() <= Date.now() : true;
}

function isDateAfterNow(value) {
  return value ? new Date(value).getTime() >= Date.now() : true;
}

export function isCouponCurrentlyUsable(coupon) {
  return (
    coupon &&
    coupon.status === "ACTIVE" &&
    coupon.timeStatus !== "EXPIRED" &&
    isDateBeforeNow(coupon.startDate) &&
    isDateAfterNow(coupon.endDate)
  );
}

function itemMatchesCoupon(coupon, item) {
  const product = item.product ?? {};
  const categoryMatches = !coupon.categoryId || String(coupon.categoryId) === String(product.categoryId ?? product.category?.id);
  const brandMatches = !coupon.brandId || String(coupon.brandId) === String(product.brandId ?? product.brand?.id);

  return categoryMatches && brandMatches;
}

export function getCouponEligibleSubtotal(coupon, items = []) {
  return items
    .filter((item) => itemMatchesCoupon(coupon, item))
    .reduce((total, item) => total + toNumber(item.unitPrice ?? item.product?.price) * toNumber(item.quantity), 0);
}

export function calculateCouponDiscount(coupon, { items = [], subtotal = 0 } = {}) {
  if (!coupon) {
    return 0;
  }

  const eligibleSubtotal = getCouponEligibleSubtotal(coupon, items);

  if (eligibleSubtotal <= 0 || subtotal < coupon.minOrder) {
    return 0;
  }

  const rawDiscount = coupon.type === "PERCENT" ? Math.round((eligibleSubtotal * coupon.value) / 100) : coupon.value;
  const cappedDiscount = coupon.maxDiscount > 0 ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;

  return Math.max(0, Math.min(cappedDiscount, subtotal));
}

export function validateCouponForCart(coupon, { items = [], subtotal = 0 } = {}) {
  if (!coupon?.code) {
    throw createApiClientError("Mã giảm giá không hợp lệ.", { code: "INVALID_COUPON", status: 400 });
  }

  if (!isCouponCurrentlyUsable(coupon)) {
    throw createApiClientError("Mã giảm giá đã hết hạn hoặc chưa khả dụng.", {
      code: "COUPON_NOT_AVAILABLE",
      status: 400,
    });
  }

  if (subtotal < coupon.minOrder) {
    throw createApiClientError("Đơn hàng chưa đạt giá trị tối thiểu của mã giảm giá.", {
      code: "COUPON_MIN_ORDER",
      status: 400,
    });
  }

  if (coupon.usageLimit && Number(coupon.usedCount ?? 0) >= Number(coupon.usageLimit)) {
    throw createApiClientError("Mã giảm giá đã hết lượt sử dụng.", {
      code: "COUPON_USAGE_LIMIT",
      status: 400,
    });
  }

  if (getCouponEligibleSubtotal(coupon, items) <= 0) {
    throw createApiClientError("Mã giảm giá không áp dụng cho sản phẩm trong giỏ hàng.", {
      code: "COUPON_NOT_APPLICABLE",
      status: 400,
    });
  }

  return true;
}

export function normalizeOrder(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};

  return {
    code: firstDefined(source.code, source.orderCode, source.id, ""),
    discount: toNumber(source.discount, 0),
    id: firstDefined(source.id, source.orderId, null),
    items: toArray(source.orderDetails ?? source.items ?? source.details),
    paymentStatus: firstDefined(source.paymentStatus, null),
    raw: source,
    shippingFee: toNumber(source.shippingFee, 0),
    status: firstDefined(source.status, null),
    subtotal: toNumber(source.subtotal, 0),
    total: toNumber(source.total, 0),
  };
}

export function getInvalidOrderItems(items = []) {
  return items.filter((item) => !Number.isInteger(Number(item.variantId)) || Number(item.quantity) <= 0);
}

function normalizePhone(value) {
  const digits = String(value ?? "").replace(/[^0-9]/g, "");

  if (digits.startsWith("84") && digits.length === 11) {
    return `0${digits.slice(2)}`;
  }

  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function buildCreateOrderPayload({
  appliedCoupon,
  items = [],
  paymentMethod,
  shippingMethod,
  user,
  values,
}) {
  const invalidItems = getInvalidOrderItems(items);

  if (invalidItems.length) {
    throw createApiClientError("Một số sản phẩm trong giỏ chưa có biến thể hợp lệ để tạo đơn.", {
      code: "INVALID_ORDER_ITEM",
      details: invalidItems.map((item) => item.product?.name ?? item.id),
      status: 422,
    });
  }

  const userId = firstDefined(user?.id, user?.userId);

  if (!userId) {
    throw createApiClientError("Phiên đăng nhập chưa có thông tin người dùng để đặt hàng.", {
      code: "MISSING_USER_ID",
      status: 401,
    });
  }

  return {
    couponCode: appliedCoupon?.code || null,
    items: items.map((item) => ({
      quantity: Number(item.quantity),
      variantId: Number(item.variantId),
    })),
    note: values.note?.trim() || null,
    paymentMethod: paymentMethod?.apiValue ?? "CASH",
    shippingDistrict: values.district.trim(),
    shippingFee: Number(shippingMethod?.price ?? 0),
    shippingLine: values.address.trim(),
    shippingName: values.fullName.trim(),
    shippingPhone: normalizePhone(values.phone),
    shippingProvider: shippingMethod?.provider ?? "OTHER",
    shippingProvince: values.city.trim(),
    shippingWard: values.ward.trim(),
    userId: Number(userId),
  };
}
