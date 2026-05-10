import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  Loader2,
  PackageSearch,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  WifiOff,
} from "lucide-react";
import { useCart } from "../../cart";
import OptimizedImage from "../../components/common/OptimizedImage";
import RecentlyViewedSection from "../../components/product/RecentlyViewedSection";
import ProductGridSkeleton from "../../components/skeletons/ProductGridSkeleton";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import EmptyState from "../../components/ui/feedback/EmptyState";
import Price from "../../components/ui/Price";
import Rating from "../../components/ui/Rating";
import { useToast } from "../../components/ui/toast";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import useWishlist from "../../hooks/useWishlist";
import { fadeUp, motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";

const MotionDiv = motion.div;

function EmptyWishlistState() {
  return (
    <EmptyState
      actionIcon={ChevronRight}
      actionLabel="Khám phá sản phẩm"
      actionTo="/products"
      className="min-h-[420px]"
      eyebrow="Wishlist trống"
      icon={PackageSearch}
      message="Bấm biểu tượng trái tim trên product card để lưu laptop, tai nghe, chuột hoặc linh kiện bạn muốn quay lại xem."
      title="Chưa có sản phẩm yêu thích"
    />
  );
}

function WishlistLoadingGrid() {
  return <ProductGridSkeleton count={6} label="Đang tải wishlist" />;
}

function SyncStatusBadge({ isHydrating, isSyncing, lastSyncedAt, syncMode }) {
  const isBusy = isHydrating || isSyncing;
  const config = {
    local: {
      Icon: ShieldCheck,
      label: "Lưu cục bộ",
      text: "Local persistence",
    },
    offline: {
      Icon: WifiOff,
      label: "Chưa đồng bộ",
      text: "Đang dùng bản lưu cục bộ",
    },
    remote: {
      Icon: CheckCircle2,
      label: "Đã đồng bộ",
      text: lastSyncedAt ? "Theo tài khoản" : "Backend wishlist",
    },
  }[syncMode] ?? {
    Icon: ShieldCheck,
    label: "Lưu cục bộ",
    text: "Local persistence",
  };
  const Icon = isBusy ? Loader2 : config.Icon;

  return (
    <div className="store-stat-card rounded-2xl p-3">
      <Icon
        className={cn(
          "mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]",
          isBusy && "animate-spin",
        )}
        size={20}
      />
      <p className="text-sm font-black text-white">{isBusy ? "Đang đồng bộ" : config.label}</p>
      <p className="text-caption mt-1 text-slate-400">{config.text}</p>
    </div>
  );
}

function WishlistItemCard({ isPending, item, onMoveToCart, onRemove }) {
  const product = item.product;

  if (!product) {
    return (
      <MotionDiv
        className="rounded-3xl border border-amber-300/20 bg-amber-500/[0.06] p-4 shadow-inner shadow-white/[0.03]"
        variants={fadeUp}
      >
        <AlertTriangle className="text-amber-200" size={24} />
        <p className="mt-3 font-black text-white">Sản phẩm chưa có dữ liệu hiển thị</p>
        <p className="text-caption mt-1 text-slate-400">Wishlist vẫn giữ ID sản phẩm và sẽ hiển thị khi backend trả snapshot đầy đủ.</p>
        <Button className="mt-4 rounded-2xl" disabled={isPending} onClick={() => onRemove(item)} variant="outline">
          {isPending ? <Loader2 className="animate-spin" size={17} /> : <Trash2 size={17} />}
          Xóa khỏi wishlist
        </Button>
      </MotionDiv>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <MotionDiv
      className="group rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl transition-default hover:border-blue-300/40 hover:bg-blue-500/[0.06] sm:p-4"
      variants={fadeUp}
    >
      <div className="grid gap-4 lg:grid-cols-[148px_minmax(0,1fr)_220px] lg:items-center">
        <Link
          className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.24),rgba(15,23,42,0.78)_48%,rgba(2,6,23,0.96)_100%)] p-3"
          to={`/products/${product.slug}`}
        >
          <div className="pointer-events-none absolute inset-x-6 bottom-4 h-10 rounded-full bg-blue-500/20 blur-2xl" />
          <OptimizedImage
            alt={product.name}
            className="premium-transition relative z-10 h-full w-full object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.44)] group-hover:scale-105"
            fallbackKind="product"
            placeholderClassName="rounded-xl bg-slate-950/70"
            sizes="148px"
            src={product.image}
            wrapperClassName="relative z-10 flex h-full w-full items-center justify-center rounded-xl"
          />
        </Link>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-1" variant="primary">
              <Heart fill="currentColor" size={12} />
              Đã lưu
            </Badge>
            <Badge variant={isOutOfStock ? "danger" : product.stock <= 10 ? "warning" : "success"}>
              {isOutOfStock ? "Hết hàng" : product.stock <= 10 ? `Còn ${product.stock}` : "Còn hàng"}
            </Badge>
          </div>

          <p className="text-caption mt-4 text-blue-200">{product.brand}</p>
          <Link className="mt-1 line-clamp-2 text-lg font-black leading-snug text-white hover:text-blue-100" to={`/products/${product.slug}`}>
            {product.name}
          </Link>

          <div className="mt-3 max-w-sm rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2">
            <Rating reviews={product.reviews} value={product.rating} />
          </div>

          <div className="mt-4">
            <Price oldClassName="text-xs text-slate-500" oldValue={product.oldPrice} value={product.price} />
          </div>
        </div>

        <div className="grid gap-2">
          <Button
            className="h-11 rounded-2xl"
            disabled={isPending || isOutOfStock}
            fullWidth
            onClick={() => onMoveToCart(item)}
          >
            {isPending ? <Loader2 className="animate-spin" size={17} /> : <ArrowRightLeft size={17} />}
            {isOutOfStock ? "Hết hàng" : "Chuyển vào giỏ"}
          </Button>
          <Button
            className="h-11 rounded-2xl border-red-300/25 text-red-100 hover:border-red-300/50 hover:bg-red-500/10 hover:shadow-[0_0_28px_rgba(239,68,68,0.18)]"
            disabled={isPending}
            fullWidth
            onClick={() => onRemove(item)}
            variant="outline"
          >
            {isPending ? <Loader2 className="animate-spin" size={17} /> : <Trash2 size={17} />}
            Xóa khỏi wishlist
          </Button>
        </div>
      </div>
    </MotionDiv>
  );
}

function WishlistGrid({ isWishlistPending, items, onMoveToCart, onRemove }) {
  return (
    <MotionDiv
      animate="visible"
      className="grid gap-4"
      initial="hidden"
      variants={staggerContainer}
      viewport={motionViewport}
    >
      {items.map((item) => (
        <WishlistItemCard
          isPending={isWishlistPending(item)}
          item={item}
          key={item.productId}
          onMoveToCart={onMoveToCart}
          onRemove={onRemove}
        />
      ))}
    </MotionDiv>
  );
}

function WishlistPage() {
  const { addItem } = useCart();
  const toast = useToast();
  const {
    clearWishlist,
    error,
    isHydrating,
    isSyncing,
    isWishlistPending,
    lastSyncedAt,
    refreshWishlist,
    removeFromWishlist,
    syncMode,
    wishlistCount,
    wishlistItems,
  } = useWishlist();
  const { recentlyViewedCount } = useRecentlyViewed();

  const handleMoveToCart = async (item) => {
    const product = item.product;

    if (!product) {
      toast.showWarning("Wishlist item này chưa có dữ liệu sản phẩm đầy đủ.");
      return;
    }

    const cartResult = await addItem(product);

    if (!cartResult.ok) {
      toast.showWarning("Sản phẩm này đang hết hàng hoặc chưa có tồn kho khả dụng.");
      return;
    }

    const removeResult = await removeFromWishlist(item);

    if (!removeResult.ok) {
      toast.showError("Đã thêm vào giỏ hàng nhưng chưa xóa được khỏi wishlist.", {
        title: "Wishlist chưa đồng bộ",
      });
      return;
    }

    toast.showSuccess("Đã chuyển sản phẩm vào giỏ hàng.", {
      title: "Giỏ hàng đã cập nhật",
    });
  };

  const handleRemove = async (item) => {
    const result = await removeFromWishlist(item);

    if (!result.ok) {
      toast.showError("Không thể xóa sản phẩm khỏi wishlist. Thao tác đã được hoàn tác.", {
        title: "Wishlist chưa cập nhật",
      });
      return;
    }

    toast.showSuccess("Đã xóa sản phẩm khỏi wishlist.", {
      duration: 2400,
      title: "Wishlist đã cập nhật",
    });
  };

  const handleClearWishlist = async () => {
    const result = await clearWishlist();

    if (!result.ok) {
      toast.showError("Không thể xóa toàn bộ wishlist. Thao tác đã được hoàn tác.", {
        title: "Wishlist chưa cập nhật",
      });
      return;
    }

    toast.showSuccess("Đã xóa toàn bộ wishlist.", {
      title: "Wishlist đã cập nhật",
    });
  };

  const handleRefreshWishlist = async () => {
    const result = await refreshWishlist();

    if (!result.ok) {
      toast.showError("Chưa thể đồng bộ wishlist với backend.", {
        title: "Wishlist đang lưu cục bộ",
      });
      return;
    }

    toast.showSuccess(result.syncMode === "remote" ? "Wishlist đã được đồng bộ." : "Wishlist đang lưu cục bộ.", {
      duration: 2600,
      title: "Wishlist đã cập nhật",
    });
  };

  return (
    <>
      <Container as="main" className="pb-16 pt-6 sm:pt-8" id="main-content" tabIndex={-1}>
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
          <Link className="premium-transition hover:text-white" to="/">
            Trang chủ
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">Yêu thích</span>
        </nav>

        <section className="store-hero-panel p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <Heart size={13} fill="currentColor" />
                Saved gear
              </Badge>
              <h1 className="text-heading max-w-3xl">Danh sách yêu thích</h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                Lưu nhanh sản phẩm đang cân nhắc, đồng bộ theo tài khoản khi backend wishlist sẵn sàng và chuyển sang giỏ hàng khi muốn mua.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="store-stat-card rounded-2xl p-3">
                <Heart className="mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]" fill="currentColor" size={20} />
                <p className="text-sm font-black text-white">{wishlistCount} sản phẩm</p>
                <p className="text-caption mt-1 text-slate-400">Đang yêu thích</p>
              </div>
              <div className="store-stat-card rounded-2xl p-3">
                <Clock3 className="mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]" size={20} />
                <p className="text-sm font-black text-white">{recentlyViewedCount} đã xem</p>
                <p className="text-caption mt-1 text-slate-400">Lưu trên trình duyệt</p>
              </div>
              <SyncStatusBadge
                isHydrating={isHydrating}
                isSyncing={isSyncing}
                lastSyncedAt={lastSyncedAt}
                syncMode={syncMode}
              />
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-6">
          {error && (
            <ApiErrorAlert
              actionLabel="Thử đồng bộ lại"
              error={error}
              onAction={handleRefreshWishlist}
              surface="store"
              title="Wishlist đang dùng bản lưu cục bộ"
            />
          )}

          <section className="store-surface-panel rounded-3xl p-4 sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="mb-4 gap-2" variant="primary">
                  <Sparkles size={13} />
                  Saved products
                </Badge>
                <h2 className="text-section">Sản phẩm đã lưu</h2>
                <p className="text-muted mt-2 text-sm">Trạng thái trái tim, số lượng wishlist và trang này cập nhật tức thì bằng optimistic UI.</p>
              </div>

              {wishlistItems.length > 0 && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="rounded-2xl" disabled={isHydrating || isSyncing} onClick={handleRefreshWishlist} variant="outline">
                    {isHydrating || isSyncing ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
                    Đồng bộ
                  </Button>
                  <Button as={Link} className="rounded-2xl" to="/products" variant="outline">
                    <ShoppingBag size={17} />
                    Mua thêm
                  </Button>
                  <Button className="rounded-2xl" disabled={isSyncing} onClick={handleClearWishlist} variant="outline">
                    {isSyncing ? <Loader2 className="animate-spin" size={17} /> : <Trash2 size={17} />}
                    Xóa tất cả
                  </Button>
                </div>
              )}
            </div>

            {isHydrating && !wishlistItems.length ? (
              <WishlistLoadingGrid />
            ) : wishlistItems.length ? (
              <WishlistGrid
                isWishlistPending={isWishlistPending}
                items={wishlistItems}
                onMoveToCart={handleMoveToCart}
                onRemove={handleRemove}
              />
            ) : (
              <EmptyWishlistState />
            )}
          </section>

          <RecentlyViewedSection />
        </div>
      </Container>
    </>
  );
}

export default WishlistPage;
