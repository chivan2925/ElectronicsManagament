import { cn } from "../../utils/classNames";

function SkeletonBlock({ className }) {
  return <span aria-hidden="true" className={cn("skeleton-shimmer block rounded-xl", className)} />;
}

export default SkeletonBlock;
