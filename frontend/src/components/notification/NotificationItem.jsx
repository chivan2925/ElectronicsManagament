import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BellRing, PackageCheck, ShieldCheck, TicketPercent } from "lucide-react";
import { cn } from "../../utils/classNames";

const MotionDiv = motion.div;

const notificationTypeConfig = {
  coupon: {
    Icon: TicketPercent,
    iconClass: "bg-emerald-400/12 text-emerald-200 ring-emerald-300/20",
    label: "Ưu đãi",
  },
  order: {
    Icon: PackageCheck,
    iconClass: "bg-blue-400/12 text-blue-200 ring-blue-300/25",
    label: "Đơn hàng",
  },
  system: {
    Icon: ShieldCheck,
    iconClass: "bg-violet-400/12 text-violet-200 ring-violet-300/20",
    label: "Hệ thống",
  },
};

const priorityClass = {
  high: "border-blue-300/35 bg-blue-500/[0.09]",
  low: "border-white/10 bg-white/[0.035]",
  medium: "border-blue-300/20 bg-white/[0.045]",
};

function formatRelativeTime(value) {
  if (!value) {
    return "Vừa xong";
  }

  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Vừa xong";
  }

  const elapsedMs = Math.max(0, Date.now() - timestamp);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsedMs < minute) {
    return "Vừa xong";
  }

  if (elapsedMs < hour) {
    return `${Math.floor(elapsedMs / minute)} phút trước`;
  }

  if (elapsedMs < day) {
    return `${Math.floor(elapsedMs / hour)} giờ trước`;
  }

  if (elapsedMs < 7 * day) {
    return `${Math.floor(elapsedMs / day)} ngày trước`;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function getMetadataLabel(notification) {
  if (notification.type === "order" && notification.metadata?.orderCode) {
    return `#${notification.metadata.orderCode}`;
  }

  if (notification.type === "coupon" && notification.metadata?.couponCode) {
    return notification.metadata.couponCode;
  }

  return null;
}

function NotificationContent({ notification }) {
  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.system;
  const Icon = config.Icon || BellRing;
  const metadataLabel = getMetadataLabel(notification);
  const isUnread = !notification.readAt;

  return (
    <span className="grid grid-cols-[42px_1fr] gap-3">
      <span
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-2xl ring-1 shadow-inner shadow-white/[0.03]",
          config.iconClass,
        )}
      >
        <Icon size={19} />
        {isUnread && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.85)]" />
        )}
      </span>

      <span className="min-w-0">
        <span className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-black text-slate-300">
            {config.label}
          </span>
          {metadataLabel && (
            <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-black text-blue-100">
              {metadataLabel}
            </span>
          )}
          <span className="text-caption text-slate-500">{formatRelativeTime(notification.createdAt)}</span>
        </span>

        <span className="mt-1 block text-sm font-black leading-snug text-white">{notification.title}</span>
        <span className="mt-1 block text-sm font-semibold leading-5 text-slate-400">{notification.message}</span>

        {notification.href && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-blue-200">
            {notification.actionLabel || "Xem ngay"}
            <ArrowRight size={14} />
          </span>
        )}
      </span>
    </span>
  );
}

function NotificationItem({ notification, onMarkAsRead, onNavigate }) {
  const isUnread = !notification.readAt;
  const sharedClassName = cn(
    "premium-transition group block w-full rounded-2xl border p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    priorityClass[notification.priority] || priorityClass.low,
    isUnread
      ? "shadow-[0_0_26px_rgba(0,91,255,0.12)] hover:border-blue-300/55 hover:bg-blue-500/[0.12]"
      : "opacity-[0.78] hover:border-white/20 hover:bg-white/[0.055] hover:opacity-100",
  );

  const handleClick = () => {
    onMarkAsRead?.(notification.id);
    onNavigate?.(notification);
  };

  return (
    <MotionDiv
      layout
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {notification.href ? (
        <Link className={sharedClassName} onClick={handleClick} to={notification.href}>
          <NotificationContent notification={notification} />
        </Link>
      ) : (
        <button className={sharedClassName} onClick={handleClick} type="button">
          <NotificationContent notification={notification} />
        </button>
      )}

      {isUnread && (
        <span className="sr-only">Chưa đọc</span>
      )}
    </MotionDiv>
  );
}

export default NotificationItem;
