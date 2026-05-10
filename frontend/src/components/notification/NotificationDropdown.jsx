import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bell, BellRing, CheckCheck, PackageSearch, TicketPercent } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";
import { cn } from "../../utils/classNames";
import NotificationItem from "./NotificationItem";

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const notificationFilters = [
  { id: "all", label: "Tất cả" },
  { id: "order", label: "Đơn hàng" },
  { id: "coupon", label: "Ưu đãi" },
  { id: "system", label: "Hệ thống" },
];

function getEmptyCopy(activeType) {
  if (activeType === "order") {
    return {
      description: "Các cập nhật xác nhận, chuẩn bị hàng và giao hàng sẽ nằm ở đây.",
      title: "Chưa có thông báo đơn hàng",
    };
  }

  if (activeType === "coupon") {
    return {
      description: "Mã giảm giá, combo và flash sale phù hợp sẽ xuất hiện khi có ưu đãi mới.",
      title: "Chưa có ưu đãi mới",
    };
  }

  if (activeType === "system") {
    return {
      description: "Cập nhật bảo mật, bảo trì và tài khoản sẽ được gom tại đây.",
      title: "Chưa có cập nhật hệ thống",
    };
  }

  return {
    description: "Thông báo đơn hàng, ưu đãi và hệ thống sẽ được gom trong khu vực này.",
    title: "Chưa có thông báo",
  };
}

function NotificationDropdown({ className, onOpenChange }) {
  const dropdownRef = useRef(null);
  const [activeType, setActiveType] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const {
    markAllAsRead,
    markAsRead,
    notificationCounts,
    notifications,
    unreadCount,
  } = useNotifications();

  const updateOpen = useCallback(
    (nextOpen) => {
      setIsOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (dropdownRef.current?.contains(event.target)) {
        return;
      }

      updateOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        updateOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updateOpen]);

  const filters = useMemo(
    () =>
      notificationFilters.map((filter) => ({
        ...filter,
        count: filter.id === "all" ? notificationCounts.total : notificationCounts.byType[filter.id] || 0,
        unreadCount:
          filter.id === "all" ? notificationCounts.unread : notificationCounts.unreadByType[filter.id] || 0,
      })),
    [notificationCounts],
  );

  const filteredNotifications = useMemo(() => {
    if (activeType === "all") {
      return notifications;
    }

    return notifications.filter((notification) => notification.type === activeType);
  }, [activeType, notifications]);

  const emptyCopy = getEmptyCopy(activeType);
  const displayUnreadCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={unreadCount ? `Thông báo, ${unreadCount} chưa đọc` : "Thông báo"}
        className={cn(
          "premium-transition relative flex h-10 min-w-10 items-center justify-center rounded-xl border px-2 text-white shadow-inner shadow-white/[0.03] outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:h-11 sm:min-w-11 sm:px-3",
          isOpen
            ? "border-blue-300/80 bg-blue-500/14 shadow-[0_0_30px_rgba(0,91,255,0.24)]"
            : "border-white/10 bg-white/[0.06] hover:-translate-y-0.5 hover:border-blue-300/80 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(0,91,255,0.24)]",
        )}
        onClick={() => updateOpen(!isOpen)}
        type="button"
      >
        {isOpen ? <BellRing size={20} /> : <Bell size={20} />}
        {unreadCount > 0 && (
          <MotionSpan
            animate={{ scale: [1, 1.12, 1] }}
            className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-[0_0_18px_rgba(239,68,68,0.7)]"
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
          >
            {displayUnreadCount}
          </MotionSpan>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="Thông báo"
            className="fixed left-3 right-3 top-[72px] z-[70] max-h-[calc(100dvh-88px)] overflow-hidden rounded-3xl border border-blue-200/15 bg-[#07111F]/97 shadow-[0_26px_90px_rgba(0,0,0,0.5),0_0_42px_rgba(0,91,255,0.16)] backdrop-blur-2xl sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[420px] sm:max-w-[calc(100vw-24px)]"
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            role="dialog"
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

            <div className="border-b border-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_0_28px_rgba(0,91,255,0.45)]">
                    <BellRing size={21} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-black leading-tight text-white">Thông báo</span>
                    <span className="text-caption mt-1 block text-slate-400">
                      {unreadCount ? `${unreadCount} thông báo chưa đọc` : "Tất cả thông báo đã đọc"}
                    </span>
                  </span>
                </div>

                <button
                  className="premium-transition inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 outline-none hover:border-blue-300/55 hover:bg-blue-500/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-45"
                  disabled={!unreadCount}
                  onClick={markAllAsRead}
                  type="button"
                >
                  <CheckCheck size={15} />
                  Đã đọc
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {filters.map((filter) => {
                  const isActive = activeType === filter.id;

                  return (
                    <button
                      className={cn(
                        "premium-transition inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                        isActive
                          ? "border-blue-300/70 bg-blue-500/18 text-white shadow-[0_0_22px_rgba(0,91,255,0.16)]"
                          : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-blue-300/45 hover:bg-blue-500/10 hover:text-white",
                      )}
                      key={filter.id}
                      onClick={() => setActiveType(filter.id)}
                      type="button"
                    >
                      {filter.label}
                      <span className={cn("text-[11px]", filter.unreadCount ? "text-blue-100" : "text-slate-500")}>
                        {filter.unreadCount || filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="max-h-[calc(100dvh-260px)] overflow-y-auto overscroll-contain p-3 sm:max-h-[390px]">
              <AnimatePresence initial={false} mode="popLayout">
                {filteredNotifications.length ? (
                  <div className="grid gap-2">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onNavigate={() => updateOpen(false)}
                      />
                    ))}
                  </div>
                ) : (
                  <MotionDiv
                    animate={{ opacity: 1, y: 0 }}
                    className="flex min-h-[240px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-center"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                  >
                    <span>
                      <Bell className="mx-auto text-blue-200 drop-shadow-[0_0_18px_rgba(0,91,255,0.55)]" size={42} />
                      <span className="mt-4 block text-sm font-black text-white">{emptyCopy.title}</span>
                      <span className="text-muted mx-auto mt-2 block max-w-xs text-sm">{emptyCopy.description}</span>
                    </span>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
              <Link
                className="premium-transition inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-black text-slate-200 hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white"
                onClick={() => updateOpen(false)}
                to="/profile/orders"
              >
                <PackageSearch size={15} />
                Đơn hàng
              </Link>
              <Link
                className="premium-transition inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-black text-slate-200 hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white"
                onClick={() => updateOpen(false)}
                to="/cart"
              >
                <TicketPercent size={15} />
                Ưu đãi
              </Link>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;
