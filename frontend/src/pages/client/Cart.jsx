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
import CartSummary from "../../components/cart/CartSummary";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import { createMockCartItems } from "../../data";
import { fadeUp, staggerContainer } from "../../styles/animations";
import { formatCurrency } from "../../utils/formatters";

const MotionDiv = motion.div;

const FREE_SHIPPING_THRESHOLD = 5_000_000;
const STANDARD_SHIPPING_FEE = 45_000;

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
];

function Cart() {
  const [cartItems, setCartItems] = useState(createMockCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const productSavings = cartItems.reduce((total, item) => {
    if (!item.product.oldPrice) {
      return total;
    }

    return total + (item.product.oldPrice - item.product.price) * item.quantity;
  }, 0);
  const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const couponDiscount = appliedCoupon ? Math.min(Math.round(subtotal * 0.05), 750_000) : 0;
  const couponFeedback = appliedCoupon
    ? `Đã áp dụng ${appliedCoupon.toUpperCase()} - giảm ${formatCurrency(couponDiscount)}`
    : "";
  const shippingCaption = freeShippingRemaining
    ? `Mua thêm ${formatCurrency(freeShippingRemaining)} để được miễn phí vận chuyển.`
    : "Đơn hàng đủ điều kiện miễn phí vận chuyển tiêu chuẩn.";

  const handleQuantityChange = (itemId, nextQuantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.min(Math.max(nextQuantity, 1), item.maxQuantity),
            }
          : item,
      ),
    );
  };

  const handleRemove = (itemId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const handleCouponApply = () => {
    const normalizedCoupon = couponCode.trim();

    if (!normalizedCoupon) {
      return;
    }

    setAppliedCoupon(normalizedCoupon);
  };

  const hasItems = cartItems.length > 0;

  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-16 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
          <Link className="premium-transition hover:text-white" to="/">
            Trang chủ
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">Giỏ hàng</span>
        </nav>

        <section className="relative isolate overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_14%_0%,rgba(0,91,255,0.34),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(7,17,31,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_42px_rgba(0,91,255,0.14)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <ShoppingCart size={13} />
                Cart checkout ready
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
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-inner shadow-white/[0.03]" key={item.label}>
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
              <div className="rounded-3xl border border-white/10 bg-slate-950/36 p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-caption text-blue-200">Cart items</p>
                    <h2 className="text-section mt-1 text-xl">{itemCount} sản phẩm sẵn sàng checkout</h2>
                  </div>
                  <Button as={Link} className="w-full rounded-2xl md:w-auto" to="/products" variant="outline">
                    <ArrowLeft size={17} />
                    Tiếp tục mua sắm
                  </Button>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {trustHighlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3" key={item.label}>
                        <Icon className="mb-2 text-blue-200" size={18} />
                        <p className="text-sm font-black text-white">{item.label}</p>
                        <p className="text-caption mt-1 text-slate-400">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="hidden rounded-2xl border border-white/10 bg-slate-950/44 px-4 py-3 text-xs font-black uppercase text-slate-500 md:grid md:grid-cols-[minmax(0,1fr)_116px_154px_134px_44px]">
                <span>Sản phẩm</span>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <span />
              </div>

              <MotionDiv animate="visible" className="grid gap-3" initial="hidden" variants={staggerContainer}>
                {cartItems.map((item) => (
                  <MotionDiv key={item.id} variants={fadeUp}>
                    <CartItem item={item} layout="page" onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
                  </MotionDiv>
                ))}
              </MotionDiv>

              <div className="grid gap-3 rounded-3xl border border-blue-300/15 bg-blue-500/[0.055] p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                  <CircleCheck className="mb-2 text-emerald-200" size={18} />
                  <p className="text-sm font-black text-white">Tiết kiệm sản phẩm</p>
                  <p className="text-caption mt-1 text-slate-400">{formatCurrency(productSavings)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                  <MapPin className="mb-2 text-blue-200" size={18} />
                  <p className="text-sm font-black text-white">Ước tính giao hàng</p>
                  <p className="text-caption mt-1 text-slate-400">Nội thành 1-2 ngày, toàn quốc 2-4 ngày</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                  <ShieldCheck className="mb-2 text-blue-200" size={18} />
                  <p className="text-sm font-black text-white">Bảo vệ đơn hàng</p>
                  <p className="text-caption mt-1 text-slate-400">Kiểm tra hàng và hỗ trợ đổi trả theo chính sách</p>
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-28">
              <CartSummary
                checkoutLabel="Tiến hành thanh toán"
                className="lg:p-5"
                continueTo="/products"
                couponFeedback={couponFeedback}
                couponValue={couponCode}
                discount={couponDiscount}
                itemCount={itemCount}
                onCouponApply={handleCouponApply}
                onCouponChange={setCouponCode}
                shippingAmount={shippingAmount}
                shippingCaption={shippingCaption}
                shippingLabel="Giao tiêu chuẩn"
                subtotal={subtotal}
                title="Tóm tắt đơn hàng"
                variant="page"
              />
            </aside>
          </div>
        ) : (
          <section className="mt-7 flex min-h-[460px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center shadow-inner shadow-white/[0.03] backdrop-blur-xl">
            <div>
              <PackageSearch className="mx-auto text-blue-200 drop-shadow-[0_0_18px_rgba(0,91,255,0.55)]" size={54} />
              <Badge className="mx-auto mt-5" variant="primary">Giỏ hàng trống</Badge>
              <h2 className="text-heading mt-4 text-3xl">Chưa có sản phẩm nào</h2>
              <p className="text-muted mx-auto mt-3 max-w-md text-sm">
                Khám phá catalog gaming và thêm laptop, tai nghe, chuột hoặc linh kiện vào giỏ để bắt đầu đơn hàng.
              </p>
              <Button as={Link} className="mt-6 rounded-2xl" to="/products">
                Xem sản phẩm
                <ChevronRight size={18} />
              </Button>
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}

export default Cart;
