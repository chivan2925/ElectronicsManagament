import { motion } from "framer-motion";
import { Check, Clock3, PackageCheck, PackageOpen, ReceiptText, ShieldCheck, Truck, XCircle } from "lucide-react";
import Badge from "../ui/Badge";
import { cn } from "../../utils/classNames";
import {
  getEstimatedDelivery,
  getOrderTrackingStatus,
  getTrackingStepIndex,
  ORDER_TRACKING_STEPS,
} from "../../utils/orderTracking";

const MotionDiv = motion.div;

const stepIcons = {
  confirmed: ShieldCheck,
  delivered: PackageCheck,
  pending: ReceiptText,
  preparing: PackageOpen,
  shipping: Truck,
};

function getStepState(stepIndex, currentIndex, isCancelled) {
  if (isCancelled) {
    return "muted";
  }

  if (stepIndex < currentIndex) {
    return "done";
  }

  if (stepIndex === currentIndex) {
    return "active";
  }

  return "upcoming";
}

function StepIcon({ state, step }) {
  const Icon = state === "done" ? Check : stepIcons[step.key] ?? Clock3;

  return (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-default",
        state === "done" && "border-emerald-300/45 bg-emerald-500/18 text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.18)]",
        state === "active" && "border-blue-300/60 bg-blue-500/20 text-blue-100 shadow-[0_0_28px_rgba(0,91,255,0.28)]",
        state === "upcoming" && "border-white/10 bg-white/[0.045] text-slate-500",
        state === "muted" && "border-white/10 bg-white/[0.035] text-slate-600",
      )}
    >
      <Icon size={19} />
    </span>
  );
}

function MobileStep({ currentIndex, index, isCancelled, step }) {
  const state = getStepState(index, currentIndex, isCancelled);

  return (
    <div className="relative flex gap-3">
      {index < ORDER_TRACKING_STEPS.length - 1 && (
        <span
          className={cn(
            "absolute left-[21px] top-12 h-[calc(100%-1.5rem)] w-px",
            state === "done" ? "bg-emerald-300/45" : "bg-white/10",
          )}
        />
      )}
      <StepIcon state={state} step={step} />
      <div className="min-w-0 pb-5">
        <p className={cn("text-sm font-black", state === "upcoming" || state === "muted" ? "text-slate-500" : "text-white")}>
          {step.label}
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">{step.description}</p>
      </div>
    </div>
  );
}

function ShipmentProgress({ className, order }) {
  const trackingStatus = getOrderTrackingStatus(order);
  const currentIndex = Math.max(0, getTrackingStepIndex(order));
  const isCancelled = trackingStatus === "cancelled";
  const estimatedDelivery = getEstimatedDelivery(order);
  const progressWidth = isCancelled ? 0 : (currentIndex / Math.max(ORDER_TRACKING_STEPS.length - 1, 1)) * 100;

  return (
    <section className={cn("store-surface-panel-strong rounded-3xl p-5 lg:p-6", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge className="mb-3 gap-2" variant="primary">
            <Truck size={13} />
            Giao hàng
          </Badge>
          <h2 className="text-xl font-black text-white">Theo dõi giao hàng</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
            {order?.trackingCode ? `Mã vận đơn ${order.trackingCode}` : "Mã vận đơn sẽ hiển thị khi đơn bắt đầu giao."}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 px-4 py-3">
          <p className="text-caption text-blue-200">Giao dự kiến</p>
          <p className="mt-1 text-sm font-black text-white">{estimatedDelivery.label}</p>
        </div>
      </div>

      {isCancelled && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm font-semibold text-red-50">
          <XCircle className="mt-0.5 shrink-0 text-red-200" size={18} />
          <p>Đơn hàng đã dừng xử lý. Các bước giao hàng không còn áp dụng cho đơn này.</p>
        </div>
      )}

      <div className="mt-6 hidden sm:block">
        <div className="relative px-5">
          <div className="absolute left-10 right-10 top-[22px] h-1 overflow-hidden rounded-full bg-white/10">
            <MotionDiv
              animate={{ width: `${progressWidth}%` }}
              className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 shadow-[0_0_20px_rgba(0,91,255,0.34)]"
              initial={{ width: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="relative grid grid-cols-5 gap-2">
            {ORDER_TRACKING_STEPS.map((step, index) => {
              const state = getStepState(index, currentIndex, isCancelled);

              return (
                <div className="grid justify-items-center text-center" key={step.key}>
                  <StepIcon state={state} step={step} />
                  <p
                    className={cn(
                      "mt-3 text-xs font-black",
                      state === "upcoming" || state === "muted" ? "text-slate-500" : "text-white",
                    )}
                  >
                    {step.shortLabel}
                  </p>
                  <p className="mt-1 max-w-[150px] text-xs font-semibold leading-5 text-slate-500">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:hidden">
        {ORDER_TRACKING_STEPS.map((step, index) => (
          <MobileStep currentIndex={currentIndex} index={index} isCancelled={isCancelled} key={step.key} step={step} />
        ))}
      </div>
    </section>
  );
}

export default ShipmentProgress;
