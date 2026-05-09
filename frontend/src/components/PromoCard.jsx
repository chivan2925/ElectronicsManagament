import { ArrowRight } from "lucide-react";

function PromoCard({ promo }) {
  return (
    <article className={`premium-transition group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${promo.gradient} p-4 shadow-xl shadow-black/20 backdrop-blur-xl hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-[0_0_34px_rgba(0,91,255,0.22)]`}>
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-white">{promo.title}</h3>
          <p className="mt-1 text-sm font-semibold text-blue-100">{promo.discount}</p>
          <a className="premium-transition mt-4 inline-flex items-center gap-1 text-sm font-bold text-white group-hover:text-blue-200" href="/">
            Mua ngay
            <ArrowRight className="premium-transition group-hover:translate-x-1" size={16} />
          </a>
        </div>
        <img alt={promo.title} className="premium-transition h-24 w-28 rounded-xl object-cover ring-1 ring-white/10 group-hover:scale-105 group-hover:ring-blue-300/40" src={promo.image} />
      </div>
    </article>
  );
}

export default PromoCard;
