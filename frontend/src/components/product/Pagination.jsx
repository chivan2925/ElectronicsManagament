import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/classNames";
import IconButton from "../ui/IconButton";

function getVisiblePages(currentPage, pageCount) {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "end-ellipsis", pageCount];
  }

  if (currentPage >= pageCount - 2) {
    return [1, "start-ellipsis", pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }

  return [1, "start-ellipsis", currentPage - 1, currentPage, currentPage + 1, "end-ellipsis", pageCount];
}

function Pagination({ currentPage, onPageChange, pageCount, totalItems }) {
  if (pageCount <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <nav
      aria-label="Phân trang sản phẩm"
      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-caption text-slate-400">
        {totalItems} sản phẩm • Trang {currentPage}/{pageCount}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <IconButton
          aria-label="Trang trước"
          className="h-10 w-10 rounded-xl border-white/10 bg-white/[0.04] disabled:pointer-events-none disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          size="sm"
          variant="outline"
        >
          <ChevronLeft size={18} />
        </IconButton>

        {visiblePages.map((page) =>
          typeof page === "number" ? (
            <button
              aria-label={`Trang ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "transition-default h-10 min-w-10 rounded-xl border px-3 text-sm font-black outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                page === currentPage
                  ? "border-blue-300/70 bg-primary text-white shadow-[0_0_26px_rgba(0,91,255,0.42)]"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-blue-300/60 hover:bg-blue-500/10 hover:text-white",
              )}
              key={page}
              onClick={() => onPageChange(page)}
              type="button"
            >
              {page}
            </button>
          ) : (
            <span aria-hidden="true" className="flex h-10 min-w-8 items-center justify-center text-sm font-black text-slate-500" key={page}>
              ...
            </span>
          ),
        )}

        <IconButton
          aria-label="Trang tiếp"
          className="h-10 w-10 rounded-xl border-white/10 bg-white/[0.04] disabled:pointer-events-none disabled:opacity-40"
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(currentPage + 1)}
          size="sm"
          variant="outline"
        >
          <ChevronRight size={18} />
        </IconButton>
      </div>
    </nav>
  );
}

export default Pagination;
