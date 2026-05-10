import { cn } from "../../../utils/classNames";

const toneClasses = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

const statusMeta = {
  ACTIVE: { label: "Đang hoạt động", tone: "emerald" },
  BLOCKED: { label: "Đã khóa", tone: "rose" },
  CANCELLED: { label: "Đã hủy", tone: "rose" },
  CONFIRMED: { label: "Đã xác nhận", tone: "blue" },
  COMPLETED: { label: "Hoàn tất", tone: "emerald" },
  DELETED: { label: "Đã xóa", tone: "rose" },
  DELIVERED: { label: "Đã giao", tone: "emerald" },
  DRAFT: { label: "Bản nháp", tone: "slate" },
  EXPIRED: { label: "Hết hạn", tone: "slate" },
  FAILED: { label: "Thất bại", tone: "rose" },
  HIDDEN: { label: "Đang ẩn", tone: "slate" },
  INACTIVE: { label: "Tạm ẩn", tone: "amber" },
  IN_STOCK: { label: "Còn hàng", tone: "emerald" },
  LOW_STOCK: { label: "Sắp hết hàng", tone: "amber" },
  OUT_OF_STOCK: { label: "Hết hàng", tone: "rose" },
  PAID: { label: "Đã thanh toán", tone: "emerald" },
  PENDING: { label: "Chờ xử lý", tone: "amber" },
  PROCESSING: { label: "Đang xử lý", tone: "blue" },
  REFUNDED: { label: "Hoàn tiền", tone: "violet" },
  RETURNED: { label: "Đã trả hàng", tone: "violet" },
  SCHEDULED: { label: "Sắp chạy", tone: "blue" },
  SHIPPING: { label: "Đang giao", tone: "blue" },
  VALID: { label: "Đang hiệu lực", tone: "emerald" },
};

function StatusBadge({ className, label, status, tone }) {
  const normalizedStatus = status
    ? String(status)
        .trim()
        .toUpperCase()
        .replace(/[-\s]+/g, "_")
    : "";
  const meta = statusMeta[normalizedStatus] ?? {};
  const resolvedTone = tone ?? meta.tone ?? "slate";
  const resolvedLabel = label ?? meta.label ?? status ?? "Unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1",
        toneClasses[resolvedTone] || toneClasses.slate,
        className,
      )}
    >
      {resolvedLabel}
    </span>
  );
}

export default StatusBadge;
