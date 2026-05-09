import SkeletonBlock from "./SkeletonBlock";

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111F]/64 shadow-[0_16px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <div className="page-container">
        <div className="flex items-center gap-3 py-3 lg:gap-4 lg:py-4">
          <div className="flex min-w-fit items-center gap-3">
            <SkeletonBlock className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-28 rounded-full" />
              <SkeletonBlock className="h-3 w-20 rounded-full" />
            </div>
          </div>

          <SkeletonBlock className="hidden h-11 w-44 rounded-xl lg:block" />

          <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-1.5 md:flex">
            <SkeletonBlock className="ml-2 h-5 w-5 rounded-full" />
            <SkeletonBlock className="h-4 flex-1 rounded-full" />
            <SkeletonBlock className="h-10 w-24 rounded-xl" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <SkeletonBlock className="hidden h-10 w-36 rounded-xl xl:block" />
            <SkeletonBlock className="hidden h-10 w-32 rounded-xl sm:block" />
            <SkeletonBlock className="h-11 w-28 rounded-xl" />
            <SkeletonBlock className="h-11 w-11 rounded-xl lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderSkeleton;
