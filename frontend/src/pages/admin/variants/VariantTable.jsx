import { Loader2, Package, Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { AdminTable, StatusBadge } from "../../../admin/components";
import OptimizedImage from "../../../components/common/OptimizedImage";
import { formatCurrency } from "../../../utils/formatters";

function AttributeChips({ variant }) {
  const chips = [
    variant.color ? { label: "Color", value: variant.color } : null,
    variant.size ? { label: "Size", value: variant.size } : null,
    ...(variant.attributes ?? []).slice(0, 2).map((attribute) => ({
      label: attribute.key,
      value: attribute.value,
    })),
  ].filter(Boolean);

  if (!chips.length) {
    return <span className="text-sm font-semibold text-slate-400">—</span>;
  }

  return (
    <div className="flex max-w-[260px] flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200" key={`${chip.label}-${chip.value}`}>
          {chip.label}: {chip.value}
        </span>
      ))}
    </div>
  );
}

function VariantImage({ variant }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {variant.image ? (
        <OptimizedImage alt={variant.name} className="h-full w-full object-cover" fallbackKind="product" sizes="44px" src={variant.image} />
      ) : (
        <Package className="text-slate-400" size={18} />
      )}
    </div>
  );
}

function StockBadge({ stock }) {
  const tone = stock <= 0 ? "bg-rose-50 text-rose-700 ring-rose-200" : stock <= 10 ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${tone}`}>{stock ?? 0}</span>;
}

function VariantTable({
  canDelete = false,
  canUpdate = false,
  data = [],
  loading = false,
  onDelete,
  onEdit,
  onToggleStatus,
  pagination,
  statusUpdatingId,
}) {
  const columns = useMemo(
    () => [
      {
        key: "sku",
        label: "SKU",
        render: (item) => (
          <div className="flex min-w-[260px] items-center gap-3">
            <VariantImage variant={item} />
            <div className="min-w-0">
              <p className="font-black text-slate-900">{item.sku || "—"}</p>
              <p className="truncate text-xs font-semibold text-slate-500">{item.name}</p>
            </div>
          </div>
        ),
      },
      {
        key: "productName",
        label: "Sản phẩm",
        render: (item) => <span className="text-sm font-semibold text-slate-700">{item.productName || "—"}</span>,
      },
      {
        key: "attributes",
        label: "Attributes",
        render: (item) => <AttributeChips variant={item} />,
      },
      {
        key: "price",
        label: "Giá",
        render: (item) => <span className="font-black text-slate-950">{formatCurrency(item.price || 0)}</span>,
      },
      {
        key: "stock",
        label: "Tồn",
        render: (item) => <StockBadge stock={item.stock} />,
      },
      {
        key: "status",
        label: "Trạng thái",
        render: (item) => (
          <button
            className="inline-flex rounded-full disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!canUpdate || item.status === "DELETED" || statusUpdatingId === item.id}
            onClick={() => onToggleStatus?.(item)}
            title={item.status === "ACTIVE" ? "Ẩn biến thể" : "Kích hoạt biến thể"}
            type="button"
          >
            {statusUpdatingId === item.id ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-primary ring-1 ring-blue-100">
                <Loader2 className="animate-spin" size={13} />
                Đang lưu
              </span>
            ) : (
              <StatusBadge status={item.status} />
            )}
          </button>
        ),
      },
    ],
    [canUpdate, onToggleStatus, statusUpdatingId],
  );

  const rowActions = useMemo(
    () =>
      [
        canUpdate
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Pencil,
              key: "edit",
              label: "Sửa biến thể",
              onClick: onEdit,
            }
          : null,
        canDelete
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Trash2,
              key: "delete",
              label: "Xóa biến thể",
              onClick: onDelete,
            }
          : null,
      ].filter(Boolean),
    [canDelete, canUpdate, onDelete, onEdit],
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      emptyMessage="Thử đổi từ khóa, sản phẩm hoặc trạng thái."
      emptyTitle="Không có biến thể phù hợp"
      enablePagination
      loading={loading}
      manualPagination
      pagination={pagination}
      rowActions={rowActions}
    />
  );
}

export default VariantTable;
