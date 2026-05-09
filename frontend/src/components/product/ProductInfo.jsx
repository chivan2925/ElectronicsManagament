import { motion } from "framer-motion";
import {
  BadgePercent,
  CheckCircle2,
  CreditCard,
  Heart,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { hoverLift, tapSoft } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Rating from "../ui/Rating";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";

const MotionDiv = motion.div;

const stockTone = {
  ready: "success",
  low: "warning",
  out: "danger",
};

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
  const isOutOfStock = maxQuantity <= 0;

  return (
    <section className="store-glass rounded-3xl p-4 sm:p-5 lg:sticky lg:top-28">
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

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
          >
            <Zap size={19} fill="currentColor" />
            Mua ngay
          </Button>
        </MotionDiv>

        <IconButton
          aria-label="Thêm vào yêu thích"
          className="h-12 w-full rounded-2xl border-white/10 bg-white/[0.05] text-white hover:border-blue-300/70 hover:bg-blue-500/10 sm:w-12"
          variant="outline"
        >
          <Heart size={20} />
        </IconButton>
      </div>

      <div className="mt-5 grid gap-3">
        {detail.shippingInfo.map((item, index) => {
          const Icon = index === 0 ? Truck : index === 1 ? ShieldCheck : CheckCircle2;

          return (
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3" key={item}>
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
