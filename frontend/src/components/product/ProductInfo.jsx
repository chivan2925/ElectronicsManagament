import { motion } from "framer-motion";
import {
  BadgePercent,
  CheckCircle2,
  CreditCard,
  Heart,
  Loader2,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../cart";
import useWishlist from "../../hooks/useWishlist";
import { hoverLift, tapSoft } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Rating from "../ui/Rating";
import { useToast } from "../ui/toast";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const stockTone = {
  ready: "success",
  low: "warning",
  out: "danger",
};

function getSelectedCartVariant(product, selectedOptions) {
  const variants = product.variants || [];
  const selectedVariantId = selectedOptions?.variant;

  return variants.find((variant) => String(variant.id) === String(selectedVariantId)) ?? variants[0] ?? null;
}

function ProductInfo({
  detail,
  finalOldPrice,
  finalPrice,
  maxQuantity,
  onQuantityChange,
  onVariantSelect,
  product,
  quantity,
  selectedOptions,
  variantGroups,
}) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const { isWishlistPending, isWishlisted, toggleWishlist } = useWishlist();
  const isOutOfStock = maxQuantity <= 0;
  const productIsWishlisted = isWishlisted(product.id);
  const productIsWishlistPending = isWishlistPending(product.id);
  const selectedCartVariant = getSelectedCartVariant(product, selectedOptions);

  const handleAddToCart = () => {
    const result = addItem(product, {
      quantity,
      variant: selectedCartVariant,
    });

    if (!result.ok) {
      toast.showWarning("Biến thể này đang hết hàng hoặc chưa có tồn kho khả dụng.");
      return false;
    }

    toast.showSuccess("Đã thêm sản phẩm vào giỏ hàng.", {
      title: "Giỏ hàng đã cập nhật",
    });
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      navigate("/checkout");
    }
  };

  const handleWishlistToggle = async () => {
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

  return (
    <section className="store-premium-sheen store-glass rounded-3xl p-4 sm:p-5 lg:sticky lg:top-28">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="gap-2" variant="primary">
          <Zap size={13} />
          {product.brand}
        </Badge>
        <Badge variant={stockTone[detail.stockInfo.status] || "soft"}>{detail.stockInfo.label}</Badge>
      </div>

      <h1 className="text-heading mt-4 text-3xl sm:text-4xl lg:text-[2.45rem]">{product.name}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-slate-400">
        <Rating reviews={product.reviews} size="md" value={product.rating} />
        <span className="h-4 w-px bg-white/10" />
        <span>Đã bán {product.sold}</span>
        <span className="h-4 w-px bg-white/10" />
        <span>Mã {product.id}</span>
      </div>

      <div className="mt-5 rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_20%_0%,rgba(0,91,255,0.24),transparent_42%),linear-gradient(135deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-4 shadow-inner shadow-white/[0.04]">
        <div className="flex flex-wrap items-end gap-3">
          <p className="text-price text-3xl sm:text-4xl">{formatCurrency(finalPrice)}</p>
          {finalOldPrice && (
            <p className="mb-1 text-sm font-bold text-slate-500 line-through">{formatCurrency(finalOldPrice)}</p>
          )}
          {product.discount && (
            <Badge className="mb-1 gap-1 border border-red-200/40 bg-gradient-to-r from-red-500 to-rose-500" variant="danger">
              <BadgePercent size={13} />
              {product.discount}
            </Badge>
          )}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-start gap-2">
              <CreditCard className="mt-0.5 shrink-0 text-blue-200" size={18} />
              <p className="text-caption text-slate-300">{detail.installment}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-start gap-2">
              <PackageCheck className="mt-0.5 shrink-0 text-emerald-200" size={18} />
              <p className="text-caption text-slate-300">{detail.stockInfo.warehouse}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-start gap-2">
              <LockKeyhole className="mt-0.5 shrink-0 text-cyan-200" size={18} />
              <p className="text-caption text-slate-300">Thanh toán được xác minh trước khi cập nhật trạng thái.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <VariantSelector groups={variantGroups} onSelect={onVariantSelect} selectedOptions={selectedOptions} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-black text-white">Số lượng</p>
          <p className="text-caption text-slate-400">Tồn kho theo biến thể</p>
        </div>
        <QuantitySelector max={maxQuantity} onChange={onQuantityChange} value={quantity} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <MotionDiv whileHover={isOutOfStock ? undefined : hoverLift} whileTap={isOutOfStock ? undefined : tapSoft}>
          <Button
            className={cn("h-12 rounded-2xl", isOutOfStock && "pointer-events-none opacity-50")}
            disabled={isOutOfStock}
            fullWidth
            onClick={handleAddToCart}
          >
            <ShoppingCart size={19} />
            Thêm vào giỏ
          </Button>
        </MotionDiv>

        <MotionDiv whileHover={isOutOfStock ? undefined : hoverLift} whileTap={isOutOfStock ? undefined : tapSoft}>
          <Button
            className={cn(
              "h-12 rounded-2xl border-amber-300/40 bg-amber-400/95 text-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.38)] hover:bg-amber-300 hover:shadow-[0_0_42px_rgba(251,191,36,0.55)]",
              isOutOfStock && "pointer-events-none opacity-50",
            )}
            disabled={isOutOfStock}
            fullWidth
            onClick={handleBuyNow}
          >
            <Zap size={19} fill="currentColor" />
            Mua ngay
          </Button>
        </MotionDiv>

        <IconButton
          aria-label={productIsWishlisted ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          aria-pressed={productIsWishlisted}
          className={cn(
            "h-12 w-full gap-2 rounded-2xl border-white/10 bg-white/[0.05] px-4 text-white hover:border-blue-300/70 hover:bg-blue-500/10 sm:w-12 sm:gap-0 sm:px-0",
            productIsWishlisted && "border-red-200/50 bg-red-500/15 text-red-100 shadow-[0_0_26px_rgba(239,68,68,0.2)]",
            productIsWishlistPending && "pointer-events-none opacity-70",
          )}
          disabled={productIsWishlistPending}
          onClick={handleWishlistToggle}
          variant="outline"
        >
          {productIsWishlistPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <MotionSpan
              animate={productIsWishlisted ? { rotate: [0, -8, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
              className="relative flex"
              key={productIsWishlisted ? "wishlisted" : "wishlist"}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              {productIsWishlisted && <span className="absolute inset-0 rounded-full bg-red-400/30 blur-sm" />}
              <Heart className="relative z-10" fill={productIsWishlisted ? "currentColor" : "none"} size={20} />
            </MotionSpan>
          )}
          <span className="text-sm font-black sm:hidden">Yêu thích</span>
        </IconButton>
      </div>

      <div className="mt-5 grid gap-3">
        {detail.shippingInfo.map((item, index) => {
          const Icon = index === 0 ? Truck : index === 1 ? ShieldCheck : CheckCircle2;

          return (
            <div className="store-action-card flex items-start gap-3 rounded-2xl p-3" key={item}>
              <Icon className="mt-0.5 shrink-0 text-blue-200" size={18} />
              <p className="text-caption text-slate-300">{item}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProductInfo;
