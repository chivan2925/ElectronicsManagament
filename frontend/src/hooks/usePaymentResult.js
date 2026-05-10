import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import paymentService from "../api/paymentService";
import {
  getPaymentProviderLabel,
  normalizePaymentProvider,
  normalizePaymentStatus,
} from "../utils/paymentStatus";

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
