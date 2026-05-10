import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import { Boxes, ClipboardList, Loader2, Plus, RefreshCw, Warehouse as WarehouseIcon } from "lucide-react";
import variantService from "../../api/variantService";
import warehouseService from "../../api/warehouseService";
import { LOW_STOCK_THRESHOLD, flattenWarehouseStocks } from "../../api/warehouseMapper";
import { AdminFilters, AdminSearch } from "../../admin/components";
import { useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import { publishRealtimeEvent } from "../../hooks/useRealtime";
import { REALTIME_EVENT_TYPES } from "../../realtime/realtimeEvents";
import LowStockCard from "./warehouse/LowStockCard";
import StockAdjustModal from "./warehouse/StockAdjustModal";
import WarehouseTable from "./warehouse/WarehouseTable";

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Deleted", value: "DELETED" },
];

const STOCK_FILTER_OPTIONS = [
  { label: "Healthy", value: "healthy" },
  { label: "Low stock", value: "low" },
  { label: "Out of stock", value: "out" },
];

const INITIAL_ADJUST_VALUES = {
  note: "",
  quantity: 1,
  type: "IMPORT",
  variantId: "",
  warehouseId: "",
};

function formatDateTime(value) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function StatCard({ icon, label, value }) {
  return (
    <div className="admin-panel admin-panel-hover rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
          {createElement(icon, { size: 18 })}
        </span>
        <span className="text-xl font-black text-slate-950">{value}</span>
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
    </div>
  );
}

function HistoryCard({ error, items = [], loading = false, onRetry }) {
  return (
    <section className="admin-panel rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 ring-1 ring-slate-200">
            <ClipboardList size={18} />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-950">Stock history</h2>
            <p className="text-xs font-semibold text-slate-500">Latest movements</p>
          </div>
        </div>
        {loading ? <Loader2 className="animate-spin text-slate-400" size={17} /> : null}
      </div>

      <div className="mt-4 space-y-2">
        {error ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-3">
            <p className="text-sm font-black text-rose-700">Could not load history</p>
            <button className="mt-2 text-xs font-black text-rose-700 underline" onClick={onRetry} type="button">
              Retry
            </button>
          </div>
        ) : loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div className="h-14 animate-pulse rounded-xl bg-slate-100" key={index} />
          ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" key={item.id ?? item.code}>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-black text-slate-900">{item.code}</p>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                  {item.type}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {item.warehouseName || "Warehouse"} · {item.quantity} units · {formatDateTime(item.updatedAt)}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center">
            <p className="text-sm font-black text-slate-700">No stock movement yet</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Recent adjustments will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Warehouse() {
  const permission = usePermissions();
  const toast = useToast();

  const [warehouses, setWarehouses] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [variants, setVariants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [statusFilter, setStatusFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustErrors, setAdjustErrors] = useState({});
  const [adjustValues, setAdjustValues] = useState(INITIAL_ADJUST_VALUES);
  const [selectedStock, setSelectedStock] = useState(null);

  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.warehouse, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.warehouse, "update");
  const canAdjust = canCreate || canUpdate;

  const loadWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await warehouseService.getAll(
        {
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setWarehouses(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setWarehouses([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, statusFilter]);

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);

    try {
      const [warehousePage, variantPage] = await Promise.all([
        warehouseService.getAll(
          {
            page: 0,
            size: 200,
            sort: "name,asc",
            status: "ACTIVE",
          },
          { skipGlobalErrorHandler: true },
        ),
        variantService.getAll(
          {
            page: 0,
            size: 300,
            sort: "name,asc",
            status: "ACTIVE",
          },
          { skipGlobalErrorHandler: true },
        ),
      ]);

      setWarehouseOptions(warehousePage.items);
      setVariants(variantPage.items);
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được dữ liệu điều chỉnh tồn kho" });
    } finally {
      setOptionsLoading(false);
    }
  }, [toast]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const response = await warehouseService.getTransactions(
        {
          page: 0,
          size: 5,
          sort: "updatedAt,desc",
        },
        { skipGlobalErrorHandler: true },
      );

      setTransactions(response.items);
    } catch (requestError) {
      setHistoryError(requestError);
      setTransactions([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses, reloadKey]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, reloadKey]);

  const stockRows = useMemo(() => flattenWarehouseStocks(warehouses), [warehouses]);

  const visibleStockRows = useMemo(() => {
    const normalizedQuery = debouncedQuery.toLowerCase();

    return stockRows.filter((row) => {
      const matchesStockFilter =
        !stockFilter ||
        (stockFilter === "low" && row.quantity > 0 && row.quantity <= LOW_STOCK_THRESHOLD) ||
        (stockFilter === "out" && row.quantity <= 0) ||
        (stockFilter === "healthy" && row.quantity > LOW_STOCK_THRESHOLD);

      if (!matchesStockFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [row.variantName, row.sku, row.warehouseName, row.warehouseAddress]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [debouncedQuery, stockFilter, stockRows]);

  const lowStockRows = useMemo(
    () =>
      stockRows
        .filter((row) => row.quantity <= LOW_STOCK_THRESHOLD)
        .sort((first, second) => first.quantity - second.quantity),
    [stockRows],
  );

  const stats = useMemo(() => {
    const totalUnits = warehouses.reduce((total, warehouse) => total + Number(warehouse.currentStock || 0), 0);
    const totalCapacity = warehouses.reduce((total, warehouse) => total + Number(warehouse.capacity || 0), 0);
    const utilization = totalCapacity > 0 ? `${Math.round((totalUnits / totalCapacity) * 100)}%` : "0%";

    return [
      { icon: WarehouseIcon, label: "Warehouses", value: pageMeta.totalItems },
      { icon: Boxes, label: "Stock rows", value: stockRows.length },
      { icon: ClipboardList, label: "Units on page", value: totalUnits.toLocaleString("vi-VN") },
      { icon: RefreshCw, label: "Capacity used", value: utilization },
    ];
  }, [pageMeta.totalItems, stockRows.length, warehouses]);

  const filterValues = useMemo(
    () => ({
      status: statusFilter,
      stockLevel: stockFilter,
    }),
    [statusFilter, stockFilter],
  );

  const handleFilterChange = (key, value) => {
    if (key === "status") {
      setStatusFilter(value);
      setPage(0);
    }

    if (key === "stockLevel") {
      setStockFilter(value);
    }
  };

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("");
    setStockFilter("");
    setPage(0);
  };

  const handleAdjustChange = (key, value) => {
    setAdjustValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
    setAdjustErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }));
  };

  const openAdjustment = (stock = null) => {
    setSelectedStock(stock);
    setAdjustErrors({});
    setAdjustValues({
      ...INITIAL_ADJUST_VALUES,
      variantId: stock?.variantId ? String(stock.variantId) : "",
      warehouseId: stock?.warehouseId ? String(stock.warehouseId) : "",
    });
    setAdjustOpen(true);
  };

  const closeAdjustment = () => {
    if (submitting) {
      return;
    }

    setAdjustOpen(false);
    setSelectedStock(null);
    setAdjustErrors({});
    setAdjustValues(INITIAL_ADJUST_VALUES);
  };

  const validateAdjustment = () => {
    const errors = {};
    const quantity = Number(adjustValues.quantity);

    if (!adjustValues.warehouseId) {
      errors.warehouseId = "Warehouse is required.";
    }

    if (!adjustValues.variantId) {
      errors.variantId = "Variant is required.";
    }

    if (!adjustValues.type) {
      errors.type = "Movement type is required.";
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.quantity = "Quantity must be a positive whole number.";
    }

    if (selectedStock && adjustValues.type === "EXPORT" && quantity > Number(selectedStock.quantity || 0)) {
      errors.quantity = "Quantity cannot exceed current stock.";
    }

    return errors;
  };

  const handleSubmitAdjustment = async () => {
    const errors = validateAdjustment();
    setAdjustErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await warehouseService.createAndCompleteTransaction(adjustValues, { skipGlobalErrorHandler: true });
      toast.showSuccess("Đã cập nhật tồn kho.");
      const quantity = Number(adjustValues.quantity || 0);
      const currentQuantity = selectedStock ? Number(selectedStock.quantity || 0) : null;
      const nextQuantity = currentQuantity === null
        ? null
        : adjustValues.type === "EXPORT"
          ? currentQuantity - quantity
          : currentQuantity + quantity;
      const selectedVariant = variants.find((variant) => String(variant.id) === String(adjustValues.variantId));
      const selectedWarehouse = warehouseOptions.find((warehouse) => String(warehouse.id) === String(adjustValues.warehouseId));
      const becameLowStock = nextQuantity !== null && nextQuantity <= LOW_STOCK_THRESHOLD;
      const replenishedStock =
        currentQuantity !== null && currentQuantity <= LOW_STOCK_THRESHOLD && nextQuantity > LOW_STOCK_THRESHOLD;

      if (becameLowStock || replenishedStock) {
        publishRealtimeEvent(
          {
            channel: "admin",
            id: `warehouse-stock-${adjustValues.variantId}-${adjustValues.warehouseId}-${Date.now()}`,
            message: `${selectedStock?.variantName || selectedVariant?.name || "Variant"} now has ${nextQuantity} units in ${selectedStock?.warehouseName || selectedWarehouse?.name || "warehouse"}.`,
            payload: {
              movementQuantity: quantity,
              movementType: adjustValues.type,
              productName: selectedStock?.variantName || selectedVariant?.name || "",
              quantity: nextQuantity,
              sku: selectedStock?.sku || selectedVariant?.sku || "",
              stock: nextQuantity,
              threshold: LOW_STOCK_THRESHOLD,
              variantId: adjustValues.variantId,
              warehouseId: adjustValues.warehouseId,
              warehouseName: selectedStock?.warehouseName || selectedWarehouse?.name || "",
            },
            priority: becameLowStock ? "high" : "medium",
            source: "admin-warehouse",
            title: becameLowStock ? "Low stock alert" : "Stock replenished",
            type: becameLowStock ? REALTIME_EVENT_TYPES.STOCK_LOW : REALTIME_EVENT_TYPES.STOCK_RESTOCKED,
          },
          { queue: true },
        );
      }
      closeAdjustment();
      setReloadKey((value) => value + 1);
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Điều chỉnh tồn kho thất bại" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-page-shell">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Warehouse Management</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Stock overview, inventory adjustments, low-stock alerts, and movement history.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            onClick={() => setReloadKey((value) => value + 1)}
            type="button"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            Refresh
          </button>

          {canAdjust ? (
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-admin-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              disabled={optionsLoading}
              onClick={() => openAdjustment(null)}
              type="button"
            >
              {optionsLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              New adjustment
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard icon={stat.icon} key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(460px,0.72fr)]">
            <AdminSearch
              disabled={loading}
              onChange={(nextValue) => {
                setQuery(nextValue);
                setPage(0);
              }}
              placeholder="Search warehouse, variant, SKU, or address..."
              value={query}
            />

            <AdminFilters
              className="p-3"
              filters={[
                {
                  key: "status",
                  label: "Warehouse",
                  options: STATUS_OPTIONS,
                  placeholder: "All statuses",
                  type: "select",
                },
                {
                  key: "stockLevel",
                  label: "Stock level",
                  options: STOCK_FILTER_OPTIONS,
                  placeholder: "All levels",
                  type: "select",
                },
              ]}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              summary="Inventory controls"
              title="Filters"
              values={filterValues}
            />
          </div>

          {error ? (
            <ApiErrorAlert
              actionLabel="Tải lại"
              error={error}
              onAction={() => setReloadKey((value) => value + 1)}
              onDismiss={() => setError(null)}
              surface="admin"
            />
          ) : null}

          <WarehouseTable
            canAdjust={canAdjust}
            data={visibleStockRows}
            loading={loading}
            onAdjust={openAdjustment}
            pagination={{
              onPageChange: (nextPage) => setPage(nextPage),
              onPageSizeChange: (nextPageSize) => {
                setPageSize(nextPageSize);
                setPage(0);
              },
              page,
              pageSize,
              totalItems: pageMeta.totalItems,
              totalPages: pageMeta.totalPages,
            }}
          />
        </div>

        <aside className="space-y-4">
          <LowStockCard
            canAdjust={canAdjust}
            items={lowStockRows}
            loading={loading}
            onAdjust={openAdjustment}
            threshold={LOW_STOCK_THRESHOLD}
          />
          <HistoryCard error={historyError} items={transactions} loading={historyLoading} onRetry={loadHistory} />
        </aside>
      </div>

      <StockAdjustModal
        errors={adjustErrors}
        loadingOptions={optionsLoading}
        onChange={handleAdjustChange}
        onClose={closeAdjustment}
        onSubmit={handleSubmitAdjustment}
        open={adjustOpen}
        selectedStock={selectedStock}
        submitting={submitting}
        values={adjustValues}
        variants={variants}
        warehouses={warehouseOptions}
      />
    </section>
  );
}

export default Warehouse;
