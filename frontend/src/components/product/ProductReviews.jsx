import { useMemo, useState } from "react";
import { Filter, Image as ImageIcon, MessageSquareText, RefreshCw, ShieldCheck, SlidersHorizontal } from "lucide-react";
import useAuth from "../../auth/useAuth";
import productService from "../../api/productService";
import { useToast } from "../ui/toast";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ApiErrorAlert from "../ui/feedback/ApiErrorAlert";
import EmptyState from "../ui/feedback/EmptyState";
import { cn } from "../../utils/classNames";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

const REVIEWS_PAGE_SIZE = 5;

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Hữu ích", value: "helpful" },
  { label: "Điểm cao", value: "highest" },
  { label: "Điểm thấp", value: "lowest" },
];

function getReviewTime(review) {
  const time = new Date(review.date).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function sortReviews(reviews, sort) {
  const sortedReviews = [...reviews];

  if (sort === "highest") {
    return sortedReviews.sort((a, b) => b.rating - a.rating || getReviewTime(b) - getReviewTime(a));
  }

  if (sort === "lowest") {
    return sortedReviews.sort((a, b) => a.rating - b.rating || getReviewTime(b) - getReviewTime(a));
  }

  if (sort === "helpful") {
    return sortedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0) || getReviewTime(b) - getReviewTime(a));
  }

  return sortedReviews.sort((a, b) => getReviewTime(b) - getReviewTime(a));
}

function getReviewAuthor(user) {
  return user?.fullName || user?.name || user?.email || "Khách hàng";
}

function addLocalReviewsToBreakdown(breakdown = [], localReviews = []) {
  const counts = new Map([5, 4, 3, 2, 1].map((star) => [star, 0]));

  breakdown.forEach((item) => {
    counts.set(Number(item.star), Number(item.count || 0));
  });

  localReviews.forEach((review) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(review.rating || 5))));
    counts.set(star, (counts.get(star) || 0) + 1);
  });

  return [5, 4, 3, 2, 1].map((star) => ({
    count: counts.get(star) || 0,
    star,
  }));
}

function getAverageRating(product, localReviews = []) {
  const baseCount = Number(product?.reviews || 0);
  const baseRating = Number(product?.rating || 0);

  if (!localReviews.length) {
    return baseRating;
  }

  const localTotal = localReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  const totalCount = baseCount + localReviews.length;

  return totalCount ? (baseRating * baseCount + localTotal) / totalCount : baseRating;
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      className={cn(
        "transition-default inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-black outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        active
          ? "border-blue-300/60 bg-blue-500/12 text-white shadow-[0_0_22px_rgba(0,91,255,0.14)]"
          : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-blue-300/45 hover:bg-blue-500/10 hover:text-white",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ProductReviews({ breakdown = [], product, reviewMeta, reviews = [] }) {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const toast = useToast();
  const [apiReviews, setApiReviews] = useState(reviews);
  const [currentMeta, setCurrentMeta] = useState(reviewMeta);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [localReviews, setLocalReviews] = useState([]);
  const [mediaOnly, setMediaOnly] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PAGE_SIZE);

  const allReviews = useMemo(() => [...localReviews, ...apiReviews], [apiReviews, localReviews]);
  const filteredReviews = useMemo(() => {
    const filtered = allReviews.filter((review) => {
      if (ratingFilter !== "all" && Math.round(Number(review.rating || 0)) !== Number(ratingFilter)) {
        return false;
      }

      if (verifiedOnly && !review.verifiedPurchase) {
        return false;
      }

      if (mediaOnly && !(review.photos || []).length) {
        return false;
      }

      return true;
    });

    return sortReviews(filtered, sort);
  }, [allReviews, mediaOnly, ratingFilter, sort, verifiedOnly]);
  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const totalReviewCount = Number(product?.reviews || 0) + localReviews.length;
  const summaryBreakdown = addLocalReviewsToBreakdown(breakdown, localReviews);
  const summaryRating = getAverageRating(product, localReviews);
  const hasMoreLoadedReviews = visibleCount < filteredReviews.length;
  const hasMoreServerReviews =
    currentMeta &&
    Number.isFinite(Number(currentMeta.page)) &&
    Number.isFinite(Number(currentMeta.totalPages)) &&
    Number(currentMeta.page) + 1 < Number(currentMeta.totalPages);

  const resetVisibleCount = () => {
    setVisibleCount(REVIEWS_PAGE_SIZE);
  };

  const handleRatingFilterChange = (nextRating) => {
    setRatingFilter(nextRating);
    resetVisibleCount();
  };

  const handleToggleVerified = () => {
    setVerifiedOnly((current) => !current);
    resetVisibleCount();
  };

  const handleToggleMediaOnly = () => {
    setMediaOnly((current) => !current);
    resetVisibleCount();
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    resetVisibleCount();
  };

  const handleSubmitReview = (values) => {
    const nextReview = {
      author: getReviewAuthor(user),
      content: values.content,
      date: new Date().toISOString(),
      helpfulCount: 0,
      id: `local-review-${Date.now()}`,
      pending: true,
      photos: values.photos,
      rating: values.rating,
      title: values.title,
      verifiedPurchase: false,
      variant: "Đánh giá từ tài khoản",
    };

    setLocalReviews((currentReviews) => [nextReview, ...currentReviews]);
    setSort("newest");
    setRatingFilter("all");
    setVerifiedOnly(false);
    setVisibleCount(REVIEWS_PAGE_SIZE);
    toast.showSuccess("Đánh giá của bạn đã được ghi nhận.", {
      title: "Cảm ơn bạn đã đánh giá",
    });
  };

  const handleLoadMore = async () => {
    if (hasMoreLoadedReviews) {
      setVisibleCount((current) => current + REVIEWS_PAGE_SIZE);
      return;
    }

    if (!hasMoreServerReviews || isLoadingMore) {
      return;
    }

    const productId = product?.apiId ?? product?.id;

    if (!productId) {
      return;
    }

    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const nextPage = await productService.getCatalogProductReviews(productId, {
        page: Number(currentMeta.page) + 1,
        size: Number(currentMeta.size) || REVIEWS_PAGE_SIZE,
      });

      setApiReviews((currentReviews) => {
        const reviewMap = new Map(currentReviews.map((review) => [review.id, review]));
        nextPage.items.forEach((review) => reviewMap.set(review.id, review));

        return Array.from(reviewMap.values());
      });
      setCurrentMeta(nextPage.meta);
      setVisibleCount((current) => current + REVIEWS_PAGE_SIZE);
    } catch (error) {
      setLoadError(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className="store-glass-soft rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <MessageSquareText size={13} />
            Đánh giá khách hàng
          </Badge>
          <h2 className="text-section">Người dùng nói gì</h2>
          <p className="text-muted mt-2 text-sm">
            Đánh giá được sắp xếp rõ ràng theo điểm sao, trạng thái mua hàng và ảnh thực tế.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="gap-2" variant="soft">
            <ShieldCheck size={13} />
            {totalReviewCount} đánh giá
          </Badge>
          <Badge className="gap-2" variant="soft">
            <ImageIcon size={13} />
            Ảnh thực tế
          </Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-4">
          <RatingSummary
            breakdown={summaryBreakdown}
            onRatingFilterChange={handleRatingFilterChange}
            rating={summaryRating}
            selectedRating={ratingFilter}
            totalReviews={totalReviewCount}
          />

          <ReviewForm
            authLoading={authLoading}
            isAuthenticated={isAuthenticated}
            onSubmit={handleSubmitReview}
            productName={product.name}
            user={user}
          />
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                <FilterChip active={ratingFilter !== "all"} onClick={() => handleRatingFilterChange("all")}>
                  <Filter size={14} />
                  {ratingFilter === "all" ? "Tất cả sao" : `${ratingFilter} sao`}
                </FilterChip>
                <FilterChip active={verifiedOnly} onClick={handleToggleVerified}>
                  <ShieldCheck size={14} />
                  Đã mua hàng
                </FilterChip>
                <FilterChip active={mediaOnly} onClick={handleToggleMediaOnly}>
                  <ImageIcon size={14} />
                  Có ảnh
                </FilterChip>
              </div>

              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <SlidersHorizontal className="text-blue-200" size={15} />
                <select
                  className="bg-transparent text-sm font-black text-white outline-none"
                  onChange={handleSortChange}
                  value={sort}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option className="bg-slate-950 text-white" key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loadError && (
            <ApiErrorAlert
              actionLabel="Thử lại"
              compact
              error={loadError}
              onAction={handleLoadMore}
              surface="store"
              title="Không tải được thêm đánh giá"
            />
          )}

          {visibleReviews.length > 0 ? (
            <div className="grid gap-3">
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="min-h-72"
              eyebrow="Chưa có kết quả"
              framed
              icon={MessageSquareText}
              message="Hãy đổi bộ lọc hoặc là người đầu tiên chia sẻ trải nghiệm của bạn về sản phẩm này."
              size="compact"
              title="Không có đánh giá phù hợp"
            />
          )}

          {(hasMoreLoadedReviews || hasMoreServerReviews) && (
            <div className="flex justify-center pt-2">
              <Button disabled={isLoadingMore} onClick={handleLoadMore} variant="outline">
                <RefreshCw className={cn(isLoadingMore && "animate-spin")} size={16} />
                {isLoadingMore ? "Đang tải..." : "Xem thêm đánh giá"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductReviews;
