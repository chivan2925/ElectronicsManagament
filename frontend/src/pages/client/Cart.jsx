import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  CircleCheck,
  MapPin,
  PackageCheck,
  PackageSearch,
  ShieldCheck,
  ShoppingCart,
  Truck,
  WalletCards,
} from "lucide-react";
import CartItem from "../../components/cart/CartItem";
import CartRecommendations from "../../components/cart/CartRecommendations";
import CartSummary from "../../components/cart/CartSummary";
import TrustSignalBar from "../../components/common/TrustSignalBar";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import { getFreeShippingState, getShippingEstimate, getStandardShippingAmount } from "../../cart/cartInsights";
import { useCart } from "../../cart";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import EmptyState from "../../components/ui/feedback/EmptyState";
import { useToast } from "../../components/ui/toast";
import useCheckoutCoupon from "../../hooks/useCheckoutCoupon";
import { fadeUp, staggerContainer } from "../../styles/animations";
import { formatCurrency } from "../../utils/formatters";

const MotionDiv = motion.div;

const trustHighlights = [
  {
    icon: Truck,
    label: "Giao nhanh",
    value: "TP.HCM 1-2 ngày, tỉnh thành 2-4 ngày",
  },
  {
    icon: ShieldCheck,
    label: "Bảo hành",
    value: "Hàng chính hãng, hỗ trợ tại shop",
  },
  {
    icon: WalletCards,
    label: "Thanh toán",
    value: "COD, thẻ, chuyển khoản khi checkout",
  },
  {
    icon: "RotateCcw",
    label: "Đổi trả",
    value: "Hỗ trợ trong 7 ngày tại cửa hàng",
  },
];

function Cart() {
  const {
    hasItems,
    itemCount,
    items: cartItems,
    productSavings,
    removeItem,
    subtotal,
    updateQuantity,
  } = useCart();
  const toast = useToast();
  const [couponCode, setCouponCode] = useState("");
  const {
    appliedCoupon,
    applyCoupon,
    clearCoupon,
    couponDiscount,
    couponError,
    couponFeedback,
    isApplyingCoupon,
  } = useCheckoutCoupon({ items: cartItems, subtotal });
  const shippingAmount = getStandardShippingAmount(subtotal);
  const { remaining: freeShippingRemaining } = getFreeShippingState(subtotal);
  const shippingEstimate = getShippingEstimate({ subtotal });
  const shippingCaption = freeShippingRemaining
    ? `Mua thêm ${formatCurrency(freeShippingRemaining)} để được miễn phí vận chuyển.`
    : "Đơn hàng đủ điều kiện miễn phí vận chuyển tiêu chuẩn.";

  const handleCouponApply = async () => {
    const normalizedCoupon = couponCode.trim();

    if (!normalizedCoupon) {
      return;
    }

    try {
      await applyCoupon(normalizedCoupon);
      toast.showSuccess("Mã giảm giá đã được áp dụng.", {
        title: "Coupon hợp lệ",
      });
    } catch (error) {
      toast.showApiError(error, {
        title: "Coupon chưa hợp lệ",
      });
    }
  };

  const handleCouponClear = () => {
    clearCoupon();
    setCouponCode("");
    toast.showInfo("Đã gỡ mã giảm giá khỏi đơn hàng.", {
      duration: 2400,
      title: "Coupon đã cập nhật",
    });
  };

  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-16 pt-6 sm:pt-8" id="main-content" tabIndex={-1}>
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
          <Link className="premium-transition hover:text-white" to="/">
            Trang chủ
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">Giỏ hàng</span>
        </nav>

        <section className="store-hero-panel p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <ShoppingCart size={13} />
                Sẵn sàng thanh toán
              </Badge>
              <h1 className="text-heading max-w-3xl">Giỏ hàng của bạn</h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                Kiểm tra gear đã chọn, cập nhật số lượng, nhập mã ưu đãi và chuẩn bị bước thanh toán với trải nghiệm mua sắm gọn, rõ, nhanh.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: `${itemCount} sản phẩm`, value: "Đang trong giỏ", icon: PackageCheck },
                { label: formatCurrency(subtotal), value: "Tạm tính", icon: WalletCards },
                { label: shippingAmount === 0 ? "Miễn phí ship" : formatCurrency(shippingAmount), value: "Ước tính giao hàng", icon: Truck },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div className="store-stat-card rounded-2xl p-3" key={item.label}>
                    <Icon className="mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]" size={20} />
                    <p className="text-sm font-black text-white">{item.label}</p>
                    <p className="text-caption mt-1 text-slate-400">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {hasItems ? (
          <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:grid-cols-[minmax(0,1fr)_420px]">
            <section className="min-w-0 space-y-4">
              <div className="store-surface-panel rounded-3xl p-4 sm:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-caption text-blue-200">Sản phẩm trong giỏ</p>
                    <h2 className="text-section mt-1 text-xl">{itemCount} sản phẩm sẵn sàng checkout</h2>
                  </div>
                  <Button as={Link} className="w-full rounded-2xl md:w-auto" to="/products" variant="outline">
                    <ArrowLeft size={17} />
                    Tiếp tục mua sắm
                  </Button>
                </div>

                <TrustSignalBar className="mt-5" compact signals={trustHighlights} surface="transparent" />
              </div>

              <div className="hidden rounded-2xl border border-white/10 bg-slate-950/44 px-4 py-3 text-xs font-black uppercase text-slate-500 md:grid md:grid-cols-[minmax(0,1fr)_116px_154px_134px_44px]">
                <span>Sản phẩm</span>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <span />
              </div>

              <MotionDiv animate="visible" className="grid gap-3" initial="hidden" role="list" variants={staggerContainer}>
                {cartItems.map((item) => (
                  <MotionDiv key={item.id} variants={fadeUp}>
                    <CartItem item={item} layout="page" onQuantityChange={updateQuantity} onRemove={removeItem} />
                  </MotionDiv>
                ))}
              </MotionDiv>

              <CartRecommendations items={cartItems} />

              <div className="grid gap-3 rounded-3xl border border-blue-300/15 bg-blue-500/[0.055] p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:grid-cols-3">
                <div className="store-stat-card rounded-2xl p-3">
                  <CircleCheck className="mb-2 text-emerald-200" size={18} />
                  <p className="text-sm font-black text-white">Tiết kiệm sản phẩm</p>
                  <p className="text-caption mt-1 text-slate-400">{formatCurrency(productSavings)}</p>
                </div>
                <div className="store-stat-card rounded-2xl p-3">
                  <MapPin className="mb-2 text-blue-200" size={18} />
                  <p className="text-sm font-black text-white">Ước tính giao hàng</p>
                  <p className="text-caption mt-1 text-slate-400">Nội thành 1-2 ngày, toàn quốc 2-4 ngày</p>
                </div>
                <div className="store-stat-card rounded-2xl p-3">
                  <ShieldCheck className="mb-2 text-blue-200" size={18} />
                  <p className="text-sm font-black text-white">Bảo vệ đơn hàng</p>
                  <p className="text-caption mt-1 text-slate-400">Kiểm tra hàng và hỗ trợ đổi trả theo chính sách</p>
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-28">
              <CartSummary
                appliedCoupon={appliedCoupon}
                checkoutLabel="Tiến hành thanh toán"
                className="lg:p-5"
                continueTo="/products"
                couponError={couponError}
                couponFeedback={couponFeedback}
                couponValue={couponCode}
                discount={couponDiscount}
                isApplyingCoupon={isApplyingCoupon}
                itemCount={itemCount}
                items={cartItems}
                onCouponApply={handleCouponApply}
                onCouponChange={setCouponCode}
                onCouponClear={handleCouponClear}
                shippingAmount={shippingAmount}
                shippingCaption={shippingCaption}
                shippingEstimate={shippingEstimate}
                shippingLabel="Giao tiêu chuẩn"
                subtotal={subtotal}
                title="Tóm tắt đơn hàng"
                variant="page"
              />
            </aside>
          </div>
        ) : (
          <section className="mt-7">
            <EmptyState
              actionIcon={ChevronRight}
              actionLabel="Xem sản phẩm"
              actionTo="/products"
              eyebrow="Giỏ hàng trống"
              icon={PackageSearch}
              message="Khám phá catalog gaming và thêm laptop, tai nghe, chuột hoặc linh kiện vào giỏ để bắt đầu đơn hàng."
              title="Chưa có sản phẩm nào"
            />
          </section>
        )}
      </Container>
    </div>
  );
}

export default Cart;
