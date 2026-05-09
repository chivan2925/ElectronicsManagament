import axios from "axios";
import { ACCESS_TOKEN_KEY, getStoredAccessToken } from "../auth/authStorage";
import { API_CONFIG } from "./apiConfig";
import { createApiErrorHandler } from "./apiErrorHandler";

export { ACCESS_TOKEN_KEY };

const RETRYABLE_METHODS = new Set(["get", "head", "options"]);

export { API_CONFIG };

function setRequestHeader(headers, key, value) {
  if (typeof headers.set === "function") {
    headers.set(key, value);
    return;
  }

  headers[key] = value;
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

  if (token && !config.skipAuth) {
    setRequestHeader(config.headers, "Authorization", `Bearer ${token}`);
  }

  return config;
});

client.interceptors.response.use((response) => response, createApiErrorHandler(client));

export async function apiRequest(config) {
  const response = await client.request(config);
  return response.data;
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
