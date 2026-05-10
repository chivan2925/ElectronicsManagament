import { memo, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock3, Eye, PackageSearch, Trash2 } from "lucide-react";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import { fadeUp, motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import { getProductAliases } from "../../utils/productIdentity";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import ProductCard from "./ProductCard";

const MotionDiv = motion.div;

function filterProducts(products, excludedProductIds) {
  const excluded = new Set(excludedProductIds.map((value) => String(value)));

  return products.filter((product) => !getProductAliases(product).some((alias) => excluded.has(alias)));
}

function RecentlyViewedEmptyState({ compact = false }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.035] text-center shadow-inner shadow-white/[0.03]",
        compact ? "p-5" : "p-6 sm:p-8",
      )}
    >
      <PackageSearch className="mx-auto text-slate-500" size={compact ? 32 : 42} />
      <p className="mt-3 font-black text-white">Chưa có sản phẩm đã xem</p>
      <p className="text-caption mx-auto mt-2 max-w-md text-slate-400">
        Các sản phẩm bạn mở trong catalog sẽ được lưu tạm ở đây để quay lại so sánh nhanh.
      </p>
    </div>
  );
}

function RecentlyViewedSection({
  className,
  compact = false,
  excludeProductIds = [],
  limit = 8,
  showClearAction = true,
  subtitle = "Quay lại nhanh những sản phẩm bạn vừa quan tâm.",
  surface = "panel",
  title = "Đã xem gần đây",
}) {
  const sliderRef = useRef(null);
  const { clearRecentlyViewed, recentlyViewedCount, recentlyViewedProducts } = useRecentlyViewed();
  const visibleProducts = useMemo(
    () => filterProducts(recentlyViewedProducts, excludeProductIds).slice(0, limit),
    [excludeProductIds, limit, recentlyViewedProducts],
  );
  const hasProducts = visibleProducts.length > 0;
  const sectionClassName =
    surface === "home"
      ? "section-visual"
      : "rounded-3xl border border-white/10 bg-slate-950/36 p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:p-5 lg:p-6";

  const scrollSlider = useCallback((direction) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      behavior: "smooth",
      left: direction * Math.min(slider.clientWidth * 0.86, 920),
    });
  }, []);

  if (!hasProducts && surface === "minimal") {
    return null;
  }

  return (
    <section className={cn(sectionClassName, className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <Clock3 size={13} />
            Recently viewed
          </Badge>
          <h2 className={cn("text-section", compact && "text-xl")}>{title}</h2>
          {subtitle && <p className="text-muted mt-2 text-sm">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {showClearAction && recentlyViewedCount > 0 && (
            <Button className="h-10 rounded-xl px-3 py-0" onClick={clearRecentlyViewed} variant="outline">
              <Trash2 size={16} />
              <span className="hidden sm:inline">Xóa lịch sử</span>
              <span className="sm:hidden">Xóa</span>
            </Button>
          )}

          {hasProducts && (
            <div className="hidden items-center gap-2 md:flex">
              <IconButton
                aria-label="Xem sản phẩm đã xem trước đó"
                className="border-white/10 bg-white/[0.04]"
                onClick={() => scrollSlider(-1)}
                size="sm"
                variant="outline"
              >
                <ChevronLeft size={18} />
              </IconButton>
              <IconButton
                aria-label="Xem thêm sản phẩm đã xem"
                className="border-white/10 bg-white/[0.04]"
                onClick={() => scrollSlider(1)}
                size="sm"
                variant="outline"
              >
                <ChevronRight size={18} />
              </IconButton>
            </div>
          )}
        </div>
      </div>

      {hasProducts ? (
        <MotionDiv animate="visible" initial="hidden" variants={staggerContainer} viewport={motionViewport}>
          <div
            className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            ref={sliderRef}
          >
            {visibleProducts.map((product) => (
              <MotionDiv
                className="min-w-[78vw] snap-start sm:min-w-[260px] lg:min-w-[282px] xl:min-w-[292px]"
                key={product.id}
                variants={fadeUp}
              >
                <ProductCard product={product} />
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      ) : (
        <RecentlyViewedEmptyState compact={compact} />
      )}

      {hasProducts && (
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
          <Eye className="text-blue-300" size={14} />
          <span>{visibleProducts.length} sản phẩm trong lịch sử xem gần đây.</span>
        </div>
      )}
    </section>
  );
}

export default memo(RecentlyViewedSection);
