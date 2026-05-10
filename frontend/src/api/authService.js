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
import {
  createDemoApiError,
  createDemoAuthResponse,
  getDemoAccountByEmail,
  isDemoModeEnabled,
} from "../demo/demoMode";
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
  if (isDemoModeEnabled) {
    const demoAccount = getDemoAccountByEmail(credentials?.email ?? credentials?.identity);

    if (demoAccount) {
      if (credentials?.password !== demoAccount.password) {
        throw createDemoApiError("Demo account password is incorrect.", {
          code: "DEMO_INVALID_CREDENTIALS",
          status: 401,
        });
      }

      const demoSession = createDemoAuthResponse(demoAccount);

      persistAuthSession(demoSession);
      notifyAuthSessionChanged(demoSession);

      return demoSession;
    }
  }

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

export async function register(payload) {
  if (isDemoModeEnabled) {
    return {
      email: payload?.email ?? "",
      fullName: payload?.fullName ?? "",
      id: `demo-customer-${Date.now()}`,
      phone: payload?.phone || null,
      role: "USER",
      status: "ACTIVE",
    };
  }

  return api.post("/auth/register", payload, {
    retry: false,
    skipAuth: true,
    skipAuthRefresh: true,
    skipGlobalErrorHandler: true,
    skipUnauthorizedHandler: true,
  });
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
  register,
  setAccessToken,
  setRefreshToken,
};

export default authService;
