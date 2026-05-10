export const PAYMENT_STATUSES = {
  CANCELLED: "cancelled",
  FAILED: "failed",
  PAID: "paid",
  PENDING: "pending",
};

const PROVIDER_LABELS = {
  COD: "COD",
  MOMO: "MoMo",
  VNPAY: "VNPay",
};

export function normalizePaymentStatus(value, fallback = PAYMENT_STATUSES.PENDING) {
  const status = String(value || fallback).trim().toLowerCase();

  return Object.values(PAYMENT_STATUSES).includes(status) ? status : fallback;
}

export function normalizePaymentProvider(value, fallback = "VNPAY") {
  return String(value || fallback).trim().toUpperCase();
}

export function getPaymentProviderLabel(provider) {
  const normalizedProvider = normalizePaymentProvider(provider);

  return PROVIDER_LABELS[normalizedProvider] || normalizedProvider;
}

export function isPaidStatus(status) {
  return normalizePaymentStatus(status) === PAYMENT_STATUSES.PAID;
}

export function isCancelledStatus(status) {
  return normalizePaymentStatus(status) === PAYMENT_STATUSES.CANCELLED;
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
