import { Check } from "lucide-react";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

function VariantSelector({ groups, onSelect, selectedOptions }) {
  return (
    <div className="grid gap-5">
      {groups.map((group) => (
        <section key={group.id}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-black text-white" id={`variant-${group.id}-heading`}>{group.label}</h3>
            <span className="text-caption text-slate-400">
              {group.options.find((option) => option.id === selectedOptions[group.id])?.label}
            </span>
          </div>

          <div aria-labelledby={`variant-${group.id}-heading`} className="grid gap-2 sm:grid-cols-2" role="radiogroup">
            {group.options.map((option) => {
              const isActive = selectedOptions[group.id] === option.id;
              const isDisabled = option.stock <= 0;

              return (
                <button
                  aria-checked={isActive}
                  aria-disabled={isDisabled}
                  className={cn(
                    "transition-default relative min-h-16 rounded-2xl border p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    isActive
                      ? "border-blue-300/70 bg-blue-500/15 shadow-[0_0_26px_rgba(0,91,255,0.22)]"
                      : "border-white/10 bg-white/[0.035] hover:border-blue-300/45 hover:bg-blue-500/10",
                    isDisabled && "cursor-not-allowed opacity-45 hover:border-white/10 hover:bg-white/[0.035]",
                  )}
                  disabled={isDisabled}
                  key={option.id}
                  onClick={() => onSelect(group.id, option.id)}
                  role="radio"
                  type="button"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-white">{option.label}</span>
                      <span className="text-caption mt-1 block text-slate-400">
                        {isDisabled ? "Tạm hết" : `Còn ${option.stock}`}
                      </span>
                    </span>
                    {isActive && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_0_18px_rgba(0,91,255,0.45)]">
                        <Check size={14} />
                      </span>
                    )}
                  </span>

                  {option.priceDelta > 0 && (
                    <span className="text-caption mt-2 block font-black text-blue-200">
                      +{formatCurrency(option.priceDelta)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default VariantSelector;
