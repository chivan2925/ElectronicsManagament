import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

function HeroBanner() {
  const features = [
    "Chip A17 Pro mạnh mẽ nhất",
    "Camera 48MP. Zoom 5x quang học",
    "Thiết kế Titan. Nhẹ hơn, bền hơn",
  ];

  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_78%_20%,rgba(0,91,255,0.42),transparent_34%),radial-gradient(circle_at_18%_82%,rgba(56,189,248,0.16),transparent_30%),linear-gradient(135deg,#0B1730_0%,#07111F_48%,#050B14_100%)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.36)] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_24%,transparent_72%,rgba(0,91,255,0.12))] before:opacity-60 lg:p-9">
      <div className="relative z-10 grid h-full gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="flex max-w-xl flex-col justify-center">
          <span className="mb-5 inline-flex w-fit items-center rounded-full border border-blue-300/40 bg-blue-500/15 px-3 py-1 text-xs font-black text-blue-100 shadow-[0_0_24px_rgba(0,91,255,0.22)] backdrop-blur-xl">
            MỚI RA MẮT
          </span>

          <h1 className="text-4xl font-black leading-tight tracking-normal text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.12)] lg:text-6xl">
            iPhone 15 Pro Max
          </h1>
          <p className="mt-4 text-xl font-semibold text-blue-100 lg:text-2xl">Titan. Mạnh mẽ. Đột phá.</p>

          <ul className="mt-7 space-y-3">
            {features.map((feature) => (
              <li className="flex items-center gap-3 text-sm font-medium text-slate-300" key={feature}>
                <CheckCircle2 className="text-emerald-300 drop-shadow-[0_0_12px_rgba(110,231,183,0.45)]" size={19} />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="premium-transition rounded-xl bg-[#005BFF] px-6 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(0,91,255,0.42)] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_0_44px_rgba(0,91,255,0.65)] active:translate-y-0">
              Mua ngay
            </button>
            <button className="premium-transition rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-black text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-blue-300/70 hover:bg-blue-500/10 hover:shadow-[0_0_28px_rgba(0,91,255,0.18)] active:translate-y-0">
              Xem chi tiết
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
          <img
            alt="iPhone 15 Pro Max"
            className="premium-transition relative z-10 max-h-[360px] w-full max-w-[360px] object-contain drop-shadow-[0_28px_60px_rgba(0,91,255,0.3)] hover:scale-[1.03]"
            src="https://placehold.co/420x560/0B1730/FFFFFF?text=iPhone%2015%20Pro%20Max"
          />
        </div>
      </div>

      <button className="premium-transition absolute left-5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-xl hover:border-blue-300/70 hover:bg-blue-600 hover:shadow-[0_0_26px_rgba(0,91,255,0.42)] lg:flex">
        <ArrowLeft size={18} />
      </button>
      <button className="premium-transition absolute right-5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur-xl hover:border-blue-300/70 hover:bg-blue-600 hover:shadow-[0_0_26px_rgba(0,91,255,0.42)] lg:flex">
        <ArrowRight size={18} />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-2 w-8 rounded-full bg-[#005BFF] shadow-[0_0_18px_rgba(0,91,255,0.7)]" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
      </div>
    </section>
  );
}

export default HeroBanner;
