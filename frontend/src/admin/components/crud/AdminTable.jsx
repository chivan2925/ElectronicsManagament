import { createElement, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from "lucide-react";
import { cn } from "../../../utils/classNames";
import AdminPagination from "./AdminPagination";
import EmptyAdminState from "./EmptyAdminState";

const rowActionToneClasses = {
  danger: "hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-rose-200",
  neutral: "hover:bg-white hover:text-primary focus-visible:ring-blue-200",
  primary: "hover:bg-blue-50 hover:text-primary focus-visible:ring-blue-200",
  warning: "hover:bg-amber-50 hover:text-amber-600 focus-visible:ring-amber-200",
};

function getPathValue(item, path) {
  return String(path)
    .split(".")
    .reduce((current, key) => current?.[key], item);
}

function normalizeSortValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return value;
  }

  return String(value).toLowerCase();
}

function sortRows(rows, columns, sortState) {
  if (!sortState?.key || !sortState.direction) {
    return rows;
  }

  const column = columns.find((item) => item.key === sortState.key);

  if (!column || column.sortable === false) {
    return rows;
  }

  const getValue =
    column.sortAccessor ||
    column.accessor ||
    ((row) => getPathValue(row, column.key));
  const direction = sortState.direction === "desc" ? -1 : 1;

  return [...rows].sort((first, second) => {
    const firstValue = normalizeSortValue(getValue(first));
    const secondValue = normalizeSortValue(getValue(second));

    if (firstValue > secondValue) {
      return direction;
    }

    if (firstValue < secondValue) {
      return -direction;
    }

    return 0;
  });
}

function getNextSortDirection(currentDirection) {
  if (currentDirection === "asc") {
    return "desc";
  }

  if (currentDirection === "desc") {
    return null;
  }

  return "asc";
}

function getSortIcon(sortState, columnKey) {
  if (sortState?.key !== columnKey || !sortState.direction) {
    return ArrowUpDown;
  }

  return sortState.direction === "asc" ? ArrowUp : ArrowDown;
}

function renderCell(column, row, rowIndex) {
  if (typeof column.render === "function") {
    return column.render(row, rowIndex);
  }

  if (typeof column.accessor === "function") {
    return column.accessor(row, rowIndex);
  }

  return getPathValue(row, column.key);
}

function resolveActionTone(action) {
  if (action.tone) {
    return action.tone;
  }

  if (["delete", "remove"].includes(action.key)) {
    return "danger";
  }

  if (["edit", "update"].includes(action.key)) {
    return "warning";
  }

  return "neutral";
}

function AdminTable({
  bulkActions = [],
  className,
  columns = [],
  data = [],
  emptyAction,
  emptyMessage,
  emptyTitle,
  enablePagination = false,
  enableSelection = false,
  getRowId = (row) => row.id,
  loading = false,
  manualPagination = false,
  manualSorting = false,
  onSelectedRowIdsChange,
  onSortChange,
  pageSizeOptions,
  pagination = null,
  rowActions = [],
  selectedRowIds,
  sort = null,
}) {
  const [localSort, setLocalSort] = useState({ direction: null, key: null });
  const [localPage, setLocalPage] = useState(0);
  const [localPageSize, setLocalPageSize] = useState(10);
  const [localSelectedRowIds, setLocalSelectedRowIds] = useState([]);
  const activeSort = sort ?? localSort;
  const activeSelectedRowIds = selectedRowIds ?? localSelectedRowIds;
  const selectedSet = useMemo(() => new Set(activeSelectedRowIds), [activeSelectedRowIds]);
  const showSelection = enableSelection || bulkActions.length > 0;
  const hasRowActions = rowActions.length > 0;
  const sortedRows = useMemo(
    () => (manualSorting ? data : sortRows(data, columns, activeSort)),
    [activeSort, columns, data, manualSorting],
  );
  const activePage = pagination?.page ?? localPage;
  const activePageSize = pagination?.pageSize ?? localPageSize;
  const totalItems = pagination?.totalItems ?? sortedRows.length;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(totalItems / activePageSize));
  const safePage = Math.min(Math.max(activePage, 0), Math.max(totalPages - 1, 0));
  const visibleRows =
    enablePagination && !manualPagination
      ? sortedRows.slice(safePage * activePageSize, safePage * activePageSize + activePageSize)
      : sortedRows;
  const selectableRowIds = visibleRows.map((row) => getRowId(row)).filter((id) => id !== undefined && id !== null);
  const allVisibleSelected =
    selectableRowIds.length > 0 && selectableRowIds.every((rowId) => selectedSet.has(rowId));
  const selectedCount = selectedSet.size;

  const handleSort = (column) => {
    if (column.sortable === false) {
      return;
    }

    const isSameColumn = activeSort?.key === column.key;
    const nextDirection = getNextSortDirection(isSameColumn ? activeSort.direction : null);
    const nextSort = {
      direction: nextDirection,
      key: nextDirection ? column.key : null,
    };

    setLocalSort(nextSort);
    onSortChange?.(nextSort);
  };

  const setSelectedIds = (nextIds) => {
    if (selectedRowIds === undefined) {
      setLocalSelectedRowIds(nextIds);
    }

    onSelectedRowIdsChange?.(nextIds);
  };

  const toggleRow = (rowId) => {
    const nextSelected = new Set(selectedSet);

    if (nextSelected.has(rowId)) {
      nextSelected.delete(rowId);
    } else {
      nextSelected.add(rowId);
    }

    setSelectedIds(Array.from(nextSelected));
  };

  const toggleVisibleRows = () => {
    const nextSelected = new Set(selectedSet);

    if (allVisibleSelected) {
      selectableRowIds.forEach((rowId) => nextSelected.delete(rowId));
    } else {
      selectableRowIds.forEach((rowId) => nextSelected.add(rowId));
    }

    setSelectedIds(Array.from(nextSelected));
  };

  const handlePageChange = (nextPage) => {
    setLocalPage(nextPage);
    pagination?.onPageChange?.(nextPage);
  };

  const handlePageSizeChange = (nextPageSize) => {
    setLocalPageSize(nextPageSize);
    setLocalPage(0);
    pagination?.onPageSizeChange?.(nextPageSize);
  };

  const skeletonRows = Array.from({ length: Math.min(activePageSize, 5) }, (_, index) => index);

  return (
    <section className={cn("admin-panel overflow-hidden rounded-2xl", className)}>
      {selectedCount > 0 && bulkActions.length > 0 ? (
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-[#07111F] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-black">{selectedCount} selected</p>
          <div className="flex flex-wrap gap-2">
            {bulkActions.map((action) => (
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={typeof action.disabled === "function" ? action.disabled(activeSelectedRowIds) : action.disabled}
                key={action.key}
                onClick={() => action.onClick?.(activeSelectedRowIds)}
                type="button"
              >
                {action.icon ? createElement(action.icon, { size: 16 }) : null}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/90">
            <tr>
              {showSelection ? (
                <th className="w-12 px-4 py-3.5">
                  <input
                    aria-label="Select all visible rows"
                    checked={allVisibleSelected}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-blue-200"
                    disabled={loading || selectableRowIds.length === 0}
                    onChange={toggleVisibleRows}
                    type="checkbox"
                  />
                </th>
              ) : null}

              {columns.map((column) => {
                const SortIcon = getSortIcon(activeSort, column.key);
                const sortable = column.sortable !== false;

                return (
                  <th
                    className={cn(
                      "whitespace-nowrap px-5 py-3.5 text-left text-xs font-black uppercase tracking-normal text-slate-500",
                      column.align === "right" && "text-right",
                      column.className,
                    )}
                    key={column.key}
                    style={{ width: column.width }}
                  >
                    {sortable ? (
                      <button
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-black uppercase tracking-normal transition hover:text-primary",
                          column.align === "right" && "ml-auto",
                        )}
                        onClick={() => handleSort(column)}
                        type="button"
                      >
                        {column.label}
                        <SortIcon size={14} />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}

              {hasRowActions ? (
                <th className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-black uppercase tracking-normal text-slate-500">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              skeletonRows.map((index) => (
                <tr key={index}>
                  {showSelection ? <td className="px-4 py-4" /> : null}
                  {columns.map((column) => (
                    <td className="px-5 py-4" key={`${index}-${column.key}`}>
                      <div className="h-4 w-full max-w-40 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                  {hasRowActions ? <td className="px-5 py-4" /> : null}
                </tr>
              ))
            ) : visibleRows.length > 0 ? (
              visibleRows.map((row, rowIndex) => {
                const rowId = getRowId(row);
                const isSelected = selectedSet.has(rowId);

                return (
                  <tr className={cn("admin-table-row", isSelected && "bg-blue-50/50")} key={rowId ?? rowIndex}>
                    {showSelection ? (
                      <td className="px-4 py-4">
                        <input
                          aria-label="Select row"
                          checked={isSelected}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-blue-200"
                          onChange={() => toggleRow(rowId)}
                          type="checkbox"
                        />
                      </td>
                    ) : null}

                    {columns.map((column) => (
                      <td
                        className={cn(
                          "whitespace-nowrap px-5 py-4 text-sm text-slate-700",
                          column.align === "right" && "text-right",
                          column.cellClassName,
                        )}
                        key={`${rowId ?? rowIndex}-${column.key}`}
                      >
                        {renderCell(column, row, rowIndex)}
                      </td>
                    ))}

                    {hasRowActions ? (
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1 rounded-xl bg-slate-50/90 p-1 ring-1 ring-slate-200">
                          {rowActions
                            .filter((action) => !(typeof action.hidden === "function" ? action.hidden(row) : action.hidden))
                            .map((action) => {
                              const disabled = typeof action.disabled === "function" ? action.disabled(row) : action.disabled;

                              return (
                                <button
                                  aria-label={action.label}
                                  className={cn(
                                    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-black text-slate-500 transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent",
                                    rowActionToneClasses[resolveActionTone(action)] || rowActionToneClasses.neutral,
                                  )}
                                  disabled={disabled}
                                  key={action.key}
                                  onClick={() => action.onClick?.(row)}
                                  title={action.label}
                                  type="button"
                                >
                                  {action.icon ? createElement(action.icon, { size: 16 }) : action.label}
                                </button>
                              );
                            })}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-5 py-8" colSpan={columns.length + (showSelection ? 1 : 0) + (hasRowActions ? 1 : 0)}>
                  <EmptyAdminState action={emptyAction} message={emptyMessage} title={emptyTitle} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 border-t border-slate-200 px-4 py-3 text-sm font-bold text-slate-500">
          <Loader2 className="animate-spin" size={16} />
          Loading records...
        </div>
      ) : null}

      {enablePagination ? (
        <AdminPagination
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          page={safePage}
          pageSize={activePageSize}
          pageSizeOptions={pageSizeOptions}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      ) : null}
    </section>
  );
}

export default AdminTable;
