import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Headphones,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";
import { fadeUp, motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const iconMap = {
  BadgeCheck,
  Clock3,
  CreditCard,
  Headphones,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
  WalletCards,
};

const defaultSignals = [
  {
    icon: ShieldCheck,
    label: "Chính hãng",
    value: "Bảo hành theo hãng",
  },
  {
    icon: Truck,
    label: "Giao nhanh",
    value: "Theo dõi đơn rõ ràng",
  },
  {
    icon: CreditCard,
    label: "Thanh toán an toàn",
    value: "COD và cổng online",
  },
  {
    icon: RotateCcw,
    label: "Đổi trả",
    value: "Hỗ trợ trong 7 ngày",
  },
];

function resolveIcon(icon) {
  if (typeof icon === "string") {
    return iconMap[icon] || ShieldCheck;
  }

  return icon || ShieldCheck;
}

function TrustSignalBar({
  className,
  compact = false,
  signals = defaultSignals,
  surface = "panel",
}) {
  const sectionClassName =
    surface === "transparent"
      ? "grid gap-3"
      : "rounded-3xl border border-blue-300/15 bg-blue-500/[0.045] p-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl";
  const gridClassName =
    compact && signals.length <= 3
      ? "sm:grid-cols-3"
      : compact
        ? "sm:grid-cols-2 xl:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <MotionSection
      className={cn(sectionClassName, surface !== "transparent" && (compact ? "sm:p-3" : "sm:p-4"), className)}
      initial="hidden"
      variants={staggerContainer}
      viewport={motionViewport}
      whileInView="visible"
    >
      <div className={cn("grid gap-3", gridClassName)}>
        {signals.map((signal) => {
          const Icon = resolveIcon(signal.icon);

          return (
            <MotionDiv
              className="store-stat-card group rounded-2xl p-3"
              key={`${signal.label}-${signal.value}`}
              variants={fadeUp}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-start gap-3">
                <span className="premium-transition flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/12 text-blue-100 shadow-[0_0_22px_rgba(0,91,255,0.14)] group-hover:border-blue-200/50 group-hover:bg-blue-500/20">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-white">{signal.label}</span>
                  <span className="text-caption mt-1 block text-slate-400">{signal.value}</span>
                </span>
              </div>
            </MotionDiv>
          );
        })}
      </div>
    </MotionSection>
  );
}

export default TrustSignalBar;
