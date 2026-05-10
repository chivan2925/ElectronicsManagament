import { Search, X } from "lucide-react";
import { cn } from "../../../utils/classNames";

function AdminSearch({
  className,
  disabled = false,
  onChange,
  onClear,
  placeholder = "Search records...",
  value = "",
}) {
  const handleChange = (event) => {
    onChange?.(event.target.value, event);
  };

  const handleClear = () => {
    onClear?.();
    onChange?.("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        className="admin-control h-11 w-full rounded-xl pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        disabled={disabled}
        onChange={handleChange}
        placeholder={placeholder}
        type="search"
        value={value}
      />
      {value ? (
        <button
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          disabled={disabled}
          onClick={handleClear}
          type="button"
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  );
}

export default AdminSearch;
