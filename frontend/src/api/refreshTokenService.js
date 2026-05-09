import axios from "axios";
import { buildAuthSession } from "../auth/authHelpers";
import {
  clearAuthSession,
  getStoredAuthSession,
  getStoredRefreshToken,
  notifyAuthSessionChanged,
  notifyAuthUnauthorized,
  persistAuthSession,
} from "../auth/authStorage";
import { API_CONFIG } from "./apiConfig";

const TOKEN_EXPIRY_SKEW_MS = 30000;

const refreshClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: API_CONFIG.timeout,
});

let refreshPromise = null;

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const decoded = globalThis.atob(padded);

  if (typeof globalThis.TextDecoder !== "function") {
    return decoded;
  }

  return new globalThis.TextDecoder().decode(Uint8Array.from(decoded, (char) => char.charCodeAt(0)));
}

export function getJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

export function getJwtExpirationTime(token) {
  const payload = getJwtPayload(token);
  const expirationSeconds = Number(payload?.exp);

  return Number.isFinite(expirationSeconds) ? expirationSeconds * 1000 : null;
}

export function isJwtExpired(token, skewMs = 0) {
  if (!token) {
    return true;
  }

  const payload = getJwtPayload(token);

  if (!payload) {
    return true;
  }

  const expirationSeconds = Number(payload.exp);

  if (!Number.isFinite(expirationSeconds)) {
    return false;
  }

  return expirationSeconds * 1000 - skewMs <= Date.now();
}

export function isAccessTokenUsable(token) {
  return Boolean(token && !isJwtExpired(token, TOKEN_EXPIRY_SKEW_MS));
}

function isRefreshTokenUsable(token) {
  if (!token) {
    return false;
  }

  const payload = getJwtPayload(token);

  if (!payload) {
    return true;
  }

  const expirationSeconds = Number(payload.exp);

  return !Number.isFinite(expirationSeconds) || expirationSeconds * 1000 > Date.now();
}

function unwrapAuthPayload(data) {
  const payload = data?.data ?? data?.result ?? data ?? {};

  return typeof payload === "string" ? { accessToken: payload } : payload;
}

function mergeRefreshPayload(payload = {}) {
  const currentSession = getStoredAuthSession() ?? {};
  const authPayload = unwrapAuthPayload(payload);
  const refreshToken = authPayload.refreshToken ?? authPayload.refresh_token ?? currentSession.refreshToken ?? null;
  const nextSession = buildAuthSession({
    ...currentSession,
    ...authPayload,
    permissions: authPayload.permissions ?? currentSession.permissions,
    refreshToken,
    roles: authPayload.roles ?? currentSession.roles,
    user: authPayload.user ?? currentSession.user,
  });

  if (!nextSession.accessToken) {
    throw new Error("Refresh token response did not include an access token.");
  }

  return nextSession;
}

function clearSessionAfterRefreshFailure() {
  clearAuthSession();
  notifyAuthUnauthorized();
}

async function requestTokenRefresh() {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token is available.");
  }

  const response = await refreshClient.post(API_CONFIG.refreshEndpoint, {
    refreshToken,
  });
  const session = mergeRefreshPayload(response.data);

  persistAuthSession(session);
  notifyAuthSessionChanged(session);

  return session;
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh()
      .catch((error) => {
        clearSessionAfterRefreshFailure();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function restoreAuthSession() {
  const session = getStoredAuthSession();

  if (!session) {
    return null;
  }

  if (isAccessTokenUsable(session.accessToken)) {
    return session;
  }

  if (isRefreshTokenUsable(session.refreshToken)) {
    return refreshAccessToken();
  }

  clearAuthSession();
  return null;
}

export function hasRefreshInProgress() {
  return Boolean(refreshPromise);
}
