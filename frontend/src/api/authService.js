import { buildAuthSession, canAccessAdmin } from "../auth/authHelpers";
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

function getAuthSurface(options = {}) {
  return options.surface === "admin" || options.demoSurface === "admin" || options.authSurface === "admin"
    ? "admin"
    : "store";
}

function getLoginEndpoint(surface) {
  return surface === "admin" ? "/admin/auth/login" : "/auth/login";
}

function getLogoutEndpoint(session) {
  return session && !canAccessAdmin(session) ? "/auth/logout" : "/admin/auth/logout";
}

function clearAndNotifyAuthSession() {
  clearAuthSession();
  notifyAuthSessionChanged(null);
}

export async function login(credentials, options = {}) {
  const surface = getAuthSurface(options);

  if (isDemoModeEnabled) {
    const demoAccount = getDemoAccountByEmail(credentials?.email ?? credentials?.identity);

    if (demoAccount && demoAccount.surface === surface) {
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

  const data = await api.post(getLoginEndpoint(surface), credentials, {
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
  if (isDemoModeEnabled) {
    clearAndNotifyAuthSession();
    return null;
  }

  const session = getStoredAuthSession();

  try {
    return await api.post(getLogoutEndpoint(session), null, {
      retry: false,
      skipGlobalErrorHandler: true,
      skipAuthRefresh: true,
      skipUnauthorizedHandler: true,
    });
  } finally {
    clearAndNotifyAuthSession();
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
