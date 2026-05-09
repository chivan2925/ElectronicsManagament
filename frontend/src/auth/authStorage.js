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

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson(key, fallback) {
  const storage = getStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const value = storage.getItem(key);
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
  return getStorage()?.getItem(AUTH_STORAGE_KEYS.accessToken) ?? null;
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
  return getStorage()?.getItem(AUTH_STORAGE_KEYS.refreshToken) ?? null;
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
  writeJson(AUTH_STORAGE_KEYS.user, session.user ?? null);
  writeJson(AUTH_STORAGE_KEYS.roles, session.roles ?? []);
  writeJson(AUTH_STORAGE_KEYS.permissions, session.permissions ?? []);
}

export function clearAuthSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  Object.values(AUTH_STORAGE_KEYS).forEach((key) => storage.removeItem(key));
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
