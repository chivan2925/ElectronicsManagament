import { AlertTriangle, CreditCard, PackageCheck, ShieldAlert, Warehouse } from "lucide-react";
import useNotifications from "../../../hooks/useNotifications";
import { cn } from "../../../utils/classNames";
import EmptyState from "../../../components/ui/feedback/EmptyState";
import AnalyticsCard from "../dashboard/AnalyticsCard";

const activityConfig = {
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

  if (elapsedMs < minute) {
    return "Just now";
  }

  if (elapsedMs < hour) {
    return `${Math.floor(elapsedMs / minute)}m ago`;
  }

  return `${Math.floor(elapsedMs / hour)}h ago`;
}

function ActivityItem({ notification }) {
  const config = activityConfig[notification.type] || activityConfig.system;
  const Icon = config.Icon;

  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1", config.tone)}>
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <p className="truncate text-sm font-black text-slate-950">{notification.title}</p>
          <span className="shrink-0 text-xs font-semibold text-slate-400">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm leading-5 text-slate-600">{notification.message}</p>
      </div>
    </div>
  );
}

function StockAlert({ notification }) {
  const stock = notification.metadata?.stock ?? notification.metadata?.quantity;
  const threshold = notification.metadata?.threshold ?? notification.metadata?.reorderAt;

  return (
    <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 shrink-0 text-rose-600" size={17} />
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-rose-700">{notification.title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-rose-600">{notification.message}</p>
          {stock || threshold ? (
            <p className="mt-2 text-xs font-black text-rose-700">
              Stock {stock ?? "N/A"}{threshold ? ` / threshold ${threshold}` : ""}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AdminRealtimeActivity() {
  const { notifications, unreadCount } = useNotifications({ surface: "admin" });
  const activityItems = notifications
    .filter((notification) => ["admin", "order", "payment", "system"].includes(notification.type))
    .slice(0, 4);
  const stockAlerts = notifications.filter((notification) => notification.type === "stock").slice(0, 3);

  return (
    <AnalyticsCard
      action={
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-primary">
          {unreadCount ? `${unreadCount} unread` : "Synced"}
        </span>
      }
      description="Centralized event feed for orders, payments, stock, and admin alerts."
      title="Realtime operations"
    >
      <div className="grid gap-4 px-5 pb-5 pt-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          {activityItems.length ? (
            activityItems.map((notification) => <ActivityItem key={notification.id} notification={notification} />)
          ) : (
            <EmptyState
              className="min-h-44 rounded-xl"
              framed
              icon={PackageCheck}
              message="Sự kiện từ WebSocket bridge hoặc polling fallback sẽ xuất hiện tại đây."
              size="compact"
              surface="admin"
              title="Chưa có hoạt động realtime"
            />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-slate-950">Low stock alerts</p>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-600">
              {stockAlerts.length}
            </span>
          </div>
          {stockAlerts.length ? (
            stockAlerts.map((notification) => <StockAlert key={notification.id} notification={notification} />)
          ) : (
            <EmptyState
              className="min-h-40 rounded-xl"
              framed
              icon={Warehouse}
              message="Low-stock alert sẽ bật lên khi tồn kho chạm ngưỡng cảnh báo."
              size="compact"
              surface="admin"
              title="Chưa có cảnh báo tồn kho"
            />
          )}
        </div>
      </div>
    </AnalyticsCard>
  );
}

export default AdminRealtimeActivity;
