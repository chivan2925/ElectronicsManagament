import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Grid3X3,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import OptimizedImage from "../../components/common/OptimizedImage";
import TrustSignalBar from "../../components/common/TrustSignalBar";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import ActiveFilters from "../../components/product/ActiveFilters";
import EmptyProductsState from "../../components/product/EmptyProductsState";
import FilterSidebar from "../../components/product/FilterSidebar";
import Pagination from "../../components/product/Pagination";
import ProductCard from "../../components/product/ProductCard";
import SearchProductsInput from "../../components/product/SearchProductsInput";
import SortDropdown from "../../components/product/SortDropdown";
import ProductCardSkeleton from "../../components/skeletons/ProductCardSkeleton";
import SEOHead from "../../components/seo/SEOHead";
import SkeletonBlock from "../../components/skeletons/SkeletonBlock";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import IconButton from "../../components/ui/IconButton";
import { categories as storefrontCategories } from "../../data/categories";
import useFocusTrap from "../../hooks/useFocusTrap";
import useProducts from "../../hooks/useProducts";
import { buildCategoryMetadata, buildProductListingMetadata, slugify } from "../../seo/metadata";
import { motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import { compactCurrency } from "../../utils/formatters";

const MotionDiv = motion.div;

function ProductListingPage() {
  const { categorySlug = null } = useParams();
  const mobileFiltersRef = useRef(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const {
    activeFilters,
    brandOptions,
    categoryCounts,
    categoryOptions,
    clearAllFilters,
    clearCategories,
    clearPriceRanges,
    currentPage,
    filteredProducts,
    filters,
    heroProducts,
    isLoading,
    error,
    pageCount,
    paginatedProducts,
    priceRanges,
    products,
    ratingOptions,
    refresh,
    removeActiveFilter,
    selectedCategories,
    setPage,
    setRating,
    setSearch,
    setSort,
    sortOptions,
    sortedProducts,
    stockOptions,
    toggleBrand,
    toggleCategory,
    togglePriceRange,
    toggleStock,
  } = useProducts({ routeCategorySlug: categorySlug });

  const closeMobileFilters = useCallback(() => {
    setIsMobileFiltersOpen(false);
  }, []);

  useFocusTrap(mobileFiltersRef, isMobileFiltersOpen, { onEscape: closeMobileFilters });

  useEffect(() => {
    if (!isMobileFiltersOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileFiltersOpen]);

  const routeCategory =
    categorySlug && categorySlug !== "tat-ca"
      ? storefrontCategories.find((category) => category.slug === categorySlug) || {
          id: categorySlug,
          name: categorySlug
            .split("-")
            .filter(Boolean)
            .join(" "),
          slug: categorySlug,
        }
      : null;
  const selectedCategory = routeCategory || (selectedCategories.length === 1 ? selectedCategories[0] : null);
  const isCategoryPage = Boolean(routeCategory);
  const categorySummary =
    selectedCategories.length > 1 ? `${selectedCategories.length} danh mục đã chọn` : selectedCategory?.name || "Toàn bộ catalog";
  const hasActiveFilters = activeFilters.length > 0;
  const availablePrices = products.map((product) => product.price).filter((price) => price > 0);
  const minPrice = availablePrices.length ? Math.min(...availablePrices) : 0;

  const handlePageChange = (page) => {
    setPage(page);

    window.requestAnimationFrame(() => {
      document.getElementById("product-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const filterSidebarProps = {
    brandOptions,
    categoryCounts,
    categoryOptions,
    clearCategories,
    clearPriceRanges,
    filters,
    onBrandToggle: toggleBrand,
    onCategoryToggle: toggleCategory,
    onClearAll: clearAllFilters,
    onPriceRangeToggle: togglePriceRange,
    onRatingChange: setRating,
    onStockToggle: toggleStock,
    priceRanges,
    ratingOptions,
    resultCount: filteredProducts.length,
    stockOptions,
  };
  const seoMetadata = isCategoryPage
    ? buildCategoryMetadata({
        category: selectedCategory,
        productCount: filteredProducts.length,
        products: sortedProducts,
      })
    : buildProductListingMetadata({
        filters,
        productCount: filteredProducts.length,
        products: sortedProducts,
        selectedCategories,
      });
  const categoryCanonicalPath = selectedCategory ? `/categories/${selectedCategory.slug || slugify(selectedCategory.name)}` : "/products";

  return (
    <div className="store-page-shell">
      <SEOHead metadata={seoMetadata} />
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-14 pt-6 sm:pt-8" id="main-content" tabIndex={-1}>
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
          <Link className="premium-transition hover:text-white" to="/">
            Trang chủ
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <Link className="premium-transition hover:text-white" to="/products">
            Sản phẩm
          </Link>
          {selectedCategory && (
            <>
              <ChevronRight className="text-slate-600" size={15} />
              <Link aria-current={isCategoryPage ? "page" : undefined} className="text-blue-200" to={categoryCanonicalPath}>
                {selectedCategory.name}
              </Link>
            </>
          )}
        </nav>

        <section
          aria-labelledby="catalog-heading"
          className="store-hero-panel p-5 sm:p-7 lg:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <Sparkles size={13} />
                Catalog gaming & electronics
              </Badge>
              <h1 className="text-heading max-w-3xl" id="catalog-heading">
                {selectedCategory ? `Mua ${selectedCategory.name}` : "Tất cả sản phẩm"}
              </h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                Gear gaming, laptop, PC và phụ kiện công nghệ được gom theo bộ lọc rõ ràng để quét nhanh, so sánh nhanh và chọn nhanh.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Grid3X3, label: `${products.length} sản phẩm`, value: "Danh mục đầy đủ" },
                  { icon: ShieldCheck, label: `${brandOptions.length} thương hiệu`, value: "Hàng chính hãng" },
                  { icon: Truck, label: "Giao nhanh", value: "Hỗ trợ toàn quốc" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div className="store-stat-card rounded-2xl p-3" key={item.label}>
                      <Icon className="mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]" size={20} />
                      <p className="text-sm font-black text-white">{item.label}</p>
                      <p className="text-caption mt-1 text-slate-400">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative hidden min-h-[260px] lg:block">
              <div className="absolute inset-x-8 bottom-8 h-20 rounded-full bg-blue-500/25 blur-3xl" />
              {heroProducts.map((product, index) => (
                <div
                  className={cn(
                    "premium-transition absolute rounded-3xl border border-white/10 bg-slate-950/50 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl",
                    index === 0 && "left-8 top-0 z-20 w-52 rotate-[-5deg]",
                    index === 1 && "right-0 top-12 z-10 w-48 rotate-[6deg]",
                    index === 2 && "bottom-0 left-28 z-30 w-44 rotate-[2deg]",
                  )}
                  key={product.id}
                >
                  <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.28),rgba(15,23,42,0.8)_48%,rgba(2,6,23,0.96)_100%)] p-3">
                    <OptimizedImage
                      alt={product.name}
                      className="h-full w-full object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.44)]"
                      fallbackKind="product"
                      placeholderClassName="rounded-xl bg-slate-950/70"
                      priority={index === 0}
                      sizes="210px"
                      src={product.image}
                      wrapperClassName="flex h-full w-full items-center justify-center rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
          <div className="hidden lg:block">
            <FilterSidebar {...filterSidebarProps} />
          </div>

          <section aria-labelledby="product-results-heading" className="min-w-0 space-y-4">
            <div
              className="store-surface-panel scroll-mt-28 rounded-2xl p-3 sm:p-4"
              id="product-results"
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-caption text-blue-200">{categorySummary}</p>
                  <h2 className="text-section mt-1 text-xl" id="product-results-heading">
                    {isLoading ? "Đang tải sản phẩm..." : `${filteredProducts.length} sản phẩm phù hợp`}
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] xl:min-w-[620px]">
                  <SearchProductsInput
                    className="min-w-0"
                    key={filters.search}
                    onSearchChange={setSearch}
                    resultCount={filteredProducts.length}
                    value={filters.search}
                  />
                  <div className="grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-[auto_auto]">
                    <SortDropdown onChange={setSort} options={sortOptions} value={filters.sort} />
                    <Button
                      aria-controls="mobile-product-filters"
                      aria-expanded={isMobileFiltersOpen}
                      className="h-11 rounded-xl px-4 py-0 lg:hidden"
                      onClick={() => setIsMobileFiltersOpen(true)}
                      variant="outline"
                    >
                      <SlidersHorizontal size={18} />
                      <span className="hidden sm:inline">Bộ lọc</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <ActiveFilters items={activeFilters} onClearAll={clearAllFilters} onRemove={removeActiveFilter} />

            {isLoading ? (
              <div className="space-y-4">
                <div className="skeleton-card rounded-2xl p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-4 w-40 rounded-full" />
                      <SkeletonBlock className="h-3 w-64 max-w-full rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <SkeletonBlock className="h-9 w-24 rounded-xl" />
                      <SkeletonBlock className="h-9 w-28 rounded-xl" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-5 xl:grid-cols-3">
                  {Array.from({ length: 9 }, (_, index) => (
                    <ProductCardSkeleton key={`product-skeleton-${index}`} />
                  ))}
                </div>
              </div>
            ) : error ? (
              <ApiErrorAlert
                actionLabel="Thử tải lại"
                error={error}
                onAction={refresh}
                surface="store"
                title="Không tải được danh sách sản phẩm"
              />
            ) : paginatedProducts.length ? (
              <MotionDiv
                animate="visible"
                className="grid grid-cols-2 gap-4 md:gap-5 xl:grid-cols-3"
                initial="hidden"
                key={`${filters.search}-${filters.categories.join(".")}-${filters.brands.join(".")}-${filters.priceRanges.join(".")}-${filters.rating}-${filters.stockStatuses.join(".")}-${filters.sort}-${currentPage}`}
                variants={staggerContainer}
                viewport={motionViewport}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </MotionDiv>
            ) : (
              <EmptyProductsState
                hasActiveFilters={hasActiveFilters}
                onClearAll={clearAllFilters}
                search={filters.search}
              />
            )}

            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              pageCount={pageCount}
              totalItems={sortedProducts.length}
            />

            <TrustSignalBar
              compact
              signals={[
                { icon: "BadgeCheck", label: "Giá tốt", value: minPrice ? `Từ ${compactCurrency(minPrice)}` : "Đang cập nhật" },
                { icon: "RotateCcw", label: "Đổi trả", value: "7 ngày tại cửa hàng" },
                { icon: "ShieldCheck", label: "Bảo hành", value: "Theo chính sách hãng" },
                { icon: "Truck", label: "Giao nhanh", value: "Theo dõi đơn rõ ràng" },
              ]}
            />
          </section>
        </div>
      </Container>

      <div
        aria-hidden={!isMobileFiltersOpen}
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          isMobileFiltersOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        inert={!isMobileFiltersOpen ? "" : undefined}
      >
        <button
          aria-label="Đóng bộ lọc"
          className={cn(
            "absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300",
            isMobileFiltersOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={closeMobileFilters}
          type="button"
        />

        <aside
          aria-labelledby="mobile-filters-title"
          aria-modal="true"
          className={cn(
            "absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-3xl border border-blue-200/20 bg-[#07111F]/96 shadow-[0_-24px_80px_rgba(0,0,0,0.5),0_0_42px_rgba(0,91,255,0.2)] backdrop-blur-2xl transition-[transform,opacity] duration-300 ease-out",
            isMobileFiltersOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          )}
          id="mobile-product-filters"
          ref={mobileFiltersRef}
          role="dialog"
          tabIndex={-1}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-black text-white" id="mobile-filters-title">Bộ lọc sản phẩm</p>
              <p className="text-caption mt-1 text-slate-400">{filteredProducts.length} kết quả phù hợp</p>
            </div>
            <IconButton
              aria-label="Đóng bộ lọc"
              className="border-white/10 bg-white/[0.05]"
              onClick={closeMobileFilters}
              variant="outline"
            >
              <X size={19} />
            </IconButton>
          </div>

          <div className="max-h-[calc(88vh-72px)] overflow-y-auto px-4 py-4">
            <FilterSidebar {...filterSidebarProps} surface={false} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ProductListingPage;
