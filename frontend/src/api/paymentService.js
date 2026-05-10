import { api } from "./client";
import { normalizePaymentLinkResponse, normalizePaymentStatusResponse } from "./paymentMapper";

const PAYMENT_RESOURCE_PATH = import.meta.env.VITE_PAYMENT_API_PATH || "/payments";

export async function createVNPayPayment(orderId, config = {}) {
  const data = await api.post(
    `${PAYMENT_RESOURCE_PATH}/vnpay/create`,
    {
      orderId: Number(orderId),
      provider: "VNPAY",
    },
    {
      skipGlobalErrorHandler: true,
      ...config,
    },
  );

  return normalizePaymentLinkResponse(data);
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
  createVNPayPayment,
  getOrderPaymentStatus,
};

export default paymentService;
