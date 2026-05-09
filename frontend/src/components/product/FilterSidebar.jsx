import { createElement, useState } from "react";
import {
  Check,
  ChevronDown,
  CircleDollarSign,
  ListFilter,
  PackageCheck,
  RotateCcw,
  Star,
  Tags,
} from "lucide-react";
import { cn } from "../../utils/classNames";
import Button from "../ui/Button";

function OptionButton({ active, count, label, mode = "checkbox", onClick }) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "transition-default flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        active
          ? "border-blue-300/70 bg-blue-500/15 text-white shadow-[0_0_24px_rgba(0,91,255,0.2)]"
          : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-blue-300/45 hover:bg-blue-500/10 hover:text-white",
      )}
      onClick={onClick}
      type="button"
      >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center border",
            mode === "radio" ? "rounded-full" : "rounded",
            active ? "border-blue-200 bg-blue-500 text-white" : "border-slate-600 bg-slate-950/60",
          )}
        >
          {active && <Check size={11} />}
        </span>
        <span className="truncate">{label}</span>
      </span>

      {count !== undefined && (
        <span className="shrink-0 rounded-full border border-white/10 bg-slate-950/45 px-2 py-0.5 text-xs font-black text-slate-400">
          {count}
        </span>
      )}
    </button>
  );
}

function FilterGroup({ children, defaultOpen = true, icon, meta, onClear, title }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
      <div className="flex items-center gap-2">
        <button
          aria-expanded={isOpen}
          className="transition-default flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-black text-white outline-none hover:text-blue-100 focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {createElement(icon, { className: "shrink-0 text-blue-200", size: 17 })}
          <span className="truncate">{title}</span>
          {meta && <span className="rounded-full bg-slate-950/55 px-2 py-0.5 text-xs text-slate-400">{meta}</span>}
          <ChevronDown className={cn("ml-auto shrink-0 text-slate-400 transition-transform", isOpen && "rotate-180")} size={17} />
        </button>

        {onClear && (
          <button
            className="transition-default rounded-lg px-2 py-1 text-xs font-black text-slate-400 hover:bg-white/[0.06] hover:text-white"
            onClick={onClear}
            type="button"
          >
            Xóa
          </button>
        )}
      </div>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
          isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="grid min-h-0 gap-2">{children}</div>
      </div>
    </section>
  );
}

function FilterSidebar({
  brandOptions,
  categoryCounts,
  categoryOptions,
  className,
  clearCategories,
  clearPriceRanges,
  filters,
  onBrandToggle,
  onCategoryToggle,
  onClearAll,
  onPriceRangeToggle,
  onRatingChange,
  onStockToggle,
  priceRanges,
  ratingOptions,
  resultCount,
  stockOptions,
  surface = true,
}) {
  return (
    <aside
      className={cn(
        surface && "store-glass-soft rounded-2xl p-4 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain",
        !surface && "p-0",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ListFilter className="text-blue-200" size={19} />
            <h2 className="text-section text-lg">Bộ lọc</h2>
          </div>
          <p className="text-caption mt-1 text-slate-400">{resultCount} sản phẩm phù hợp</p>
        </div>

        <Button className="h-9 shrink-0 rounded-lg px-3 py-0 text-xs" onClick={onClearAll} size="sm" variant="ghost">
          <RotateCcw size={14} />
          Xóa
        </Button>
      </div>

      <div className="grid gap-3">
        <FilterGroup
          icon={Tags}
          meta={filters.categories.length || undefined}
          onClear={filters.categories.length ? clearCategories : undefined}
          title="Danh mục"
        >
          <OptionButton
            active={!filters.categories.length}
            count={categoryCounts.all}
            label="Tất cả danh mục"
            mode="radio"
            onClick={clearCategories}
          />
          {categoryOptions.map((category) => (
            <OptionButton
              active={filters.categories.includes(category.slug)}
              count={categoryCounts[category.slug] || 0}
              key={category.id}
              label={category.name}
              onClick={() => onCategoryToggle(category.slug)}
            />
          ))}
        </FilterGroup>

        <FilterGroup icon={PackageCheck} meta={filters.brands.length || undefined} title="Thương hiệu">
          <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
            {brandOptions.map((brand) => (
              <OptionButton
                active={filters.brands.includes(brand.name)}
                count={brand.count}
                key={brand.name}
                label={brand.name}
                onClick={() => onBrandToggle(brand.name)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup
          icon={CircleDollarSign}
          meta={filters.priceRanges.length || undefined}
          onClear={filters.priceRanges.length ? clearPriceRanges : undefined}
          title="Khoảng giá"
        >
          <OptionButton
            active={!filters.priceRanges.length}
            label="Tất cả mức giá"
            mode="radio"
            onClick={clearPriceRanges}
          />
          {priceRanges.map((range) => (
            <OptionButton
              active={filters.priceRanges.includes(range.id)}
              key={range.id}
              label={range.label}
              onClick={() => onPriceRangeToggle(range.id)}
            />
          ))}
        </FilterGroup>

        <FilterGroup icon={Star} meta={filters.rating ? 1 : undefined} title="Đánh giá">
          <OptionButton
            active={!filters.rating}
            label="Tất cả đánh giá"
            onClick={() => onRatingChange(null)}
            mode="radio"
          />
          {ratingOptions.map((rating) => (
            <OptionButton
              active={filters.rating === rating.value}
              key={rating.value}
              label={rating.label}
              onClick={() => onRatingChange(rating.value)}
              mode="radio"
            />
          ))}
        </FilterGroup>

        <FilterGroup icon={PackageCheck} meta={filters.stockStatuses.length || undefined} title="Tình trạng kho">
          {stockOptions.map((stock) => (
            <OptionButton
              active={filters.stockStatuses.includes(stock.value)}
              count={stock.count}
              key={stock.value}
              label={stock.label}
              onClick={() => onStockToggle(stock.value)}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

export default FilterSidebar;
