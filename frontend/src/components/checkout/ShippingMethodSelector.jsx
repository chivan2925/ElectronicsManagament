import { CheckCircle2, Clock3, Truck } from "lucide-react";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

function ShippingMethodSelector({ disabled = false, onChange, options, value }) {
  return (
    <section className="store-surface-panel rounded-3xl p-4 sm:p-5">
      <div className="mb-4">
        <p className="text-caption text-blue-200">Cách nhận hàng</p>
        <h2 className="text-section mt-1 text-xl" id="shipping-method-heading">Phương thức giao hàng</h2>
      </div>

      <div aria-labelledby="shipping-method-heading" className="grid gap-3" role="radiogroup">
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <button
              aria-checked={isSelected}
              aria-disabled={disabled}
              className={cn(
                "premium-transition w-full rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
                isSelected
                  ? "border-blue-300/70 bg-blue-500/12 shadow-[0_0_30px_rgba(0,91,255,0.18)]"
                  : "border-white/10 bg-white/[0.035] hover:border-blue-300/45 hover:bg-blue-500/[0.07]",
              )}
              disabled={disabled}
              key={option.id}
              onClick={() => onChange(option.id)}
              role="radio"
              type="button"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                      isSelected ? "border-blue-300/50 bg-blue-500/20 text-blue-100" : "border-white/10 bg-slate-950/45 text-slate-400",
                    )}
                  >
                    <Truck size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-black text-white">{option.name}</p>
                    <p className="text-caption mt-1 flex items-center gap-1.5 text-slate-400">
                      <Clock3 size={14} />
                      {option.eta}
                    </p>
                    <p className="text-caption mt-2 text-slate-500">{option.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                  <p className="text-sm font-black text-blue-100">
                    {option.price === 0 ? "Miễn phí" : formatCurrency(option.price)}
                  </p>
                  {isSelected && <CheckCircle2 className="text-emerald-200 sm:ml-auto sm:mt-2" size={18} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ShippingMethodSelector;
