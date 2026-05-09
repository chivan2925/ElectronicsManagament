import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../utils/classNames";
import IconButton from "../ui/IconButton";

function SearchProductsInput({
  className,
  debounceMs = 320,
  onSearchChange,
  placeholder = "Tìm laptop, tai nghe, RTX 4070...",
  resultCount,
  value,
}) {
  const [localValue, setLocalValue] = useState(value);
  const isTyping = localValue !== value;

  useEffect(() => {
    if (localValue === value) {
      return undefined;
    }

    const searchTimer = window.setTimeout(() => {
      onSearchChange(localValue);
    }, debounceMs);

    return () => window.clearTimeout(searchTimer);
  }, [debounceMs, localValue, onSearchChange, value]);

  const handleClear = () => {
    setLocalValue("");
    onSearchChange("");
  };

  return (
    <div
      className={cn(
        "premium-transition flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/50 p-2.5 shadow-inner shadow-white/[0.03] backdrop-blur-xl focus-within:border-blue-300/80 focus-within:bg-slate-950/75 focus-within:shadow-[0_0_34px_rgba(0,91,255,0.22)] sm:flex-row sm:items-center",
        className,
      )}
    >
      <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 px-2">
        <Search className="shrink-0 text-blue-200" size={19} />
        <input
          aria-label="Tìm kiếm sản phẩm"
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-500"
          onChange={(event) => setLocalValue(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={localValue}
        />
        {localValue && (
          <IconButton
            aria-label="Xóa từ khóa tìm kiếm"
            className="h-8 w-8 rounded-lg border-white/10 bg-white/[0.04]"
            onClick={handleClear}
            size="sm"
            variant="outline"
          >
            <X size={15} />
          </IconButton>
        )}
      </label>

      <div className="flex h-9 shrink-0 items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs font-black text-slate-400 sm:min-w-[150px]">
        <span>{isTyping ? "Đang tìm..." : `${resultCount} kết quả`}</span>
        <span className={cn("h-2 w-2 rounded-full", isTyping ? "bg-amber-300" : "bg-emerald-300")} />
      </div>
    </div>
  );
}

export default SearchProductsInput;
