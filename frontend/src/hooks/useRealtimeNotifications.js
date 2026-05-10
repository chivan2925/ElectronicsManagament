import { useMemo } from "react";
import { useToast } from "../components/ui/toast";
import { handleRealtimeNotificationEvent } from "../realtime/notificationEventHandlers";
import { REALTIME_CHANNELS } from "../realtime/realtimeEvents";
import useNotifications from "./useNotifications";
import useRealtime from "./useRealtime";

function useRealtimeNotifications(options = {}) {
  const {
    channel,
    enabled = true,
    listen = true,
    showToasts = true,
    surface = REALTIME_CHANNELS.STOREFRONT,
  } = options;
  const toast = useToast();
  const notifications = useNotifications({ surface });

  const realtimeHandlers = useMemo(
    () => ({
      "*": (event) =>
        handleRealtimeNotificationEvent(event, {
          addNotification: notifications.addNotification,
          showToast: showToasts,
          surface,
          toast,
        }),
    }),
    [notifications.addNotification, showToasts, surface, toast],
  );

  const connection = useRealtime({
    channel: channel || surface,
    enabled: enabled && listen,
    handlers: realtimeHandlers,
    pollingEnabled: true,
  });

  return {
    ...notifications,
    realtime: connection,
  };
}

export default useRealtimeNotifications;
