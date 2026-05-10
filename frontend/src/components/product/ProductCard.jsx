import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2, PackageCheck, ShoppingCart, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../cart";
import { useToast } from "../ui/toast";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import useWishlist from "../../hooks/useWishlist";
import { fadeUp, hoverGlow, hoverLift, imageZoom, tapSoft } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import OptimizedImage from "../common/OptimizedImage";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import IconButton from "../ui/IconButton";
import Price from "../ui/Price";
import Rating from "../ui/Rating";

const MotionArticle = motion.article;
const MotionButton = motion.button;
const MotionImg = motion.img;
const MotionSpan = motion.span;

function getStockBadge(stock = 0) {
  if (stock <= 0) {
    return { label: "Hết hàng", variant: "danger" };
  }

  if (stock <= 10) {
    return { label: `Còn ${stock}`, variant: "warning" };
  }

  return { label: "Còn hàng", variant: "success" };
}

function ProductCard({ product }) {
  const { addItem } = useCart();
  const { addRecentlyViewed } = useRecentlyViewed();
  const toast = useToast();
  const { isWishlistPending, isWishlisted, toggleWishlist } = useWishlist();
  const stockBadge = getStockBadge(product.stock);
  const primaryTag = product.tags?.[0];
  const productIsWishlisted = isWishlisted(product.id);
  const productIsWishlistPending = isWishlistPending(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleWishlistToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const result = await toggleWishlist(product);

    if (!result.ok) {
      toast.showError("Không thể đồng bộ wishlist. Thao tác đã được hoàn tác.", {
        title: "Wishlist chưa cập nhật",
      });
      return;
    }

    toast.showSuccess(result.wishlisted ? "Đã lưu sản phẩm vào wishlist." : "Đã bỏ sản phẩm khỏi wishlist.", {
      duration: 2400,
      title: "Wishlist đã cập nhật",
    });
  };

  const handleProductOpen = () => {
    addRecentlyViewed(product);
  };

  const handleQuickAdd = () => {
    const result = addItem(product);

    if (!result.ok) {
      toast.showWarning("Sản phẩm này đang hết hàng hoặc chưa có tồn kho khả dụng.");
      return;
    }

    toast.showSuccess("Đã thêm sản phẩm vào giỏ hàng.", {
      title: "Giỏ hàng đã cập nhật",
    });
  };

  return (
    <Card as={MotionArticle} className="isolate flex h-full flex-col" variants={{ ...fadeUp, hover: hoverGlow }} variant="product" whileHover="hover">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(0,91,255,0.24),rgba(15,23,42,0.72)_42%,rgba(2,6,23,0.94)_100%)] p-4 shadow-inner shadow-white/[0.04]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_32%,rgba(0,91,255,0.16))] opacity-70" />
        <div className="pointer-events-none absolute inset-x-8 bottom-5 h-12 rounded-full bg-blue-500/20 blur-2xl" />

        {product.discount && (
          <Badge className="absolute left-3 top-3 z-20 gap-1 border border-red-200/40 bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_24px_rgba(239,68,68,0.45)]" variant="danger">
            <Zap size={12} />
            {product.discount}
          </Badge>
        )}

        <IconButton
          aria-label={productIsWishlisted ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          aria-pressed={productIsWishlisted}
          className={cn(
            "absolute right-3 top-3 z-20 border-white/15 bg-slate-950/55 text-slate-200 hover:border-blue-200/70 hover:bg-blue-500/20 hover:text-white disabled:pointer-events-none disabled:opacity-70",
            productIsWishlisted && "border-red-200/50 bg-red-500/18 text-red-100 shadow-[0_0_24px_rgba(239,68,68,0.24)]",
          )}
          disabled={productIsWishlistPending}
          onClick={handleWishlistToggle}
          size="sm"
          title={productIsWishlisted ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          variant="outline"
        >
          {productIsWishlistPending ? (
            <Loader2 className="animate-spin" size={17} />
          ) : (
            <MotionSpan
              animate={productIsWishlisted ? { rotate: [0, -8, 0], scale: [1, 1.24, 1] } : { rotate: 0, scale: 1 }}
              className="relative flex"
              key={productIsWishlisted ? "wishlisted" : "wishlist"}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              {productIsWishlisted && <span className="absolute inset-0 rounded-full bg-red-400/30 blur-sm" />}
              <Heart className="relative z-10" fill={productIsWishlisted ? "currentColor" : "none"} size={17} />
            </MotionSpan>
          )}
        </IconButton>

        <Link className="relative z-10 flex h-full w-full items-center justify-center" onClick={handleProductOpen} to={`/products/${product.slug}`}>
          <OptimizedImage
            as={MotionImg}
            alt={product.name}
            className="premium-transition h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.42)] group-hover:drop-shadow-[0_26px_52px_rgba(0,91,255,0.28)]"
            sizes="(max-width: 640px) 46vw, (max-width: 1280px) 30vw, 280px"
            src={product.image}
            variants={{ hover: imageZoom }}
          />
        </Link>

        <Badge className="absolute bottom-3 left-3 z-20 gap-1 border border-white/10 bg-slate-950/60 shadow-[0_0_18px_rgba(0,91,255,0.16)] backdrop-blur-xl" variant={stockBadge.variant}>
          <PackageCheck size={12} />
          {stockBadge.label}
        </Badge>

        {primaryTag && (
          <span className="absolute bottom-3 right-3 z-20 hidden rounded-full border border-blue-200/20 bg-blue-500/15 px-2.5 py-1 text-xs font-black text-blue-100 shadow-[0_0_18px_rgba(0,91,255,0.16)] backdrop-blur-xl sm:inline-flex">
            {primaryTag}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-4 flex flex-1 flex-col">
        <p className="text-caption text-blue-200">{product.brand}</p>
        <h3 className="text-card-title mt-1 min-h-[48px]">
          <Link className="transition-default hover:text-blue-100" onClick={handleProductOpen} to={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/35 px-2.5 py-2 shadow-inner shadow-white/[0.03] sm:px-3">
          <Rating reviews={product.reviews} value={product.rating} />
        </div>

        <div className="mt-4 rounded-2xl border border-blue-200/10 bg-white/[0.035] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-3">
          <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
            <Price className="min-w-0" oldClassName="text-xs text-slate-500" oldValue={product.oldPrice} value={product.price} />
            <span className="mb-1 hidden shrink-0 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-black text-blue-100 ring-1 ring-blue-200/20 sm:inline-flex">Deal</span>
          </div>

          <MotionButton
            aria-label="Thêm nhanh vào giỏ hàng"
            className={cn(
              "transition-default mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-black text-white shadow-[0_0_26px_rgba(0,91,255,0.42)] outline-none hover:bg-primary-hover hover:shadow-[0_0_38px_rgba(0,91,255,0.62)] focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              isOutOfStock && "cursor-not-allowed bg-slate-700 text-slate-400 shadow-none hover:bg-slate-700 hover:shadow-none",
            )}
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            type="button"
            whileHover={isOutOfStock ? undefined : hoverLift}
            whileTap={isOutOfStock ? undefined : tapSoft}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">{isOutOfStock ? "Hết hàng" : "Thêm nhanh"}</span>
            <span className="sm:hidden">{isOutOfStock ? "Hết" : "Thêm"}</span>
          </MotionButton>
        </div>
      </div>
    </Card>
  );
}

export default memo(ProductCard);
