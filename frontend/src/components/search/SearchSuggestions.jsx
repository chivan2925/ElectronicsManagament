import { ArrowRight, Clock3, Flame, Grid3X3, PackageSearch, Search, Sparkles, Store, X } from "lucide-react";
import IconButton from "../ui/IconButton";
import { cn } from "../../utils/classNames";
import SearchResultItem from "./SearchResultItem";

function SearchTermButton({ icon, label, onRemove, onSelect }) {
  return (
    <span className="inline-flex min-w-0 items-center rounded-full border border-white/10 bg-white/[0.045] text-sm font-bold text-slate-200 shadow-inner shadow-white/[0.03] transition-default hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white">
      <button
        className="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        onClick={() => onSelect(label)}
        type="button"
      >
        {icon}
        <span className="truncate">{label}</span>
      </button>
      {onRemove && (
        <IconButton
          aria-label={`Xóa ${label}`}
          className="mr-1 h-7 w-7 rounded-full border-white/10 bg-transparent text-slate-400 hover:bg-white/[0.06]"
          onClick={() => onRemove(label)}
          size="sm"
          variant="ghost"
        >
          <X size={13} />
        </IconButton>
      )}
    </span>
  );
}

function SuggestionGroup({ children, count, icon, title }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-black text-white">{title}</h3>
        </div>
        {count > 0 && (
          <span className="text-caption rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-slate-500">
            {count}
          </span>
        )}
      </div>
      <div aria-label={title} className="grid gap-2" role="listbox">
        {children}
      </div>
    </section>
  );
}

function LoadingRows() {
  return (
    <div className="grid gap-3" role="status" aria-label="Đang tải gợi ý tìm kiếm">
      {[0, 1, 2].map((item) => (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3" key={item}>
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-14 w-14 shrink-0 rounded-xl bg-white/[0.06]" />
            <div className="min-w-0 flex-1">
              <div className="skeleton-shimmer h-3 w-28 rounded-full bg-white/[0.06]" />
              <div className="skeleton-shimmer mt-3 h-4 w-full rounded-full bg-white/[0.06]" />
              <div className="skeleton-shimmer mt-2 h-3 w-2/3 rounded-full bg-white/[0.06]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContextChips({ detectedBrands, detectedCategories }) {
  const chips = [
    ...detectedCategories.slice(0, 2).map((category) => ({ label: category.name, type: "Danh mục" })),
    ...detectedBrands.slice(0, 2).map((brand) => ({ label: brand.name, type: "Brand" })),
  ];

  if (!chips.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-caption text-slate-500">Ngữ cảnh:</span>
      {chips.map((chip) => (
        <span
          className="text-caption rounded-full border border-blue-300/20 bg-blue-500/[0.08] px-2.5 py-1 font-bold text-blue-100"
          key={`${chip.type}-${chip.label}`}
        >
          {chip.type}: {chip.label}
        </span>
      ))}
    </div>
  );
}

function SearchSuggestions({
  activeResult,
  brandResults,
  categoryResults,
  debouncedQuery,
  detectedBrands,
  detectedCategories,
  hasQuery,
  isLoading,
  onClearRecent,
  onPickResult,
  onRemoveRecent,
  onSearchTerm,
  productResults,
  recentSearches,
  searchResultCount,
  trendingSearches,
}) {
  if (!hasQuery) {
    return (
      <div className="grid gap-5">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock3 className="text-blue-200" size={17} />
              <h3 className="text-sm font-black text-white">Tìm gần đây</h3>
            </div>
            {recentSearches.length > 0 && (
              <button
                className="rounded-lg px-2 py-1 text-xs font-black text-slate-400 outline-none transition-default hover:text-white focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                onClick={onClearRecent}
                type="button"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {recentSearches.length ? (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <SearchTermButton
                  icon={<Clock3 className="shrink-0 text-blue-200" size={15} />}
                  key={term}
                  label={term}
                  onRemove={onRemoveRecent}
                  onSelect={onSearchTerm}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-sm font-bold text-slate-400">Chưa có tìm kiếm gần đây trên trình duyệt này.</p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Flame className="text-amber-200" size={17} />
            <h3 className="text-sm font-black text-white">Đang được tìm nhiều</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <SearchTermButton
                icon={<Sparkles className="shrink-0 text-blue-200" size={15} />}
                key={term}
                label={term}
                onSelect={onSearchTerm}
              />
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-blue-300/15 bg-blue-500/[0.055] p-4">
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 shrink-0 text-blue-200" size={18} />
            <div>
              <p className="text-sm font-black text-white">Tìm theo sản phẩm, danh mục hoặc thương hiệu</p>
              <p className="text-caption mt-1 text-slate-400">
                Gõ tên sản phẩm, brand như ASUS ROG, Logitech G hoặc nhóm hàng như laptop, PC Gaming, tai nghe.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingRows />;
  }

  if (!searchResultCount) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center">
        <PackageSearch className="mx-auto text-slate-500" size={42} />
        <h3 className="mt-4 text-xl font-black text-white">Không tìm thấy kết quả phù hợp</h3>
        <p className="text-muted mx-auto mt-2 max-w-md text-sm">
          Thử tìm theo thương hiệu như ASUS ROG, Logitech G hoặc nhóm sản phẩm như tai nghe, bàn phím, PC Gaming.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {trendingSearches.slice(0, 4).map((term) => (
            <SearchTermButton
              icon={<Sparkles className="shrink-0 text-blue-200" size={15} />}
              key={term}
              label={term}
              onSelect={onSearchTerm}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-400">
            {searchResultCount} gợi ý cho <span className="text-white">"{debouncedQuery}"</span>
          </p>
          <span className="text-caption inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-500">
            <ArrowRight size={13} />
            Enter để chọn
          </span>
        </div>
        <ContextChips detectedBrands={detectedBrands} detectedCategories={detectedCategories} />
      </div>

      {productResults.length > 0 && (
        <SuggestionGroup count={productResults.length} icon={<PackageSearch className="text-blue-200" size={17} />} title="Sản phẩm phù hợp">
          {productResults.map((product) => (
            <SearchResultItem
              active={activeResult?.resultId === product.resultId}
              key={product.resultId}
              onPick={onPickResult}
              result={product}
            />
          ))}
        </SuggestionGroup>
      )}

      <div className={cn("grid gap-5", categoryResults.length && brandResults.length && "lg:grid-cols-2")}>
        {categoryResults.length > 0 && (
          <SuggestionGroup count={categoryResults.length} icon={<Grid3X3 className="text-blue-200" size={17} />} title="Danh mục">
            {categoryResults.map((category) => (
              <SearchResultItem
                active={activeResult?.resultId === category.resultId}
                key={category.resultId}
                onPick={onPickResult}
                result={category}
              />
            ))}
          </SuggestionGroup>
        )}

        {brandResults.length > 0 && (
          <SuggestionGroup count={brandResults.length} icon={<Store className="text-blue-200" size={17} />} title="Thương hiệu">
            {brandResults.map((brand) => (
              <SearchResultItem
                active={activeResult?.resultId === brand.resultId}
                key={brand.resultId}
                onPick={onPickResult}
                result={brand}
              />
            ))}
          </SuggestionGroup>
        )}
      </div>
    </div>
  );
}

export default SearchSuggestions;
