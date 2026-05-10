import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import IconButton from "../ui/IconButton";
import ProductCard from "./ProductCard";

const MotionDiv = motion.div;

function getProductKey(product, index) {
  return product?.id || product?.apiId || product?.productId || product?.slug || `recommendation-product-${index}`;
}

function ProductCarousel({
  ariaLabel = "Danh sách sản phẩm gợi ý",
  className,
  compact = false,
  controlLabel = "Sản phẩm",
  emptyState = null,
  itemClassName,
  products = [],
  renderItem,
  showControls = true,
  trackClassName,
}) {
  const sliderRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollBackward: false,
    canScrollForward: false,
  });
  const productList = useMemo(() => (Array.isArray(products) ? products.filter(Boolean) : []), [products]);

  const updateScrollState = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const maxScroll = Math.max(slider.scrollWidth - slider.clientWidth, 0);

    setScrollState({
      canScrollBackward: slider.scrollLeft > 2,
      canScrollForward: slider.scrollLeft < maxScroll - 2,
    });
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || !productList.length) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(updateScrollState);

    slider.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.cancelAnimationFrame(frame);
      slider.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [productList.length, updateScrollState]);

  const scrollCarousel = useCallback((direction) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      behavior: "smooth",
      left: direction * Math.min(slider.clientWidth * 0.88, 960),
    });
  }, []);

  if (!productList.length) {
    return emptyState;
  }

  return (
    <MotionDiv
      className={cn("relative", className)}
      initial="hidden"
      variants={staggerContainer}
      viewport={motionViewport}
      whileInView="visible"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-[#07111F] to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-[#07111F] to-transparent md:block" />

      <div
        aria-label={ariaLabel}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          compact && "gap-3",
          trackClassName,
        )}
        ref={sliderRef}
        role="list"
      >
        {productList.map((product, index) => (
          <MotionDiv
            className={cn(
              "min-w-[78vw] snap-start sm:min-w-[260px] lg:min-w-[282px] xl:min-w-[292px]",
              compact && "min-w-[76vw] sm:min-w-[236px] lg:min-w-[252px]",
              itemClassName,
            )}
            key={getProductKey(product, index)}
            role="listitem"
            variants={fadeUp}
          >
            {renderItem ? renderItem(product, index) : <ProductCard product={product} />}
          </MotionDiv>
        ))}
      </div>

      {showControls && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs font-bold text-slate-500">
            {productList.length} {controlLabel.toLowerCase()} gợi ý.
          </p>

          <div className="flex items-center gap-2">
            <IconButton
              aria-label="Lùi carousel sản phẩm"
              className="border-white/10 bg-white/[0.04] disabled:pointer-events-none disabled:opacity-40"
              disabled={!scrollState.canScrollBackward}
              onClick={() => scrollCarousel(-1)}
              size="sm"
              variant="outline"
            >
              <ChevronLeft size={18} />
            </IconButton>
            <IconButton
              aria-label="Tiến carousel sản phẩm"
              className="border-white/10 bg-white/[0.04] disabled:pointer-events-none disabled:opacity-40"
              disabled={!scrollState.canScrollForward}
              onClick={() => scrollCarousel(1)}
              size="sm"
              variant="outline"
            >
              <ChevronRight size={18} />
            </IconButton>
          </div>
        </div>
      )}
    </MotionDiv>
  );
}

export default memo(ProductCarousel);
