const statusStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  HIDDEN: "bg-slate-100 text-slate-700 ring-slate-200",
  DELETED: "bg-rose-50 text-rose-700 ring-rose-200",
  BLOCKED: "bg-rose-50 text-rose-700 ring-rose-200",
  LOW_STOCK: "bg-amber-50 text-amber-700 ring-amber-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 ring-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
  EXPIRED: "bg-slate-100 text-slate-700 ring-slate-200",
};

const statusLabels = {
  ACTIVE: "Đang hoạt động",
  HIDDEN: "Đang ẩn",
  DELETED: "Đã xóa",
  BLOCKED: "Đã khóa",
  LOW_STOCK: "Sắp hết hàng",
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  EXPIRED: "Hết hạn",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        statusStyles[status] || "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export default StatusBadge;
