import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ClipboardCheck, CreditCard, PackageSearch, ShieldCheck, Truck } from "lucide-react";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";
import PaymentMethodSelector from "../../components/checkout/PaymentMethodSelector";
import ShippingMethodSelector from "../../components/checkout/ShippingMethodSelector";
import TrustSignalBar from "../../components/common/TrustSignalBar";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import PaymentTrustIndicators from "../../components/payment/PaymentTrustIndicators";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  getCartStockInsights,
  getShippingEstimate,
} from "../../cart/cartInsights";
import paymentService from "../../api/paymentService";
import { useCart } from "../../cart";
import Badge from "../../components/ui/Badge";
import Container from "../../components/ui/Container";
import EmptyState from "../../components/ui/feedback/EmptyState";
import { useToast } from "../../components/ui/toast";
import useCheckoutCoupon from "../../hooks/useCheckoutCoupon";
import useCheckoutOrder from "../../hooks/useCheckoutOrder";
import useCheckoutProfile from "../../hooks/useCheckoutProfile";
import { trackPaymentError } from "../../monitoring";
import { fadeUp, staggerContainer } from "../../styles/animations";
import { formatCurrency } from "../../utils/formatters";

const MotionDiv = motion.div;

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
    flowTitle: "Xác nhận COD",
    highlights: ["Không nhập thẻ", "Kiểm tra khi nhận"],
    apiValue: "CASH",
    id: "cod",
    name: "COD",
    placeholder: false,
    provider: "COD",
    settlement: "Đơn được ghi nhận ngay, thanh toán trực tiếp cho đơn vị giao hàng khi nhận sản phẩm.",
    subtitle: "Thanh toán khi nhận hàng",
  },
  {
    badge: "Sandbox",
    description: "Tạo phiên thanh toán VNPay Sandbox và chuyển hướng sang cổng bảo mật.",
    flowTitle: "Luồng VNPay Sandbox",
    highlights: ["Secure hash", "Server xác minh"],
    apiValue: "DIGITAL",
    id: "vnpay",
    name: "VNPay",
    placeholder: false,
    provider: "VNPAY",
    settlement: "Website chỉ cập nhật paid sau khi backend xác minh secure hash, merchant code và số tiền.",
    subtitle: "Cổng thanh toán nội địa",
  },
  {
    badge: "Sandbox",
    description: "Tạo phiên thanh toán ví MoMo Sandbox với xác minh chữ ký giao dịch.",
    flowTitle: "Luồng MoMo Sandbox",
    highlights: ["HMAC-SHA256", "Server xác minh"],
    apiValue: "DIGITAL",
    id: "momo",
    name: "MoMo",
    placeholder: false,
    provider: "MOMO",
    settlement: "Website chỉ cập nhật paid sau khi backend xác minh chữ ký MoMo, merchant code và số tiền.",
    subtitle: "Ví điện tử",
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
  const { itemCount, items: cartItems, subtotal } = useCart();
  const toast = useToast();
  const { profile } = useCheckoutProfile();
  const [values, setValues] = useState(initialCheckoutValues);
  const [profileApplied, setProfileApplied] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [shippingMethodId, setShippingMethodId] = useState("standard");
  const [paymentMethodId, setPaymentMethodId] = useState("cod");
  const [paymentHandoff, setPaymentHandoff] = useState({
    error: null,
    isRedirecting: false,
  });
  const [couponCode, setCouponCode] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const {
    appliedCoupon,
    applyCoupon,
    clearCoupon,
    couponDiscount,
    couponError,
    couponFeedback,
    isApplyingCoupon,
  } = useCheckoutCoupon({ items: cartItems, subtotal });
  const {
    createOrder,
    createOrderError,
    createdOrder,
    isCreatingOrder,
    resetOrder,
  } = useCheckoutOrder();

  useEffect(() => {
    if (profileApplied || !profile) {
      return undefined;
    }

    let isActive = true;

    Promise.resolve().then(() => {
      if (!isActive) {
        return;
      }

      setValues((currentValues) => ({
        ...currentValues,
        email: currentValues.email || profile.email,
        fullName: currentValues.fullName || profile.fullName,
        phone: currentValues.phone || profile.phone,
      }));
      setProfileApplied(true);
    });

    return () => {
      isActive = false;
    };
  }, [profile, profileApplied]);

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
        provider: "GHN",
      },
      {
        description: "Ưu tiên xử lý đơn trong ngày làm việc, phù hợp khi cần nhận sớm.",
        eta: "1-2 ngày",
        id: "express",
        name: "Giao nhanh",
        price: 89_000,
        provider: "GHTK",
      },
      {
        description: "Nhận tại cửa hàng sau khi có thông báo xác nhận đơn.",
        eta: "Trong ngày",
        id: "pickup",
        name: "Nhận tại cửa hàng",
        price: 0,
        provider: "OTHER",
      },
    ],
    [isFreeShipping],
  );
  const selectedShippingMethod = shippingMethods.find((method) => method.id === shippingMethodId) || shippingMethods[0];
  const selectedPaymentMethod = paymentMethods.find((method) => method.id === paymentMethodId) || paymentMethods[0];
  const stockInsights = useMemo(() => getCartStockInsights(cartItems), [cartItems]);
  const shippingEstimate = useMemo(
    () =>
      getShippingEstimate({
        city: values.city,
        shippingMethod: selectedShippingMethod,
        subtotal,
      }),
    [selectedShippingMethod, subtotal, values.city],
  );
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
    setPaymentHandoff({ error: null, isRedirecting: false });
    resetOrder();
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
  };

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
      setOrderPlaced(false);
      setPaymentHandoff({ error: null, isRedirecting: false });
      resetOrder();
    } catch (error) {
      toast.showApiError(error, {
        title: "Coupon chưa hợp lệ",
      });
    }
  };

  const handleCouponClear = () => {
    clearCoupon();
    setCouponCode("");
    setOrderPlaced(false);
    setPaymentHandoff({ error: null, isRedirecting: false });
    resetOrder();
    toast.showInfo("Đã gỡ mã giảm giá khỏi đơn hàng.", {
      duration: 2400,
      title: "Coupon đã cập nhật",
    });
  };

  const handlePlaceOrder = async () => {
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

    if (stockInsights.hasBlockingIssues) {
      toast.showWarning("Một số sản phẩm vượt quá tồn kho khả dụng. Vui lòng kiểm tra lại giỏ hàng.", {
        title: "Cần kiểm tra tồn kho",
      });
      setOrderPlaced(false);
      return;
    }

    let paymentOrderId = null;

    try {
      const order = await createOrder({
        appliedCoupon,
        items: cartItems,
        paymentMethod: selectedPaymentMethod,
        shippingMethod: selectedShippingMethod,
        values,
      });
      paymentOrderId = order.id;

      if (selectedPaymentMethod.apiValue === "DIGITAL") {
        setPaymentHandoff({ error: null, isRedirecting: true });

        const paymentLink = await paymentService.createPayment({
          orderId: order.id,
          provider: selectedPaymentMethod.provider,
        });

        if (!paymentLink.paymentUrl) {
          throw new Error(`Không nhận được đường dẫn thanh toán ${selectedPaymentMethod.name} từ hệ thống.`);
        }

        toast.showInfo(`Đang chuyển sang ${selectedPaymentMethod.name} Sandbox để hoàn tất thanh toán.`, {
          duration: 2200,
          title: "Mở cổng thanh toán",
        });
        window.location.assign(paymentLink.paymentUrl);
        return;
      }

      setPaymentHandoff({ error: null, isRedirecting: false });
      setOrderPlaced(true);
      toast.showSuccess(order?.code ? `Đơn hàng ${order.code} đã được tạo.` : "Đơn hàng đã được tạo.", {
        title: "Đặt hàng thành công",
      });
    } catch (error) {
      if (selectedPaymentMethod.apiValue === "DIGITAL") {
        trackPaymentError(error, {
          operation: "checkout_payment_handoff",
          orderId: paymentOrderId,
          provider: selectedPaymentMethod.provider,
        });
      }

      setOrderPlaced(false);
      setPaymentHandoff({
        error: selectedPaymentMethod.apiValue === "DIGITAL" ? error : null,
        isRedirecting: false,
      });
      toast.showApiError(error, {
        title: selectedPaymentMethod.apiValue === "DIGITAL" ? `Chưa mở được ${selectedPaymentMethod.name}` : "Chưa tạo được đơn hàng",
      });
    }
  };

  if (!cartItems.length) {
    return (
      <div className="store-page-shell">
        <AnnouncementBar />
        <Header />

        <Container as="main" className="pb-16 pt-6 sm:pt-8" id="main-content" tabIndex={-1}>
          <section className="flex min-h-[520px] items-center justify-center">
            <EmptyState
              actionIcon={ChevronRight}
              actionLabel="Xem sản phẩm"
              actionTo="/products"
              icon={PackageSearch}
              message="Thêm sản phẩm vào giỏ hàng trước khi tiếp tục bước thanh toán."
              eyebrow="Không có sản phẩm"
              title="Checkout cần sản phẩm trong giỏ"
            />
          </section>
        </Container>
      </div>
    );
  }

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
          <Link className="premium-transition hover:text-white" to="/cart">
            Giỏ hàng
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">Thanh toán</span>
        </nav>

        <section className="store-hero-panel p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <ClipboardCheck size={13} />
                Thanh toán an toàn
              </Badge>
              <h1 className="text-heading max-w-3xl">Hoàn tất đơn hàng</h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                Nhập thông tin giao hàng, chọn vận chuyển và phương thức thanh toán. COD, VNPay Sandbox và MoMo Sandbox đã sẵn sàng cho đơn hàng ecommerce.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Truck, label: "Vận chuyển rõ ràng", value: selectedShippingMethod.eta },
                { icon: CreditCard, label: "Thanh toán bảo mật", value: selectedPaymentMethod.name },
                { icon: ShieldCheck, label: "Thông tin rõ ràng", value: "Kiểm tra trước khi đặt" },
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

        <TrustSignalBar
          className="mt-5"
          compact
          signals={[
            { icon: "ShieldCheck", label: "Bảo mật", value: "Thông tin giao hàng rõ ràng" },
            { icon: "CreditCard", label: "Thanh toán linh hoạt", value: "COD, VNPay và MoMo Sandbox" },
            { icon: "Clock3", label: "Xử lý nhanh", value: "Ước tính thời gian giao" },
            { icon: "Headphones", label: "Hỗ trợ", value: "Theo dõi sau khi đặt đơn" },
          ]}
        />

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
                setPaymentHandoff({ error: null, isRedirecting: false });
                resetOrder();
              }}
              options={shippingMethods}
              value={shippingMethodId}
            />
            <PaymentMethodSelector
              onChange={(nextMethodId) => {
                setPaymentMethodId(nextMethodId);
                setOrderPlaced(false);
                setPaymentHandoff({ error: null, isRedirecting: false });
                resetOrder();
              }}
              options={paymentMethods}
              value={paymentMethodId}
            />
            <PaymentTrustIndicators provider={selectedPaymentMethod.provider} />
          </MotionDiv>

          <MotionDiv variants={fadeUp}>
            <CheckoutSummary
              appliedCoupon={appliedCoupon}
              couponCode={couponCode}
              couponDiscount={couponDiscount}
              couponError={couponError}
              couponFeedback={couponFeedback}
              createdOrder={createdOrder}
              itemCount={itemCount}
              items={cartItems}
              isApplyingCoupon={isApplyingCoupon}
              isPaymentRedirecting={paymentHandoff.isRedirecting}
              isSubmitting={isCreatingOrder || paymentHandoff.isRedirecting}
              onCouponApply={handleCouponApply}
              onCouponChange={(nextCouponCode) => {
                setCouponCode(nextCouponCode);
                setOrderPlaced(false);
                resetOrder();
              }}
              onCouponClear={handleCouponClear}
              onPlaceOrder={handlePlaceOrder}
              orderError={paymentHandoff.error || createOrderError}
              orderErrorTitle={paymentHandoff.error ? `Chưa mở được ${selectedPaymentMethod.name}` : "Chưa tạo được đơn hàng"}
              orderPlaced={orderPlaced}
              paymentMethod={selectedPaymentMethod}
              shippingEstimate={shippingEstimate}
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
