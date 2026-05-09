import { createElement } from "react";
import { ArrowUpRight } from "lucide-react";

const toneStyles = {
  blue: "bg-blue-50 text-primary ring-blue-100",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  red: "bg-rose-50 text-rose-600 ring-rose-100",
};

function StatCard({ icon, title, value, trend, tone = "blue" }) {
  return (
    <article className="rounded-lg border border-border bg-panel p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-normal text-ink">{value}</p>
        </div>

        <div className={`rounded-lg p-3 ring-1 ${toneStyles[tone] || toneStyles.blue}`}>
          {createElement(icon, { size: 22, strokeWidth: 2.2 })}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
        <ArrowUpRight size={16} />
        <span>{trend}</span>
      </div>
    </article>
  );
}

export default StatCard;
