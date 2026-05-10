import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, hoverGlow, imageZoom } from "../../styles/animations";
import OptimizedImage from "../common/OptimizedImage";

const MotionArticle = motion.article;
const MotionImg = motion.img;

function PromoCard({ promo }) {
  const promoHref = `/products?search=${encodeURIComponent(promo.title)}`;

  return (
    <MotionArticle className={`store-premium-sheen premium-transition group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${promo.gradient} p-3 shadow-xl shadow-black/24 backdrop-blur-xl hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-[0_0_38px_rgba(0,91,255,0.26),0_24px_60px_rgba(0,0,0,0.34)] sm:p-4`} variants={{ ...fadeUp, hover: hoverGlow }} whileHover="hover">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(96,165,250,0.28),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,rgba(0,91,255,0.14))] opacity-80" />
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-blue-100/45 to-transparent" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-400/18 blur-2xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-caption text-blue-200">Deal nổi bật</p>
          <h3 className="mt-1 text-base font-black leading-tight text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.12)] sm:text-lg">{promo.title}</h3>
          <p className="mt-1 text-sm font-bold text-blue-100">{promo.discount}</p>
          <Link className="premium-transition mt-4 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm font-black text-white shadow-inner shadow-white/[0.03] hover:border-blue-200/50 group-hover:text-blue-100" to={promoHref}>
            Mua ngay
            <ArrowRight className="premium-transition group-hover:translate-x-1" size={16} />
          </Link>
        </div>
        <div className="relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950/35 p-1.5 shadow-[0_0_28px_rgba(0,91,255,0.12)]">
          <div className="pointer-events-none absolute inset-x-3 bottom-2 h-8 rounded-full bg-blue-500/20 blur-xl" />
          <OptimizedImage
            as={MotionImg}
            alt={promo.title}
            className="premium-transition relative z-10 h-20 w-24 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-blue-300/40 sm:h-24 sm:w-28"
            fallbackKind="product"
            placeholderClassName="rounded-lg bg-slate-950/70"
            sizes="112px"
            src={promo.image}
            variants={{ hover: imageZoom }}
            wrapperClassName="relative z-10 h-20 w-24 rounded-lg sm:h-24 sm:w-28"
          />
        </div>
      </div>
    </MotionArticle>
  );
}

export default PromoCard;
