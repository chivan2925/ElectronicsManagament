import { ArrowRight } from "lucide-react";

function PromoCard({ promo }) {
  return (
    <article className={`group overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${promo.gradient} p-4 shadow-xl shadow-black/20`}>
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-white">{promo.title}</h3>
          <p className="mt-1 text-sm font-semibold text-blue-100">{promo.discount}</p>
          <a className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-white transition group-hover:text-blue-200" href="/">
            Mua ngay
            <ArrowRight size={16} />
          </a>
        </div>
        <img alt={promo.title} className="h-24 w-28 rounded-xl object-cover ring-1 ring-white/10" src={promo.image} />
      </div>
    </article>
  );
}

export default PromoCard;
