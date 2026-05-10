import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  REALTIME_CHANNELS,
  normalizeRealtimeEvent,
  normalizeRealtimeEventBatch,
  realtimeEventMatchesChannel,
} from "../realtime/realtimeEvents";

export const REALTIME_LOCAL_EVENT = "electronicsManagement:realtime-event";
const REALTIME_QUEUE_KEY = "electronicsManagement:realtime-queue";
const DEFAULT_POLL_INTERVAL = 30000;

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

function readQueuedItems() {
  const storage = getStorage();
  const rawValue = storage?.getItem(REALTIME_QUEUE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue?.items) ? parsedValue.items : [];
  } catch {
    return [];
  }
}

function writeQueuedItems(items) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    REALTIME_QUEUE_KEY,
    JSON.stringify({
      items: items.slice(-60),
      updatedAt: new Date().toISOString(),
      version: 1,
    }),
  );
}

function getWebSocketUrl(channel) {
  const configuredUrl = import.meta.env?.VITE_REALTIME_WS_URL;

  if (!configuredUrl || typeof window === "undefined") {
    return "";
  }

  try {
    const url = new URL(configuredUrl, window.location.origin);
    url.searchParams.set("channel", channel);
    return url.toString();
  } catch {
    const separator = configuredUrl.includes("?") ? "&" : "?";
    return `${configuredUrl}${separator}channel=${encodeURIComponent(channel)}`;
  }
}

function parseWebSocketMessage(message) {
  if (!message) {
    return [];
  }

  if (typeof message !== "string") {
    return normalizeRealtimeEventBatch(message);
  }

  try {
    return normalizeRealtimeEventBatch(JSON.parse(message));
  } catch {
    return [];
  }
}

function createInitialConnection(enabled) {
  return {
    lastConnectedAt: null,
    lastError: null,
    lastEvent: null,
    status: enabled ? "connecting" : "idle",
    transport: "idle",
  };
}

export function queueRealtimeEvent(event) {
  const normalizedEvent = normalizeRealtimeEvent(event);

  if (!normalizedEvent) {
    return null;
  }

  const queuedItems = readQueuedItems();
  writeQueuedItems([
    ...queuedItems,
    {
      deliveredChannels: [],
      event: normalizedEvent,
      queuedAt: new Date().toISOString(),
    },
  ]);

  return normalizedEvent;
}

export function publishRealtimeEvent(event, options = {}) {
  const normalizedEvent = normalizeRealtimeEvent(event);

  if (!normalizedEvent) {
    return null;
  }

  if (options.queue) {
    queueRealtimeEvent(normalizedEvent);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REALTIME_LOCAL_EVENT, {
        detail: normalizedEvent,
      }),
    );
  }

  return normalizedEvent;
}

export function readQueuedRealtimeEvents(options = {}) {
  const channel = options.channel || REALTIME_CHANNELS.ALL;
  const queuedItems = readQueuedItems();
  const matchedEvents = [];
  const nextItems = [];

  queuedItems.forEach((item) => {
    const event = normalizeRealtimeEvent(item.event || item);

    if (!event) {
      return;
    }

    const deliveredChannels = new Set(item.deliveredChannels || []);

    if (realtimeEventMatchesChannel(event, channel) && !deliveredChannels.has(channel)) {
      matchedEvents.push(event);
      deliveredChannels.add(channel);
    }

    const requiredChannels = event.channel === REALTIME_CHANNELS.ALL
      ? [REALTIME_CHANNELS.ADMIN, REALTIME_CHANNELS.STOREFRONT]
      : [event.channel];

    if (!requiredChannels.every((requiredChannel) => deliveredChannels.has(requiredChannel))) {
      nextItems.push({
        ...item,
        deliveredChannels: Array.from(deliveredChannels),
        event,
      });
    }
  });

  if (nextItems.length !== queuedItems.length || matchedEvents.length) {
    writeQueuedItems(nextItems);
  }

  return matchedEvents;
}

function useRealtime(options = {}) {
  const {
    channel = REALTIME_CHANNELS.STOREFRONT,
    enabled = true,
    handlers = {},
    onEvent,
    pollInterval = DEFAULT_POLL_INTERVAL,
    poller = readQueuedRealtimeEvents,
    pollingEnabled = true,
  } = options;

  const [connection, setConnection] = useState(() => createInitialConnection(enabled));
  const handlersRef = useRef(handlers);
  const onEventRef = useRef(onEvent);
  const seenEventIds = useRef(new Set());

  useEffect(() => {
    handlersRef.current = handlers;
    onEventRef.current = onEvent;
  }, [handlers, onEvent]);

  const emitEvent = useCallback(
    (event) => {
      const normalizedEvent = normalizeRealtimeEvent(event);

      if (!normalizedEvent || !realtimeEventMatchesChannel(normalizedEvent, channel)) {
        return;
      }

      if (seenEventIds.current.has(normalizedEvent.id)) {
        return;
      }

      seenEventIds.current.add(normalizedEvent.id);

      if (seenEventIds.current.size > 120) {
        seenEventIds.current = new Set(Array.from(seenEventIds.current).slice(-80));
      }

      setConnection((currentConnection) => ({
        ...currentConnection,
        lastEvent: normalizedEvent,
      }));

      handlersRef.current?.[normalizedEvent.type]?.(normalizedEvent);
      handlersRef.current?.["*"]?.(normalizedEvent);
      onEventRef.current?.(normalizedEvent);
    },
    [channel],
  );

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const handleLocalEvent = (event) => {
      emitEvent(event.detail);
    };

    window.addEventListener(REALTIME_LOCAL_EVENT, handleLocalEvent);

    return () => {
      window.removeEventListener(REALTIME_LOCAL_EVENT, handleLocalEvent);
    };
  }, [emitEvent, enabled]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    let socket = null;
    let isActive = true;
    let pollTimer = null;
    const websocketUrl = getWebSocketUrl(channel);

    const runPoll = async () => {
      if (!isActive || !pollingEnabled) {
        return;
      }

      try {
        const polledEvents = await poller({ channel });
        normalizeRealtimeEventBatch(polledEvents).forEach(emitEvent);
      } catch (error) {
        setConnection((currentConnection) => ({
          ...currentConnection,
          lastError: error,
          status: "error",
          transport: "polling",
        }));
      }
    };

    const startPollingFallback = (error) => {
      if (!isActive || !pollingEnabled) {
        setConnection((currentConnection) => ({
          ...currentConnection,
          lastError: error || currentConnection.lastError,
          status: "error",
          transport: "idle",
        }));
        return;
      }

      setConnection((currentConnection) => ({
        ...currentConnection,
        lastError: error || null,
        status: "fallback",
        transport: "polling",
      }));

      runPoll();
      pollTimer = window.setInterval(runPoll, Math.max(5000, pollInterval));
    };

    if (!websocketUrl || typeof WebSocket === "undefined") {
      startPollingFallback(null);
      return () => {
        isActive = false;
        if (pollTimer) {
          window.clearInterval(pollTimer);
        }
      };
    }

    setConnection((currentConnection) => ({
      ...currentConnection,
      lastError: null,
      status: "connecting",
      transport: "websocket",
    }));

    try {
      socket = new WebSocket(websocketUrl);
    } catch (error) {
      startPollingFallback(error);
      return () => {
        isActive = false;
        if (pollTimer) {
          window.clearInterval(pollTimer);
        }
      };
    }

    socket.onopen = () => {
      setConnection((currentConnection) => ({
        ...currentConnection,
        lastConnectedAt: new Date().toISOString(),
        lastError: null,
        status: "connected",
        transport: "websocket",
      }));
    };

    socket.onmessage = (message) => {
      parseWebSocketMessage(message.data).forEach(emitEvent);
    };

    socket.onerror = (error) => {
      setConnection((currentConnection) => ({
        ...currentConnection,
        lastError: error,
        status: "error",
        transport: "websocket",
      }));
    };

    socket.onclose = () => {
      if (isActive) {
        startPollingFallback(null);
      }
    };

    return () => {
      isActive = false;

      if (pollTimer) {
        window.clearInterval(pollTimer);
      }

      if (socket && socket.readyState <= WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [channel, emitEvent, enabled, pollInterval, poller, pollingEnabled]);

  return useMemo(
    () => ({
      ...connection,
      channel,
      isConnected: connection.status === "connected",
      isFallback: connection.status === "fallback",
      publish: publishRealtimeEvent,
      queue: queueRealtimeEvent,
    }),
    [channel, connection],
  );
}

export default useRealtime;
