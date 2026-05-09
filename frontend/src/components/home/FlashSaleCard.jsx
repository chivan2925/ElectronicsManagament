import { motion } from "framer-motion";
import { Heart, PackageCheck, ShoppingBag, Zap } from "lucide-react";
import { fadeUp, hoverGlow, hoverLift, imageZoom, motionViewport, tapSoft } from "../../styles/animations";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import IconButton from "../ui/IconButton";
import Price from "../ui/Price";
import Rating from "../ui/Rating";

function getStockBadge(stock = 0) {
  if (stock <= 0) {
    return { label: "Hết hàng", variant: "danger" };
  }

  if (stock <= 10) {
    return { label: `Còn ${stock}`, variant: "warning" };
  }

  return { label: "Còn hàng", variant: "success" };
}

function FlashSaleCard({ product }) {
  if (!product) {
    return null;
  }

  const stockBadge = getStockBadge(product.stock);
  const primaryTag = product.tags?.[0];

  return (
    <Card
      as={motion.aside}
      initial="hidden"
      variants={{ ...fadeUp, hover: hoverGlow }}
      variant="flash"
      viewport={motionViewport}
      whileHover="hover"
      whileInView="visible"
    >
      <div className="flex-between gap-3">
        <div>
          <h2 className="text-section drop-shadow-[0_0_24px_rgba(0,91,255,0.3)]">⚡ FLASH SALE</h2>
          <p className="text-muted mt-1 text-sm">Kết thúc sau</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="gap-1 border border-red-200/40 bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_24px_rgba(239,68,68,0.42)]" size="md" variant="danger">
            <Zap size={13} />
            {product.discount}
          </Badge>
          <IconButton
            aria-label="Thêm flash sale vào yêu thích"
            className="border-white/15 bg-slate-950/45 text-slate-200 hover:border-blue-200/70 hover:bg-blue-500/20 hover:text-white"
            size="sm"
            title="Thêm vào yêu thích"
            variant="outline"
          >
            <Heart size={17} />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 flex gap-2 text-center text-sm font-black text-white">
        {["02", "15", "30"].map((time, index) => (
          <div className="flex items-center gap-2" key={time}>
            <span className="rounded-xl bg-slate-950/80 px-3 py-2 shadow-inner shadow-white/[0.03] ring-1 ring-blue-300/20">{time}</span>
            {index < 2 && <span className="text-slate-500">:</span>}
          </div>
        ))}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_22%,rgba(0,91,255,0.28),rgba(15,23,42,0.76)_46%,rgba(2,6,23,0.94)_100%)] p-4 shadow-inner shadow-white/[0.04]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),transparent_36%,rgba(0,91,255,0.16))] opacity-70" />
        <div className="pointer-events-none absolute inset-x-8 bottom-5 h-12 rounded-full bg-blue-500/20 blur-2xl" />
        <motion.img
          alt={product.name}
          className="premium-transition relative z-10 h-48 w-full object-contain drop-shadow-[0_22px_44px_rgba(0,0,0,0.42)] hover:drop-shadow-[0_28px_56px_rgba(0,91,255,0.3)]"
          src={product.image}
          variants={{ hover: imageZoom }}
        />

        <Badge className="absolute bottom-3 left-3 z-20 gap-1 border border-white/10 bg-slate-950/60 shadow-[0_0_18px_rgba(0,91,255,0.16)] backdrop-blur-xl" variant={stockBadge.variant}>
          <PackageCheck size={12} />
          {stockBadge.label}
        </Badge>

        {primaryTag && (
          <span className="absolute bottom-3 right-3 z-20 rounded-full border border-blue-200/20 bg-blue-500/15 px-2.5 py-1 text-xs font-black text-blue-100 shadow-[0_0_18px_rgba(0,91,255,0.16)] backdrop-blur-xl">
            {primaryTag}
          </span>
        )}
      </div>

      <h3 className="text-card-title mt-5">{product.name}</h3>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2 shadow-inner shadow-white/[0.03]">
        <Rating reviews={product.reviews} value={product.rating} />
      </div>

      <Price className="mt-4" oldValue={product.oldPrice} size="lg" value={product.price} />

      <motion.div className="mt-5" whileHover={hoverLift} whileTap={tapSoft}>
        <Button className="h-12 shadow-[0_0_34px_rgba(0,91,255,0.46)]" fullWidth size="lg">
          <ShoppingBag size={18} />
          Chốt deal ngay
        </Button>
      </motion.div>
    </Card>
  );
}

export default FlashSaleCard;
