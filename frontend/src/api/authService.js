import { buildAuthSession } from "../auth/authHelpers";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  clearAuthSession,
  getStoredAccessToken,
  getStoredAuthSession,
  getStoredRefreshToken,
  notifyAuthSessionChanged,
  persistAuthSession,
  setStoredAccessToken,
  setStoredRefreshToken,
} from "../auth/authStorage";
import { api } from "./client";

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };

export function getAccessToken() {
  return getStoredAccessToken();
}

export function getRefreshToken() {
  return getStoredRefreshToken();
}

export function setAccessToken(token) {
  setStoredAccessToken(token);
  notifyAuthSessionChanged(getStoredAuthSession());
}

export function setRefreshToken(token) {
  setStoredRefreshToken(token);
  notifyAuthSessionChanged(getStoredAuthSession());
}

export function clearAccessToken() {
  clearAuthSession();
  notifyAuthSessionChanged(null);
}

export async function login(credentials) {
  const data = await api.post("/admin/auth/login", credentials, {
    retry: false,
    skipAuth: true,
    skipGlobalErrorHandler: true,
    skipUnauthorizedHandler: true,
  });
  const session = buildAuthSession(data);

  if (session.accessToken) {
    persistAuthSession(session);
    notifyAuthSessionChanged(session);
  }

  return data;
}

export async function logout() {
  try {
    return await api.post("/admin/auth/logout", null, {
      retry: false,
      skipGlobalErrorHandler: true,
      skipAuthRefresh: true,
      skipUnauthorizedHandler: true,
    });
  } finally {
    clearAuthSession();
    notifyAuthSessionChanged(null);
  }
}

const authService = {
  clearAccessToken,
  getAccessToken,
  getRefreshToken,
  login,
  logout,
  setAccessToken,
  setRefreshToken,
};

export default authService;
