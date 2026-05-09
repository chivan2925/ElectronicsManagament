import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

function HeroBanner({ promotion }) {
  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_78%_20%,rgba(0,91,255,0.42),transparent_34%),radial-gradient(circle_at_18%_82%,rgba(56,189,248,0.16),transparent_30%),linear-gradient(135deg,#0B1730_0%,#07111F_48%,#050B14_100%)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.36)] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_24%,transparent_72%,rgba(0,91,255,0.12))] before:opacity-60 lg:p-9">
      <div className="relative z-10 grid h-full gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="flex max-w-xl flex-col justify-center">
          <Badge className="mb-5" variant="primary">
            {promotion.badge}
          </Badge>

          <h1 className="text-4xl font-black leading-tight tracking-normal text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.12)] lg:text-6xl">
            {promotion.title}
          </h1>
          <p className="mt-4 text-xl font-semibold text-blue-100 lg:text-2xl">{promotion.subtitle}</p>

          <ul className="mt-7 space-y-3">
            {promotion.features.map((feature) => (
              <li className="flex items-center gap-3 text-sm font-medium text-slate-300" key={feature}>
                <CheckCircle2 className="text-emerald-300 drop-shadow-[0_0_12px_rgba(110,231,183,0.45)]" size={19} />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">Mua ngay</Button>
            <Button size="lg" variant="outline">Xem chi tiết</Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
          <img
            alt={promotion.imageAlt}
            className="premium-transition relative z-10 max-h-[360px] w-full max-w-[360px] object-contain drop-shadow-[0_28px_60px_rgba(0,91,255,0.3)] hover:scale-[1.03]"
            src={promotion.image}
          />
        </div>
      </div>

      <IconButton aria-label="Slide trước" className="absolute left-5 top-1/2 hidden -translate-y-1/2 lg:flex" size="sm" variant="outline">
        <ArrowLeft size={18} />
      </IconButton>
      <IconButton aria-label="Slide sau" className="absolute right-5 top-1/2 hidden -translate-y-1/2 lg:flex" size="sm" variant="outline">
        <ArrowRight size={18} />
      </IconButton>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-2 w-8 rounded-full bg-[#005BFF] shadow-[0_0_18px_rgba(0,91,255,0.7)]" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
      </div>
    </section>
  );
}

export default HeroBanner;
