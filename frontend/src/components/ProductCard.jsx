import { ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

function ProductCard({ product }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-[#07111F] p-4 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-blue-500/70">
      {product.discount && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-black text-white">
          {product.discount}
        </span>
      )}

      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-slate-950/70 p-3 ring-1 ring-slate-800">
        <img alt={product.name} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" src={product.image} />
      </div>

      <div className="mt-4">
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#005BFF] text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-700"
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
