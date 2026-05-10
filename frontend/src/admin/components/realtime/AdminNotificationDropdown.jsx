import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BellRing,
  CheckCheck,
  CreditCard,
  PackageCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  Warehouse,
} from "lucide-react";
import useRealtimeNotifications from "../../../hooks/useRealtimeNotifications";
import AdminIconButton from "../../../components/ui/admin/AdminIconButton";
import { cn } from "../../../utils/classNames";

const notificationTypeConfig = {
  admin: {
    Icon: ShieldAlert,
    tone: "bg-amber-50 text-amber-600 ring-amber-100",
  },
  order: {
    Icon: PackageCheck,
    tone: "bg-blue-50 text-primary ring-blue-100",
  },
  payment: {
    Icon: CreditCard,
    tone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  stock: {
    Icon: Warehouse,
    tone: "bg-rose-50 text-rose-600 ring-rose-100",
  },
  system: {
    Icon: ShieldAlert,
    tone: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

function formatRelativeTime(value) {
  const timestamp = value ? new Date(value).getTime() : Date.now();

  if (!Number.isFinite(timestamp)) {
    return "Just now";
  }

  const elapsedMs = Math.max(0, Date.now() - timestamp);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsedMs < minute) {
    return "Just now";
  }

  if (elapsedMs < hour) {
    return `${Math.floor(elapsedMs / minute)}m ago`;
  }

  if (elapsedMs < day) {
    return `${Math.floor(elapsedMs / hour)}h ago`;
  }

  return `${Math.floor(elapsedMs / day)}d ago`;
}

function getConnectionCopy(realtime) {
  if (realtime.status === "connected") {
    return {
      Icon: Wifi,
      label: "Live websocket",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (realtime.status === "fallback") {
    return {
      Icon: Wifi,
      label: "Polling fallback",
      tone: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  if (realtime.status === "connecting") {
    return {
      Icon: Wifi,
      label: "Connecting",
      tone: "border-blue-200 bg-blue-50 text-primary",
    };
  }

  return {
    Icon: WifiOff,
    label: "Offline",
    tone: "border-slate-200 bg-slate-50 text-slate-500",
  };
}

function NotificationRow({ notification, onNavigate }) {
  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.system;
  const Icon = config.Icon;
  const isUnread = !notification.readAt;
  const content = (
    <span className="flex gap-3">
      <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1", config.tone)}>
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate text-sm font-black text-slate-950">{notification.title}</span>
            <span className="mt-1 block text-sm font-semibold leading-5 text-slate-600">{notification.message}</span>
          </span>
          {isUnread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-sm shadow-blue-200" /> : null}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
          <span>{formatRelativeTime(notification.createdAt)}</span>
          {notification.metadata?.orderCode ? <span>#{notification.metadata.orderCode}</span> : null}
          {notification.metadata?.sku ? <span>{notification.metadata.sku}</span> : null}
        </span>
      </span>
    </span>
  );

  if (notification.href) {
    return (
      <Link
        className="block rounded-xl border border-slate-100 bg-white p-3 text-left transition hover:border-blue-100 hover:bg-blue-50/50"
        onClick={() => onNavigate(notification)}
        to={notification.href}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className="block w-full rounded-xl border border-slate-100 bg-white p-3 text-left transition hover:border-blue-100 hover:bg-blue-50/50"
      onClick={() => onNavigate(notification)}
      type="button"
    >
      {content}
    </button>
  );
}

function AdminNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    markAllAsRead,
    markAsRead,
    notifications,
    realtime,
    unreadCount,
  } = useRealtimeNotifications({ channel: "admin", surface: "admin" });

  const visibleNotifications = useMemo(() => notifications.slice(0, 8), [notifications]);
  const displayUnreadCount = unreadCount > 9 ? "9+" : unreadCount;
  const connectionCopy = getConnectionCopy(realtime);
  const ConnectionIcon = connectionCopy.Icon;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (dropdownRef.current?.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleNavigate = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <AdminIconButton
        className="relative"
        icon={unreadCount ? BellRing : Bell}
        onClick={() => setIsOpen((value) => !value)}
        size="md"
        title="Notifications"
      >
        {unreadCount ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-danger px-1 text-[10px] font-black text-white">
            {displayUnreadCount}
          </span>
        ) : null}
      </AdminIconButton>

      {isOpen ? (
        <div className="absolute right-0 top-12 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950">Realtime notifications</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {unreadCount ? `${unreadCount} unread operation alerts` : "All operation alerts are read"}
                </p>
              </div>
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary disabled:pointer-events-none disabled:opacity-45"
                disabled={!unreadCount}
                onClick={markAllAsRead}
                type="button"
              >
                <CheckCheck size={14} />
                Read
              </button>
            </div>

            <span
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black",
                connectionCopy.tone,
              )}
            >
              <ConnectionIcon size={13} />
              {connectionCopy.label}
            </span>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-3">
            {visibleNotifications.length ? (
              <div className="grid gap-2">
                {visibleNotifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                <ShieldAlert className="mx-auto text-slate-300" size={34} />
                <p className="mt-3 text-sm font-black text-slate-800">No live notifications yet</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Order, payment, stock, and admin events will appear here when the realtime bridge receives them.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminNotificationDropdown;
