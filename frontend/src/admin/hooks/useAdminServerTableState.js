import { useCallback, useMemo, useState } from "react";

const DEFAULT_PAGE_META = {
  totalItems: 0,
  totalPages: 1,
};

function normalizePage(value) {
  const page = Number(value);

  return Number.isFinite(page) ? Math.max(0, page) : 0;
}

function normalizePageSize(value, fallback) {
  const pageSize = Number(value);

  return Number.isFinite(pageSize) && pageSize > 0 ? pageSize : fallback;
}

function normalizePageMeta(meta = {}) {
  return {
    totalItems: Number.isFinite(Number(meta.totalItems)) ? Number(meta.totalItems) : DEFAULT_PAGE_META.totalItems,
    totalPages: Math.max(1, Number.isFinite(Number(meta.totalPages)) ? Number(meta.totalPages) : DEFAULT_PAGE_META.totalPages),
  };
}

function useAdminServerTableState({ initialPage = 0, initialPageMeta = DEFAULT_PAGE_META, initialPageSize = 10 } = {}) {
  const [page, setPageValue] = useState(() => normalizePage(initialPage));
  const [pageSize, setPageSizeValue] = useState(() => normalizePageSize(initialPageSize, 10));
  const [pageMeta, setPageMetaValue] = useState(() => normalizePageMeta(initialPageMeta));
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  const setPage = useCallback((nextPage) => {
    setPageValue((currentPage) => normalizePage(typeof nextPage === "function" ? nextPage(currentPage) : nextPage));
  }, []);

  const resetPage = useCallback(() => {
    setPageValue(0);
  }, []);

  const setPageSize = useCallback(
    (nextPageSize) => {
      setPageSizeValue((currentPageSize) => normalizePageSize(nextPageSize, currentPageSize || initialPageSize || 10));
      setPageValue(0);
    },
    [initialPageSize],
  );

  const setPageMeta = useCallback((nextPageMeta) => {
    setPageMetaValue(normalizePageMeta(nextPageMeta));
  }, []);

  const pagination = useMemo(
    () => ({
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
      page,
      pageSize,
      totalItems: pageMeta.totalItems,
      totalPages: pageMeta.totalPages,
    }),
    [page, pageMeta.totalItems, pageMeta.totalPages, pageSize, setPage, setPageSize],
  );

  return {
    page,
    pageMeta,
    pageSize,
    pagination,
    refresh,
    reloadKey,
    resetPage,
    setPage,
    setPageMeta,
    setPageSize,
  };
}

export default useAdminServerTableState;
