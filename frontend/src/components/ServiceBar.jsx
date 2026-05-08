import { CreditCard, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { services } from "../data/mockData";

const serviceIcons = [Truck, ShieldCheck, RotateCcw, CreditCard, Headphones];

function ServiceBar() {
  return (
    <section className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:grid-cols-2 lg:grid-cols-5">
      {services.map((service, index) => {
        const Icon = serviceIcons[index];

        return (
          <div className="flex items-center gap-3 rounded-xl bg-[#07111F] p-4 ring-1 ring-slate-800" key={service.id}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
              <Icon size={21} />
            </div>
            <div>
              <p className="text-sm font-black text-white">{service.title}</p>
              <p className="mt-1 text-xs text-slate-500">{service.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default ServiceBar;
