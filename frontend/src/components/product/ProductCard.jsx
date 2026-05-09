import { motion } from "framer-motion";
import { Heart, PackageCheck, ShoppingCart, Zap } from "lucide-react";
import { fadeUp, hoverGlow, hoverLift, imageZoom, tapSoft } from "../../styles/animations";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import IconButton from "../ui/IconButton";
import Price from "../ui/Price";
import Rating from "../ui/Rating";

const MotionArticle = motion.article;
const MotionButton = motion.button;
const MotionImg = motion.img;

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
  const stockBadge = getStockBadge(product.stock);
  const primaryTag = product.tags?.[0];

  return (
    <Card as={MotionArticle} className="isolate h-full" variants={{ ...fadeUp, hover: hoverGlow }} variant="product" whileHover="hover">
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
          aria-label="Thêm vào yêu thích"
          className="absolute right-3 top-3 z-20 border-white/15 bg-slate-950/55 text-slate-200 hover:border-blue-200/70 hover:bg-blue-500/20 hover:text-white"
          size="sm"
          title="Thêm vào yêu thích"
          variant="outline"
        >
          <Heart size={17} />
        </IconButton>

        <MotionImg
          alt={product.name}
          className="premium-transition relative z-10 h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.42)] group-hover:drop-shadow-[0_26px_52px_rgba(0,91,255,0.28)]"
          src={product.image}
          variants={{ hover: imageZoom }}
        />

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
        <h3 className="text-card-title mt-1 min-h-[48px]">{product.name}</h3>

        <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2 shadow-inner shadow-white/[0.03]">
          <Rating reviews={product.reviews} value={product.rating} />
        </div>

        <div className="mt-4 rounded-2xl border border-blue-200/10 bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-end justify-between gap-3">
            <Price oldClassName="text-xs text-slate-500" oldValue={product.oldPrice} value={product.price} />
            <span className="mb-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-black text-blue-100 ring-1 ring-blue-200/20">Deal</span>
          </div>

          <MotionButton
            aria-label="Thêm nhanh vào giỏ hàng"
            className="transition-default mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-black text-white shadow-[0_0_26px_rgba(0,91,255,0.42)] outline-none hover:bg-primary-hover hover:shadow-[0_0_38px_rgba(0,91,255,0.62)] focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            type="button"
            whileHover={hoverLift}
            whileTap={tapSoft}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Thêm nhanh</span>
            <span className="sm:hidden">Thêm</span>
          </MotionButton>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
