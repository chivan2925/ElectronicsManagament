import { useMemo } from "react";
import { Boxes, History, SlidersHorizontal, Warehouse } from "lucide-react";
import { AdminTable, StatusBadge } from "../../../admin/components";
import { cn } from "../../../utils/classNames";

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

function StockBadge({ quantity }) {
  const tone =
    quantity <= 0
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : quantity <= 10
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1", tone)}>{quantity ?? 0}</span>;
}

function StockLevel({ row }) {
  const labels = {
    IN_STOCK: "Healthy",
    LOW_STOCK: "Low stock",
    OUT_OF_STOCK: "Out",
  };
  const tone = {
    IN_STOCK: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    LOW_STOCK: "bg-amber-50 text-amber-700 ring-amber-100",
    OUT_OF_STOCK: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1", tone[row.status] ?? tone.IN_STOCK)}>
      {labels[row.status] ?? "Healthy"}
    </span>
  );
}

function WarehouseLoad({ row }) {
  const utilization = Math.min(Math.max(Number(row.utilization ?? 0), 0), 100);
  const tone = utilization >= 90 ? "bg-rose-500" : utilization >= 75 ? "bg-amber-500" : "bg-primary";

  return (
    <div className="min-w-[170px]">
      <div className="mb-1 flex items-center justify-between text-xs font-black text-slate-500">
        <span>{row.warehouseCurrentStock ?? 0}/{row.warehouseCapacity ?? 0}</span>
        <span>{utilization}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={cn("h-2 rounded-full", tone)} style={{ width: `${utilization}%` }} />
      </div>
    </div>
  );
}

function WarehouseTable({ canAdjust = false, data = [], loading = false, onAdjust, onHistory, pagination }) {
  const columns = useMemo(
    () => [
      {
        key: "variantName",
        label: "Stock item",
        render: (row) => (
          <div className="flex min-w-[280px] items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 ring-1 ring-slate-200">
              <Boxes size={18} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-black text-slate-950">{row.variantName}</p>
              <p className="truncate text-xs font-semibold text-slate-500">
                {row.sku ? `${row.sku} · ` : ""}Variant #{row.variantId ?? "N/A"}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "warehouseName",
        label: "Warehouse",
        render: (row) => (
          <div className="min-w-[240px]">
            <div className="flex items-center gap-2">
              <Warehouse className="text-slate-400" size={16} />
              <p className="font-black text-slate-800">{row.warehouseName}</p>
            </div>
            <p className="mt-1 max-w-[260px] truncate text-xs font-semibold text-slate-500">{row.warehouseAddress || "No address"}</p>
          </div>
        ),
      },
      {
        align: "right",
        key: "quantity",
        label: "On hand",
        render: (row) => <StockBadge quantity={row.quantity} />,
      },
      {
        key: "status",
        label: "Stock state",
        render: (row) => (
          <div className="flex flex-wrap items-center gap-2">
            <StockLevel row={row} />
            <StatusBadge status={row.warehouseStatus} />
          </div>
        ),
      },
      {
        key: "utilization",
        label: "Capacity",
        render: (row) => <WarehouseLoad row={row} />,
      },
      {
        key: "updatedAt",
        label: "Updated",
        render: (row) => <span className="text-sm font-semibold text-slate-500">{formatDateTime(row.updatedAt)}</span>,
      },
    ],
    [],
  );

  const rowActions = useMemo(
    () =>
      [
        canAdjust
          ? {
              disabled: (row) => row.warehouseStatus === "DELETED",
              icon: SlidersHorizontal,
              key: "adjust",
              label: "Adjust stock",
              onClick: onAdjust,
            }
          : null,
        onHistory
          ? {
              icon: History,
              key: "history",
              label: "Stock history",
              onClick: onHistory,
            }
          : null,
      ].filter(Boolean),
    [canAdjust, onAdjust, onHistory],
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      emptyMessage="Try another warehouse, status, or stock level filter."
      emptyTitle="No stock rows found"
      enablePagination
      loading={loading}
      manualPagination
      pagination={pagination}
      rowActions={rowActions}
    />
  );
}

export default WarehouseTable;
