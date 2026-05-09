import { useCallback, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

function toPositiveNumber(value, fallback) {
  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function clampPage(page, totalPages) {
  const pageNumber = Number(page);
  const safePage = Number.isFinite(pageNumber) ? Math.trunc(pageNumber) : 0;

  return Math.min(Math.max(safePage, 0), Math.max(totalPages - 1, 0));
}

export function paginateAdminItems(items = [], { page = 0, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const safePageSize = toPositiveNumber(pageSize, DEFAULT_PAGE_SIZE);
  const start = clampPage(page, Math.max(1, Math.ceil(items.length / safePageSize))) * safePageSize;

  return items.slice(start, start + safePageSize);
}

function useAdminPagination({ initialPage = 0, initialPageSize = DEFAULT_PAGE_SIZE, items = [], totalItems } = {}) {
  const [pageState, setPageState] = useState(initialPage);
  const [pageSizeState, setPageSizeState] = useState(initialPageSize);
  const pageSize = toPositiveNumber(pageSizeState, DEFAULT_PAGE_SIZE);
  const resolvedTotalItems = Number.isFinite(Number(totalItems)) ? Number(totalItems) : items.length;
  const totalPages = Math.max(1, Math.ceil(resolvedTotalItems / pageSize));
  const page = clampPage(pageState, totalPages);

  const paginatedItems = useMemo(() => paginateAdminItems(items, { page, pageSize }), [items, page, pageSize]);

  const setPage = useCallback(
    (nextPage) => {
      setPageState((currentPage) => {
        const value = typeof nextPage === "function" ? nextPage(currentPage) : nextPage;
        return clampPage(value, totalPages);
      });
    },
    [totalPages],
  );

  const setPageSize = useCallback((nextPageSize) => {
    setPageSizeState(toPositiveNumber(nextPageSize, DEFAULT_PAGE_SIZE));
    setPageState(0);
  }, []);

  const nextPage = useCallback(() => setPage((currentPage) => currentPage + 1), [setPage]);
  const previousPage = useCallback(() => setPage((currentPage) => currentPage - 1), [setPage]);
  const resetPage = useCallback(() => setPageState(0), []);

  return {
    canGoNext: page + 1 < totalPages,
    canGoPrevious: page > 0,
    nextPage,
    page,
    pageSize,
    paginatedItems,
    previousPage,
    resetPage,
    setPage,
    setPageSize,
    totalItems: resolvedTotalItems,
    totalPages,
  };
}

export default useAdminPagination;
