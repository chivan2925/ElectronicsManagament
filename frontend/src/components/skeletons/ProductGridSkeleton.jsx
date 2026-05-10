import { cn } from "../../utils/classNames";
import ProductCardSkeleton from "./ProductCardSkeleton";

function ProductGridSkeleton({
  className = "grid grid-cols-2 gap-4 md:gap-5 xl:grid-cols-3",
  count = 9,
  label = "Đang tải sản phẩm",
}) {
  return (
    <div aria-busy="true" aria-label={label} className={cn(className)} role="status">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={`product-grid-skeleton-${index}`} />
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
