import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../utils/classNames";

const defaultPageSizeOptions = [10, 20, 50, 100];

function AdminPagination({
  className,
  onPageChange,
  onPageSizeChange,
  page = 0,
  pageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  totalItems = 0,
  totalPages = Math.max(1, Math.ceil(totalItems / pageSize)),
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(page, 0), safeTotalPages - 1);
  const startItem = totalItems === 0 ? 0 : safePage * pageSize + 1;
  const endItem = Math.min(totalItems, (safePage + 1) * pageSize);
  const canGoPrevious = safePage > 0;
  const canGoNext = safePage + 1 < safeTotalPages;

  return (
    <div className={cn("flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <p className="text-sm font-semibold text-slate-500">
        Showing <span className="font-black text-slate-900">{startItem}</span>-
        <span className="font-black text-slate-900">{endItem}</span> of{" "}
        <span className="font-black text-slate-900">{totalItems}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="admin-control h-9 rounded-lg px-2 text-sm font-bold text-slate-700 outline-none"
          onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          value={pageSize}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} / page
            </option>
          ))}
        </select>

        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
          <button
            aria-label="Previous page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-50 hover:text-primary disabled:cursor-not-allowed disabled:text-slate-300"
            disabled={!canGoPrevious}
            onClick={() => onPageChange?.(safePage - 1)}
            type="button"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-3 text-sm font-black text-slate-700">
            {safePage + 1}/{safeTotalPages}
          </span>
          <button
            aria-label="Next page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-50 hover:text-primary disabled:cursor-not-allowed disabled:text-slate-300"
            disabled={!canGoNext}
            onClick={() => onPageChange?.(safePage + 1)}
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPagination;
