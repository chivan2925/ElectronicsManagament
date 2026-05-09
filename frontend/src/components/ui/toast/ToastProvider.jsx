import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import ToastContext from "./ToastContext";
import { cn } from "../../../utils/classNames";

const MotionDiv = motion.div;

const toastConfig = {
  error: {
    icon: XCircle,
    className: "border-red-300/30 bg-red-500/15 text-red-50 shadow-[0_22px_70px_rgba(239,68,68,0.22)]",
    iconClassName: "text-red-200",
    title: "Có lỗi xảy ra",
  },
  info: {
    icon: Info,
    className: "border-blue-300/30 bg-blue-500/15 text-blue-50 shadow-[0_22px_70px_rgba(0,91,255,0.22)]",
    iconClassName: "text-blue-200",
    title: "Thông báo",
  },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-300/30 bg-emerald-500/15 text-emerald-50 shadow-[0_22px_70px_rgba(16,185,129,0.2)]",
    iconClassName: "text-emerald-200",
    title: "Thành công",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-300/30 bg-amber-500/15 text-amber-50 shadow-[0_22px_70px_rgba(245,158,11,0.2)]",
    iconClassName: "text-amber-200",
    title: "Cần kiểm tra",
  },
};

function ToastItem({ toast, onDismiss }) {
  const config = toastConfig[toast.tone] ?? toastConfig.info;
  const Icon = config.icon;

  return (
    <MotionDiv
      animate={{ opacity: 1, x: 0, y: 0 }}
      className={cn(
        "pointer-events-auto relative w-full overflow-hidden rounded-2xl border p-4 pr-11 backdrop-blur-2xl",
        "bg-[#07111F]/92 ring-1 ring-white/10",
        config.className,
      )}
      exit={{ opacity: 0, x: 24, y: -8 }}
      initial={{ opacity: 0, x: 24, y: -8 }}
      layout
      role="status"
    >
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 shrink-0 drop-shadow-[0_0_14px_currentColor]", config.iconClassName)} size={19} />
        <div className="min-w-0">
          <p className="text-sm font-black text-white">{toast.title ?? config.title}</p>
          {toast.message && <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-200">{toast.message}</p>}
        </div>
      </div>

      <button
        aria-label="Đóng thông báo"
        className="absolute right-3 top-3 rounded-lg p-1 text-slate-300 transition-default hover:bg-white/10 hover:text-white"
        onClick={() => onDismiss(toast.id)}
        type="button"
      >
        <X size={16} />
      </button>
    </MotionDiv>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextToastId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ duration = 4200, message, title, tone = "info" }) => {
      const id = `toast-${Date.now()}-${nextToastId.current}`;
      nextToastId.current += 1;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          message,
          title,
          tone,
        },
      ]);

      if (duration > 0) {
        window.setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      dismissToast,
      showError: (message, options = {}) => showToast({ ...options, message, tone: "error" }),
      showInfo: (message, options = {}) => showToast({ ...options, message, tone: "info" }),
      showSuccess: (message, options = {}) => showToast({ ...options, message, tone: "success" }),
      showToast,
      showWarning: (message, options = {}) => showToast({ ...options, message, tone: "warning" }),
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] grid w-[min(92vw,380px)] gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} onDismiss={dismissToast} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
