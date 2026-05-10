import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PackageSearch, Sparkles } from "lucide-react";
import { cn } from "../../utils/classNames";
import { ProductCardSkeleton } from "../skeletons";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ProductCarousel from "./ProductCarousel";

function RecommendationLoading({ compact = false, count = 4 }) {
  return (
    <div className="flex gap-4 overflow-hidden pb-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className={cn(
            "min-w-[78vw] sm:min-w-[260px] lg:min-w-[282px] xl:min-w-[292px]",
            compact && "min-w-[76vw] sm:min-w-[236px] lg:min-w-[252px]",
          )}
          key={`recommendation-loading-${index}`}
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

function RecommendationEmptyState({ compact = false, message, title }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.035] text-center shadow-inner shadow-white/[0.03]",
        compact ? "p-5" : "p-6 sm:p-8",
      )}
    >
      <PackageSearch className="mx-auto text-slate-500" size={compact ? 32 : 42} />
      <p className="mt-3 font-black text-white">{title}</p>
      <p className="text-caption mx-auto mt-2 max-w-md text-slate-400">{message}</p>
    </div>
  );
}

function RecommendationErrorState({ compact = false, message }) {
  return (
    <RecommendationEmptyState
      compact={compact}
      message={message || "Vui lòng thử lại sau khi dữ liệu sản phẩm ổn định."}
      title="Chưa tải được gợi ý"
    />
  );
}

function RecommendationPlaceholder({
  actionLabel = "Khám phá sản phẩm",
  actionTo = "/products",
  compact = false,
  message,
  title,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-blue-200/15 bg-[radial-gradient(circle_at_top_left,rgba(0,91,255,0.2),rgba(15,23,42,0.42)_40%,rgba(2,6,23,0.7)_100%)] shadow-inner shadow-white/[0.04]",
        compact ? "p-5" : "p-6 sm:p-8",
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />
      <Sparkles className="text-blue-200 drop-shadow-[0_0_18px_rgba(0,91,255,0.56)]" size={compact ? 26 : 34} />
      <h3 className={cn("mt-4 font-black text-white", compact ? "text-lg" : "text-2xl")}>{title}</h3>
      <p className="text-muted mt-2 max-w-2xl text-sm">{message}</p>
      {actionTo && actionLabel && (
        <Button as={Link} className="mt-5 rounded-2xl" to={actionTo} variant="outline">
          {actionLabel}
          <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
}

function RecommendationSection({
  actionLabel,
  actionTo,
  badgeLabel = "Gợi ý mua sắm",
  carouselProps,
  children,
  className,
  compact = false,
  emptyMessage = "Các sản phẩm phù hợp sẽ xuất hiện khi catalog có thêm dữ liệu.",
  emptyTitle = "Chưa có sản phẩm gợi ý",
  error,
  icon = Sparkles,
  isLoading = false,
  loadingCount = 4,
  placeholder = false,
  placeholderActionLabel = "Khám phá sản phẩm",
  placeholderActionTo = "/products",
  placeholderMessage = "Tiếp tục duyệt, thêm vào wishlist hoặc giỏ hàng để nhận các lựa chọn phù hợp hơn.",
  placeholderTitle = "Gợi ý dành riêng cho bạn",
  products = [],
  subtitle,
  surface = "panel",
  title,
}) {
  const safeProducts = useMemo(() => (Array.isArray(products) ? products.filter(Boolean) : []), [products]);
  const BadgeIcon = icon || Sparkles;
  const sectionClassName =
    surface === "home"
      ? "section-visual"
      : "rounded-3xl border border-white/10 bg-slate-950/36 p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:p-5 lg:p-6";

  return (
    <section className={cn(sectionClassName, className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <BadgeIcon size={13} />
            {badgeLabel}
          </Badge>
          <h2 className={cn("text-section", compact && "text-xl")}>{title}</h2>
          {subtitle && <p className="text-muted mt-2 text-sm">{subtitle}</p>}
        </div>

        {actionTo && actionLabel && (
          <Link className="premium-transition inline-flex items-center gap-2 text-sm font-black text-blue-200 hover:text-white" to={actionTo}>
            {actionLabel}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {children ||
        (isLoading ? (
          <RecommendationLoading compact={compact} count={loadingCount} />
        ) : error ? (
          <RecommendationErrorState compact={compact} message={typeof error === "string" ? error : undefined} />
        ) : placeholder ? (
          <RecommendationPlaceholder
            actionLabel={placeholderActionLabel}
            actionTo={placeholderActionTo}
            compact={compact}
            message={placeholderMessage}
            title={placeholderTitle}
          />
        ) : (
          <ProductCarousel
            compact={compact}
            emptyState={<RecommendationEmptyState compact={compact} message={emptyMessage} title={emptyTitle} />}
            products={safeProducts}
            {...carouselProps}
          />
        ))}
    </section>
  );
}

export default memo(RecommendationSection);
