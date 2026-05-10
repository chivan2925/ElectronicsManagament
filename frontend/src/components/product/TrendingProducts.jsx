import { useMemo } from "react";
import { Flame } from "lucide-react";
import RecommendationSection from "./RecommendationSection";

function getRecentRankMap(products) {
  return new Map(
    [...products]
      .sort((first, second) => (Date.parse(second.createdAt || "") || 0) - (Date.parse(first.createdAt || "") || 0))
      .map((product, index) => [product.slug || product.id, products.length - index]),
  );
}

function getTrendingProducts(products = [], limit = 10) {
  const recentRankMap = getRecentRankMap(products);

  return [...products]
    .sort((first, second) => {
      const firstKey = first.slug || first.id;
      const secondKey = second.slug || second.id;
      const firstScore =
        (first.sold || 0) * 1.2 +
        (first.reviews || 0) * 0.8 +
        (first.rating || 0) * 55 +
        (recentRankMap.get(firstKey) || 0) * 18 +
        (first.discount ? 40 : 0);
      const secondScore =
        (second.sold || 0) * 1.2 +
        (second.reviews || 0) * 0.8 +
        (second.rating || 0) * 55 +
        (recentRankMap.get(secondKey) || 0) * 18 +
        (second.discount ? 40 : 0);

      return secondScore - firstScore;
    })
    .slice(0, limit);
}

function TrendingProducts({ className, limit = 10, products = [], surface = "home" }) {
  const trendingProducts = useMemo(() => getTrendingProducts(products, limit), [limit, products]);

  return (
    <RecommendationSection
      actionLabel="Xem xu hướng"
      actionTo="/products"
      badgeLabel="Trending"
      className={className}
      icon={Flame}
      products={trendingProducts}
      subtitle="Những sản phẩm đang nổi bật theo lượt mua, đánh giá và độ mới trong catalog."
      surface={surface}
      title="Xu hướng đang được quan tâm"
    />
  );
}

export default TrendingProducts;
