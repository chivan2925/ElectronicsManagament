import { api } from "./client";
import { createApiClientError } from "./checkoutMapper";
import { normalizePaymentLinkResponse, normalizePaymentStatusResponse } from "./paymentMapper";
import { trackPaymentError } from "../monitoring";

const PAYMENT_RESOURCE_PATH = import.meta.env.VITE_PAYMENT_API_PATH || "/payments";

function normalizePaymentOrderId(orderId) {
  const normalizedOrderId = String(orderId || "").trim();
  const numericOrderId = Number(normalizedOrderId);

  return /^\d+$/.test(normalizedOrderId) &&
    Number.isSafeInteger(numericOrderId) &&
    numericOrderId > 0 &&
    numericOrderId <= 2147483647
    ? numericOrderId
    : null;
}

export async function createPayment({ orderId, provider }, config = {}) {
  const normalizedProvider = String(provider || "").trim().toUpperCase();
  const normalizedOrderId = normalizePaymentOrderId(orderId);

  if (!normalizedProvider) {
    const providerError = new Error("Thiếu nhà cung cấp thanh toán.");
    trackPaymentError(providerError, {
      operation: "create_payment",
      orderId,
      provider: normalizedProvider,
    });
    throw providerError;
  }

  if (!normalizedOrderId) {
    const orderError = createApiClientError("Thiếu mã đơn hàng hợp lệ để tạo phiên thanh toán.", {
      code: "INVALID_PAYMENT_ORDER_ID",
      status: 400,
    });

    trackPaymentError(orderError, {
      operation: "create_payment",
      orderId,
      provider: normalizedProvider,
    });
    throw orderError;
  }

  let data;

  try {
    data = await api.post(
      `${PAYMENT_RESOURCE_PATH}/${normalizedProvider.toLowerCase()}/create`,
      {
        orderId: normalizedOrderId,
        provider: normalizedProvider,
      },
      {
        skipGlobalErrorHandler: true,
        ...config,
      },
    );
  } catch (error) {
    trackPaymentError(error, {
      operation: "create_payment",
      orderId,
      provider: normalizedProvider,
    });
    throw error;
  }

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
  let data;

  try {
    data = await api.get(`${PAYMENT_RESOURCE_PATH}/orders/${orderId}/status`, {
      ...requestConfig,
      params: {
        ...params,
        ...configParams,
      },
      skipGlobalErrorHandler: true,
    });
  } catch (error) {
    trackPaymentError(error, {
      operation: "verify_payment_status",
      orderId,
      transactionId: params.transactionId ?? configParams?.transactionId,
    });
    throw error;
  }

  return normalizePaymentStatusResponse(data);
}

const paymentService = {
  createMomoPayment,
  createPayment,
  createVNPayPayment,
  getOrderPaymentStatus,
};

export default paymentService;
