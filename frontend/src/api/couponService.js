import { api } from "./client";
import {
  calculateCouponDiscount,
  createApiClientError,
  normalizeCouponPage,
  validateCouponForCart,
} from "./checkoutMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = import.meta.env.VITE_COUPON_API_PATH || "/admin/coupons";

const baseCouponService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = baseCouponService;

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
};

export default couponService;
