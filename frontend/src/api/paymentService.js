import { api } from "./client";
import { normalizePaymentLinkResponse, normalizePaymentStatusResponse } from "./paymentMapper";

const PAYMENT_RESOURCE_PATH = import.meta.env.VITE_PAYMENT_API_PATH || "/payments";

export async function createPayment({ orderId, provider }, config = {}) {
  const normalizedProvider = String(provider || "").trim().toUpperCase();

  if (!normalizedProvider) {
    throw new Error("Thiếu nhà cung cấp thanh toán.");
  }

  const data = await api.post(
    `${PAYMENT_RESOURCE_PATH}/${normalizedProvider.toLowerCase()}/create`,
    {
      orderId: Number(orderId),
      provider: normalizedProvider,
    },
    {
      skipGlobalErrorHandler: true,
      ...config,
    },
  );

  return normalizePaymentLinkResponse(data);
}

export async function createVNPayPayment(orderId, config = {}) {
  return createPayment({ orderId, provider: "VNPAY" }, config);
}

export async function createMomoPayment(orderId, config = {}) {
  return createPayment({ orderId, provider: "MOMO" }, config);
}

export async function getOrderPaymentStatus(orderId, params = {}, config = {}) {
  const { params: configParams, ...requestConfig } = config;
  const data = await api.get(`${PAYMENT_RESOURCE_PATH}/orders/${orderId}/status`, {
    ...requestConfig,
    params: {
      ...params,
      ...configParams,
    },
    skipGlobalErrorHandler: true,
  });

  return normalizePaymentStatusResponse(data);
}

const paymentService = {
  createMomoPayment,
  createPayment,
  createVNPayPayment,
  getOrderPaymentStatus,
};

export default paymentService;
