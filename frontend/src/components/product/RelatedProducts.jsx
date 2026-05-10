import { PackageCheck } from "lucide-react";
import RecommendationSection from "./RecommendationSection";

function RelatedProducts({ products = [] }) {
  if (!products.length) {
    return null;
  }

  return (
    <RecommendationSection
      actionLabel="Xem tất cả"
      actionTo="/products"
      badgeLabel="Gợi ý cùng nhóm"
      icon={PackageCheck}
      products={products}
      subtitle="Các lựa chọn gần với sản phẩm bạn đang xem."
      title="Sản phẩm liên quan"
    />
  );
}

export default RelatedProducts;
