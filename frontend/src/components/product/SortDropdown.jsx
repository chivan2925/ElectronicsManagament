import { ArrowDownUp, ChevronDown } from "lucide-react";
import { cn } from "../../utils/classNames";

function SortDropdown({ className, onChange, options, value }) {
  return (
    <label
      className={cn(
        "premium-transition flex h-11 min-w-[180px] items-center gap-2 rounded-xl border border-white/10 bg-slate-950/55 px-3 text-sm font-bold text-slate-200 shadow-inner shadow-white/[0.03] backdrop-blur-xl focus-within:border-blue-300/70 focus-within:bg-slate-950/75 focus-within:shadow-[0_0_28px_rgba(0,91,255,0.2)]",
        className,
      )}
    >
      <ArrowDownUp className="text-blue-200" size={17} />
      <select
        aria-label="Sắp xếp sản phẩm"
        className="min-w-0 flex-1 appearance-none bg-transparent text-sm font-black text-white outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option className="bg-slate-950 text-white" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none text-slate-400" size={17} />
    </label>
  );
}

export default SortDropdown;
