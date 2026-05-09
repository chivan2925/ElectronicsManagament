import { cn } from "../../utils/classNames";
import SkeletonBlock from "./SkeletonBlock";

function BannerSkeleton({ variant = "hero" }) {
  if (variant === "promo") {
    return (
      <article className="skeleton-card overflow-hidden rounded-2xl p-4">
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
    <section className="skeleton-card relative min-h-[520px] overflow-hidden rounded-2xl p-6 lg:p-9">
      <div className="pointer-events-none absolute -right-28 top-6 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative z-10 grid h-full gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="flex max-w-xl flex-col justify-center">
          <SkeletonBlock className="mb-5 h-7 w-28 rounded-full" />
          <div className="space-y-4">
            <SkeletonBlock className="h-12 w-64 rounded-2xl lg:h-16 lg:w-80" />
            <SkeletonBlock className="h-12 w-48 rounded-2xl lg:h-16 lg:w-64" />
            <SkeletonBlock className="h-6 w-56 rounded-full" />
          </div>

          <div className="mt-7 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2" key={index}>
                <SkeletonBlock className="h-5 w-5 rounded-full" />
                <SkeletonBlock className={cn("h-4 rounded-full", index === 0 ? "w-52" : "w-44")} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <SkeletonBlock className="h-12 w-32 rounded-xl" />
            <SkeletonBlock className="h-12 w-32 rounded-xl" />
          </div>
        </div>

        <div className="flex-center relative min-h-[320px] lg:justify-end">
          <SkeletonBlock className="h-[340px] w-[340px] rounded-full" />
          <SkeletonBlock className="absolute h-[300px] w-[210px] rounded-[2rem]" />
        </div>
      </div>
    </section>
  );
}

export default BannerSkeleton;
