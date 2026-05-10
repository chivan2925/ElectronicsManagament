import { Eye, Package, Phone, ReceiptText, Truck } from "lucide-react";
import { useMemo } from "react";
import { getStageTone } from "../../../api/orderMapper";
import { AdminIconButton, AdminTable } from "../../../admin/components";
import { cn } from "../../../utils/classNames";
import { formatCurrency } from "../../../utils/formatters";

const toneClasses = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

const paymentLabels = {
  FAILED: "Failed",
  PAID: "Paid",
  PENDING: "Pending",
  REFUNDED: "Refunded",
};

const paymentTones = {
  FAILED: "rose",
  PAID: "emerald",
  PENDING: "amber",
  REFUNDED: "violet",
};

const shippingLabels = {
  CANCELLED: "Cancelled",
  DELIVERED: "Delivered",
  PENDING: "Pending",
  RETURNED: "Returned",
  SHIPPING: "Shipping",
};

const shippingTones = {
  CANCELLED: "rose",
  DELIVERED: "emerald",
  PENDING: "amber",
  RETURNED: "violet",
  SHIPPING: "blue",
};

function Badge({ label, tone = "slate" }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1", toneClasses[tone] || toneClasses.slate)}>
      {label}
    </span>
  );
}

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
        label: "Order",
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
        label: "Customer",
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
        label: "Status",
        render: (item) => <Badge label={item.stageLabel} tone={getStageTone(item.stage)} />,
      },
      {
        key: "paymentStatus",
        label: "Payment",
        render: (item) => <Badge label={paymentLabels[item.paymentStatus] || item.paymentStatus} tone={paymentTones[item.paymentStatus]} />,
      },
      {
        key: "shippingStatus",
        label: "Shipping",
        render: (item) => (
          <div className="flex items-center gap-2">
            <Truck className="text-slate-400" size={16} />
            <Badge label={shippingLabels[item.shippingStatus] || item.shippingStatus} tone={shippingTones[item.shippingStatus]} />
          </div>
        ),
      },
      {
        align: "right",
        key: "total",
        label: "Total",
        render: (item) => <span className="font-black text-slate-950">{formatCurrency(item.total || 0)}</span>,
      },
      {
        key: "createdAt",
        label: "Created",
        render: (item) => <span className="text-sm font-semibold text-slate-600">{formatDate(item.createdAt)}</span>,
      },
      {
        key: "tools",
        label: "Ops",
        sortable: false,
        render: (item) => (
          <div className="flex items-center gap-2">
            <AdminIconButton icon={Package} title={item.shippingProvider || "Carrier"} />
            <AdminIconButton icon={Eye} onClick={() => onView?.(item)} title={canUpdate ? "View and update order" : "View order"} />
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
      emptyMessage="Try changing the keyword, order status, payment status, or shipping status."
      emptyTitle="No orders found"
      enablePagination
      loading={loading}
      manualPagination
      pagination={pagination}
    />
  );
}

export default OrderTable;
