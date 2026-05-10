import { Link } from "react-router-dom";
import { ChevronDown, Eye, MapPin, PackageCheck, ReceiptText, Truck } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import SkeletonBlock from "../skeletons/SkeletonBlock";
import OrderStatusBadge from "./OrderStatusBadge";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

const statusTone = {
  CANCELLED: "danger",
  COMPLETED: "success",
  FAILED: "danger",
  PAID: "success",
  PENDING: "warning",
  PROCESSING: "primary",
  REFUNDED: "warning",
  RETURNED: "warning",
  SHIPPING: "primary",
};

function formatDate(value) {
  if (!value) {
    return "Đang cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function PaymentStatusBadge({ status }) {
  if (!status) {
    return <Badge variant="muted">N/A</Badge>;
  }

  return <Badge variant={statusTone[String(status).toUpperCase()] || "muted"}>{status}</Badge>;
}

function OrdersTableSkeleton() {
  return (
    <div className="grid gap-3">
      {[0, 1, 2].map((item) => (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4" key={item}>
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="mt-4 h-4 w-full max-w-lg" />
          <SkeletonBlock className="mt-3 h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

function OrderDetailPanel({ detail, isLoading }) {
  if (isLoading) {
    return (
      <div className="mt-3 rounded-2xl border border-blue-300/15 bg-blue-500/[0.045] p-4">
        <SkeletonBlock className="h-5 w-44" />
        <SkeletonBlock className="mt-4 h-4 w-full max-w-2xl" />
        <SkeletonBlock className="mt-3 h-20 w-full" />
      </div>
    );
  }

  if (!detail) {
    return null;
  }

  const address = [
    detail.shippingAddress?.line,
    detail.shippingAddress?.ward,
    detail.shippingAddress?.district,
    detail.shippingAddress?.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mt-3 rounded-2xl border border-blue-300/15 bg-blue-500/[0.055] p-4 shadow-inner shadow-white/[0.03]">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="gap-2" variant="primary">
              <ReceiptText size={13} />
              Chi tiết đơn
            </Badge>
            <OrderStatusBadge order={detail} size="sm" />
            <PaymentStatusBadge status={detail.paymentStatus} />
            <Button as={Link} className="rounded-xl" size="sm" to={`/profile/orders/${detail.id}`} variant="outline">
              <Truck size={15} />
              Theo dõi
            </Button>
          </div>

          <div className="mt-4 grid gap-3">
            {detail.items.map((item) => (
              <div
                className="store-surface-panel-strong grid gap-3 rounded-2xl p-3 sm:grid-cols-[minmax(0,1fr)_92px_120px]"
                key={`${item.variantId}-${item.variantName}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">{item.variantName}</p>
                  <p className="text-caption mt-1 text-slate-400">{item.productName}</p>
                </div>
                <p className="text-sm font-bold text-slate-300">x{item.quantity}</p>
                <p className="text-sm font-black text-blue-100">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="store-surface-panel-strong rounded-2xl p-4">
          <p className="text-sm font-black text-white">Thông tin giao hàng</p>
          <div className="mt-3 space-y-3 text-sm font-semibold text-slate-300">
            <p>{detail.shippingName}</p>
            <p>{detail.shippingPhone}</p>
            {address && (
              <p className="flex gap-2 leading-6">
                <MapPin className="mt-1 shrink-0 text-blue-200" size={16} />
                {address}
              </p>
            )}
            <p className="flex gap-2">
              <Truck className="shrink-0 text-blue-200" size={16} />
              {detail.trackingCode || "Chưa có mã vận đơn"}
            </p>
          </div>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Tạm tính</span>
              <span className="font-bold text-slate-200">{formatCurrency(detail.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Giảm giá</span>
              <span className="font-bold text-emerald-200">-{formatCurrency(detail.discount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Vận chuyển</span>
              <span className="font-bold text-slate-200">{formatCurrency(detail.shippingFee)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-black text-white">
              <span>Tổng cộng</span>
              <span>{formatCurrency(detail.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileOrderCard({ detail, isActive, isLoadingDetail, onViewDetail, order }) {
  return (
    <article className="store-action-card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">#{order.code}</p>
          <p className="text-caption mt-1 text-slate-400">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge order={order} size="sm" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-caption text-slate-500">Thanh toán</p>
          <div className="mt-1">
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
        <div>
          <p className="text-caption text-slate-500">Tổng tiền</p>
          <p className="mt-1 font-black text-blue-100">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button as={Link} className="rounded-2xl" to={`/profile/orders/${order.id}`} variant="outline">
          <Truck size={17} />
          Theo dõi
        </Button>
        <Button className="rounded-2xl" onClick={() => onViewDetail(order)} variant="outline">
          <Eye size={17} />
          {isActive ? "Ẩn bớt" : "Chi tiết"}
          <ChevronDown className={cn("transition-default", isActive && "rotate-180")} size={16} />
        </Button>
      </div>

      {isActive && <OrderDetailPanel detail={detail} isLoading={isLoadingDetail} />}
    </article>
  );
}

function OrdersTable({
  detail,
  isLoading = false,
  isLoadingDetail = false,
  onViewDetail,
  orders = [],
  selectedOrderId,
}) {
  if (isLoading) {
    return <OrdersTableSkeleton />;
  }

  if (!orders.length) {
    return (
      <div className="flex min-h-[340px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center shadow-inner shadow-white/[0.03]">
        <div>
          <PackageCheck className="mx-auto text-blue-200 drop-shadow-[0_0_18px_rgba(0,91,255,0.55)]" size={52} />
          <Badge className="mx-auto mt-5" variant="primary">Chưa có đơn hàng</Badge>
          <h2 className="text-section mt-4">Lịch sử đơn đang trống</h2>
          <p className="text-muted mx-auto mt-2 max-w-md text-sm">Các đơn đã tạo qua checkout sẽ xuất hiện tại đây sau khi API trả dữ liệu.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="store-surface-panel hidden overflow-hidden rounded-3xl md:block">
        <table className="w-full table-fixed text-left">
          <thead className="border-b border-white/10 bg-white/[0.035] text-xs font-black uppercase text-slate-500">
            <tr>
              <th className="px-4 py-4">Mã đơn</th>
              <th className="px-4 py-4">Ngày tạo</th>
              <th className="px-4 py-4">Trạng thái</th>
              <th className="px-4 py-4">Thanh toán</th>
              <th className="px-4 py-4 text-right">Tổng tiền</th>
              <th className="px-4 py-4 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.map((order) => {
              const isActive = String(selectedOrderId) === String(order.id);

              return (
                <tr className="align-top" key={order.id}>
                  <td className="px-4 py-4">
                    <p className="font-black text-white">#{order.code}</p>
                    <p className="text-caption mt-1 text-slate-500">{order.shippingName}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-300">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge order={order} size="sm" />
                  </td>
                  <td className="px-4 py-4">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-4 text-right font-black text-blue-100">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        className="premium-transition inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300/20 bg-blue-500/10 px-3 py-2 text-xs font-black text-blue-100 outline-none hover:border-blue-300/55 hover:bg-blue-500/16 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        to={`/profile/orders/${order.id}`}
                      >
                        <Truck size={15} />
                        Theo dõi
                      </Link>
                      <button
                        className="premium-transition inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 outline-none hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        onClick={() => onViewDetail(order)}
                        type="button"
                      >
                        <Eye size={15} />
                        Xem
                        <ChevronDown className={cn("transition-default", isActive && "rotate-180")} size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {orders.map((order) => {
          const isActive = String(selectedOrderId) === String(order.id);

          return (
            <MobileOrderCard
              detail={detail}
              isActive={isActive}
              isLoadingDetail={isLoadingDetail}
              key={order.id}
              onViewDetail={onViewDetail}
              order={order}
            />
          );
        })}
      </div>

      <div className="hidden md:block">
        {selectedOrderId && <OrderDetailPanel detail={detail} isLoading={isLoadingDetail} />}
      </div>
    </div>
  );
}

export default OrdersTable;
