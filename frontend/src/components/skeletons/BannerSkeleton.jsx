import { cn } from "../../utils/classNames";
import SkeletonBlock from "./SkeletonBlock";

function BannerSkeleton({ variant = "hero" }) {
  if (variant === "promo") {
    return (
      <article className="skeleton-card overflow-hidden rounded-2xl p-3 sm:p-4">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBlock className="h-3 w-20 rounded-full" />
            <SkeletonBlock className="h-5 w-28 rounded-full" />
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <SkeletonBlock className="h-8 w-24 rounded-full" />
          </div>
          <SkeletonBlock className="h-24 w-28 rounded-xl" />
        </div>
      </article>
    );
  }

  return (
    <section className="skeleton-card relative min-h-0 overflow-hidden rounded-2xl p-5 sm:p-6 md:min-h-[500px] lg:p-8 xl:min-h-[520px] xl:p-9">
      <div className="pointer-events-none absolute -right-24 top-6 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl sm:h-80 sm:w-80" />
      <div className="relative z-10 grid h-full gap-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.82fr)] md:items-center lg:gap-8">
        <div className="flex max-w-xl flex-col justify-center">
          <SkeletonBlock className="mb-5 h-7 w-28 rounded-full" />
          <div className="space-y-4">
            <SkeletonBlock className="h-12 w-64 rounded-2xl lg:h-16 lg:w-80" />
            <SkeletonBlock className="h-12 w-48 rounded-2xl lg:h-16 lg:w-64" />
            <SkeletonBlock className="h-6 w-56 rounded-full" />
          </div>

          <div className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2" key={index}>
                <SkeletonBlock className="h-5 w-5 rounded-full" />
                <SkeletonBlock className={cn("h-4 rounded-full", index === 0 ? "w-52" : "w-44")} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <SkeletonBlock className="h-12 w-32 rounded-xl" />
            <SkeletonBlock className="h-12 w-32 rounded-xl" />
          </div>
        </div>

        <div className="flex-center relative min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[320px] lg:justify-end">
          <SkeletonBlock className="h-56 w-56 rounded-full sm:h-72 sm:w-72 lg:h-[340px] lg:w-[340px]" />
          <SkeletonBlock className="absolute h-[220px] w-[160px] rounded-[2rem] sm:h-[260px] sm:w-[190px] lg:h-[300px] lg:w-[210px]" />
        </div>
      </div>
    </section>
  );
}

export default BannerSkeleton;
