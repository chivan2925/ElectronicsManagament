import { createElement } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "../../../utils/classNames";

const toneClasses = {
  amber: {
    accent: "bg-amber-50 text-amber-600 ring-amber-100",
    glow: "from-amber-500/12",
  },
  blue: {
    accent: "bg-blue-50 text-primary ring-blue-100",
    glow: "from-blue-500/12",
  },
  emerald: {
    accent: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    glow: "from-emerald-500/12",
  },
  rose: {
    accent: "bg-rose-50 text-rose-600 ring-rose-100",
    glow: "from-rose-500/12",
  },
  violet: {
    accent: "bg-violet-50 text-violet-600 ring-violet-100",
    glow: "from-violet-500/12",
  },
};

const trendClasses = {
  down: "bg-rose-50 text-rose-600",
  flat: "bg-slate-100 text-slate-500",
  up: "bg-emerald-50 text-emerald-600",
};

const trendIcons = {
  down: ArrowDownRight,
  flat: Minus,
  up: ArrowUpRight,
};

function StatCard({ helper, icon, title, tone = "blue", trend, trendType = "up", value }) {
  const toneClass = toneClasses[tone] || toneClasses.blue;
  const TrendIcon = trendIcons[trendType] || ArrowUpRight;

  return (
    <article className="admin-panel admin-panel-hover group relative overflow-hidden rounded-2xl p-5">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent", toneClass.glow)} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-black tracking-normal text-slate-950">{value}</p>
          {helper ? <p className="mt-1 truncate text-xs font-semibold text-slate-500">{helper}</p> : null}
        </div>

        <div className={cn("transition-default rounded-xl p-3 ring-1 group-hover:scale-105", toneClass.accent)}>
          {icon ? createElement(icon, { size: 22, strokeWidth: 2.2 }) : null}
        </div>
      </div>

      {trend ? (
        <div className="relative mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black", trendClasses[trendType])}>
            <TrendIcon size={14} />
            {trend}
          </span>
          <span className="text-xs font-bold text-slate-400">vs previous</span>
        </div>
      ) : null}
    </article>
  );
}

export default StatCard;
