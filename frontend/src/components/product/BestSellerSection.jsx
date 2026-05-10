import { useMemo } from "react";
import { Trophy } from "lucide-react";
import { products as catalogProducts } from "../../data";
import RecommendationSection from "./RecommendationSection";

function getBestSellerProducts(products = [], limit = 10) {
  return [...products]
    .sort((first, second) => {
      const firstScore = (first.sold || 0) * 2 + (first.reviews || 0) * 0.6 + (first.rating || 0) * 45;
      const secondScore = (second.sold || 0) * 2 + (second.reviews || 0) * 0.6 + (second.rating || 0) * 45;

      return secondScore - firstScore;
    })
    .slice(0, limit);
}

function BestSellerSection({ className, limit = 10, products = catalogProducts, surface = "home" }) {
  const bestSellerProducts = useMemo(() => getBestSellerProducts(products, limit), [limit, products]);

  return (
    <RecommendationSection
      actionLabel="Xem bán chạy"
      actionTo="/products"
      badgeLabel="Best sellers"
      className={className}
      icon={Trophy}
      products={bestSellerProducts}
      subtitle="Các lựa chọn có lượt mua và đánh giá tốt, phù hợp để ra quyết định nhanh."
      surface={surface}
      title="Bán chạy nhất"
    />
  );
}

export default BestSellerSection;
