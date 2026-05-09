import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToastContext from "./ToastContext";
import { buildApiErrorFeedback } from "../../../api/apiErrorFeedback";
import { subscribeGlobalApiErrors } from "../../../api/apiErrorEvents";
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
  loading: {
    icon: Loader2,
    className: "border-blue-300/30 bg-blue-500/15 text-blue-50 shadow-[0_22px_70px_rgba(0,91,255,0.22)]",
    iconClassName: "animate-spin text-blue-200",
    title: "Đang xử lý",
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
  const toastTimers = useRef(new Map());

  const clearToastTimer = useCallback((id) => {
    const timer = toastTimers.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const dismissToast = useCallback((id) => {
    clearToastTimer(id);
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, [clearToastTimer]);

  const scheduleDismiss = useCallback(
    (id, duration) => {
      clearToastTimer(id);

      if (duration > 0) {
        const timer = window.setTimeout(() => dismissToast(id), duration);
        toastTimers.current.set(id, timer);
      }
    },
    [clearToastTimer, dismissToast],
  );

  const showToast = useCallback(
    ({ duration, id: requestedId, message, title, tone = "info" }) => {
      const id = requestedId ?? `toast-${Date.now()}-${nextToastId.current}`;
      const toastDuration = duration ?? (tone === "loading" ? 0 : 4200);
      nextToastId.current += 1;

      setToasts((currentToasts) => {
        const nextToast = {
          id,
          message,
          title,
          tone,
        };

        if (currentToasts.some((toast) => toast.id === id)) {
          return currentToasts.map((toast) => (toast.id === id ? { ...toast, ...nextToast } : toast));
        }

        return [...currentToasts, nextToast];
      });

      scheduleDismiss(id, toastDuration);

      return id;
    },
    [scheduleDismiss],
  );

  const updateToast = useCallback(
    (id, updates = {}) => {
      setToasts((currentToasts) =>
        currentToasts.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast)),
      );

      if ("duration" in updates) {
        scheduleDismiss(id, updates.duration);
      }
    },
    [scheduleDismiss],
  );

  const showApiError = useCallback(
    (error, options = {}) => {
      const feedback = buildApiErrorFeedback(error, options);

      return showToast({
        duration: feedback.isUnauthorized ? 5200 : options.duration,
        message: feedback.message,
        title: feedback.title,
        tone: feedback.tone,
      });
    },
    [showToast],
  );

  const runWithToast = useCallback(
    async (task, options = {}) => {
      const loadingMessage = options.loadingMessage ?? "Đang xử lý yêu cầu...";
      const toastId = showToast({
        duration: 0,
        message: loadingMessage,
        title: options.loadingTitle,
        tone: "loading",
      });

      try {
        const result = await (typeof task === "function" ? task() : task);
        const successMessage = options.successMessage ?? "Thao tác đã hoàn tất.";

        updateToast(toastId, {
          duration: options.successDuration ?? 3600,
          message: successMessage,
          title: options.successTitle,
          tone: "success",
        });

        return result;
      } catch (error) {
        const feedback = buildApiErrorFeedback(error, {
          message: options.errorMessage,
          title: options.errorTitle,
        });

        updateToast(toastId, {
          duration: options.errorDuration ?? 5200,
          message: feedback.message,
          title: feedback.title,
          tone: feedback.tone,
        });

        throw error;
      }
    },
    [showToast, updateToast],
  );

  useEffect(
    () =>
      subscribeGlobalApiErrors((detail) => {
        const feedback = detail?.feedback ?? buildApiErrorFeedback(detail?.apiError ?? detail?.error);

        showToast({
          duration: feedback.isUnauthorized ? 5200 : undefined,
          message: feedback.message,
          title: feedback.title,
          tone: feedback.tone,
        });
      }),
    [showToast],
  );

  useEffect(
    () => () => {
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
      toastTimers.current.clear();
    },
    [],
  );

  const value = useMemo(
    () => ({
      dismissToast,
      runWithToast,
      showApiError,
      showError: (message, options = {}) => showToast({ ...options, message, tone: "error" }),
      showInfo: (message, options = {}) => showToast({ ...options, message, tone: "info" }),
      showLoading: (message = "Đang xử lý yêu cầu...", options = {}) =>
        showToast({ duration: 0, ...options, message, tone: "loading" }),
      showSuccess: (message, options = {}) => showToast({ ...options, message, tone: "success" }),
      showToast,
      showWarning: (message, options = {}) => showToast({ ...options, message, tone: "warning" }),
      updateToast,
    }),
    [dismissToast, runWithToast, showApiError, showToast, updateToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 top-4 z-[100] grid w-[min(92vw,380px)] gap-3">
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
