import { ArrowRight, BadgePercent, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import Button from "../ui/Button";

function CartSummary({
  checkoutLabel = "Thanh toán",
  checkoutTo = "/checkout",
  className,
  continueLabel = "Tiếp tục mua sắm",
  continueTo,
  couponFeedback,
  couponValue,
  discount = 0,
  itemCount,
  onClose,
  onCouponApply,
  onCouponChange,
  shippingAmount,
  shippingCaption,
  shippingLabel = "Phí vận chuyển",
  shippingValue,
  subtotal,
  title,
  variant = "drawer",
}) {
  const isPage = variant === "page";
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

  return (
    <div
      className={cn(
        "bg-[#07111F]/96 p-4 backdrop-blur-2xl",
        isPage
          ? "rounded-3xl border border-blue-300/20 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_36px_rgba(0,91,255,0.12)]"
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

      <div className="rounded-2xl border border-white/10 bg-slate-950/38 p-3">
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 shadow-inner shadow-white/[0.03] focus-within:border-blue-300/70 focus-within:shadow-[0_0_26px_rgba(0,91,255,0.18)]">
          <BadgePercent className="shrink-0 text-blue-200" size={18} />
          <input
            {...couponInputProps}
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-500"
            placeholder="Mã giảm giá"
            type="text"
          />
          <button
            className="text-xs font-black text-blue-200 hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
            disabled={Boolean(onCouponChange) && !(couponValue || "").trim()}
            onClick={onCouponApply}
            type="button"
          >
            Áp dụng
          </button>
        </label>
        {couponFeedback && <p className="text-caption mt-2 text-emerald-200">{couponFeedback}</p>}

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
          <div className="mt-2 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
            <span className="font-black text-white">{isPage ? "Tổng thanh toán" : "Tổng tạm tính"}</span>
            <span className="text-xl font-black text-blue-200">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <Button as={Link} className="h-12 rounded-2xl" fullWidth onClick={onClose} to={checkoutTo}>
          {checkoutLabel}
          <ArrowRight size={18} />
        </Button>
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
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <Truck className="mb-2 text-blue-200" size={18} />
          <p className="text-caption text-slate-400">Giao nhanh toàn quốc</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <ShieldCheck className="mb-2 text-emerald-200" size={18} />
          <p className="text-caption text-slate-400">Bảo hành chính hãng</p>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
