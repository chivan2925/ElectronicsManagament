export const PAYMENT_STATUSES = {
  CANCELLED: "cancelled",
  FAILED: "failed",
  PAID: "paid",
  PENDING: "pending",
};

export const PAYMENT_PROVIDERS = {
  COD: "COD",
  MOMO: "MOMO",
  VNPAY: "VNPAY",
};

const PROVIDER_LABELS = {
  COD: "COD",
  MOMO: "MoMo",
  VNPAY: "VNPay",
};

const PROVIDER_META = {
  COD: {
    badge: "Linh hoạt",
    checkoutDescription: "Thanh toán khi nhận hàng, phù hợp khi muốn kiểm tra đơn trước.",
    handoffLabel: "Xác nhận tại điểm giao",
    processingTitle: "Ghi nhận đơn COD",
    settlement: "Thanh toán trực tiếp cho đơn vị giao hàng",
    trust: ["Kiểm tra thông tin trước khi nhận", "Không cần nhập thẻ", "Đơn được theo dõi trong tài khoản"],
  },
  MOMO: {
    badge: "Sandbox",
    checkoutDescription: "Ví MoMo Sandbox với chữ ký HMAC và xác minh giao dịch phía server.",
    handoffLabel: "MoMo Sandbox",
    processingTitle: "Đang mở MoMo Sandbox",
    settlement: "Xác minh bằng chữ ký MoMo và số tiền giao dịch",
    trust: ["Không lưu ví trên website", "Xác minh chữ ký", "Cập nhật trạng thái tự động"],
  },
  VNPAY: {
    badge: "Sandbox",
    checkoutDescription: "Cổng VNPay Sandbox với URL ký bảo mật và xác minh phản hồi phía server.",
    handoffLabel: "VNPay Sandbox",
    processingTitle: "Đang mở VNPay Sandbox",
    settlement: "Xác minh secure hash và số tiền giao dịch",
    trust: ["Không lưu thông tin thẻ", "Xác minh secure hash", "Cập nhật trạng thái tự động"],
  },
};

const STATUS_LABELS = {
  [PAYMENT_STATUSES.CANCELLED]: "Đã hủy",
  [PAYMENT_STATUSES.FAILED]: "Chưa thành công",
  [PAYMENT_STATUSES.PAID]: "Đã thanh toán",
  [PAYMENT_STATUSES.PENDING]: "Đang xử lý",
};

const STATUS_TONES = {
  [PAYMENT_STATUSES.CANCELLED]: "warning",
  [PAYMENT_STATUSES.FAILED]: "danger",
  [PAYMENT_STATUSES.PAID]: "success",
  [PAYMENT_STATUSES.PENDING]: "pending",
};

export function normalizePaymentStatus(value, fallback = PAYMENT_STATUSES.PENDING) {
  const status = String(value || fallback).trim().toLowerCase();

  return Object.values(PAYMENT_STATUSES).includes(status) ? status : fallback;
}

export function normalizePaymentProvider(value, fallback = "VNPAY") {
  const normalizedProvider = String(value || fallback).trim().toUpperCase();
  const normalizedFallback = String(fallback || PAYMENT_PROVIDERS.VNPAY).trim().toUpperCase();
  const fallbackProvider = Object.values(PAYMENT_PROVIDERS).includes(normalizedFallback) ? normalizedFallback : PAYMENT_PROVIDERS.VNPAY;

  return Object.values(PAYMENT_PROVIDERS).includes(normalizedProvider) ? normalizedProvider : fallbackProvider;
}

export function getPaymentProviderLabel(provider) {
  const normalizedProvider = normalizePaymentProvider(provider);

  return PROVIDER_LABELS[normalizedProvider] || normalizedProvider;
}

export function getPaymentProviderMeta(provider) {
  const normalizedProvider = normalizePaymentProvider(provider, PAYMENT_PROVIDERS.VNPAY);

  return {
    label: getPaymentProviderLabel(normalizedProvider),
    provider: normalizedProvider,
    ...(PROVIDER_META[normalizedProvider] || PROVIDER_META.VNPAY),
  };
}

export function getPaymentStatusLabel(status) {
  return STATUS_LABELS[normalizePaymentStatus(status)] || STATUS_LABELS[PAYMENT_STATUSES.PENDING];
}

export function getPaymentStatusTone(status) {
  return STATUS_TONES[normalizePaymentStatus(status)] || STATUS_TONES[PAYMENT_STATUSES.PENDING];
}

export function isPaidStatus(status) {
  return normalizePaymentStatus(status) === PAYMENT_STATUSES.PAID;
}

export function isCancelledStatus(status) {
  return normalizePaymentStatus(status) === PAYMENT_STATUSES.CANCELLED;
}

export function isFailedStatus(status) {
  return normalizePaymentStatus(status) === PAYMENT_STATUSES.FAILED;
}

export function isPendingStatus(status) {
  return normalizePaymentStatus(status) === PAYMENT_STATUSES.PENDING;
}

export function isOnlinePaymentProvider(provider) {
  const normalizedProvider = normalizePaymentProvider(provider, PAYMENT_PROVIDERS.COD);

  return normalizedProvider === PAYMENT_PROVIDERS.VNPAY || normalizedProvider === PAYMENT_PROVIDERS.MOMO;
}

export function getPaymentResultCopy({ isVerifying = false, provider, status }) {
  const providerLabel = getPaymentProviderLabel(provider);
  const normalizedStatus = normalizePaymentStatus(status, PAYMENT_STATUSES.FAILED);

  if (normalizedStatus === PAYMENT_STATUSES.PAID) {
    return {
      badge: "Đã xác minh",
      description: `Hệ thống đã xác minh giao dịch ${providerLabel} Sandbox và cập nhật trạng thái đơn hàng.`,
      title: `Thanh toán ${providerLabel} thành công`,
    };
  }

  if (normalizedStatus === PAYMENT_STATUSES.CANCELLED) {
    return {
      badge: "Đã hủy",
      description: `Phiên ${providerLabel} Sandbox đã được hủy và đơn hàng được đóng để hoàn lại tồn kho giữ chỗ.`,
      title: "Thanh toán đã được hủy",
    };
  }

  return {
    badge: isVerifying ? "Đang xác minh" : "Chưa thành công",
    description: `Hệ thống chưa ghi nhận trạng thái paid cho giao dịch ${providerLabel}. Bạn có thể kiểm tra lại đơn hoặc tạo checkout mới.`,
    title: "Thanh toán chưa thành công",
  };
}

export function getPaymentProcessingCopy(provider) {
  const providerMeta = getPaymentProviderMeta(provider);

  if (providerMeta.provider === PAYMENT_PROVIDERS.COD) {
    return {
      description: "Đơn hàng sẽ được xác nhận và thanh toán khi giao hàng.",
      title: "Đang ghi nhận đơn COD",
    };
  }

  return {
    description: `Hệ thống đang tạo phiên thanh toán, ký dữ liệu và chuyển bạn sang ${providerMeta.label} Sandbox.`,
    title: providerMeta.processingTitle,
  };
}

export function getCheckoutPaymentSteps({ isRedirecting = false, provider }) {
  const providerMeta = getPaymentProviderMeta(provider);

  if (providerMeta.provider === PAYMENT_PROVIDERS.COD) {
    return [
      {
        description: "Thông tin giao hàng và tồn kho được kiểm tra trước khi tạo đơn.",
        label: "Kiểm tra đơn",
        state: "complete",
      },
      {
        description: "Đơn COD được ghi nhận trong hệ thống.",
        label: "Tạo đơn hàng",
        state: isRedirecting ? "active" : "pending",
      },
      {
        description: "Thanh toán tiền mặt hoặc chuyển khoản khi nhận hàng.",
        label: "Thanh toán khi giao",
        state: "pending",
      },
    ];
  }

  return [
    {
      description: "Đơn được tạo với phương thức thanh toán online.",
      label: "Tạo đơn hàng",
      state: "complete",
    },
    {
      description: `Dữ liệu được ký và gửi tới ${providerMeta.handoffLabel}.`,
      label: "Tạo phiên thanh toán",
      state: isRedirecting ? "active" : "pending",
    },
    {
      description: "Kết quả chỉ được ghi nhận sau khi server xác minh phản hồi.",
      label: "Xác minh giao dịch",
      state: "pending",
    },
  ];
}

export function getPaymentTimelineSteps({ isVerifying = false, provider, status }) {
  const normalizedStatus = normalizePaymentStatus(status);
  const providerMeta = getPaymentProviderMeta(provider);
  const isPaid = normalizedStatus === PAYMENT_STATUSES.PAID;
  const isCancelled = normalizedStatus === PAYMENT_STATUSES.CANCELLED;
  const isFailed = normalizedStatus === PAYMENT_STATUSES.FAILED;
  const handoffState = isPaid ? "complete" : isVerifying ? "active" : isCancelled || isFailed ? "error" : "pending";
  const verifyState = isPaid ? "complete" : isVerifying ? "active" : isCancelled || isFailed ? "error" : "pending";

  return [
    {
      description: "Đơn đã được tạo và giữ thông tin giao dịch.",
      label: "Đơn hàng",
      state: "complete",
    },
    {
      description: isPaid
        ? `${providerMeta.handoffLabel} trả kết quả thành công.`
        : `${providerMeta.handoffLabel} chưa trả về kết quả paid hợp lệ.`,
      label: providerMeta.handoffLabel,
      state: handoffState,
    },
    {
      description: isPaid
        ? providerMeta.settlement
        : "Server kiểm tra chữ ký, số tiền và trạng thái trước khi cập nhật đơn.",
      label: "Xác minh server",
      state: verifyState,
    },
    {
      description: isPaid
        ? "Đơn được chuyển sang xử lý sau khi thanh toán thành công."
        : "Đơn chưa được xử lý tiếp cho tới khi có giao dịch hợp lệ.",
      label: "Xử lý đơn",
      state: isPaid ? "complete" : "pending",
    },
  ];
}

export function getOrderConfirmationSteps(provider) {
  const providerMeta = getPaymentProviderMeta(provider);

  return [
    {
      description: "Thông tin đơn và tồn kho đã được ghi nhận.",
      label: "Tạo đơn",
      state: "complete",
    },
    {
      description: providerMeta.provider === PAYMENT_PROVIDERS.COD
        ? "Thanh toán sẽ diễn ra khi giao hàng."
        : "Đang chờ xác minh thanh toán online.",
      label: providerMeta.provider === PAYMENT_PROVIDERS.COD ? "COD" : providerMeta.handoffLabel,
      state: providerMeta.provider === PAYMENT_PROVIDERS.COD ? "active" : "pending",
    },
    {
      description: "Bạn có thể theo dõi đơn trong khu vực tài khoản.",
      label: "Theo dõi",
      state: "pending",
    },
  ];
}
