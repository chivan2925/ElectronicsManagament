import { ShoppingBag, Star } from "lucide-react";
import { flashSaleProduct } from "../data/mockData";
import { formatCurrency } from "../utils/formatters";

function FlashSaleCard() {
  return (
    <aside className="premium-transition rounded-2xl border border-blue-400/30 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.32),transparent_42%),linear-gradient(150deg,rgba(0,91,255,0.24),#07111F_42%,#050B14_100%)] p-5 shadow-[0_0_42px_rgba(0,91,255,0.2),0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:border-blue-300/60 hover:shadow-[0_0_56px_rgba(0,91,255,0.28),0_28px_80px_rgba(0,0,0,0.38)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white drop-shadow-[0_0_24px_rgba(0,91,255,0.3)]">⚡ FLASH SALE</h2>
          <p className="mt-1 text-sm font-medium text-slate-400">Kết thúc sau</p>
        </div>
        <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white shadow-[0_0_18px_rgba(239,68,68,0.6)]">
          {flashSaleProduct.discount}
        </span>
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
          alt={flashSaleProduct.name}
          className="premium-transition h-48 w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)] hover:scale-110 hover:drop-shadow-[0_24px_48px_rgba(0,91,255,0.28)]"
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

      <button className="premium-transition mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#005BFF] text-sm font-black text-white shadow-[0_0_28px_rgba(0,91,255,0.42)] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_0_42px_rgba(0,91,255,0.68)] active:translate-y-0">
        <ShoppingBag size={18} />
        Mua ngay
      </button>
    </aside>
  );
}

export default FlashSaleCard;
