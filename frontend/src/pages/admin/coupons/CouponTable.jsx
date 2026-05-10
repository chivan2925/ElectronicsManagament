import { CalendarClock, Eye, EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { COUPON_TYPE, getCouponLifecycle } from "../../../api/couponMapper";
import { AdminTable, StatusBadge } from "../../../admin/components";
import { cn } from "../../../utils/classNames";
import { formatCurrency } from "../../../utils/formatters";

const lifecycleMeta = {
  active: { label: "Đang hiệu lực", tone: "emerald" },
  deleted: { label: "Đã xóa", tone: "rose" },
  expired: { label: "Hết hạn", tone: "slate" },
  inactive: { label: "Tạm ẩn", tone: "amber" },
  scheduled: { label: "Sắp chạy", tone: "blue" },
};

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDiscount(coupon) {
  if (coupon.type === COUPON_TYPE.percent) {
    return `${coupon.value}%`;
  }

  return formatCurrency(coupon.value);
}

function CouponDiscountCell({ coupon }) {
  return (
    <div className="min-w-[190px]">
      <p className="text-sm font-black text-slate-900">{formatDiscount(coupon)}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">
        {coupon.type === COUPON_TYPE.percent ? "Percentage discount" : "Fixed discount"}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-400">
        Min {formatCurrency(coupon.minOrder)}
        {coupon.maxDiscount > 0 ? ` · Cap ${formatCurrency(coupon.maxDiscount)}` : ""}
      </p>
    </div>
  );
}

function CouponValidityCell({ coupon }) {
  return (
    <div className="min-w-[230px] space-y-1 text-xs font-semibold text-slate-600">
      <p className="flex items-center gap-2">
        <CalendarClock size={14} />
        <span className="font-black text-slate-800">{formatDateTime(coupon.startDate)}</span>
      </p>
      <p className="pl-6 text-slate-500">{formatDateTime(coupon.endDate)}</p>
    </div>
  );
}

function CouponUsageCell({ coupon }) {
  const hasLimit = Number(coupon.usageLimit) > 0;
  const usageRate = hasLimit ? Math.min(100, Math.round((Number(coupon.usedCount || 0) / Number(coupon.usageLimit)) * 100)) : 0;

  return (
    <div className="min-w-[180px]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-900">
          {Number(coupon.usedCount || 0).toLocaleString("vi-VN")}
          <span className="text-slate-400">/{hasLimit ? Number(coupon.usageLimit).toLocaleString("vi-VN") : "∞"}</span>
        </p>
        <span className="text-xs font-black text-slate-500">{hasLimit ? `${usageRate}%` : "No cap"}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full",
            usageRate >= 90 ? "bg-rose-500" : usageRate >= 60 ? "bg-amber-500" : "bg-primary",
          )}
          style={{ width: `${hasLimit ? usageRate : 8}%` }}
        />
      </div>
    </div>
  );
}

function CouponStatusCell({ canUpdate, coupon, onToggleStatus, statusUpdatingId }) {
  const lifecycle = getCouponLifecycle(coupon);
  const meta = lifecycleMeta[lifecycle] ?? lifecycleMeta.inactive;
  const nextLabel = coupon.status === "ACTIVE" ? "Tạm ẩn coupon" : "Kích hoạt coupon";

  return (
    <div className="flex min-w-[190px] flex-wrap items-center gap-2">
      <StatusBadge label={meta.label} status={lifecycle.toUpperCase()} tone={meta.tone} />
      <StatusBadge status={coupon.status} />
      {canUpdate && coupon.status !== "DELETED" ? (
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:bg-blue-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          disabled={statusUpdatingId === coupon.id}
          onClick={() => onToggleStatus(coupon)}
          title={nextLabel}
          type="button"
        >
          {statusUpdatingId === coupon.id ? (
            <Loader2 className="animate-spin" size={16} />
          ) : coupon.status === "ACTIVE" ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      ) : null}
    </div>
  );
}

function CouponTable({
  canDelete = false,
  canUpdate = false,
  data = [],
  loading = false,
  onDelete,
  onEdit,
  onToggleStatus,
  pagination,
  statusUpdatingId = null,
}) {
  const columns = useMemo(
    () => [
      {
        key: "code",
        label: "Coupon",
        render: (coupon) => (
          <div className="min-w-[160px]">
            <p className="font-black text-primary">{coupon.code}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">#{coupon.id}</p>
          </div>
        ),
      },
      {
        key: "type",
        label: "Discount",
        render: (coupon) => <CouponDiscountCell coupon={coupon} />,
      },
      {
        key: "startDate",
        label: "Validity",
        render: (coupon) => <CouponValidityCell coupon={coupon} />,
      },
      {
        key: "usageLimit",
        label: "Usage",
        render: (coupon) => <CouponUsageCell coupon={coupon} />,
      },
      {
        key: "status",
        label: "Status",
        render: (coupon) => (
          <CouponStatusCell
            canUpdate={canUpdate}
            coupon={coupon}
            onToggleStatus={onToggleStatus}
            statusUpdatingId={statusUpdatingId}
          />
        ),
      },
      {
        key: "updatedAt",
        label: "Updated",
        render: (coupon) => <span className="text-sm font-semibold text-slate-600">{formatDateTime(coupon.updatedAt)}</span>,
      },
    ],
    [canUpdate, onToggleStatus, statusUpdatingId],
  );

  const rowActions = useMemo(
    () =>
      [
        canUpdate
          ? {
              disabled: (coupon) => coupon.status === "DELETED",
              icon: Pencil,
              key: "edit",
              label: "Sửa coupon",
              onClick: onEdit,
            }
          : null,
        canDelete
          ? {
              disabled: (coupon) => coupon.status === "DELETED",
              icon: Trash2,
              key: "delete",
              label: "Xóa coupon",
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
      emptyMessage="Thử thay đổi từ khóa, trạng thái, thời hạn hoặc khoảng ngày."
      emptyTitle="Không có coupon nào phù hợp"
      enablePagination
      loading={loading}
      manualPagination
      pagination={pagination}
      rowActions={rowActions}
    />
  );
}

export default CouponTable;
