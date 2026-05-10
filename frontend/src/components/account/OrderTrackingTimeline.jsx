import { motion } from "framer-motion";
import { CheckCircle2, Clock3, CreditCard, PackageCheck, PackageOpen, ReceiptText, Truck, XCircle } from "lucide-react";
import Badge from "../ui/Badge";
import { cn } from "../../utils/classNames";
import { formatTrackingDate, getOrderActivityHistory, ORDER_STATUS_META } from "../../utils/orderTracking";

const MotionDiv = motion.div;

const activityIcons = {
  cancelled: XCircle,
  confirmed: CreditCard,
  delivered: PackageCheck,
  pending: ReceiptText,
  preparing: PackageOpen,
  shipping: Truck,
};

const activityTone = {
  cancelled: "border-red-300/30 bg-red-500/14 text-red-100",
  confirmed: "border-sky-300/30 bg-sky-500/14 text-sky-100",
  delivered: "border-emerald-300/30 bg-emerald-500/14 text-emerald-100",
  pending: "border-amber-300/30 bg-amber-500/14 text-amber-100",
  preparing: "border-blue-300/30 bg-blue-500/14 text-blue-100",
  shipping: "border-cyan-300/30 bg-cyan-500/14 text-cyan-100",
};

function OrderTrackingTimeline({ activities, className, order }) {
  const history = activities?.length ? activities : getOrderActivityHistory(order);

  return (
    <section className={cn("rounded-3xl border border-white/10 bg-slate-950/42 p-5 shadow-inner shadow-white/[0.03] lg:p-6", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="mb-3 gap-2" variant="primary">
            <Clock3 size={13} />
            Hoạt động
          </Badge>
          <h2 className="text-xl font-black text-white">Lịch sử hoạt động</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
            Các cập nhật mới nhất từ trạng thái đơn hàng và vận chuyển.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm font-semibold text-slate-400">
          Chưa có hoạt động mới cho đơn hàng này.
        </div>
      ) : (
        <div className="mt-6 grid gap-0">
          {history.map((activity, index) => {
            const status = activity.status ?? "pending";
            const Icon = activityIcons[status] ?? CheckCircle2;
            const meta = ORDER_STATUS_META[status] ?? ORDER_STATUS_META.pending;

            return (
              <MotionDiv
                animate={{ opacity: 1, y: 0 }}
                className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-3"
                initial={{ opacity: 0, y: 10 }}
                key={activity.id ?? `${activity.title}-${index}`}
                transition={{ delay: index * 0.04, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {index < history.length - 1 && <span className="absolute left-[21px] top-12 h-[calc(100%-1rem)] w-px bg-white/10" />}

                <span
                  className={cn(
                    "relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-xl",
                    activityTone[status] ?? activityTone.pending,
                  )}
                >
                  <Icon size={18} />
                </span>

                <div className="pb-5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-white">{activity.title}</p>
                        {activity.description && <p className="mt-1 text-sm font-semibold leading-6 text-slate-400">{activity.description}</p>}
                      </div>
                      <span className="w-fit rounded-full border border-white/10 bg-slate-950/55 px-2.5 py-1 text-xs font-black text-slate-300">
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase text-slate-500">
                      {formatTrackingDate(activity.date)}
                    </p>
                  </div>
                </div>
              </MotionDiv>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OrderTrackingTimeline;
