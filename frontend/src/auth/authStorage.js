export const AUTH_STORAGE_KEYS = {
  accessToken: "accessToken",
  permissions: "auth:permissions",
  refreshToken: "refreshToken",
  roles: "auth:roles",
  user: "auth:user",
};

export const ACCESS_TOKEN_KEY = AUTH_STORAGE_KEYS.accessToken;
export const REFRESH_TOKEN_KEY = AUTH_STORAGE_KEYS.refreshToken;

export const AUTH_EVENTS = {
  sessionChanged: "auth:session-changed",
  unauthorized: "auth:unauthorized",
};

const TOKEN_STORAGE_MODE = String(import.meta.env.VITE_AUTH_TOKEN_STORAGE ?? "local").toLowerCase();

function getStorageByMode(mode) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return mode === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

function getStorage() {
  return getStorageByMode(TOKEN_STORAGE_MODE === "session" ? "session" : "local");
}

function getFallbackStorage() {
  return TOKEN_STORAGE_MODE === "session" ? getStorageByMode("local") : null;
}

function readJson(key, fallback) {
  const storage = getStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const value = storage.getItem(key) ?? getFallbackStorage()?.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (value === null || value === undefined) {
    storage.removeItem(key);
    return;
  }

  storage.setItem(key, JSON.stringify(value));
}

export function getStoredAccessToken() {
  return getStorage()?.getItem(AUTH_STORAGE_KEYS.accessToken) ?? getFallbackStorage()?.getItem(AUTH_STORAGE_KEYS.accessToken) ?? null;
}

export function setStoredAccessToken(accessToken) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (accessToken) {
    storage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
  } else {
    storage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  }
}

export function getStoredRefreshToken() {
  return getStorage()?.getItem(AUTH_STORAGE_KEYS.refreshToken) ?? getFallbackStorage()?.getItem(AUTH_STORAGE_KEYS.refreshToken) ?? null;
}

export function setStoredRefreshToken(refreshToken) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (refreshToken) {
    storage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  } else {
    storage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  }
}

export function getStoredAuthSession() {
  const accessToken = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();
  const user = readJson(AUTH_STORAGE_KEYS.user, null);
  const roles = readJson(AUTH_STORAGE_KEYS.roles, []);
  const permissions = readJson(AUTH_STORAGE_KEYS.permissions, []);

  if (!accessToken && !refreshToken && !user && roles.length === 0 && permissions.length === 0) {
    return null;
  }

  return {
    accessToken,
    permissions,
    refreshToken,
    roles,
    user,
  };
}

export function persistAuthSession(session = {}) {
  setStoredAccessToken(session.accessToken);
  setStoredRefreshToken(session.refreshToken);
  writeJson(AUTH_STORAGE_KEYS.user, sanitizeAuthUser(session.user));
  writeJson(AUTH_STORAGE_KEYS.roles, session.roles ?? []);
  writeJson(AUTH_STORAGE_KEYS.permissions, session.permissions ?? []);
}

export function clearAuthSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
    storage.removeItem(key);
    getFallbackStorage()?.removeItem(key);
  });
}

function pickSafeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function sanitizeAuthUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  return {
    avatarUrl: user.avatarUrl ?? user.avatar ?? "",
    email: user.email ?? "",
    fullName: user.fullName ?? user.name ?? "",
    id: user.id ?? user.userId ?? user.staffId ?? null,
    permissions: pickSafeArray(user.permissions),
    phone: user.phone ?? user.phoneNumber ?? "",
    role: typeof user.role === "string" ? user.role : user.role?.name ?? user.roleName ?? "",
    roleName: user.roleName ?? (typeof user.role === "object" ? user.role.name : user.role ?? ""),
    roles: pickSafeArray(user.roles),
    staffId: user.staffId ?? null,
    status: user.status ?? "",
    type: user.type ?? "",
    username: user.username ?? "",
  };
}

export function notifyAuthSessionChanged(session = null) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.sessionChanged, { detail: session }));
}

export function notifyAuthUnauthorized() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.unauthorized));
}
