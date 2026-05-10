import { Eye, Package, Phone, ReceiptText, Truck } from "lucide-react";
import { useMemo } from "react";
import { getStageTone } from "../../../api/orderMapper";
import { AdminIconButton, AdminTable, StatusBadge } from "../../../admin/components";
import { formatCurrency } from "../../../utils/formatters";

const paymentLabels = {
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
  PAID: "Đã thanh toán",
  PENDING: "Chờ thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

const paymentTones = {
  CANCELLED: "rose",
  FAILED: "rose",
  PAID: "emerald",
  PENDING: "amber",
  REFUNDED: "violet",
};

const shippingLabels = {
  CANCELLED: "Đã hủy",
  DELIVERED: "Đã giao",
  PENDING: "Chờ lấy hàng",
  RETURNED: "Đã trả hàng",
  SHIPPING: "Đang giao",
};

const shippingTones = {
  CANCELLED: "rose",
  DELIVERED: "emerald",
  PENDING: "amber",
  RETURNED: "violet",
  SHIPPING: "blue",
};

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function OrderTable({ canUpdate = false, data = [], loading = false, onView, pagination }) {
  const columns = useMemo(
    () => [
      {
        key: "code",
        label: "Đơn hàng",
        render: (item) => (
          <div className="flex min-w-[180px] items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
              <ReceiptText size={18} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-black text-slate-950">{item.code || `#${item.id}`}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">ID {item.id}</p>
            </div>
          </div>
        ),
      },
      {
        key: "customer",
        label: "Khách hàng",
        render: (item) => (
          <div className="min-w-[180px]">
            <p className="truncate font-black text-slate-900">{item.customerName}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
              <Phone size={12} />
              {item.shippingPhone || "—"}
            </p>
          </div>
        ),
      },
      {
        key: "stage",
        label: "Trạng thái",
        render: (item) => <StatusBadge label={item.stageLabel} status={String(item.stage || "").toUpperCase()} tone={getStageTone(item.stage)} />,
      },
      {
        key: "paymentStatus",
        label: "Thanh toán",
        render: (item) => <StatusBadge label={paymentLabels[item.paymentStatus] || item.paymentStatus} status={item.paymentStatus} tone={paymentTones[item.paymentStatus]} />,
      },
      {
        key: "shippingStatus",
        label: "Vận chuyển",
        render: (item) => (
          <div className="flex items-center gap-2">
            <Truck className="text-slate-400" size={16} />
            <StatusBadge label={shippingLabels[item.shippingStatus] || item.shippingStatus} status={item.shippingStatus} tone={shippingTones[item.shippingStatus]} />
          </div>
        ),
      },
      {
        align: "right",
        key: "total",
        label: "Tổng tiền",
        render: (item) => <span className="font-black text-slate-950">{formatCurrency(item.total || 0)}</span>,
      },
      {
        key: "createdAt",
        label: "Ngày tạo",
        render: (item) => <span className="text-sm font-semibold text-slate-600">{formatDate(item.createdAt)}</span>,
      },
      {
        key: "tools",
        label: "Thao tác",
        sortable: false,
        render: (item) => (
          <div className="flex items-center gap-2">
            <AdminIconButton icon={Package} title={item.shippingProvider || "Đơn vị vận chuyển"} />
            <AdminIconButton icon={Eye} onClick={() => onView?.(item)} title={canUpdate ? "Xem và cập nhật đơn hàng" : "Xem đơn hàng"} />
          </div>
        ),
      },
    ],
    [canUpdate, onView],
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      emptyMessage="Hãy thử thay đổi từ khóa, trạng thái đơn, trạng thái thanh toán hoặc vận chuyển."
      emptyTitle="Không tìm thấy đơn hàng"
      enablePagination
      loading={loading}
      manualPagination
      pagination={pagination}
    />
  );
}

export default OrderTable;
