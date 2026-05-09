import { useCallback, useMemo, useState } from "react";
import couponService from "../api/couponService";
import { calculateCouponDiscount } from "../api/checkoutMapper";

function useCheckoutCoupon({ items, subtotal }) {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const couponDiscount = useMemo(
    () => calculateCouponDiscount(appliedCoupon, { items, subtotal }),
    [appliedCoupon, items, subtotal],
  );

  const couponFeedback = appliedCoupon
    ? `Đã áp dụng ${appliedCoupon.code.toUpperCase()} - giảm ${couponDiscount.toLocaleString("vi-VN")}đ`
    : "";

  const applyCoupon = useCallback(
    async (code) => {
      setIsApplyingCoupon(true);
      setCouponError(null);

      try {
        const coupon = await couponService.applyCouponCode(code, { items, subtotal });
        setAppliedCoupon(coupon);
        return coupon;
      } catch (error) {
        setAppliedCoupon(null);
        setCouponError(error);
        throw error;
      } finally {
        setIsApplyingCoupon(false);
      }
    },
    [items, subtotal],
  );

  const clearCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError(null);
  }, []);

  return {
    appliedCoupon,
    applyCoupon,
    clearCoupon,
    couponDiscount,
    couponError,
    couponFeedback,
    isApplyingCoupon,
  };
}

export default useCheckoutCoupon;
