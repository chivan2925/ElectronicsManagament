import { motion } from "framer-motion";
import { CheckCircle2, Truck } from "lucide-react";
import { getFreeShippingState } from "../../cart/cartInsights";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

const MotionDiv = motion.div;

function FreeShippingProgress({ className, compact = false, subtotal, threshold }) {
  const { isUnlocked, progress, remaining, threshold: resolvedThreshold } = getFreeShippingState(subtotal, threshold);

  return (
    <div
      className={cn(
        "rounded-2xl border border-blue-300/15 bg-blue-500/[0.055] p-3 shadow-inner shadow-white/[0.03]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl",
            compact ? "h-9 w-9" : "h-10 w-10",
            isUnlocked ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-300/30" : "bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/30",
          )}
        >
          {isUnlocked ? <CheckCircle2 size={18} /> : <Truck size={18} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white">
                {isUnlocked ? "Đã mở khóa miễn phí vận chuyển" : "Tiến độ miễn phí vận chuyển"}
              </p>
              <p className="text-caption mt-1 text-slate-400">
                {isUnlocked
                  ? `Đơn từ ${formatCurrency(resolvedThreshold)} được miễn phí giao tiêu chuẩn.`
                  : `Mua thêm ${formatCurrency(remaining)} để được miễn phí giao tiêu chuẩn.`}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-slate-950/45 px-2.5 py-1 text-xs font-black text-blue-100">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/70 ring-1 ring-white/10">
            <MotionDiv
              animate={{ width: `${progress}%` }}
              className={cn(
                "h-full rounded-full",
                isUnlocked
                  ? "bg-gradient-to-r from-emerald-400 to-blue-300 shadow-[0_0_20px_rgba(16,185,129,0.45)]"
                  : "bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 shadow-[0_0_20px_rgba(0,91,255,0.45)]",
              )}
              initial={{ width: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreeShippingProgress;
