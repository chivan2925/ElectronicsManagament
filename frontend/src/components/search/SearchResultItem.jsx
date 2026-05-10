import { ArrowUpRight, Cpu, Grid3X3, PackageSearch, Store, Tags } from "lucide-react";
import Badge from "../ui/Badge";
import Price from "../ui/Price";
import Rating from "../ui/Rating";
import { normalizeSearchValue } from "../../hooks/useSearch";
import { cn } from "../../utils/classNames";

const resultIconMap = {
  brand: Store,
  category: Grid3X3,
  product: PackageSearch,
};

function getHighlightRange(value, query) {
  const text = String(value || "");
  const normalizedQuery = normalizeSearchValue(query);
  const compactQuery = normalizedQuery.replace(/\s+/g, "");

  if (!text || !compactQuery) {
    return null;
  }

  const charMap = Array.from(text).map((char, index) => ({
    index,
    normalized: normalizeSearchValue(char),
  }));
  const normalizedText = charMap.map((item) => item.normalized).join("");
  const normalizedMatch = normalizedText.includes(normalizedQuery) ? normalizedQuery : compactQuery;
  const matchIndex = normalizedText.indexOf(normalizedMatch);

  if (matchIndex < 0) {
    return null;
  }

  const matchEnd = matchIndex + normalizedMatch.length;
  let normalizedCursor = 0;
  let start = 0;
  let end = text.length;

  for (const item of charMap) {
    const nextCursor = normalizedCursor + item.normalized.length;

    if (normalizedCursor <= matchIndex && matchIndex < nextCursor) {
      start = item.index;
    }

    if (normalizedCursor < matchEnd && matchEnd <= nextCursor) {
      end = item.index + 1;
      break;
    }

    normalizedCursor = nextCursor;
  }

  return { end, start };
}

function HighlightText({ className, query, value }) {
  const text = String(value || "");
  const range = getHighlightRange(text, query);

  if (!range) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {text.slice(0, range.start)}
      <mark className="rounded-md bg-blue-400/18 px-0.5 font-black text-blue-100 ring-1 ring-blue-300/20">
        {text.slice(range.start, range.end)}
      </mark>
      {text.slice(range.end)}
    </span>
  );
}

function ResultShell({ active, children, compact = false, onPick, result }) {
  return (
    <button
      aria-selected={active}
      className={cn(
        "premium-transition group w-full rounded-2xl border text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        compact ? "px-3 py-3" : "p-2.5",
        active
          ? "border-blue-300/70 bg-blue-500/12 shadow-[0_0_34px_rgba(0,91,255,0.2)]"
          : "border-white/10 bg-white/[0.035] hover:border-blue-300/45 hover:bg-blue-500/[0.075]",
      )}
      id={`search-option-${result.resultId}`}
      onClick={() => onPick(result)}
      role="option"
      type="button"
    >
      {children}
    </button>
  );
}

function ProductResult({ active, onPick, result }) {
  const labels = result.matchLabels?.length ? result.matchLabels : [result.brand, result.category].filter(Boolean).slice(0, 2);

  return (
    <ResultShell active={active} onPick={onPick} result={result}>
      <span className="grid grid-cols-[58px_1fr] items-center gap-3 sm:grid-cols-[70px_1fr_auto]">
        <span className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.28),rgba(15,23,42,0.82)_52%,rgba(2,6,23,0.98)_100%)] p-1.5 shadow-inner shadow-white/[0.04]">
          <img
            alt={result.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            src={result.image}
          />
          {Number(result.stock) <= 0 && (
            <span className="absolute inset-x-1 bottom-1 rounded-lg bg-slate-950/86 px-1.5 py-1 text-center text-[10px] font-black text-slate-300">
              Hết hàng
            </span>
          )}
        </span>

        <span className="min-w-0">
          <span className="flex min-w-0 flex-wrap items-center gap-1.5">
            {labels.map((label) => (
              <Badge className="max-w-36 truncate" key={label} size="sm" variant="soft">
                <HighlightText query={result.highlightQuery} value={label} />
              </Badge>
            ))}
          </span>
          <HighlightText
            className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white sm:text-base"
            query={result.highlightQuery}
            value={result.name}
          />
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating reviews={result.reviews} value={result.rating} />
            <span className="text-caption text-slate-500">{Number(result.sold) || 0} đã bán</span>
          </span>
        </span>

        <span className="hidden min-w-28 text-right sm:block">
          <Price oldClassName="text-[11px]" oldValue={result.oldPrice} size="sm" value={result.price} />
        </span>
      </span>
    </ResultShell>
  );
}

function EntityResult({ active, onPick, result }) {
  const Icon = resultIconMap[result.resultType] || Tags;
  const isBrand = result.resultType === "brand";

  return (
    <ResultShell active={active} compact onPick={onPick} result={result}>
      <span className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/48 text-blue-200 shadow-inner shadow-white/[0.03]">
            <Icon size={19} />
          </span>
          <span className="min-w-0">
            <HighlightText
              className="block truncate text-sm font-black text-white"
              query={result.highlightQuery}
              value={result.name}
            />
            <span className="text-caption mt-1 flex min-w-0 flex-wrap items-center gap-1.5 text-slate-400">
              <span>{result.meta}</span>
              <span className="text-slate-600">/</span>
              <span>{result.count} sản phẩm</span>
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          <Badge className="hidden sm:inline-flex" variant={isBrand ? "primary" : "soft"}>
            {isBrand ? <Cpu className="mr-1.5" size={12} /> : <Tags className="mr-1.5" size={12} />}
            {isBrand ? "Brand" : "Danh mục"}
          </Badge>
          <ArrowUpRight className="text-slate-500 transition-default group-hover:text-blue-200" size={18} />
        </span>
      </span>
    </ResultShell>
  );
}

function SearchResultItem({ active = false, onPick, result }) {
  if (result.resultType === "product") {
    return <ProductResult active={active} onPick={onPick} result={result} />;
  }

  return <EntityResult active={active} onPick={onPick} result={result} />;
}

export default SearchResultItem;
