import { AlertTriangle, Loader2, SlidersHorizontal } from "lucide-react";
import { cn } from "../../../utils/classNames";

function LowStockItem({ canAdjust, item, onAdjust }) {
  const isOut = Number(item.quantity ?? 0) <= 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-900">{item.variantName}</p>
        <p className="truncate text-xs font-semibold text-slate-500">{item.warehouseName}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={cn(
            "inline-flex min-w-10 justify-center rounded-full px-2.5 py-1 text-xs font-black ring-1",
            isOut ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-amber-50 text-amber-700 ring-amber-200",
          )}
        >
          {item.quantity}
        </span>
        {canAdjust ? (
          <button
            aria-label={`Adjust ${item.variantName}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:text-primary"
            onClick={() => onAdjust?.(item)}
            title="Adjust stock"
            type="button"
          >
            <SlidersHorizontal size={15} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function LowStockCard({ canAdjust = false, items = [], loading = false, onAdjust, threshold = 10 }) {
  const outCount = items.filter((item) => Number(item.quantity ?? 0) <= 0).length;
  const lowCount = items.length - outCount;
  const previewItems = items.slice(0, 5);

  return (
    <section className="admin-panel rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
            <AlertTriangle size={18} />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-950">Low stock alerts</h2>
            <p className="text-xs font-semibold text-slate-500">Threshold: {threshold} units</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-slate-950">{items.length}</p>
          <p className="text-xs font-black uppercase tracking-normal text-slate-400">alerts</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
          <p className="text-lg font-black text-amber-700">{lowCount}</p>
          <p className="text-xs font-black text-amber-700">Low</p>
        </div>
        <div className="rounded-xl bg-rose-50 px-3 py-2 ring-1 ring-rose-100">
          <p className="text-lg font-black text-rose-700">{outCount}</p>
          <p className="text-xs font-black text-rose-700">Out</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-5 text-sm font-bold text-slate-500">
            <Loader2 className="animate-spin" size={16} />
            Loading alerts...
          </div>
        ) : previewItems.length > 0 ? (
          previewItems.map((item) => <LowStockItem canAdjust={canAdjust} item={item} key={item.id} onAdjust={onAdjust} />)
        ) : (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-3 py-5 text-center">
            <p className="text-sm font-black text-emerald-700">Inventory is healthy</p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">No visible stock item is below the alert threshold.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default LowStockCard;
