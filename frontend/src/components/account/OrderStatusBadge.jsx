import { motion } from "framer-motion";
import { CheckCircle2, Clock3, PackageCheck, PackageOpen, ShieldCheck, Truck, XCircle } from "lucide-react";
import { cn } from "../../utils/classNames";
import { getOrderStatusMeta, getOrderTrackingStatus } from "../../utils/orderTracking";

const MotionSpan = motion.span;

const iconByStatus = {
  cancelled: XCircle,
  confirmed: ShieldCheck,
  delivered: PackageCheck,
  pending: Clock3,
  preparing: PackageOpen,
  shipping: Truck,
};

const toneClasses = {
  cancelled: "border-red-300/30 bg-red-500/14 text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.18)]",
  confirmed: "border-sky-300/35 bg-sky-500/14 text-sky-100 shadow-[0_0_22px_rgba(56,189,248,0.16)]",
  delivered: "border-emerald-300/35 bg-emerald-500/14 text-emerald-100 shadow-[0_0_22px_rgba(16,185,129,0.16)]",
  pending: "border-amber-300/35 bg-amber-500/14 text-amber-100 shadow-[0_0_22px_rgba(245,158,11,0.14)]",
  preparing: "border-blue-300/35 bg-blue-500/14 text-blue-100 shadow-[0_0_22px_rgba(0,91,255,0.18)]",
  shipping: "border-cyan-300/35 bg-cyan-500/14 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)]",
};

const sizeClasses = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-xs",
  lg: "px-3.5 py-2 text-sm",
};

function OrderStatusBadge({ className, order, paymentStatus, shippingStatus, size = "md", status }) {
  const trackingStatus = getOrderTrackingStatus(order ?? status, {
    paymentStatus,
    shippingStatus,
  });
  const meta = getOrderStatusMeta(order ?? status, {
    paymentStatus,
    shippingStatus,
  });
  const Icon = iconByStatus[trackingStatus] ?? CheckCircle2;

  return (
    <MotionSpan
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border font-black backdrop-blur-xl",
        toneClasses[trackingStatus] ?? toneClasses.pending,
        sizeClasses[size] ?? sizeClasses.md,
        className,
      )}
      initial={{ opacity: 0, scale: 0.96 }}
      layout
      title={meta.description}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Icon size={size === "lg" ? 16 : 14} />
      {meta.label}
    </MotionSpan>
  );
}

export default OrderStatusBadge;
