import SkeletonBlock from "./SkeletonBlock";

function CategoryCardSkeleton() {
  return (
    <div className="skeleton-card rounded-2xl p-4">
      <SkeletonBlock className="mb-4 h-11 w-11 rounded-xl" />
      <SkeletonBlock className="h-4 w-20 rounded-full" />
    </div>
  );
}

function CategorySidebarSkeleton({ count = 11 }) {
  return (
    <aside className="skeleton-card hidden rounded-2xl p-3 lg:block">
      <div className="mb-3 px-3 py-2">
        <SkeletonBlock className="h-4 w-36 rounded-full" />
        <SkeletonBlock className="mt-2 h-3 w-44 rounded-full" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div className="flex items-center gap-3 rounded-xl px-3 py-3" key={index}>
            <SkeletonBlock className="h-5 w-5 rounded-lg" />
            <SkeletonBlock className="h-4 flex-1 rounded-full" />
            <SkeletonBlock className="h-4 w-4 rounded-lg" />
          </div>
        ))}
      </div>
    </aside>
  );
}

function CategorySkeleton({ count = 10, variant = "grid" }) {
  if (variant === "sidebar") {
    return <CategorySidebarSkeleton count={count} />;
  }

  return (
    <div className="grid-categories">
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default CategorySkeleton;
