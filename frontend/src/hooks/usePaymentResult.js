import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import paymentService from "../api/paymentService";
import { REALTIME_EVENT_TYPES } from "../realtime/realtimeEvents";
import {
  getPaymentProviderLabel,
  PAYMENT_STATUSES,
  normalizePaymentProvider,
  normalizePaymentStatus,
} from "../utils/paymentStatus";
import { publishRealtimeEvent } from "./useRealtime";

const paymentEventTypeByStatus = {
  [PAYMENT_STATUSES.CANCELLED]: REALTIME_EVENT_TYPES.PAYMENT_CANCELLED,
  [PAYMENT_STATUSES.FAILED]: REALTIME_EVENT_TYPES.PAYMENT_FAILED,
  [PAYMENT_STATUSES.PAID]: REALTIME_EVENT_TYPES.PAYMENT_SUCCEEDED,
};

const MAX_QUERY_MESSAGE_LENGTH = 220;
const missingOrderMessage = "Thiếu mã đơn hàng trong phản hồi thanh toán. Vui lòng kiểm tra đơn trong tài khoản hoặc liên hệ hỗ trợ.";
const invalidOrderMessage = "Mã đơn hàng trong phản hồi thanh toán không hợp lệ. Hệ thống không gửi yêu cầu xác minh sai tới API.";

function normalizePositiveId(value) {
  const normalizedValue = String(value || "").trim();
  const numericValue = Number(normalizedValue);

  const isSafePositiveId =
    /^\d+$/.test(normalizedValue) &&
    Number.isSafeInteger(numericValue) &&
    numericValue > 0 &&
    numericValue <= 2147483647;

  return isSafePositiveId ? normalizedValue : "";
}

function sanitizeQueryText(value) {
  return String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, MAX_QUERY_MESSAGE_LENGTH);
}

function sanitizeResponseCode(value) {
  return sanitizeQueryText(value).replace(/[^\w.-]/g, "").slice(0, 40);
}

function getClientIssueMessage(clientIssue) {
  if (clientIssue === "invalid_order_id") {
    return invalidOrderMessage;
  }

  if (clientIssue === "missing_order_id") {
    return missingOrderMessage;
  }

  return "";
}

function usePaymentResult({ defaultProvider = "VNPAY", defaultStatus = "pending" } = {}) {
  const [searchParams] = useSearchParams();
  const rawOrderId = searchParams.get("orderId");
  const rawTransactionId = searchParams.get("transactionId");
  const orderId = normalizePositiveId(rawOrderId);
  const transactionId = normalizePositiveId(rawTransactionId);
  const clientIssue = rawOrderId && !orderId ? "invalid_order_id" : !orderId ? "missing_order_id" : null;
  const queryStatus = normalizePaymentStatus(searchParams.get("status"), defaultStatus);
  const queryProvider = normalizePaymentProvider(searchParams.get("provider"), defaultProvider);
  const requestKey = `${orderId || ""}:${transactionId || ""}`;
  const [paymentState, setPaymentState] = useState({
    error: null,
    key: "",
    result: null,
  });
  const publishedEventKey = useRef("");

  useEffect(() => {
    if (!orderId) {
      return undefined;
    }

    let isActive = true;
    const activeKey = requestKey;

    paymentService
      .getOrderPaymentStatus(orderId, { transactionId })
      .then((paymentStatus) => {
        if (isActive) {
          setPaymentState({
            error: null,
            key: activeKey,
            result: paymentStatus,
          });
        }
      })
      .catch((statusError) => {
        if (isActive) {
          setPaymentState({
            error: statusError,
            key: activeKey,
            result: null,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [orderId, requestKey, transactionId]);

  useEffect(() => {
    const hasCurrentResponse = paymentState.key === requestKey;
    const result = hasCurrentResponse ? paymentState.result : null;

    if (!orderId || !result) {
      return;
    }

    const status = normalizePaymentStatus(result.status || queryStatus, defaultStatus);
    const eventType = paymentEventTypeByStatus[status];

    if (!eventType) {
      return;
    }

    const provider = normalizePaymentProvider(result.provider || queryProvider, defaultProvider);
    const eventKey = `${eventType}:${result.transactionId || transactionId || orderId}`;

    if (publishedEventKey.current === eventKey) {
      return;
    }

    publishedEventKey.current = eventKey;
    publishRealtimeEvent(
      {
        channel: "all",
        id: `payment-result-${eventKey}`,
        message: `${getPaymentProviderLabel(provider)} payment for order #${result.orderCode || orderId} is ${status}.`,
        payload: {
          amount: result.amount,
          orderCode: result.orderCode,
          orderId,
          provider,
          providerPaymentId: result.providerPaymentId,
          responseCode: result.responseCode,
          status,
          transactionId: result.transactionId || transactionId,
          verified: Boolean(result.verified),
        },
        priority: status === PAYMENT_STATUSES.PAID ? "medium" : "high",
        source: "payment-result",
        title: status === PAYMENT_STATUSES.PAID ? "Payment confirmed" : "Payment needs review",
        type: eventType,
      },
      { queue: true },
    );
  }, [defaultProvider, defaultStatus, orderId, paymentState, queryProvider, queryStatus, requestKey, transactionId]);

  return useMemo(() => {
    const hasCurrentResponse = paymentState.key === requestKey;
    const result = hasCurrentResponse ? paymentState.result : null;
    const error = hasCurrentResponse ? paymentState.error : null;
    const status = normalizePaymentStatus(result?.status || queryStatus, defaultStatus);
    const provider = normalizePaymentProvider(result?.provider || queryProvider, defaultProvider);
    const queryMessage = sanitizeQueryText(searchParams.get("message"));
    const responseCode = sanitizeResponseCode(result?.responseCode || searchParams.get("code"));

    return {
      amount: result?.amount || 0,
      clientIssue,
      error,
      isVerifying: Boolean(orderId) && !result && !error,
      message: result?.message || queryMessage || getClientIssueMessage(clientIssue),
      orderCode: result?.orderCode || "",
      orderId,
      provider,
      providerLabel: getPaymentProviderLabel(provider),
      providerPaymentId: result?.providerPaymentId || "",
      responseCode,
      result,
      status,
      transactionId: result?.transactionId || transactionId,
      verified: Boolean(result?.verified),
    };
  }, [clientIssue, defaultProvider, defaultStatus, orderId, paymentState, queryProvider, queryStatus, requestKey, searchParams, transactionId]);
}

export default usePaymentResult;
