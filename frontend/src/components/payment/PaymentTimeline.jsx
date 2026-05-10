import { CheckCircle2, Circle, Clock3, Loader2, XCircle } from "lucide-react";
import { cn } from "../../utils/classNames";

const stateStyles = {
  active: {
    icon: Loader2,
    iconClassName: "animate-spin text-blue-100",
    markerClassName: "border-blue-300/60 bg-blue-500/20 shadow-[0_0_18px_rgba(0,91,255,0.24)]",
    textClassName: "text-blue-100",
  },
  complete: {
    icon: CheckCircle2,
    iconClassName: "text-emerald-100",
    markerClassName: "border-emerald-300/50 bg-emerald-500/20 shadow-[0_0_18px_rgba(16,185,129,0.18)]",
    textClassName: "text-emerald-100",
  },
  error: {
    icon: XCircle,
    iconClassName: "text-red-100",
    markerClassName: "border-red-300/50 bg-red-500/20 shadow-[0_0_18px_rgba(239,68,68,0.18)]",
    textClassName: "text-red-100",
  },
  pending: {
    icon: Clock3,
    iconClassName: "text-slate-400",
    markerClassName: "border-white/10 bg-slate-950/48",
    textClassName: "text-slate-300",
  },
};

function PaymentTimeline({ className = "", compact = false, steps = [], title = "Tiến trình thanh toán" }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-slate-950/44 p-4 shadow-inner shadow-white/[0.03]", className)}>
      {title && <p className="text-sm font-black text-white">{title}</p>}
      <div className={cn("grid gap-3", title ? "mt-4" : "")}>
        {steps.map((step, index) => {
          const state = stateStyles[step.state] || stateStyles.pending;
          const Icon = compact && step.state === "pending" ? Circle : state.icon;

          return (
            <div className="grid grid-cols-[34px_minmax(0,1fr)] gap-3" key={`${step.label}-${index}`}>
              <div className="relative flex justify-center">
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border",
                    state.markerClassName,
                  )}
                >
                  <Icon className={state.iconClassName} size={compact ? 15 : 17} />
                </div>
                {index < steps.length - 1 && <div className="absolute bottom-[-14px] top-8 w-px bg-white/10" />}
              </div>
              <div className="min-w-0 pb-1">
                <p className={cn("text-sm font-black", state.textClassName)}>{step.label}</p>
                <p className="text-caption mt-1 text-slate-400">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentTimeline;
