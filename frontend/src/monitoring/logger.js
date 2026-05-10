const DEFAULT_BUFFER_LIMIT = 80;
const SENSITIVE_KEY_PATTERN = /(authorization|cookie|password|secret|token|jwt|api[-_]?key)/i;
const consoleLevelBySeverity = {
  debug: "debug",
  error: "error",
  info: "info",
  warn: "warn",
};

let monitoringTransport = null;
let bufferLimit = DEFAULT_BUFFER_LIMIT;
let monitoringBuffer = [];

function isMonitoringEnabled() {
  return import.meta.env.VITE_ENABLE_CLIENT_MONITORING !== "false";
}

function shouldWriteToConsole() {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_CLIENT_LOGS === "true";
}

function getRuntimeContext() {
  const location = typeof window === "undefined" ? null : window.location;

  return {
    app: "ElectronicsManagement",
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || "local",
    url: location ? `${location.pathname}${location.search}${location.hash}` : "",
  };
}

function serializeError(error) {
  if (!error) {
    return null;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: shouldWriteToConsole() ? error.stack : undefined,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
      name: "Error",
    };
  }

  return sanitizeValue(error, 2);
}

function sanitizeValue(value, depth = 3) {
  if (value == null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return value;
  }

  if (value instanceof Error) {
    return serializeError(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (depth <= 0) {
    return Array.isArray(value) ? "[array]" : "[object]";
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeValue(item, depth - 1));
  }

  if (typeof value === "object") {
    return Object.keys(value).reduce((result, key) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        result[key] = "[redacted]";
        return result;
      }

      const item = value[key];

      if (typeof item !== "function" && typeof item !== "symbol") {
        result[key] = sanitizeValue(item, depth - 1);
      }

      return result;
    }, {});
  }

  return String(value);
}

function pushToBuffer(entry) {
  monitoringBuffer = [...monitoringBuffer, entry].slice(-bufferLimit);
}

function dispatchMonitoringEvent(entry) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("monitoring:event", {
      detail: entry,
    }),
  );
}

export function configureMonitoring({ limit, transport } = {}) {
  if (Number.isFinite(limit) && limit > 0) {
    bufferLimit = limit;
    monitoringBuffer = monitoringBuffer.slice(-bufferLimit);
  }

  monitoringTransport = typeof transport === "function" ? transport : null;
}

export function getMonitoringBuffer() {
  return monitoringBuffer;
}

export function clearMonitoringBuffer() {
  monitoringBuffer = [];
}

export function logMonitoringEvent(level, event, context = {}) {
  if (!isMonitoringEnabled()) {
    return null;
  }

  const entry = {
    ...getRuntimeContext(),
    ...sanitizeValue(context),
    event,
    level,
    timestamp: new Date().toISOString(),
  };

  pushToBuffer(entry);
  dispatchMonitoringEvent(entry);

  if (monitoringTransport) {
    try {
      monitoringTransport(entry);
    } catch (transportError) {
      if (shouldWriteToConsole()) {
        console.warn("[monitoring] transport failed", transportError);
      }
    }
  }

  if (shouldWriteToConsole()) {
    const consoleMethod = consoleLevelBySeverity[level] || "log";
    console[consoleMethod]("[monitoring]", entry);
  }

  return entry;
}

export function createLogger(scope) {
  const withScope = (context = {}) => ({
    scope,
    ...context,
  });

  return {
    debug: (event, context) => logMonitoringEvent("debug", event, withScope(context)),
    error: (event, context, error) =>
      logMonitoringEvent("error", event, withScope({ ...context, error: serializeError(error) })),
    info: (event, context) => logMonitoringEvent("info", event, withScope(context)),
    warn: (event, context, error) =>
      logMonitoringEvent("warn", event, withScope({ ...context, error: serializeError(error) })),
  };
}
