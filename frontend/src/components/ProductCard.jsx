import { ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

function ProductCard({ product }) {
  return (
    <article className="premium-transition group relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.12),transparent_42%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(7,17,31,0.96))] p-4 shadow-xl shadow-black/20 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(130deg,rgba(255,255,255,0.08),transparent_28%,transparent_70%,rgba(0,91,255,0.1))] before:opacity-0 before:transition-opacity before:duration-300 hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-[0_0_36px_rgba(0,91,255,0.24),0_24px_70px_rgba(0,0,0,0.35)] hover:before:opacity-100">
      {product.discount && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-black text-white shadow-[0_0_18px_rgba(239,68,68,0.55)]">
          {product.discount}
        </span>
      )}

      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_30%,rgba(0,91,255,0.16),rgba(2,6,23,0.86)_54%)] p-3 ring-1 ring-white/10">
        <img alt={product.name} className="premium-transition h-full w-full object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:drop-shadow-[0_24px_44px_rgba(0,91,255,0.24)]" src={product.image} />
      </div>

      <div className="relative z-10 mt-4">
        <h3 className="min-h-[44px] text-sm font-black leading-snug text-white md:text-base">{product.name}</h3>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-amber-300">
            <Star size={15} fill="currentColor" />
            <span className="font-bold">{product.rating}</span>
          </div>
          <span className="text-xs text-slate-500">({product.reviews} đánh giá)</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-black text-blue-300">{formatCurrency(product.price)}</p>
            {product.oldPrice && (
              <p className="mt-1 text-sm text-slate-500 line-through">{formatCurrency(product.oldPrice)}</p>
            )}
          </div>
          <button
            className="premium-transition flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#005BFF] text-white shadow-[0_0_24px_rgba(0,91,255,0.36)] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_0_36px_rgba(0,91,255,0.65)] active:translate-y-0"
            type="button"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
