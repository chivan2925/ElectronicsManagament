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

function usePaymentResult({ defaultProvider = "VNPAY", defaultStatus = "pending" } = {}) {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
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

    return {
      amount: result?.amount || 0,
      error,
      isVerifying: Boolean(orderId) && !result && !error,
      message: result?.message || searchParams.get("message") || "",
      orderCode: result?.orderCode || "",
      orderId,
      provider,
      providerLabel: getPaymentProviderLabel(provider),
      providerPaymentId: result?.providerPaymentId || "",
      responseCode: result?.responseCode || searchParams.get("code") || "",
      result,
      status,
      transactionId: result?.transactionId || transactionId,
      verified: Boolean(result?.verified),
    };
  }, [defaultProvider, defaultStatus, orderId, paymentState, queryProvider, queryStatus, requestKey, searchParams, transactionId]);
}

export default usePaymentResult;
