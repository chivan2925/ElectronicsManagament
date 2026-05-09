const DEFAULT_API_BASE_URL = "http://localhost:8080/api";
const DEFAULT_API_TIMEOUT = 15000;
const DEFAULT_REFRESH_ENDPOINT = "/admin/auth/refresh";

function getApiTimeout() {
  const timeout = Number(import.meta.env.VITE_API_TIMEOUT ?? DEFAULT_API_TIMEOUT);

  return Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_API_TIMEOUT;
}

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  refreshEndpoint: import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || DEFAULT_REFRESH_ENDPOINT,
  timeout: getApiTimeout(),
};
