import { Banknote, CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, Smartphone } from "lucide-react";
import { cn } from "../../utils/classNames";
import Badge from "../ui/Badge";

const methodIcons = {
  cod: Banknote,
  momo: Smartphone,
  vnpay: CreditCard,
};

function PaymentMethodSelector({ onChange, options, value }) {
  const selectedOption = options.find((option) => option.id === value) || options[0];

  return (
    <section className="store-surface-panel rounded-3xl p-4 sm:p-5">
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
          const isDisabled = Boolean(option.disabled || option.placeholder);

          return (
            <button
              className={cn(
                "premium-transition min-h-[156px] rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
                isSelected
                  ? "border-blue-300/70 bg-blue-500/12 shadow-[0_0_30px_rgba(0,91,255,0.18)]"
                  : "border-white/10 bg-white/[0.035] hover:border-blue-300/45 hover:bg-blue-500/[0.07]",
              )}
              disabled={isDisabled}
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
                  {option.subtitle && <p className="text-caption mt-0.5 text-blue-200">{option.subtitle}</p>}
                  <p className="text-caption mt-1 text-slate-400">{option.description}</p>
                </div>

                {option.highlights?.length > 0 && (
                  <div className="mt-3 grid gap-1.5">
                    {option.highlights.slice(0, 2).map((highlight) => (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-300" key={highlight}>
                        <ShieldCheck className="text-emerald-200" size={12} />
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                {option.badge && (
                  <Badge className="mt-auto" variant={isDisabled ? "warning" : "soft"}>
                    {option.badge}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div className="mt-4 rounded-2xl border border-blue-300/20 bg-blue-500/10 p-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950/44 text-blue-100 ring-1 ring-blue-300/30">
              <LockKeyhole size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white">{selectedOption.flowTitle || `Luồng ${selectedOption.name}`}</p>
              <p className="text-caption mt-1 text-slate-400">
                {selectedOption.settlement || "Thông tin thanh toán được xử lý theo trạng thái đơn hàng và chỉ cập nhật sau khi xác minh."}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PaymentMethodSelector;
