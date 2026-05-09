import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ClipboardCheck, CreditCard, PackageSearch, ShieldCheck, Truck } from "lucide-react";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";
import PaymentMethodSelector from "../../components/checkout/PaymentMethodSelector";
import ShippingMethodSelector from "../../components/checkout/ShippingMethodSelector";
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

const initialCheckoutValues = {
  address: "",
  city: "",
  district: "",
  email: "",
  fullName: "",
  note: "",
  phone: "",
  ward: "",
};

const paymentMethods = [
  {
    badge: "Khuyến nghị",
    description: "Thanh toán khi nhận hàng, kiểm tra thông tin đơn trước khi trả tiền.",
    id: "cod",
    name: "COD",
    placeholder: false,
  },
  {
    badge: "Placeholder",
    description: "Giữ chỗ giao diện cho cổng VNPay, chưa tạo giao dịch thật.",
    id: "vnpay",
    name: "VNPay",
    placeholder: true,
  },
  {
    badge: "Placeholder",
    description: "Giữ chỗ giao diện cho ví MoMo, chưa gọi API thanh toán thật.",
    id: "momo",
    name: "MoMo",
    placeholder: true,
  },
];

function validateCheckout(values) {
  const errors = {};
  const phoneValue = values.phone.trim();
  const emailValue = values.email.trim();

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ tên.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Họ tên cần ít nhất 2 ký tự.";
  }

  if (!phoneValue) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!/^(0|\+84)[0-9\s.-]{8,13}$/.test(phoneValue)) {
    errors.phone = "Số điện thoại chưa đúng định dạng.";
  }

  if (!emailValue) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!values.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ chi tiết.";
  }

  if (!values.city.trim()) {
    errors.city = "Vui lòng nhập tỉnh hoặc thành phố.";
  }

  if (!values.district.trim()) {
    errors.district = "Vui lòng nhập quận hoặc huyện.";
  }

  if (!values.ward.trim()) {
    errors.ward = "Vui lòng nhập phường hoặc xã.";
  }

  return errors;
}

function Checkout() {
  const [cartItems] = useState(createMockCartItems);
  const [values, setValues] = useState(initialCheckoutValues);
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [shippingMethodId, setShippingMethodId] = useState("standard");
  const [paymentMethodId, setPaymentMethodId] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingMethods = useMemo(
    () => [
      {
        description: isFreeShipping
          ? "Đơn hàng đủ điều kiện miễn phí vận chuyển tiêu chuẩn."
          : `Miễn phí khi đơn hàng từ ${formatCurrency(FREE_SHIPPING_THRESHOLD)}.`,
        eta: "2-4 ngày",
        id: "standard",
        name: "Giao tiêu chuẩn",
        price: isFreeShipping ? 0 : STANDARD_SHIPPING_FEE,
      },
      {
        description: "Ưu tiên xử lý đơn trong ngày làm việc, phù hợp khi cần nhận sớm.",
        eta: "1-2 ngày",
        id: "express",
        name: "Giao nhanh",
        price: 89_000,
      },
      {
        description: "Nhận tại cửa hàng sau khi có thông báo xác nhận đơn.",
        eta: "Trong ngày",
        id: "pickup",
        name: "Nhận tại cửa hàng",
        price: 0,
      },
    ],
    [isFreeShipping],
  );
  const selectedShippingMethod = shippingMethods.find((method) => method.id === shippingMethodId) || shippingMethods[0];
  const selectedPaymentMethod = paymentMethods.find((method) => method.id === paymentMethodId) || paymentMethods[0];
  const validationErrors = validateCheckout(values);
  const visibleErrors = Object.keys(validationErrors).reduce((currentErrors, fieldName) => {
    if (submitAttempted || touchedFields[fieldName]) {
      return {
        ...currentErrors,
        [fieldName]: validationErrors[fieldName],
      };
    }

    return currentErrors;
  }, {});
  const couponDiscount = appliedCoupon ? Math.min(Math.round(subtotal * 0.05), 750_000) : 0;
  const couponFeedback = appliedCoupon
    ? `Đã áp dụng ${appliedCoupon.toUpperCase()} - giảm ${formatCurrency(couponDiscount)}`
    : "";
  const validationMessage =
    submitAttempted && Object.keys(validationErrors).length
      ? "Vui lòng kiểm tra các trường bắt buộc trước khi xác nhận đơn hàng."
      : "";

  const handleFieldChange = (fieldName, nextValue) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
    setOrderPlaced(false);
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
  };

  const handleCouponApply = () => {
    const normalizedCoupon = couponCode.trim();

    if (!normalizedCoupon) {
      return;
    }

    setAppliedCoupon(normalizedCoupon);
    setOrderPlaced(false);
  };

  const handlePlaceOrder = () => {
    setSubmitAttempted(true);
    setTouchedFields(
      Object.keys(initialCheckoutValues).reduce(
        (fields, fieldName) => ({
          ...fields,
          [fieldName]: true,
        }),
        {},
      ),
    );

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      window.requestAnimationFrame(() => {
        document.getElementById(firstErrorField)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      setOrderPlaced(false);
      return;
    }

    setOrderPlaced(true);
  };

  if (!cartItems.length) {
    return (
      <div className="store-page-shell">
        <AnnouncementBar />
        <Header />

        <Container as="main" className="pb-16 pt-6 sm:pt-8">
          <section className="flex min-h-[520px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center shadow-inner shadow-white/[0.03] backdrop-blur-xl">
            <div>
              <PackageSearch className="mx-auto text-blue-200 drop-shadow-[0_0_18px_rgba(0,91,255,0.55)]" size={54} />
              <Badge className="mx-auto mt-5" variant="primary">Không có sản phẩm</Badge>
              <h1 className="text-heading mt-4 text-3xl">Checkout cần sản phẩm trong giỏ</h1>
              <p className="text-muted mx-auto mt-3 max-w-md text-sm">
                Thêm sản phẩm vào giỏ hàng trước khi tiếp tục bước thanh toán.
              </p>
              <Button as={Link} className="mt-6 rounded-2xl" to="/products">
                Xem sản phẩm
                <ChevronRight size={18} />
              </Button>
            </div>
          </section>
        </Container>
      </div>
    );
  }

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
          <Link className="premium-transition hover:text-white" to="/cart">
            Giỏ hàng
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">Thanh toán</span>
        </nav>

        <section className="relative isolate overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_14%_0%,rgba(0,91,255,0.34),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(7,17,31,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_42px_rgba(0,91,255,0.14)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <ClipboardCheck size={13} />
                Secure mock checkout
              </Badge>
              <h1 className="text-heading max-w-3xl">Hoàn tất đơn hàng</h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                Nhập thông tin giao hàng, chọn vận chuyển và phương thức thanh toán. VNPay và MoMo đang là placeholder, chưa tạo giao dịch thật.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Truck, label: "Vận chuyển rõ ràng", value: selectedShippingMethod.eta },
                { icon: CreditCard, label: "3 phương thức", value: "COD, VNPay, MoMo" },
                { icon: ShieldCheck, label: "Mock an toàn", value: "Không gọi payment API" },
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

        <MotionDiv
          animate="visible"
          className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start xl:grid-cols-[minmax(0,1fr)_430px]"
          initial="hidden"
          variants={staggerContainer}
        >
          <MotionDiv className="min-w-0 space-y-4" variants={fadeUp}>
            <CheckoutForm
              errors={visibleErrors}
              onBlur={handleFieldBlur}
              onChange={handleFieldChange}
              values={values}
            />
            <ShippingMethodSelector
              onChange={(nextMethodId) => {
                setShippingMethodId(nextMethodId);
                setOrderPlaced(false);
              }}
              options={shippingMethods}
              value={shippingMethodId}
            />
            <PaymentMethodSelector
              onChange={(nextMethodId) => {
                setPaymentMethodId(nextMethodId);
                setOrderPlaced(false);
              }}
              options={paymentMethods}
              value={paymentMethodId}
            />
          </MotionDiv>

          <MotionDiv variants={fadeUp}>
            <CheckoutSummary
              appliedCoupon={appliedCoupon}
              couponCode={couponCode}
              couponDiscount={couponDiscount}
              couponFeedback={couponFeedback}
              itemCount={itemCount}
              items={cartItems}
              onCouponApply={handleCouponApply}
              onCouponChange={(nextCouponCode) => {
                setCouponCode(nextCouponCode);
                setOrderPlaced(false);
              }}
              onPlaceOrder={handlePlaceOrder}
              orderPlaced={orderPlaced}
              paymentMethod={selectedPaymentMethod}
              shippingFee={selectedShippingMethod.price}
              shippingMethod={selectedShippingMethod}
              subtotal={subtotal}
              validationMessage={validationMessage}
            />
          </MotionDiv>
        </MotionDiv>
      </Container>
    </div>
  );
}

export default Checkout;
