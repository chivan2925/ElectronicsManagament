import { CircleDollarSign, PackageCheck, Settings2, ShoppingCart, Warehouse } from "lucide-react";
import { cn } from "../../../utils/classNames";
import AnalyticsCard from "./AnalyticsCard";

const activityStyles = {
  ORDER: {
    icon: ShoppingCart,
    tone: "bg-blue-50 text-primary ring-blue-100",
  },
  PAYMENT: {
    icon: CircleDollarSign,
    tone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  PRODUCT: {
    icon: PackageCheck,
    tone: "bg-violet-50 text-violet-600 ring-violet-100",
  },
  SYSTEM: {
    icon: Settings2,
    tone: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  WAREHOUSE: {
    icon: Warehouse,
    tone: "bg-amber-50 text-amber-600 ring-amber-100",
  },
};

function ActivityFeed({ items }) {
  return (
    <AnalyticsCard description="Cập nhật vận hành mới nhất." title="Hoạt động gần đây">
      <div className="space-y-4 px-5 pb-5 pt-4">
        {items.length ? items.map((item) => {
          const style = activityStyles[item.type] || activityStyles.SYSTEM;
          const Icon = style.icon;

          return (
            <div className="flex gap-3" key={item.id}>
              <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1", style.tone)}>
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="truncate text-sm font-black text-slate-900">{item.actor}</p>
                  <span className="text-xs font-semibold text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-sm leading-5 text-slate-600">{item.action}</p>
              </div>
            </div>
          );
        }) : (
          <p className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
            Chưa có hoạt động đơn hàng để hiển thị.
          </p>
        )}
      </div>
    </AnalyticsCard>
  );
}

export default ActivityFeed;
