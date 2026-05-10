import { Filter, RotateCcw } from "lucide-react";
import { cn } from "../../../utils/classNames";

function renderFilterControl(filter, values, onChange) {
  const value = values?.[filter.key] ?? filter.value ?? "";
  const commonClass =
    "admin-control h-11 w-full rounded-xl px-3 text-sm font-semibold text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-50";

  if (typeof filter.render === "function") {
    return filter.render({ onChange: (nextValue) => onChange?.(filter.key, nextValue), value, values });
  }

  if (filter.type === "select") {
    return (
      <select
        className={commonClass}
        disabled={filter.disabled}
        onChange={(event) => onChange?.(filter.key, event.target.value)}
        value={value}
      >
        <option value="">{filter.placeholder || "All"}</option>
        {(filter.options ?? []).map((option) => {
          const optionValue = typeof option === "object" ? option.value : option;
          const optionLabel = typeof option === "object" ? option.label : option;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <input
      className={commonClass}
      disabled={filter.disabled}
      onChange={(event) => onChange?.(filter.key, event.target.value)}
      placeholder={filter.placeholder}
      type={filter.type || "text"}
      value={value}
    />
  );
}

function AdminFilters({
  className,
  filters = [],
  onChange,
  onReset,
  summary,
  title = "Filters",
  values = {},
}) {
  if (filters.length === 0 && !summary) {
    return null;
  }

  return (
    <section className={cn("admin-panel rounded-2xl p-4", className)}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <Filter size={17} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-950">{title}</h3>
            {summary ? <p className="text-xs font-semibold text-slate-500">{summary}</p> : null}
          </div>
        </div>

        {onReset ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 transition hover:border-primary hover:bg-blue-50 hover:text-primary"
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filters.map((filter) => (
          <label className="space-y-1.5" key={filter.key}>
            <span className="text-xs font-black uppercase tracking-normal text-slate-500">{filter.label}</span>
            {renderFilterControl(filter, values, onChange)}
          </label>
        ))}
      </div>
    </section>
  );
}

export default AdminFilters;
