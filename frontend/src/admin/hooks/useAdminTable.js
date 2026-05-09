import { useMemo } from "react";
import useAdminFilters from "./useAdminFilters";
import useAdminPagination from "./useAdminPagination";

function useAdminTable({
  columns = [],
  data = [],
  filterFns = {},
  initialFilters = {},
  initialPageSize = 10,
  initialQuery = "",
  paginate = false,
  searchKeys = [],
} = {}) {
  const filterState = useAdminFilters({
    filterFns,
    initialFilters,
    initialQuery,
    items: data,
    searchKeys,
  });
  const pagination = useAdminPagination({
    initialPageSize,
    items: filterState.filteredItems,
  });
  const rows = paginate ? pagination.paginatedItems : filterState.filteredItems;
  const tableProps = useMemo(
    () => ({
      columns,
      data: rows,
    }),
    [columns, rows],
  );

  return {
    ...filterState,
    ...pagination,
    columns,
    filteredCount: filterState.filteredItems.length,
    filteredItems: filterState.filteredItems,
    rows,
    tableProps,
    totalCount: data.length,
  };
}

export default useAdminTable;
