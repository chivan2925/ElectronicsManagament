import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

function HeroBanner() {
  const features = [
    "Chip A17 Pro mạnh mẽ nhất",
    "Camera 48MP. Zoom 5x quang học",
    "Thiết kế Titan. Nhẹ hơn, bền hơn",
  ];

  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_78%_20%,rgba(0,91,255,0.35),transparent_34%),linear-gradient(135deg,#0B1730_0%,#07111F_48%,#050B14_100%)] p-6 shadow-2xl shadow-black/30 lg:p-9">
      <div className="relative z-10 grid h-full gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="flex max-w-xl flex-col justify-center">
          <span className="mb-5 inline-flex w-fit items-center rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-200">
            MỚI RA MẮT
          </span>

          <h1 className="text-4xl font-black leading-tight tracking-normal text-white lg:text-6xl">
            iPhone 15 Pro Max
          </h1>
          <p className="mt-4 text-xl font-semibold text-blue-100">Titan. Mạnh mẽ. Đột phá.</p>

          <ul className="mt-7 space-y-3">
            {features.map((feature) => (
              <li className="flex items-center gap-3 text-sm font-medium text-slate-300" key={feature}>
                <CheckCircle2 className="text-emerald-300" size={19} />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-xl bg-[#005BFF] px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-700">
              Mua ngay
            </button>
            <button className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-black text-white transition hover:border-blue-400 hover:bg-white/5">
              Xem chi tiết
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <img
            alt="iPhone 15 Pro Max"
            className="relative z-10 max-h-[360px] w-full max-w-[360px] object-contain drop-shadow-2xl"
            src="https://placehold.co/420x560/0B1730/FFFFFF?text=iPhone%2015%20Pro%20Max"
          />
        </div>
      </div>

      <button className="absolute left-5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur transition hover:bg-blue-600 lg:flex">
        <ArrowLeft size={18} />
      </button>
      <button className="absolute right-5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white backdrop-blur transition hover:bg-blue-600 lg:flex">
        <ArrowRight size={18} />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-2 w-8 rounded-full bg-[#005BFF]" />
        <span className="h-2 w-2 rounded-full bg-slate-600" />
        <span className="h-2 w-2 rounded-full bg-slate-600" />
      </div>
    </section>
  );
}

export default HeroBanner;
