import { ArrowRight, BadgePercent, CheckCircle2, Clock3, Loader2, MapPin, ShieldCheck, Truck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { buildApiErrorFeedback } from "../../api/apiErrorFeedback";
import { getCartStockInsights } from "../../cart/cartInsights";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import Button from "../ui/Button";
import FreeShippingProgress from "./FreeShippingProgress";
import StockValidationPanel from "./StockValidationPanel";

function CartSummary({
  appliedCoupon,
  checkoutLabel = "Thanh toán",
  checkoutTo = "/checkout",
  className,
  continueLabel = "Tiếp tục mua sắm",
  continueTo,
  couponError,
  couponFeedback,
  couponValue,
  discount = 0,
  isApplyingCoupon = false,
  itemCount,
  items = [],
  onClose,
  onCouponApply,
  onCouponChange,
  onCouponClear,
  shippingAmount,
  shippingCaption,
  shippingEstimate,
  shippingLabel = "Phí vận chuyển",
  shippingValue,
  subtotal,
  title,
  variant = "drawer",
}) {
  const isPage = variant === "page";
  const hasCouponControls = Boolean(onCouponApply && onCouponChange);
  const { hasBlockingIssues } = getCartStockInsights(items);
  const resolvedShippingAmount = typeof shippingAmount === "number" ? shippingAmount : 0;
  const total = Math.max(subtotal + resolvedShippingAmount - discount, 0);
  const shippingDisplay =
    shippingValue || (typeof shippingAmount === "number" ? (shippingAmount === 0 ? "Miễn phí" : formatCurrency(shippingAmount)) : "Tính khi thanh toán");
  const couponInputProps = onCouponChange
    ? {
        onChange: (event) => onCouponChange(event.target.value),
        value: couponValue || "",
      }
    : {};
  const couponErrorFeedback = couponError ? buildApiErrorFeedback(couponError, { title: "Coupon chưa hợp lệ" }) : null;

  return (
    <div
      className={cn(
        "bg-[#07111F]/96 p-4 backdrop-blur-2xl",
        isPage
          ? "store-surface-panel-strong rounded-3xl"
          : "border-t border-white/10 shadow-[0_-18px_60px_rgba(0,0,0,0.34)]",
        className,
      )}
    >
      {title && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-section text-xl">{title}</h2>
            <p className="text-caption mt-1 text-slate-400">{itemCount} sản phẩm đã chọn</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/30">
            <BadgePercent size={20} />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        <FreeShippingProgress compact subtotal={subtotal} />
        <StockValidationPanel compact items={items} showHealthy={isPage} />
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/38 p-3">
        {hasCouponControls && (
          <>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-black text-white">Mã ưu đãi</p>
              {appliedCoupon && onCouponClear && (
                <button
                  className="inline-flex items-center gap-1 text-xs font-black text-slate-400 transition-default hover:text-white"
                  onClick={onCouponClear}
                  type="button"
                >
                  <X size={13} />
                  Đổi mã
                </button>
              )}
            </div>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 shadow-inner shadow-white/[0.03] focus-within:border-blue-300/70 focus-within:shadow-[0_0_26px_rgba(0,91,255,0.18)]">
              {appliedCoupon ? (
                <CheckCircle2 className="shrink-0 text-emerald-200" size={18} />
              ) : (
                <BadgePercent className="shrink-0 text-blue-200" size={18} />
              )}
              <input
                {...couponInputProps}
                className="min-w-0 flex-1 bg-transparent text-sm font-bold uppercase text-white outline-none placeholder:normal-case placeholder:text-slate-500"
                placeholder="Mã giảm giá"
                type="text"
              />
              <button
                className="inline-flex min-w-[58px] items-center justify-center gap-1 text-xs font-black text-blue-200 hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
                disabled={isApplyingCoupon || !(couponValue || "").trim()}
                onClick={onCouponApply}
                type="button"
              >
                {isApplyingCoupon ? <Loader2 className="animate-spin" size={14} /> : "Áp dụng"}
              </button>
            </label>
            {couponFeedback && <p className="text-caption mt-2 text-emerald-200">{couponFeedback}</p>}
            {couponErrorFeedback && <p className="text-caption mt-2 text-red-200">{couponErrorFeedback.message}</p>}
          </>
        )}

        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-3 text-slate-400">
            <span>Tạm tính ({itemCount} sản phẩm)</span>
            <span className="font-black text-slate-200">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between gap-3 text-slate-400">
              <span>Ưu đãi coupon</span>
              <span className="font-black text-emerald-200">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 text-slate-400">
            <span>{shippingLabel}</span>
            <span className="text-right font-black text-emerald-200">{shippingDisplay}</span>
          </div>
          {shippingCaption && <p className="text-caption text-slate-500">{shippingCaption}</p>}
          {shippingEstimate && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 shrink-0 text-blue-200" size={16} />
                <div className="min-w-0">
                  <p className="text-xs font-black text-white">{shippingEstimate.destination}</p>
                  <p className="text-caption mt-1 flex items-center gap-1.5 text-slate-400">
                    <Clock3 size={13} />
                    {shippingEstimate.eta}
                  </p>
                  <p className="text-caption mt-1 text-slate-500">{shippingEstimate.note}</p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-2 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
            <span className="font-black text-white">{isPage ? "Tổng thanh toán" : "Tổng tạm tính"}</span>
            <span className="text-xl font-black text-blue-200">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {hasBlockingIssues ? (
          <Button className="h-12 rounded-2xl" disabled fullWidth>
            Kiểm tra tồn kho trước
          </Button>
        ) : (
          <Button as={Link} className="h-12 rounded-2xl" fullWidth onClick={onClose} to={checkoutTo}>
            {checkoutLabel}
            <ArrowRight size={18} />
          </Button>
        )}
        {continueTo ? (
          <Button as={Link} className="h-11 rounded-2xl" fullWidth onClick={onClose} to={continueTo} variant="outline">
            {continueLabel}
          </Button>
        ) : (
          <Button className="h-11 rounded-2xl" fullWidth onClick={onClose} variant="outline">
            {continueLabel}
          </Button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="store-stat-card rounded-2xl p-3">
          <Truck className="mb-2 text-blue-200" size={18} />
          <p className="text-caption text-slate-400">Giao nhanh toàn quốc</p>
        </div>
        <div className="store-stat-card rounded-2xl p-3">
          <ShieldCheck className="mb-2 text-emerald-200" size={18} />
          <p className="text-caption text-slate-400">Bảo hành chính hãng</p>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
