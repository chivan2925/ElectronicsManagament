import { Suspense } from "react";
import { cn } from "../../utils/classNames";
import ProductCardSkeleton from "../skeletons/ProductCardSkeleton";
import SkeletonBlock from "../skeletons/SkeletonBlock";

function DeferredSectionFallback({ cardCount = 4, className, compact = false, surface = "panel" }) {
  const sectionClassName =
    surface === "home"
      ? "section-visual"
      : "store-surface-panel rounded-3xl p-4 sm:p-5 lg:p-6";

  return (
    <section className={cn(sectionClassName, className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-32 rounded-full" />
          <SkeletonBlock className="h-7 w-56 rounded-full" />
          <SkeletonBlock className="h-4 w-72 max-w-full rounded-full" />
        </div>
        <SkeletonBlock className="hidden h-5 w-24 rounded-full sm:block" />
      </div>

      <div className="flex gap-4 overflow-hidden pb-2">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            className={cn(
              "min-w-[78vw] sm:min-w-[260px] lg:min-w-[282px] xl:min-w-[292px]",
              compact && "min-w-[76vw] sm:min-w-[236px] lg:min-w-[252px]",
            )}
            key={`deferred-section-${index}`}
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

function DeferredSectionBoundary({ children, fallback = null, fallbackProps }) {
  return (
    <Suspense fallback={fallback || <DeferredSectionFallback {...fallbackProps} />}>
      {children}
    </Suspense>
  );
}

export { DeferredSectionFallback };
export default DeferredSectionBoundary;
