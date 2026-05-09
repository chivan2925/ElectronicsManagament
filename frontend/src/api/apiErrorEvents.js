import { buildApiErrorFeedback } from "./apiErrorFeedback";
import { normalizeApiError } from "./normalizeApiError";

export const API_ERROR_EVENTS = {
  globalError: "api:global-error",
};

export function shouldNotifyGlobalApiError(error) {
  const config = error?.config ?? {};

  return !config.skipGlobalErrorHandler && !config.skipGlobalErrorToast && !config.silent;
}

export function notifyGlobalApiError(error, apiError = normalizeApiError(error)) {
  if (typeof window === "undefined" || !shouldNotifyGlobalApiError(error)) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(API_ERROR_EVENTS.globalError, {
      detail: {
        apiError,
        error,
        feedback: buildApiErrorFeedback(apiError),
        request: {
          method: apiError.method,
          path: apiError.path,
          status: apiError.status,
          url: apiError.url,
        },
      },
    }),
  );
}

export function subscribeGlobalApiErrors(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleGlobalApiError = (event) => listener(event.detail);

  window.addEventListener(API_ERROR_EVENTS.globalError, handleGlobalApiError);

  return () => {
    window.removeEventListener(API_ERROR_EVENTS.globalError, handleGlobalApiError);
  };
}
