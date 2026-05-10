import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, PackageSearch, ShoppingBag } from "lucide-react";
import TrustSignalBar from "../../components/common/TrustSignalBar";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import ProductGallery from "../../components/product/ProductGallery";
import ProductInfo from "../../components/product/ProductInfo";
import ProductReviews from "../../components/product/ProductReviews";
import ProductSpecs from "../../components/product/ProductSpecs";
import RecentlyViewedSection from "../../components/product/RecentlyViewedSection";
import RecommendationSection from "../../components/product/RecommendationSection";
import RelatedProducts from "../../components/product/RelatedProducts";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import EmptyState from "../../components/ui/feedback/EmptyState";
import SkeletonBlock from "../../components/skeletons/SkeletonBlock";
import { products as catalogProducts } from "../../data";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import useProductDetail from "../../hooks/useProductDetail";
import { fadeUp, staggerContainer } from "../../styles/animations";

const MotionDiv = motion.div;

const frequentlyBoughtCategories = {
  "điện thoại": ["tai nghe", "phụ kiện gaming"],
  laptop: ["chuột", "bàn phím", "tai nghe", "lót chuột"],
  "tai nghe": ["chuột", "bàn phím", "phụ kiện gaming"],
  "chuột": ["bàn phím", "lót chuột", "tai nghe"],
  "bàn phím": ["chuột", "lót chuột", "tai nghe"],
  "lót chuột": ["chuột", "bàn phím"],
  "PC Gaming": ["linh kiện PC", "chuột", "bàn phím", "tai nghe", "ghế gaming"],
  "máy bộ": ["chuột", "bàn phím", "tai nghe", "lót chuột"],
  "linh kiện PC": ["PC Gaming", "máy bộ", "phụ kiện gaming"],
  "ghế gaming": ["bàn phím", "chuột", "tai nghe"],
  "phụ kiện gaming": ["tai nghe", "chuột", "bàn phím"],
};

function getProductAliases(product = {}) {
  return [product.id, product.apiId, product.productId, product.slug].map((value) => String(value ?? "")).filter(Boolean);
}

function getUniqueProducts(products) {
  const productMap = new Map();

  products.filter(Boolean).forEach((product) => {
    const key = product.slug || product.id || product.apiId || product.productId;

    if (key && !productMap.has(String(key))) {
      productMap.set(String(key), product);
    }
  });

  return Array.from(productMap.values());
}

function getFrequentlyBoughtTogetherProducts(product, relatedProducts, limit = 6) {
  const excludedAliases = new Set(getProductAliases(product));
  const preferredCategories = frequentlyBoughtCategories[product.category] || [];
  const productTags = new Set(product.tags || []);
  const candidates = getUniqueProducts([...relatedProducts, ...catalogProducts]).filter(
    (candidate) => !getProductAliases(candidate).some((alias) => excludedAliases.has(alias)),
  );

  return candidates
    .map((candidate) => {
      const preferredCategoryIndex = preferredCategories.indexOf(candidate.category);
      const matchingTags = (candidate.tags || []).filter((tag) => productTags.has(tag)).length;
      const score =
        (preferredCategoryIndex >= 0 ? 110 - preferredCategoryIndex * 12 : 0) +
        (candidate.category === product.category ? 36 : 0) +
        (candidate.brand === product.brand ? 18 : 0) +
        matchingTags * 18 +
        (candidate.sold || 0) * 0.22 +
        (candidate.rating || 0) * 12;

      return { product: candidate, score };
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map((item) => item.product);
}

function getInitialOptions(groups) {
  return groups.reduce((selectedOptions, group) => {
    const firstAvailableOption = group.options.find((option) => option.stock > 0) || group.options[0];

    return {
      ...selectedOptions,
      [group.id]: firstAvailableOption.id,
    };
  }, {});
}

function getSelectedVariantOptions(groups, selectedOptions) {
  return groups
    .map((group) => group.options.find((option) => option.id === selectedOptions[group.id]))
    .filter(Boolean);
}

function getMaxQuantity(product, selectedVariantOptions) {
  if (product.stock <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(product.stock, ...selectedVariantOptions.map((option) => option.stock)));
}

function ProductNotFound() {
  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="py-10">
        <EmptyState
          actionLabel="Quay lại danh sách"
          actionTo="/products"
          eyebrow="Không tìm thấy"
          icon={PackageSearch}
          message="Sản phẩm này có thể đã đổi đường dẫn hoặc chưa có trong catalog hiện tại."
          title="Sản phẩm không tồn tại"
        />
      </Container>
    </div>
  );
}

function ProductDetailLoading() {
  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-14 pt-6 sm:pt-8">
        <div className="mb-4 flex gap-2">
          <SkeletonBlock className="h-5 w-20 rounded-full" />
          <SkeletonBlock className="h-5 w-28 rounded-full" />
          <SkeletonBlock className="h-5 w-36 rounded-full" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start">
          <section className="store-glass-soft overflow-hidden rounded-3xl p-3 sm:p-4">
            <SkeletonBlock className="aspect-square min-h-[320px] rounded-3xl" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonBlock className="aspect-square rounded-2xl" key={`detail-gallery-${index}`} />
              ))}
            </div>
          </section>

          <section className="store-glass rounded-3xl p-4 sm:p-5">
            <div className="flex gap-2">
              <SkeletonBlock className="h-7 w-24 rounded-full" />
              <SkeletonBlock className="h-7 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="mt-5 h-10 w-4/5 rounded-2xl" />
            <SkeletonBlock className="mt-3 h-6 w-2/3 rounded-full" />
            <SkeletonBlock className="mt-6 h-32 rounded-3xl" />
            <SkeletonBlock className="mt-5 h-28 rounded-2xl" />
            <SkeletonBlock className="mt-5 h-12 rounded-2xl" />
          </section>
        </div>

        <div className="skeleton-card mt-6 rounded-3xl p-3 sm:p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3" key={`detail-trust-${index}`}>
                <SkeletonBlock className="h-10 w-10 rounded-2xl" />
                <SkeletonBlock className="mt-3 h-4 w-24 rounded-full" />
                <SkeletonBlock className="mt-2 h-3 w-32 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

function ProductDetailError({ error, onRetry }) {
  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="py-10">
        <ApiErrorAlert
          actionLabel="Thử tải lại"
          error={error}
          onAction={onRetry}
          surface="store"
          title="Không tải được chi tiết sản phẩm"
        />
        <Button as={Link} className="mt-5" to="/products" variant="outline">
          Quay lại danh sách
        </Button>
      </Container>
    </div>
  );
}

function ProductDetailContent({ detail, relatedProducts }) {
  const { addRecentlyViewed } = useRecentlyViewed();
  const initialOptions = getInitialOptions(detail.variantGroups);
  const initialVariantOptions = getSelectedVariantOptions(detail.variantGroups, initialOptions);
  const initialMaxQuantity = getMaxQuantity(detail.product, initialVariantOptions);
  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [quantity, setQuantity] = useState(initialMaxQuantity > 0 ? 1 : 0);

  const selectedVariantOptions = getSelectedVariantOptions(detail.variantGroups, selectedOptions);
  const maxQuantity = getMaxQuantity(detail.product, selectedVariantOptions);
  const selectedPriceDelta = selectedVariantOptions.reduce((sum, option) => sum + option.priceDelta, 0);
  const finalPrice = detail.product.price + selectedPriceDelta;
  const finalOldPrice = detail.product.oldPrice ? detail.product.oldPrice + selectedPriceDelta : null;
  const frequentlyBoughtProducts = getFrequentlyBoughtTogetherProducts(detail.product, relatedProducts);

  useEffect(() => {
    addRecentlyViewed(detail.product);
  }, [addRecentlyViewed, detail.product]);

  const handleVariantSelect = (groupId, optionId) => {
    const nextOptions = { ...selectedOptions, [groupId]: optionId };
    const nextVariantOptions = getSelectedVariantOptions(detail.variantGroups, nextOptions);
    const nextMaxQuantity = getMaxQuantity(detail.product, nextVariantOptions);

    setSelectedOptions(nextOptions);
    setQuantity((currentQuantity) => {
      if (nextMaxQuantity <= 0) {
        return 0;
      }

      return Math.min(Math.max(currentQuantity, 1), nextMaxQuantity);
    });
  };

  const handleQuantityChange = (nextQuantity) => {
    if (maxQuantity <= 0) {
      setQuantity(0);
      return;
    }

    setQuantity(Math.min(Math.max(nextQuantity, 1), maxQuantity));
  };

  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-14 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
          <Link className="premium-transition hover:text-white" to="/">
            Trang chủ
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <Link className="premium-transition hover:text-white" to="/products">
            Sản phẩm
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">{detail.product.category}</span>
        </nav>

        <MotionDiv
          animate="visible"
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start"
          initial="hidden"
          variants={staggerContainer}
        >
          <MotionDiv variants={fadeUp}>
            <ProductGallery images={detail.gallery} productName={detail.product.name} />
          </MotionDiv>
          <MotionDiv variants={fadeUp}>
            <ProductInfo
              detail={detail}
              finalOldPrice={finalOldPrice}
              finalPrice={finalPrice}
              maxQuantity={maxQuantity}
              onQuantityChange={handleQuantityChange}
              onVariantSelect={handleVariantSelect}
              product={detail.product}
              quantity={quantity}
              selectedOptions={selectedOptions}
              variantGroups={detail.variantGroups}
            />
          </MotionDiv>
        </MotionDiv>

        <TrustSignalBar
          className="mt-6"
          compact
          signals={[
            { icon: "ShieldCheck", label: "Chính hãng", value: "Bảo hành theo chính sách" },
            { icon: "Headphones", label: "Tư vấn setup", value: "Hỗ trợ chọn đúng nhu cầu" },
            { icon: "Truck", label: "Giao nhanh", value: "Theo dõi đơn sau checkout" },
            { icon: "RotateCcw", label: "Đổi trả", value: "Hỗ trợ trong 7 ngày" },
          ]}
        />

        <div className="mt-6 grid gap-6">
          <ProductSpecs description={detail.description} specs={detail.specs} />
          <ProductReviews
            breakdown={detail.ratingBreakdown}
            product={detail.product}
            reviewMeta={detail.reviewMeta}
            reviews={detail.reviews}
          />
          <RelatedProducts products={relatedProducts} />
          <RecommendationSection
            actionLabel="Xem thêm combo"
            actionTo="/products"
            badgeLabel="Bundle gợi ý"
            icon={ShoppingBag}
            products={frequentlyBoughtProducts}
            subtitle="Phụ kiện và sản phẩm bổ trợ để hoàn thiện setup quanh lựa chọn hiện tại."
            title="Thường mua cùng"
          />
          <RecentlyViewedSection
            excludeProductIds={[detail.product.id, detail.product.apiId, detail.product.slug]}
            limit={8}
            subtitle="Các sản phẩm vừa xem được giữ trên trình duyệt để bạn so sánh trước khi chốt đơn."
            title="Bạn vừa xem"
          />
        </div>
      </Container>
    </div>
  );
}

function ProductDetail() {
  const { slug } = useParams();
  const { detail, error, isLoading, isNotFound, refresh, relatedProducts } = useProductDetail(slug);

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (error) {
    return <ProductDetailError error={error} onRetry={refresh} />;
  }

  if (isNotFound || !detail) {
    return <ProductNotFound />;
  }

  return <ProductDetailContent detail={detail} key={detail.product.id} relatedProducts={relatedProducts} />;
}

export default ProductDetail;
