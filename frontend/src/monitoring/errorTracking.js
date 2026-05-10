import { normalizeApiError } from "../api/normalizeApiError";
import { createLogger } from "./logger";

const apiLogger = createLogger("frontend.api");
const errorLogger = createLogger("frontend.error");
const paymentLogger = createLogger("frontend.payment");
const routeLogger = createLogger("frontend.route");

let uninstallGlobalHandlers = null;

function getRouteContext() {
  if (typeof window === "undefined") {
    return {};
  }

  return {
    hash: window.location.hash,
    path: window.location.pathname,
    query: window.location.search,
  };
}

function getFailureSeverity(apiError) {
  return apiError.isNetworkError || apiError.isServerError || apiError.isTimeout ? "error" : "warn";
}

function normalizeError(error) {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return error;
}

export function trackGlobalError(error, context = {}) {
  errorLogger.error(
    "frontend.global_error",
    {
      ...getRouteContext(),
      componentStack: context.errorInfo?.componentStack,
      source: context.source || "react",
      ...context,
      errorInfo: undefined,
    },
    normalizeError(error),
  );
}

export function trackApiFailure(error, apiError = normalizeApiError(error), context = {}) {
  const logger = getFailureSeverity(apiError) === "error" ? apiLogger.error : apiLogger.warn;

  logger(
    "frontend.api_failure",
    {
      code: apiError.code,
      method: apiError.method,
      path: apiError.path,
      requestId: apiError.requestId,
      retryCount: error?.config?.__retryCount ?? 0,
      status: apiError.status,
      type: apiError.type,
      url: apiError.url,
      ...context,
    },
    error,
  );
}

export function trackPaymentError(error, context = {}) {
  const apiError = normalizeApiError(error);

  paymentLogger.error(
    "frontend.payment_error",
    {
      code: apiError.code,
      method: apiError.method,
      operation: context.operation || "payment",
      orderId: context.orderId,
      path: apiError.path,
      provider: context.provider,
      requestId: apiError.requestId,
      responseCode: context.responseCode,
      status: apiError.status,
      transactionId: context.transactionId,
      type: apiError.type,
      ...getRouteContext(),
    },
    error,
  );
}

export function trackRouteChange(context = {}) {
  if (import.meta.env.VITE_MONITOR_ROUTE_CHANGES !== "true") {
    return;
  }

  routeLogger.info("frontend.route_change", {
    ...getRouteContext(),
    ...context,
  });
}

export function trackRouteError(error, context = {}) {
  routeLogger.error(
    "frontend.route_error",
    {
      ...getRouteContext(),
      ...context,
    },
    normalizeError(error),
  );
}

export function installGlobalErrorTracking() {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (uninstallGlobalHandlers) {
    return uninstallGlobalHandlers;
  }

  const handleWindowError = (event) => {
    trackGlobalError(event.error || event.message, {
      column: event.colno,
      filename: event.filename,
      line: event.lineno,
      source: "window.error",
    });
  };

  const handleUnhandledRejection = (event) => {
    trackGlobalError(event.reason || "Unhandled promise rejection", {
      source: "window.unhandledrejection",
    });
  };

  const handlePreloadError = (event) => {
    trackRouteError(event.payload || "Route preload failed", {
      source: "vite.preload",
    });
  };

  window.addEventListener("error", handleWindowError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
  window.addEventListener("vite:preloadError", handlePreloadError);

  uninstallGlobalHandlers = () => {
    window.removeEventListener("error", handleWindowError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    window.removeEventListener("vite:preloadError", handlePreloadError);
    uninstallGlobalHandlers = null;
  };

  return uninstallGlobalHandlers;
}
