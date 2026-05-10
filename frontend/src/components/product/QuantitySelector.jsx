import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/classNames";
import IconButton from "../ui/IconButton";

function QuantitySelector({ className, max = 1, onChange, value }) {
  const safeMax = Math.max(max, 0);
  const canDecrease = value > 1;
  const canIncrease = value < safeMax;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        aria-label="Chọn số lượng sản phẩm"
        className="flex h-12 items-center rounded-2xl border border-white/10 bg-slate-950/45 p-1 shadow-inner shadow-white/[0.03]"
        role="group"
      >
        <IconButton
          aria-label="Giảm số lượng"
          className="h-10 w-10 rounded-xl disabled:pointer-events-none disabled:opacity-40"
          disabled={!canDecrease}
          onClick={() => onChange(value - 1)}
          size="sm"
          variant="ghost"
        >
          <Minus size={17} />
        </IconButton>

        <span aria-live="polite" className="flex h-10 min-w-12 items-center justify-center rounded-xl bg-white/[0.04] px-3 text-sm font-black text-white">
          {value}
        </span>

        <IconButton
          aria-label="Tăng số lượng"
          className="h-10 w-10 rounded-xl disabled:pointer-events-none disabled:opacity-40"
          disabled={!canIncrease}
          onClick={() => onChange(value + 1)}
          size="sm"
          variant="ghost"
        >
          <Plus size={17} />
        </IconButton>
      </div>

      <p className="text-caption text-slate-400">
        {safeMax > 0 ? `Tối đa ${safeMax}` : "Hết hàng"}
      </p>
    </div>
  );
}

export default QuantitySelector;
