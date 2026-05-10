import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSearch from "../../hooks/useSearch";
import { fadeUp, tapSoft } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import IconButton from "../ui/IconButton";
import SearchSuggestions from "./SearchSuggestions";

const MotionDiv = motion.div;

function SearchOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const {
    activeResult,
    addRecentSearch,
    brandResults,
    categoryResults,
    clearRecentSearches,
    createSearchHref,
    debouncedQuery,
    detectedBrands,
    detectedCategories,
    flattenedResults,
    hasQuery,
    isLoading,
    productResults,
    query,
    recentSearches,
    removeRecentSearch,
    searchResultCount,
    selectNext,
    selectPrevious,
    setQuery,
    trendingSearches,
  } = useSearch();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSearchTerm = (term) => {
    setQuery(term);
    addRecentSearch(term);
  };

  const handleNavigate = (href, recentTerm) => {
    if (recentTerm) {
      addRecentSearch(recentTerm);
    }

    navigate(href);
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    handleNavigate(createSearchHref(trimmedQuery), trimmedQuery);
  };

  const handlePickResult = (result) => {
    handleNavigate(result.href, result.name);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectNext();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectPrevious();
      return;
    }

    if (event.key === "Enter" && activeResult) {
      event.preventDefault();
      handlePickResult(activeResult);
    }
  };

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Tìm kiếm sản phẩm">
      <button
        aria-label="Đóng tìm kiếm"
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
        onClick={handleClose}
        type="button"
      />

      <MotionDiv
        animate="visible"
        className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-3 py-4 sm:px-5 sm:py-8"
        initial="hidden"
        variants={fadeUp}
      >
        <form
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-blue-300/20 bg-[#07111F]/96 shadow-[0_28px_90px_rgba(0,0,0,0.48),0_0_44px_rgba(0,91,255,0.16)] backdrop-blur-2xl"
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
        >
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

          <div className="border-b border-white/10 p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-2 shadow-inner shadow-white/[0.03] focus-within:border-blue-300/80 focus-within:shadow-[0_0_34px_rgba(0,91,255,0.22)]">
              <Search className="ml-2 shrink-0 text-blue-200" size={22} />
              <input
                aria-label="Tìm kiếm sản phẩm, danh mục hoặc thương hiệu"
                aria-activedescendant={activeResult ? `search-option-${activeResult.resultId}` : undefined}
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-expanded={hasQuery}
                className="h-11 min-w-0 flex-1 bg-transparent text-base font-bold text-white outline-none placeholder:text-slate-500"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm laptop, PC Gaming, tai nghe, ASUS ROG..."
                ref={inputRef}
                type="search"
                value={query}
              />

              {query && (
                <IconButton
                  aria-label="Xóa từ khóa"
                  className="h-9 w-9 rounded-xl border-white/10 bg-white/[0.04]"
                  onClick={() => setQuery("")}
                  size="sm"
                  variant="outline"
                >
                  <X size={16} />
                </IconButton>
              )}

              <IconButton
                aria-label="Đóng tìm kiếm"
                className="h-9 w-9 rounded-xl border-white/10 bg-white/[0.04]"
                onClick={handleClose}
                size="sm"
                variant="outline"
              >
                <X size={16} />
              </IconButton>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-caption text-slate-400">Sản phẩm, danh mục và thương hiệu trong catalog.</p>
              <span className="text-caption rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-500">
                {hasQuery ? `${searchResultCount} gợi ý` : "Tìm nhanh"}
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4" id="search-results">
            <SearchSuggestions
              activeResult={activeResult}
              brandResults={brandResults}
              categoryResults={categoryResults}
              debouncedQuery={debouncedQuery}
              detectedBrands={detectedBrands}
              detectedCategories={detectedCategories}
              hasQuery={hasQuery}
              isLoading={isLoading}
              onClearRecent={clearRecentSearches}
              onPickResult={handlePickResult}
              onRemoveRecent={removeRecentSearch}
              onSearchTerm={handleSearchTerm}
              productResults={productResults}
              recentSearches={recentSearches}
              searchResultCount={searchResultCount}
              trendingSearches={trendingSearches}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <p className="text-caption text-slate-500">Kết quả được sắp xếp theo độ phù hợp và sức bán.</p>
            <motion.button
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-white shadow-[0_0_28px_rgba(0,91,255,0.42)] outline-none transition-default hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                !query.trim() && "pointer-events-none opacity-50",
              )}
              type="submit"
              whileTap={tapSoft}
            >
              Xem tất cả kết quả
              <ArrowRight size={17} />
            </motion.button>
          </div>
        </form>

        {flattenedResults.length > 0 && (
          <div className="sr-only" aria-live="polite">
            {flattenedResults.length} gợi ý tìm kiếm. Mục đang chọn: {activeResult?.name}.
          </div>
        )}
      </MotionDiv>
    </div>
  );
}

export default SearchOverlay;
