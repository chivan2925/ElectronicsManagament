import SkeletonBlock from "./SkeletonBlock";

function ProductCardSkeleton({ variant = "default" }) {
  const isFeature = variant === "feature";

  return (
    <article className="skeleton-card h-full overflow-hidden rounded-2xl p-4">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30 p-4">
        <SkeletonBlock className="absolute left-3 top-3 h-6 w-16 rounded-full" />
        <SkeletonBlock className="absolute right-3 top-3 h-10 w-10 rounded-full" />
        <SkeletonBlock className={isFeature ? "h-44 w-52 rounded-2xl" : "h-28 w-36 rounded-2xl"} />
        <SkeletonBlock className="absolute bottom-3 left-3 h-6 w-20 rounded-full" />
      </div>

      <div className="mt-4 space-y-3">
        <SkeletonBlock className="h-3 w-20 rounded-full" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/30 px-3 py-2">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-16 rounded-full" />
            <SkeletonBlock className="h-3 w-24 rounded-full" />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200/10 bg-white/[0.03] p-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-28 rounded-full" />
              <SkeletonBlock className="h-3 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-6 w-12 rounded-full" />
          </div>
          <SkeletonBlock className="mt-3 h-11 w-full rounded-xl" />
        </div>
      </div>
    </article>
  );
}

export default ProductCardSkeleton;
