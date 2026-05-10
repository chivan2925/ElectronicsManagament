import axios from "axios";
import { ACCESS_TOKEN_KEY, getStoredAccessToken } from "../auth/authStorage";
import {
  clearApiCache,
  createApiCacheKey,
  getCachedApiResponse,
  getInFlightApiRequest,
  getResolvedCacheTtl,
  isCacheableMethod,
  setCachedApiResponse,
  setInFlightApiRequest,
} from "./apiCache";
import { API_CONFIG } from "./apiConfig";
import { createApiErrorHandler } from "./apiErrorHandler";

export { ACCESS_TOKEN_KEY };
export { clearApiCache, getApiCacheStats } from "./apiCache";

const RETRYABLE_METHODS = new Set(["get", "head", "options"]);
const REQUEST_ID_HEADER = "X-Request-Id";
const DEMO_MODE_VALUES = new Set(["1", "true", "yes", "on", "demo"]);

export { API_CONFIG };

function setRequestHeader(headers, key, value) {
  if (typeof headers.set === "function") {
    headers.set(key, value);
    return;
  }

  headers[key] = value;
}

function createClientRequestId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isDemoModeEnabled() {
  return DEMO_MODE_VALUES.has(String(import.meta.env.VITE_DEMO_MODE ?? "").trim().toLowerCase());
}

async function getDemoApiResponse(config) {
  if (!isDemoModeEnabled()) {
    return { handled: false };
  }

  const { handleDemoApiRequest } = await import("../demo/demoApi");

  return handleDemoApiRequest(config);
}

const client = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    Accept: "application/json",
  },
  timeout: API_CONFIG.timeout,
});

client.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  const method = String(config.method ?? "get").toLowerCase();

  config.headers = config.headers ?? {};
  config.retry = config.retry ?? RETRYABLE_METHODS.has(method);
  config.retryCount = config.retryCount ?? 1;
  config.retryDelay = config.retryDelay ?? 500;
  config.requestId = config.requestId ?? createClientRequestId();
  setRequestHeader(config.headers, REQUEST_ID_HEADER, config.requestId);

  if (token && !config.skipAuth) {
    setRequestHeader(config.headers, "Authorization", `Bearer ${token}`);
  }

  return config;
});

client.interceptors.response.use((response) => response, createApiErrorHandler(client));

function getAuthCachePartition(config = {}) {
  if (config.skipAuth) {
    return "public";
  }

  const token = getStoredAccessToken();

  return token ? `auth:${token.slice(-18)}` : "anonymous";
}

export async function apiRequest(config) {
  const method = String(config.method ?? "get").toLowerCase();
  const isReadRequest = isCacheableMethod(method);
  const demoResponse = await getDemoApiResponse(config);

  if (demoResponse.handled) {
    if (!isReadRequest) {
      clearApiCache();
    }

    return demoResponse.data;
  }

  const shouldDedupe = isReadRequest && config.dedupe !== false;
  const cacheTtl = getResolvedCacheTtl(config);
  const cacheKey =
    shouldDedupe || cacheTtl > 0 ? createApiCacheKey(config, getAuthCachePartition(config)) : null;

  if (cacheKey && cacheTtl > 0) {
    const cachedResponse = getCachedApiResponse(cacheKey);

    if (cachedResponse.hit) {
      return cachedResponse.value;
    }
  }

  if (cacheKey && shouldDedupe) {
    const inFlightRequest = getInFlightApiRequest(cacheKey);

    if (inFlightRequest) {
      return inFlightRequest;
    }
  }

  const requestPromise = client.request(config).then((response) => {
    const responseData = response.data;

    if (cacheKey && cacheTtl > 0) {
      setCachedApiResponse(cacheKey, responseData, cacheTtl);
    }

    if (!isReadRequest) {
      clearApiCache();
    }

    return responseData;
  });

  return cacheKey && shouldDedupe ? setInFlightApiRequest(cacheKey, requestPromise) : requestPromise;
}

export const api = {
  delete: (url, config = {}) => apiRequest({ ...config, method: "delete", url }),
  get: (url, config = {}) => apiRequest({ ...config, method: "get", url }),
  patch: (url, data, config = {}) => apiRequest({ ...config, data, method: "patch", url }),
  post: (url, data, config = {}) => apiRequest({ ...config, data, method: "post", url }),
  put: (url, data, config = {}) => apiRequest({ ...config, data, method: "put", url }),
  request: apiRequest,
};

export default client;
