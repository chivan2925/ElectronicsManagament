const DEFAULT_DEV_API_BASE_URL = "http://localhost:8080/api";
const DEFAULT_PROD_API_BASE_URL = "/api";
const DEFAULT_API_TIMEOUT = 15000;
const DEFAULT_REFRESH_ENDPOINT = "/admin/auth/refresh";

function getApiTimeout() {
  const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? DEFAULT_API_TIMEOUT);

  return Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_API_TIMEOUT;
}

function getApiBaseUrl() {
  const configuredBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/g, "");
  }

  return import.meta.env.PROD ? DEFAULT_PROD_API_BASE_URL : DEFAULT_DEV_API_BASE_URL;
}

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  refreshEndpoint: import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || DEFAULT_REFRESH_ENDPOINT,
  timeout: getApiTimeout(),
};
