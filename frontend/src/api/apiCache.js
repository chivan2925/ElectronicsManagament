const DEFAULT_CACHE_TTL_MS = 30_000;
const MAX_CACHE_ENTRIES = 80;
const CACHEABLE_METHODS = new Set(["get", "head"]);

const responseCache = new Map();
const inFlightRequests = new Map();

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeCacheValue(value) {
  if (value instanceof URLSearchParams) {
    return Array.from(value.entries()).sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
  }

  if (Array.isArray(value)) {
    return value.map(normalizeCacheValue);
  }

  if (isPlainObject(value)) {
    return Object.keys(value)
      .sort()
      .reduce((normalized, key) => {
        const item = value[key];

        if (item === undefined || typeof item === "function" || typeof item === "symbol") {
          return normalized;
        }

        normalized[key] = normalizeCacheValue(item);
        return normalized;
      }, {});
  }

  return value ?? null;
}

function stableSerialize(value) {
  try {
    return JSON.stringify(normalizeCacheValue(value));
  } catch {
    return String(value ?? "");
  }
}

function getMethod(config = {}) {
  return String(config.method ?? "get").toLowerCase();
}

function trimCacheIfNeeded() {
  while (responseCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;

    if (!oldestKey) {
      return;
    }

    responseCache.delete(oldestKey);
  }
}

export function isCacheableMethod(method) {
  return CACHEABLE_METHODS.has(String(method ?? "get").toLowerCase());
}

export function getResolvedCacheTtl(config = {}) {
  if (!isCacheableMethod(getMethod(config))) {
    return 0;
  }

  if (typeof config.cacheTtl === "number") {
    return Math.max(0, config.cacheTtl);
  }

  if (typeof config.cache === "number") {
    return Math.max(0, config.cache);
  }

  return config.cache === true ? DEFAULT_CACHE_TTL_MS : 0;
}

export function createApiCacheKey(config = {}, authPartition = "anonymous") {
  return [
    getMethod(config),
    config.baseURL ?? "",
    config.url ?? "",
    stableSerialize(config.params),
    stableSerialize(config.data),
    stableSerialize({
      responseType: config.responseType,
      skipAuth: config.skipAuth,
      skipGlobalErrorHandler: config.skipGlobalErrorHandler,
      skipUnauthorizedHandler: config.skipUnauthorizedHandler,
    }),
    authPartition,
  ].join("|");
}

export function getCachedApiResponse(cacheKey) {
  const entry = responseCache.get(cacheKey);

  if (!entry) {
    return { hit: false, value: null };
  }

  if (entry.expiresAt <= Date.now()) {
    responseCache.delete(cacheKey);
    return { hit: false, value: null };
  }

  return { hit: true, value: entry.value };
}

export function setCachedApiResponse(cacheKey, value, ttl) {
  if (!cacheKey || ttl <= 0) {
    return;
  }

  responseCache.set(cacheKey, {
    expiresAt: Date.now() + ttl,
    value,
  });
  trimCacheIfNeeded();
}

export function getInFlightApiRequest(cacheKey) {
  return inFlightRequests.get(cacheKey) ?? null;
}

export function setInFlightApiRequest(cacheKey, promise) {
  if (!cacheKey) {
    return promise;
  }

  inFlightRequests.set(cacheKey, promise);

  const clearInFlight = () => {
    if (inFlightRequests.get(cacheKey) === promise) {
      inFlightRequests.delete(cacheKey);
    }
  };

  promise.then(clearInFlight, clearInFlight);
  return promise;
}

export function clearApiCache() {
  responseCache.clear();
}

export function getApiCacheStats() {
  return {
    cachedResponses: responseCache.size,
    inFlightRequests: inFlightRequests.size,
  };
}
