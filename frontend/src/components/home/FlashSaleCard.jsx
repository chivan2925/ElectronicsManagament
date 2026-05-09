import { ShoppingBag } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Price from "../ui/Price";
import Rating from "../ui/Rating";

function FlashSaleCard({ product }) {
  if (!product) {
    return null;
  }

  return (
    <Card as="aside" variant="flash">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white drop-shadow-[0_0_24px_rgba(0,91,255,0.3)]">⚡ FLASH SALE</h2>
          <p className="mt-1 text-sm font-medium text-slate-400">Kết thúc sau</p>
        </div>
        <Badge size="md" variant="danger">{product.discount}</Badge>
      </div>

      <div className="mt-4 flex gap-2 text-center text-sm font-black text-white">
        {["02", "15", "30"].map((time, index) => (
          <div className="flex items-center gap-2" key={time}>
            <span className="rounded-xl bg-slate-950/80 px-3 py-2 shadow-inner shadow-white/[0.03] ring-1 ring-blue-300/20">{time}</span>
            {index < 2 && <span className="text-slate-500">:</span>}
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_30%,rgba(0,91,255,0.18),rgba(2,6,23,0.86)_58%)] p-4 ring-1 ring-white/10">
        <img
          alt={product.name}
          className="premium-transition h-48 w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)] hover:scale-110 hover:drop-shadow-[0_24px_48px_rgba(0,91,255,0.28)]"
          src={product.image}
        />
      </div>

      <h3 className="mt-5 text-lg font-black text-white">{product.name}</h3>
      <Rating className="mt-3" reviews={product.reviews} value={product.rating} />

      <Price className="mt-4" oldValue={product.oldPrice} size="lg" value={product.price} />

      <Button className="mt-5 h-12" fullWidth size="lg">
        <ShoppingBag size={18} />
        Mua ngay
      </Button>
    </Card>
  );
}

export default FlashSaleCard;
