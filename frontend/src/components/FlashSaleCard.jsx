import { ShoppingBag, Star } from "lucide-react";
import { flashSaleProduct } from "../data/mockData";
import { formatCurrency } from "../utils/formatters";

function FlashSaleCard() {
  return (
    <aside className="rounded-2xl border border-blue-500/30 bg-[linear-gradient(150deg,rgba(0,91,255,0.24),#07111F_42%,#050B14_100%)] p-5 shadow-2xl shadow-blue-950/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">⚡ FLASH SALE</h2>
          <p className="mt-1 text-sm text-slate-400">Kết thúc sau</p>
        </div>
        <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
          {flashSaleProduct.discount}
        </span>
      </div>

      <div className="mt-4 flex gap-2 text-center text-sm font-black text-white">
        {["02", "15", "30"].map((time, index) => (
          <div className="flex items-center gap-2" key={time}>
            <span className="rounded-xl bg-slate-950 px-3 py-2 ring-1 ring-slate-700">{time}</span>
            {index < 2 && <span className="text-slate-500">:</span>}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-slate-950/70 p-4 ring-1 ring-slate-800">
        <img
          alt={flashSaleProduct.name}
          className="h-48 w-full object-contain"
          src={flashSaleProduct.image}
        />
      </div>

      <h3 className="mt-5 text-lg font-black text-white">{flashSaleProduct.name}</h3>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 text-amber-300">
          <Star size={15} fill="currentColor" />
          <span className="text-sm font-bold">{flashSaleProduct.rating}</span>
        </div>
        <span className="text-xs text-slate-500">({flashSaleProduct.reviews} đánh giá)</span>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-black text-blue-300">{formatCurrency(flashSaleProduct.price)}</p>
        <p className="mt-1 text-sm text-slate-500 line-through">{formatCurrency(flashSaleProduct.oldPrice)}</p>
      </div>

      <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005BFF] text-sm font-black text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-700">
        <ShoppingBag size={18} />
        Mua ngay
      </button>
    </aside>
  );
}

export default FlashSaleCard;
