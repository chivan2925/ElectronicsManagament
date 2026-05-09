import { createElement } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, LockKeyhole, ShieldAlert, WifiOff, X, XCircle } from "lucide-react";
import { buildApiErrorFeedback, getApiErrorDetailItems } from "../../../api/apiErrorFeedback";
import { cn } from "../../../utils/classNames";

const MotionDiv = motion.div;

function getIcon(feedback) {
  if (feedback.isNetworkError || feedback.isTimeout) {
    return WifiOff;
  }

  if (feedback.isUnauthorized) {
    return LockKeyhole;
  }

  if (feedback.isForbidden) {
    return ShieldAlert;
  }

  return feedback.tone === "warning" ? AlertTriangle : XCircle;
}

function AlertIcon({ className, feedback, size = 18 }) {
  return createElement(getIcon(feedback), { className, size });
}

const toneClasses = {
  error: {
    admin: "border-red-100 bg-red-50 text-red-900",
    icon: "text-red-500",
    store: "border-red-300/25 bg-red-500/12 text-red-50 shadow-[0_22px_70px_rgba(239,68,68,0.16)]",
  },
  info: {
    admin: "border-blue-100 bg-blue-50 text-blue-950",
    icon: "text-blue-500",
    store: "border-blue-300/25 bg-blue-500/12 text-blue-50 shadow-[0_22px_70px_rgba(0,91,255,0.16)]",
  },
  warning: {
    admin: "border-amber-100 bg-amber-50 text-amber-950",
    icon: "text-amber-500",
    store: "border-amber-300/25 bg-amber-500/12 text-amber-50 shadow-[0_22px_70px_rgba(245,158,11,0.14)]",
  },
};

function ApiErrorAlert({
  actionLabel,
  className,
  compact = false,
  details,
  error,
  message,
  onAction,
  onDismiss,
  surface = "store",
  title,
}) {
  const feedback = error
    ? buildApiErrorFeedback(error, { message, title })
    : {
        detailItems: getApiErrorDetailItems(details),
        message,
        title: title ?? "Có lỗi xảy ra",
        tone: "error",
      };
  const palette = toneClasses[feedback.tone] ?? toneClasses.error;
  const detailItems = details ? getApiErrorDetailItems(details) : feedback.detailItems;

  if (!feedback.message && detailItems.length === 0) {
    return null;
  }

  return (
    <MotionDiv
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4",
        surface === "admin" ? palette.admin : cn("backdrop-blur-xl", palette.store),
        compact ? "text-sm" : "text-sm",
        className,
      )}
      initial={{ opacity: 0, y: 8 }}
      role="alert"
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
            surface === "admin" ? "border-white/70 bg-white/80" : "border-white/10 bg-white/[0.06]",
          )}
        >
          <AlertIcon className={palette.icon} feedback={feedback} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={cn("font-black", surface === "admin" ? "text-inherit" : "text-white")}>{feedback.title}</p>
              {feedback.message && (
                <p className={cn("mt-1 leading-6", surface === "admin" ? "text-slate-600" : "text-slate-200")}>
                  {feedback.message}
                </p>
              )}
            </div>

            {onDismiss && (
              <button
                aria-label="Đóng cảnh báo"
                className={cn(
                  "rounded-lg p-1 transition-default",
                  surface === "admin"
                    ? "text-slate-500 hover:bg-white hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
                onClick={onDismiss}
                type="button"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {detailItems.length > 0 && (
            <ul className={cn("mt-3 grid gap-1.5 text-xs font-semibold", surface === "admin" ? "text-slate-600" : "text-slate-300")}>
              {detailItems.slice(0, 5).map((item) => (
                <li key={item} className="rounded-lg bg-white/[0.06] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          )}

          {actionLabel && onAction && (
            <button
              className={cn(
                "transition-default mt-4 inline-flex h-10 items-center justify-center rounded-xl px-4 text-xs font-black outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                surface === "admin"
                  ? "bg-primary text-white hover:bg-primary-hover focus-visible:ring-blue-200 focus-visible:ring-offset-white"
                  : "bg-white text-slate-950 hover:bg-blue-50 focus-visible:ring-blue-300/60 focus-visible:ring-offset-slate-950",
              )}
              onClick={onAction}
              type="button"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </MotionDiv>
  );
}

export default ApiErrorAlert;
