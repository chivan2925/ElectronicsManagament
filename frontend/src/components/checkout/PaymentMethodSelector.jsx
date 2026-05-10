import { Banknote, CheckCircle2, CreditCard, ShieldCheck, Smartphone } from "lucide-react";
import { cn } from "../../utils/classNames";
import Badge from "../ui/Badge";

const methodIcons = {
  cod: Banknote,
  momo: Smartphone,
  vnpay: CreditCard,
};

function PaymentMethodSelector({ onChange, options, value }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/36 p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-caption text-blue-200">Thanh toán đơn hàng</p>
          <h2 className="text-section mt-1 text-xl">Phương thức thanh toán</h2>
        </div>
        <Badge className="gap-1.5" variant="success">
          <ShieldCheck size={13} />
          Bảo mật đơn hàng
        </Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {options.map((option) => {
          const Icon = methodIcons[option.id] || CreditCard;
          const isSelected = value === option.id;

          return (
            <button
              className={cn(
                "premium-transition min-h-[156px] rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
                isSelected
                  ? "border-blue-300/70 bg-blue-500/12 shadow-[0_0_30px_rgba(0,91,255,0.18)]"
                  : "border-white/10 bg-white/[0.035] hover:border-blue-300/45 hover:bg-blue-500/[0.07]",
              )}
              disabled={option.placeholder}
              key={option.id}
              onClick={() => onChange(option.id)}
              type="button"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl border",
                      isSelected ? "border-blue-300/50 bg-blue-500/20 text-blue-100" : "border-white/10 bg-slate-950/45 text-slate-400",
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  {isSelected && <CheckCircle2 className="text-emerald-200" size={19} />}
                </div>

                <div className="mt-4">
                  <p className="font-black text-white">{option.name}</p>
                  <p className="text-caption mt-1 text-slate-400">{option.description}</p>
                </div>

                {option.badge && (
                  <Badge className="mt-auto" variant={option.placeholder ? "warning" : "soft"}>
                    {option.badge}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PaymentMethodSelector;
