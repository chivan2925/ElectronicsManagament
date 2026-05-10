import { CalendarDays, Download, SlidersHorizontal } from "lucide-react";
import { cn } from "../../utils/classNames";

const defaultPresets = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "Quarter", value: "quarter" },
  { label: "YTD", value: "ytd" },
];

const defaultChannelOptions = [
  { label: "All channels", value: "all" },
  { label: "Storefront", value: "storefront" },
  { label: "Admin assisted", value: "admin" },
  { label: "Marketplace", value: "marketplace" },
];

const defaultSegmentOptions = [
  { label: "All segments", value: "all" },
  { label: "New customers", value: "new" },
  { label: "Returning customers", value: "returning" },
  { label: "VIP customers", value: "vip" },
];

const defaultValue = {
  channel: "all",
  from: "2026-04-10",
  preset: "30d",
  segment: "all",
  to: "2026-05-09",
};

function AnalyticsFilters({
  channelOptions = defaultChannelOptions,
  className,
  onChange,
  onExport,
  presets = defaultPresets,
  segmentOptions = defaultSegmentOptions,
  value = defaultValue,
}) {
  const filters = { ...defaultValue, ...value };

  const updateFilter = (key, nextValue) => {
    onChange?.({ ...filters, [key]: nextValue });
  };

  return (
    <section
      className={cn(
        "admin-panel admin-panel-hover rounded-2xl p-4",
        "xl:flex xl:items-center xl:justify-between xl:gap-5",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="hidden rounded-xl bg-blue-50 p-3 text-primary ring-1 ring-blue-100 sm:block">
          <SlidersHorizontal size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-950">Analytics filters</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Date range, channel, segment, and export placeholders for reporting APIs.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] xl:mt-0 xl:min-w-[820px]">
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-inner shadow-white">
          {presets.map((preset) => (
            <button
              aria-pressed={filters.preset === preset.value}
              className={cn(
                "h-9 rounded-lg px-3 text-xs font-black transition",
                filters.preset === preset.value
                  ? "bg-white text-primary shadow-sm ring-1 ring-blue-100"
                  : "text-slate-500 hover:text-slate-950",
              )}
              key={preset.value}
              onClick={() => updateFilter("preset", preset.value)}
              type="button"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <label className="relative">
          <span className="sr-only">Start date</span>
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="admin-control h-11 w-full rounded-xl pl-9 pr-3 text-sm font-bold text-slate-700 outline-none"
            onChange={(event) => updateFilter("from", event.target.value)}
            type="date"
            value={filters.from}
          />
        </label>

        <label className="relative">
          <span className="sr-only">End date</span>
          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="admin-control h-11 w-full rounded-xl pl-9 pr-3 text-sm font-bold text-slate-700 outline-none"
            onChange={(event) => updateFilter("to", event.target.value)}
            type="date"
            value={filters.to}
          />
        </label>

        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
          <label>
            <span className="sr-only">Channel</span>
            <select
              className="admin-control h-11 w-full rounded-xl px-3 text-sm font-bold text-slate-700 outline-none"
              onChange={(event) => updateFilter("channel", event.target.value)}
              value={filters.channel}
            >
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Customer segment</span>
            <select
              className="admin-control h-11 w-full rounded-xl px-3 text-sm font-bold text-slate-700 outline-none"
              onChange={(event) => updateFilter("segment", event.target.value)}
              value={filters.segment}
            >
              {segmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-950 px-4 text-sm font-black text-white shadow-admin-card transition hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          onClick={() => onExport?.(filters)}
          type="button"
        >
          <Download size={17} />
          Export
        </button>
      </div>
    </section>
  );
}

export default AnalyticsFilters;
