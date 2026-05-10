import {
  AlertCircle,
  BadgePercent,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCartStockInsights } from "../../cart/cartInsights";
import { formatCurrency } from "../../utils/formatters";
import FreeShippingProgress from "../cart/FreeShippingProgress";
import StockValidationPanel from "../cart/StockValidationPanel";
import OptimizedImage from "../common/OptimizedImage";
import Button from "../ui/Button";
import ApiErrorAlert from "../ui/feedback/ApiErrorAlert";

function CheckoutSummary({
  appliedCoupon,
  couponCode,
  couponDiscount,
  couponError,
  couponFeedback,
  createdOrder,
  items,
  itemCount,
  isApplyingCoupon = false,
  isPaymentRedirecting = false,
  isSubmitting = false,
  onCouponApply,
  onCouponChange,
  onCouponClear,
  onPlaceOrder,
  orderError,
  orderErrorTitle = "Chưa tạo được đơn hàng",
  orderPlaced,
  paymentMethod,
  shippingEstimate,
  shippingFee,
  shippingMethod,
  subtotal,
  validationMessage,
}) {
  const total = Math.max(subtotal + shippingFee - couponDiscount, 0);
  const { hasBlockingIssues } = getCartStockInsights(items);

  return (
    <aside className="rounded-3xl border border-blue-300/20 bg-[#07111F]/96 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_36px_rgba(0,91,255,0.12)] backdrop-blur-2xl lg:sticky lg:top-28 lg:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-caption text-blue-200">Tổng quan đơn</p>
          <h2 className="text-section mt-1 text-xl">Tóm tắt đơn hàng</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/30">
          <PackageCheck size={20} />
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-2 sm:grid-cols-[64px_minmax(0,1fr)_auto]" key={item.id}>
            <Link
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.22),rgba(15,23,42,0.78)_52%,rgba(2,6,23,0.96)_100%)] p-1.5"
              to={`/products/${item.product.slug}`}
            >
              <OptimizedImage alt={item.product.name} className="h-full w-full object-contain" sizes="64px" src={item.product.image} />
            </Link>
            <div className="min-w-0">
              <Link className="line-clamp-2 text-sm font-black text-white hover:text-blue-100" to={`/products/${item.product.slug}`}>
                {item.product.name}
              </Link>
              <p className="text-caption mt-1 text-slate-500">x{item.quantity} · {item.variant}</p>
            </div>
            <p className="col-span-2 text-right text-sm font-black text-blue-100 sm:col-span-1">{formatCurrency(item.product.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <FreeShippingProgress compact subtotal={subtotal} />
        <StockValidationPanel compact items={items} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/38 p-3">
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
            className="min-w-0 flex-1 bg-transparent text-sm font-bold uppercase text-white outline-none placeholder:normal-case placeholder:text-slate-500"
            onChange={(event) => onCouponChange(event.target.value)}
            placeholder="Mã giảm giá"
            type="text"
            value={couponCode}
          />
          <button
            className="inline-flex min-w-[58px] items-center justify-center gap-1 text-xs font-black text-blue-200 hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
            disabled={isApplyingCoupon || !couponCode.trim()}
            onClick={onCouponApply}
            type="button"
          >
            {isApplyingCoupon ? <Loader2 className="animate-spin" size={14} /> : "Áp dụng"}
          </button>
        </label>
        {couponFeedback && (
          <p className="text-caption mt-2 flex items-center gap-1.5 text-emerald-200">
            <CheckCircle2 size={14} />
            {couponFeedback}
          </p>
        )}
        {couponError && (
          <ApiErrorAlert className="mt-3" compact error={couponError} surface="store" title="Coupon chưa hợp lệ" />
        )}
        {appliedCoupon && !couponFeedback && <p className="text-caption mt-2 text-slate-500">Coupon đã được ghi nhận.</p>}
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3 text-slate-400">
          <span>Tạm tính ({itemCount} sản phẩm)</span>
          <span className="font-black text-slate-200">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-400">
          <span>{shippingMethod.name}</span>
          <span className="font-black text-emerald-200">{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
        </div>
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
        {couponDiscount > 0 && (
          <div className="flex items-center justify-between gap-3 text-slate-400">
            <span>Ưu đãi coupon</span>
            <span className="font-black text-emerald-200">-{formatCurrency(couponDiscount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-3 text-slate-400">
          <span>Thanh toán</span>
          <span className="font-black text-slate-200">{paymentMethod.name}</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
          <span className="font-black text-white">Tổng thanh toán</span>
          <span className="text-2xl font-black text-blue-200">{formatCurrency(total)}</span>
        </div>
      </div>

      {validationMessage && (
        <div className="mt-4 rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm font-bold text-red-100">
          <div className="flex gap-2">
            <AlertCircle className="mt-0.5 shrink-0" size={17} />
            <span>{validationMessage}</span>
          </div>
        </div>
      )}

      {orderError && (
        <ApiErrorAlert
          className="mt-4"
          compact
          error={orderError}
          surface="store"
          title={orderErrorTitle}
        />
      )}

      {isPaymentRedirecting && (
        <div className="mt-4 rounded-2xl border border-blue-300/30 bg-blue-500/10 p-3 text-sm font-bold text-blue-100">
          <div className="flex items-center gap-2">
            <Loader2 className="shrink-0 animate-spin" size={17} />
            <span>Đang mở phiên thanh toán VNPay Sandbox...</span>
          </div>
        </div>
      )}

      {orderPlaced ? (
        <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-center">
          <CheckCircle2 className="mx-auto text-emerald-200" size={30} />
          <p className="mt-2 font-black text-white">Đơn hàng đã được tạo</p>
          <p className="text-caption mt-1 text-slate-400">
            {createdOrder?.code ? `Mã đơn: ${createdOrder.code}. ` : ""}
            Bạn có thể theo dõi đơn hàng trong khu vực tài khoản.
          </p>
        </div>
      ) : (
        <Button className="mt-4 h-12 rounded-2xl" disabled={isSubmitting || hasBlockingIssues} fullWidth onClick={onPlaceOrder}>
          {isPaymentRedirecting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Đang chuyển sang VNPay
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Đang tạo đơn
            </>
          ) : hasBlockingIssues ? (
            "Kiểm tra tồn kho trước"
          ) : paymentMethod.id === "vnpay" ? (
            <>
              Thanh toán qua VNPay
              <ChevronRight size={18} />
            </>
          ) : (
            <>
              Xác nhận đặt hàng
              <ChevronRight size={18} />
            </>
          )}
        </Button>
      )}

      <Button as={Link} className="mt-2 h-11 rounded-2xl" fullWidth to="/cart" variant="outline">
        Quay lại giỏ hàng
      </Button>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="store-stat-card rounded-2xl p-3">
          <LockKeyhole className="mb-2 text-blue-200" size={18} />
          <p className="text-caption text-slate-400">Không lưu thông tin thẻ trên giao diện này</p>
        </div>
        <div className="store-stat-card rounded-2xl p-3">
          <ShieldCheck className="mb-2 text-emerald-200" size={18} />
          <p className="text-caption text-slate-400">Kiểm tra thông tin trước khi xác nhận</p>
        </div>
      </div>
    </aside>
  );
}

export default CheckoutSummary;
