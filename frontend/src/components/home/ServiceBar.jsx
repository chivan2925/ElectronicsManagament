import { CreditCard, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const serviceIcons = {
  CreditCard,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
};

function ServiceBar({ services = [] }) {
  return (
    <section className="store-glass-soft grid gap-3 rounded-2xl p-3 sm:grid-cols-2 lg:grid-cols-5">
      {services.map((service) => {
        const Icon = serviceIcons[service.iconName] ?? Truck;

        return (
          <div className="premium-transition flex items-center gap-3 rounded-xl bg-[#07111F]/80 p-4 ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-blue-500/10 hover:ring-blue-300/40 hover:shadow-[0_0_28px_rgba(0,91,255,0.16)]" key={service.id}>
            <div className="premium-transition flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 group-hover:bg-blue-500/20">
              <Icon size={21} />
            </div>
            <div>
              <p className="text-sm font-black text-white">{service.title}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{service.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default ServiceBar;
