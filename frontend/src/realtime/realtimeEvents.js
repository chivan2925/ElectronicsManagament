export const REALTIME_CHANNELS = {
  ADMIN: "admin",
  ALL: "all",
  STOREFRONT: "storefront",
};

export const REALTIME_EVENT_TYPES = {
  ADMIN_ALERT: "ADMIN_ALERT",
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
  ORDER_UPDATED: "ORDER_UPDATED",
  PAYMENT_CANCELLED: "PAYMENT_CANCELLED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_SUCCEEDED: "PAYMENT_SUCCEEDED",
  STOCK_LOW: "STOCK_LOW",
  STOCK_RESTOCKED: "STOCK_RESTOCKED",
  SYSTEM: "SYSTEM",
};

const CHANNEL_VALUES = new Set(Object.values(REALTIME_CHANNELS));
const EVENT_TYPE_VALUES = new Set(Object.values(REALTIME_EVENT_TYPES));
const PRIORITY_VALUES = new Set(["high", "medium", "low"]);

function createRealtimeId(type) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${String(type || "event").toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeChannel(value) {
  const channel = value ? String(value).toLowerCase() : REALTIME_CHANNELS.ALL;

  return CHANNEL_VALUES.has(channel) ? channel : REALTIME_CHANNELS.ALL;
}

function normalizeEventType(value) {
  const eventType = value ? String(value).trim().toUpperCase() : REALTIME_EVENT_TYPES.SYSTEM;

  return EVENT_TYPE_VALUES.has(eventType) ? eventType : REALTIME_EVENT_TYPES.SYSTEM;
}

function normalizePriority(value, type) {
  const priority = value ? String(value).toLowerCase() : "";

  if (PRIORITY_VALUES.has(priority)) {
    return priority;
  }

  if (
    type === REALTIME_EVENT_TYPES.PAYMENT_FAILED ||
    type === REALTIME_EVENT_TYPES.PAYMENT_CANCELLED ||
    type === REALTIME_EVENT_TYPES.STOCK_LOW
  ) {
    return "high";
  }

  if (type === REALTIME_EVENT_TYPES.SYSTEM || type === REALTIME_EVENT_TYPES.STOCK_RESTOCKED) {
    return "low";
  }

  return "medium";
}

function normalizeDate(value) {
  const timestamp = value ? new Date(value).getTime() : Date.now();

  if (!Number.isFinite(timestamp)) {
    return new Date().toISOString();
  }

  return new Date(timestamp).toISOString();
}

function normalizePayload(rawEvent) {
  if (rawEvent?.payload && typeof rawEvent.payload === "object" && !Array.isArray(rawEvent.payload)) {
    return rawEvent.payload;
  }

  if (rawEvent?.data && typeof rawEvent.data === "object" && !Array.isArray(rawEvent.data)) {
    return rawEvent.data;
  }

  if (rawEvent?.metadata && typeof rawEvent.metadata === "object" && !Array.isArray(rawEvent.metadata)) {
    return rawEvent.metadata;
  }

  return {};
}

export function createRealtimeEvent(event = {}) {
  const type = normalizeEventType(event.type || event.eventType || event.name);

  return {
    channel: normalizeChannel(event.channel || event.surface || event.scope),
    createdAt: normalizeDate(event.createdAt || event.timestamp || event.time),
    href: event.href || null,
    id: event.id ? String(event.id) : createRealtimeId(type),
    message: event.message ? String(event.message) : "",
    payload: normalizePayload(event),
    priority: normalizePriority(event.priority, type),
    source: event.source ? String(event.source) : "realtime",
    title: event.title ? String(event.title) : "",
    type,
  };
}

export function normalizeRealtimeEvent(rawEvent) {
  if (!rawEvent || typeof rawEvent !== "object" || Array.isArray(rawEvent)) {
    return null;
  }

  return createRealtimeEvent(rawEvent);
}

export function normalizeRealtimeEventBatch(rawMessage) {
  const source = Array.isArray(rawMessage) ? rawMessage : rawMessage?.events || rawMessage?.items || rawMessage?.data;
  const events = Array.isArray(source) ? source : [rawMessage];

  return events.map(normalizeRealtimeEvent).filter(Boolean);
}

export function realtimeEventMatchesChannel(event, channel = REALTIME_CHANNELS.ALL) {
  const normalizedEvent = normalizeRealtimeEvent(event);
  const normalizedChannel = normalizeChannel(channel);

  if (!normalizedEvent) {
    return false;
  }

  return (
    normalizedChannel === REALTIME_CHANNELS.ALL ||
    normalizedEvent.channel === REALTIME_CHANNELS.ALL ||
    normalizedEvent.channel === normalizedChannel
  );
}

export function isPaymentRealtimeEvent(type) {
  return [
    REALTIME_EVENT_TYPES.PAYMENT_CANCELLED,
    REALTIME_EVENT_TYPES.PAYMENT_FAILED,
    REALTIME_EVENT_TYPES.PAYMENT_SUCCEEDED,
  ].includes(type);
}

export function isOrderRealtimeEvent(type) {
  return [
    REALTIME_EVENT_TYPES.ORDER_CREATED,
    REALTIME_EVENT_TYPES.ORDER_STATUS_CHANGED,
    REALTIME_EVENT_TYPES.ORDER_UPDATED,
  ].includes(type);
}

export function isStockRealtimeEvent(type) {
  return [REALTIME_EVENT_TYPES.STOCK_LOW, REALTIME_EVENT_TYPES.STOCK_RESTOCKED].includes(type);
}
