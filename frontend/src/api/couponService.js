import { api } from "./client";
import { buildCouponPayload, normalizeCoupon, normalizeCouponPage } from "./couponMapper";
import {
  calculateCouponDiscount,
  createApiClientError,
  validateCouponForCart,
} from "./checkoutMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = import.meta.env.VITE_COUPON_API_PATH || "/admin/coupons";

const baseCouponService = createResourceService(RESOURCE_PATH);

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

export async function getAll(params = {}, config = {}) {
  const data = await baseCouponService.getAll(cleanParams(params), config);
  return normalizeCouponPage(data);
}

export async function getById(id, config = {}) {
  const data = await baseCouponService.getById(id, config);
  return normalizeCoupon(data);
}

export async function create(payload, config = {}) {
  const data = await baseCouponService.create(buildCouponPayload(payload), config);
  return normalizeCoupon(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseCouponService.update(id, buildCouponPayload(payload), config);
  return normalizeCoupon(data);
}

export async function remove(id, config = {}) {
  return baseCouponService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status: nextStatus }, config);

  return normalizeCoupon(data);
}

export async function applyCouponCode(code, cartContext = {}, config = {}) {
  const normalizedCode = String(code ?? "").trim();

  if (!normalizedCode) {
    throw createApiClientError("Vui lòng nhập mã giảm giá.", { code: "EMPTY_COUPON", status: 400 });
  }

  const data = await api.get(RESOURCE_PATH, {
    skipGlobalErrorHandler: true,
    ...config,
    params: {
      keyword: normalizedCode,
      page: 0,
      size: 20,
      status: "ACTIVE",
      timeStatus: "VALID",
      ...config.params,
    },
  });
  const couponPage = normalizeCouponPage(data);
  const coupon = couponPage.items.find((item) => item.code.toLowerCase() === normalizedCode.toLowerCase());

  if (!coupon) {
    throw createApiClientError("Mã giảm giá không hợp lệ.", { code: "INVALID_COUPON", status: 400 });
  }

  validateCouponForCart(coupon, cartContext);

  return {
    ...coupon,
    discount: calculateCouponDiscount(coupon, cartContext),
  };
}

const couponService = {
  ...baseCouponService,
  applyCouponCode,
  create,
  getAll,
  getById,
  remove,
  update,
  updateStatus,
};

export default couponService;
