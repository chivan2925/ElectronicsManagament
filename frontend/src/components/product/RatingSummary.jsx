import { Star } from "lucide-react";
import Badge from "../ui/Badge";
import Rating from "../ui/Rating";
import { cn } from "../../utils/classNames";

function getTotalCount(breakdown = [], fallback = 0) {
  const total = breakdown.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return total || fallback;
}

function RatingSummary({
  breakdown = [],
  className,
  onRatingFilterChange,
  rating = 0,
  selectedRating = "all",
  totalReviews = 0,
}) {
  const totalCount = getTotalCount(breakdown, totalReviews);
  const maxCount = Math.max(...breakdown.map((item) => item.count), 1);

  return (
    <aside className={cn("rounded-3xl border border-white/10 bg-slate-950/35 p-5 shadow-inner shadow-white/[0.03]", className)}>
      <div className="text-center">
        <Badge className="mb-4 gap-2" variant="primary">
          <Star fill="currentColor" size={13} />
          Tổng quan đánh giá
        </Badge>
        <p className="text-5xl font-black text-white">{Number(rating || 0).toFixed(1)}</p>
        <Rating className="mt-2 justify-center" reviews={totalCount} size="md" value={rating} />
      </div>

      <div className="mt-5 grid gap-2">
        <button
          className={cn(
            "transition-default flex items-center justify-between rounded-2xl border px-3 py-2 text-left text-xs font-black outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            selectedRating === "all"
              ? "border-blue-300/60 bg-blue-500/12 text-white"
              : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-blue-300/40 hover:bg-blue-500/10 hover:text-white",
          )}
          onClick={() => onRatingFilterChange?.("all")}
          type="button"
        >
          <span>Tất cả đánh giá</span>
          <span>{totalCount}</span>
        </button>

        {breakdown.map((item) => {
          const active = String(selectedRating) === String(item.star);

          return (
            <button
              className={cn(
                "transition-default grid grid-cols-[42px_1fr_42px] items-center gap-2 rounded-2xl border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                active
                  ? "border-blue-300/60 bg-blue-500/12"
                  : "border-transparent hover:border-blue-300/30 hover:bg-blue-500/10",
              )}
              key={item.star}
              onClick={() => onRatingFilterChange?.(active ? "all" : String(item.star))}
              type="button"
            >
              <span className="flex items-center gap-1 text-xs font-black text-slate-300">
                {item.star}
                <Star className="text-amber-300" fill="currentColor" size={12} />
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-blue-300"
                  style={{ width: `${(Number(item.count || 0) / maxCount) * 100}%` }}
                />
              </span>
              <span className="text-right text-xs font-bold text-slate-400">{item.count}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default RatingSummary;
