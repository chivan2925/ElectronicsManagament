import { clearAuthSession, getStoredRefreshToken, notifyAuthUnauthorized } from "../auth/authStorage";
import { trackApiFailure } from "../monitoring";
import { notifyGlobalApiError } from "./apiErrorEvents";
import { normalizeApiError } from "./normalizeApiError";
import { refreshAccessToken } from "./refreshTokenService";

const DEFAULT_RETRY_COUNT = 1;
const DEFAULT_RETRY_DELAY = 500;
const RETRYABLE_METHODS = new Set(["get", "head", "options"]);
const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 409, 422, 423]);

function getMethod(config = {}) {
  return String(config.method ?? "get").toLowerCase();
}

function getRetryLimit(config = {}) {
  if (!config.retry) {
    return 0;
  }

  const retryCount = Number(config.retryCount ?? DEFAULT_RETRY_COUNT);
  return Number.isFinite(retryCount) && retryCount > 0 ? retryCount : DEFAULT_RETRY_COUNT;
}

function getRetryDelay(config = {}) {
  const retryDelay = Number(config.retryDelay ?? DEFAULT_RETRY_DELAY);
  const delay = Number.isFinite(retryDelay) && retryDelay >= 0 ? retryDelay : DEFAULT_RETRY_DELAY;
  const retryCount = Number(config.__retryCount ?? 1);

  return delay * Math.max(1, retryCount);
}

function wait(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

function setRequestHeader(headers, key, value) {
  if (typeof headers?.set === "function") {
    headers.set(key, value);
    return;
  }

  headers[key] = value;
}

export function isRetryableApiError(error, apiError = normalizeApiError(error)) {
  const { config } = error ?? {};

  if (!config) {
    return false;
  }

  if (NON_RETRYABLE_STATUSES.has(apiError.status)) {
    return false;
  }

  const method = getMethod(config);

  if (!RETRYABLE_METHODS.has(method) && !config.retryUnsafe) {
    return false;
  }

  const retryLimit = getRetryLimit(config);
  const retryCount = Number(config.__retryCount ?? 0);

  if (retryLimit <= retryCount) {
    return false;
  }

  return apiError.isNetworkError || apiError.isTimeout || apiError.isServerError;
}

export function handleUnauthorizedApiError(error, apiError = normalizeApiError(error)) {
  if (!apiError.isUnauthorized || error?.config?.skipUnauthorizedHandler) {
    return;
  }

  clearAuthSession();
  notifyAuthUnauthorized();
}

export function attachApiError(error, apiError = normalizeApiError(error)) {
  if (error && typeof error === "object") {
    error.apiError = apiError;
    error.normalizedError = apiError;
  }

  return apiError;
}

export function canRefreshUnauthorizedRequest(error, apiError = normalizeApiError(error)) {
  const { config } = error ?? {};

  return Boolean(
    apiError.isUnauthorized &&
      config &&
      getStoredRefreshToken() &&
      !config.__isRetryAfterRefresh &&
      !config.skipAuthRefresh &&
      !config.skipUnauthorizedHandler,
  );
}

export function createApiErrorHandler(client) {
  return async function handleApiError(error) {
    const apiError = attachApiError(error);

    if (canRefreshUnauthorizedRequest(error, apiError)) {
      try {
        const session = await refreshAccessToken();

        error.config.__isRetryAfterRefresh = true;
        error.config.headers = error.config.headers ?? {};
        setRequestHeader(error.config.headers, "Authorization", `Bearer ${session.accessToken}`);

        return client.request(error.config);
      } catch {
        handleUnauthorizedApiError(error, apiError);
        trackApiFailure(error, apiError, {
          operation: "auth_refresh_retry",
          refreshAttempted: true,
        });
        notifyGlobalApiError(error, apiError);
        return Promise.reject(error);
      }
    }

    handleUnauthorizedApiError(error, apiError);

    if (isRetryableApiError(error, apiError)) {
      error.config.__retryCount = Number(error.config.__retryCount ?? 0) + 1;
      await wait(getRetryDelay(error.config));
      return client.request(error.config);
    }

    notifyGlobalApiError(error, apiError);
    trackApiFailure(error, apiError, {
      operation: "api_request",
      refreshAttempted: Boolean(error?.config?.__isRetryAfterRefresh),
    });

    return Promise.reject(error);
  };
}
