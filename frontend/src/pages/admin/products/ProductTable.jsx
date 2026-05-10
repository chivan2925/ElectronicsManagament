import { Image, Layers3, Loader2, Pencil, Star, Trash2 } from "lucide-react";
import { useMemo } from "react";
import PermissionGate from "../../../auth/PermissionGate";
import { ADMIN_RESOURCES, getResourceActionPolicy } from "../../../auth/roleHelpers";
import { AdminIconButton, AdminTable, StatusBadge } from "../../../admin/components";
import OptimizedImage from "../../../components/common/OptimizedImage";
import { formatCurrency } from "../../../utils/formatters";

const variantToolPolicy = getResourceActionPolicy(ADMIN_RESOURCES.variants, "view");
const mediaToolPolicy = getResourceActionPolicy(ADMIN_RESOURCES.media, "view");

function ProductThumb({ product }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {product.image ? (
        <OptimizedImage alt={product.name} className="h-full w-full object-cover" fallbackKind="product" sizes="48px" src={product.image} />
      ) : (
        <Image className="text-slate-400" size={18} />
      )}
    </div>
  );
}

function FeaturedToggle({ disabled, loading, onToggle, product }) {
  return (
    <button
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled || loading}
      onClick={() => onToggle?.(product)}
      title={product.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
      type="button"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <Star fill={product.featured ? "currentColor" : "none"} size={16} />
      )}
    </button>
  );
}

function ProductTable({
  canDelete = false,
  canUpdate = false,
  data = [],
  featuredUpdatingId,
  loading = false,
  onDelete,
  onEdit,
  onToggleFeatured,
  onToggleStatus,
  pagination,
  statusUpdatingId,
}) {
  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Sản phẩm",
        render: (item) => (
          <div className="flex min-w-[300px] items-center gap-3">
            <ProductThumb product={item} />
            <div className="min-w-0">
              <p className="truncate font-black text-slate-900">{item.name}</p>
              <p className="truncate text-xs font-semibold text-slate-500">{item.slug}</p>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        label: "Danh mục",
        render: (item) => <span className="text-sm font-semibold text-slate-700">{item.category || "—"}</span>,
      },
      {
        key: "brand",
        label: "Thương hiệu",
        render: (item) => <span className="text-sm font-semibold text-slate-700">{item.brand || "—"}</span>,
      },
      {
        key: "price",
        label: "Giá",
        render: (item) => <span className="font-black text-slate-950">{formatCurrency(item.price || 0)}</span>,
      },
      {
        key: "stock",
        label: "Tồn",
        render: (item) => (
          <span className={item.stock <= 0 ? "font-black text-rose-600" : item.stock <= 10 ? "font-black text-amber-600" : "font-black text-slate-800"}>
            {item.stock ?? 0}
          </span>
        ),
      },
      {
        key: "featured",
        label: "Nổi bật",
        render: (item) => (
          <FeaturedToggle
            disabled={!canUpdate || item.status === "DELETED"}
            loading={featuredUpdatingId === item.id}
            onToggle={onToggleFeatured}
            product={item}
          />
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        render: (item) => (
          <button
            className="inline-flex rounded-full disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!canUpdate || item.status === "DELETED" || statusUpdatingId === item.id}
            onClick={() => onToggleStatus?.(item)}
            title={item.status === "ACTIVE" ? "Ẩn sản phẩm" : "Kích hoạt sản phẩm"}
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
      {
        key: "tools",
        label: "Quản lý",
        render: () => (
          <div className="flex items-center gap-2">
            <PermissionGate policy={variantToolPolicy}>
              <AdminIconButton icon={Layers3} title="Biến thể" />
            </PermissionGate>
            <PermissionGate policy={mediaToolPolicy}>
              <AdminIconButton icon={Image} title="Media" />
            </PermissionGate>
          </div>
        ),
      },
    ],
    [canUpdate, featuredUpdatingId, onToggleFeatured, onToggleStatus, statusUpdatingId],
  );

  const rowActions = useMemo(
    () =>
      [
        canUpdate
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Pencil,
              key: "edit",
              label: "Sửa sản phẩm",
              onClick: onEdit,
            }
          : null,
        canDelete
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Trash2,
              key: "delete",
              label: "Xóa sản phẩm",
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
      emptyMessage="Thử đổi từ khóa, danh mục, thương hiệu hoặc trạng thái."
      emptyTitle="Không có sản phẩm phù hợp"
      enablePagination
      loading={loading}
      manualPagination
      pagination={pagination}
      rowActions={rowActions}
    />
  );
}

export default ProductTable;
