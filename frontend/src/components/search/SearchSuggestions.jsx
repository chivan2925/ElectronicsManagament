import {
  ArrowRight,
  Clock3,
  Cpu,
  Flame,
  Grid3X3,
  PackageSearch,
  Search,
  Sparkles,
  Store,
  Tags,
  X,
} from "lucide-react";
import Badge from "../ui/Badge";
import IconButton from "../ui/IconButton";
import Price from "../ui/Price";
import Rating from "../ui/Rating";
import { cn } from "../../utils/classNames";

function SearchTermButton({ icon, label, onRemove, onSelect }) {
  return (
    <span className="inline-flex min-w-0 items-center rounded-full border border-white/10 bg-white/[0.045] text-sm font-bold text-slate-200 shadow-inner shadow-white/[0.03] transition-default hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white">
      <button className="inline-flex min-w-0 items-center gap-2 px-3 py-2" onClick={() => onSelect(label)} type="button">
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

function SuggestionGroup({ children, icon, title }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-black text-white">{title}</h3>
      </div>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function ProductSuggestion({ active, onPick, product }) {
  return (
    <button
      className={cn(
        "premium-transition grid w-full grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        active
          ? "border-blue-300/70 bg-blue-500/12 shadow-[0_0_30px_rgba(0,91,255,0.18)]"
          : "border-white/10 bg-white/[0.035] hover:border-blue-300/45 hover:bg-blue-500/[0.07]",
      )}
      onClick={() => onPick(product)}
      type="button"
    >
      <span className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.24),rgba(15,23,42,0.78)_52%,rgba(2,6,23,0.96)_100%)] p-1.5">
        <img alt={product.name} className="h-full w-full object-contain" src={product.image} />
      </span>
      <span className="min-w-0">
        <span className="text-caption text-blue-200">{product.brand}</span>
        <span className="mt-0.5 line-clamp-2 text-sm font-black text-white">{product.name}</span>
        <span className="mt-1 block">
          <Rating reviews={product.reviews} value={product.rating} />
        </span>
      </span>
      <span className="hidden text-right sm:block">
        <Price oldClassName="text-[11px]" oldValue={product.oldPrice} size="sm" value={product.price} />
      </span>
    </button>
  );
}

function CompactSuggestion({ active, count, icon, label, meta, onPick, result }) {
  return (
    <button
      className={cn(
        "premium-transition flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        active
          ? "border-blue-300/70 bg-blue-500/12 shadow-[0_0_30px_rgba(0,91,255,0.18)]"
          : "border-white/10 bg-white/[0.035] hover:border-blue-300/45 hover:bg-blue-500/[0.07]",
      )}
      onClick={() => onPick(result)}
      type="button"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/45 text-blue-200">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-black text-white">{label}</span>
          <span className="text-caption text-slate-400">{meta}</span>
        </span>
      </span>
      <Badge className="shrink-0" variant="soft">{count} sản phẩm</Badge>
    </button>
  );
}

function SearchSuggestions({
  activeResult,
  brandResults,
  categoryResults,
  debouncedQuery,
  hasQuery,
  isDebouncing,
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
              <button className="text-xs font-black text-slate-400 transition-default hover:text-white" onClick={onClearRecent} type="button">
                Xóa tất cả
              </button>
            )}
          </div>

          {recentSearches.length ? (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <SearchTermButton icon={<Clock3 className="shrink-0 text-blue-200" size={15} />} key={term} label={term} onRemove={onRemoveRecent} onSelect={onSearchTerm} />
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
              <SearchTermButton icon={<Sparkles className="shrink-0 text-blue-200" size={15} />} key={term} label={term} onSelect={onSearchTerm} />
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-blue-300/15 bg-blue-500/[0.055] p-4">
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 shrink-0 text-blue-200" size={18} />
            <div>
              <p className="text-sm font-black text-white">Sản phẩm, danh mục, thương hiệu</p>
              <p className="text-caption mt-1 text-slate-400">
                Ưu tiên sản phẩm nổi bật, danh mục đúng nhu cầu và thương hiệu phổ biến.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!searchResultCount && !isDebouncing) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center">
        <PackageSearch className="mx-auto text-slate-500" size={42} />
        <h3 className="mt-4 text-xl font-black text-white">Không tìm thấy kết quả phù hợp</h3>
        <p className="text-muted mx-auto mt-2 max-w-md text-sm">
          Thử tìm theo thương hiệu như ASUS ROG, Logitech G hoặc nhóm sản phẩm như tai nghe, bàn phím, PC Gaming.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-400">
          {isDebouncing ? "Đang cập nhật gợi ý..." : `${searchResultCount} gợi ý cho "${debouncedQuery}"`}
        </p>
        <span className="text-caption inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-500">
          <ArrowRight size={13} />
          Xem trước
        </span>
      </div>

      {productResults.length > 0 && (
        <SuggestionGroup icon={<PackageSearch className="text-blue-200" size={17} />} title="Sản phẩm">
          {productResults.map((product) => (
            <ProductSuggestion
              active={activeResult?.resultId === product.resultId}
              key={product.id}
              onPick={onPickResult}
              product={product}
            />
          ))}
        </SuggestionGroup>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {categoryResults.length > 0 && (
          <SuggestionGroup icon={<Grid3X3 className="text-blue-200" size={17} />} title="Danh mục">
            {categoryResults.map((category) => (
              <CompactSuggestion
                active={activeResult?.resultId === category.resultId}
                count={category.count}
                icon={<Tags size={18} />}
                key={category.id}
                label={category.name}
                meta="Danh mục sản phẩm"
                onPick={onPickResult}
                result={category}
              />
            ))}
          </SuggestionGroup>
        )}

        {brandResults.length > 0 && (
          <SuggestionGroup icon={<Store className="text-blue-200" size={17} />} title="Thương hiệu">
            {brandResults.map((brand) => (
              <CompactSuggestion
                active={activeResult?.resultId === brand.resultId}
                count={brand.count}
                icon={<Cpu size={18} />}
                key={brand.name}
                label={brand.name}
                meta="Brand trong catalog"
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
