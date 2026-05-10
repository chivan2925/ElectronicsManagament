import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  RefreshCcw,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";
import orderService from "../../api/orderService";
import OrderStatusBadge from "../../components/account/OrderStatusBadge";
import OrderTrackingTimeline from "../../components/account/OrderTrackingTimeline";
import ShipmentProgress from "../../components/account/ShipmentProgress";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import EmptyState from "../../components/ui/feedback/EmptyState";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import SkeletonBlock from "../../components/skeletons/SkeletonBlock";
import { useToast } from "../../components/ui/toast";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import { formatTrackingDate, getEstimatedDelivery } from "../../utils/orderTracking";

const MotionDiv = motion.div;

function getAddress(order) {
  return [
    order?.shippingAddress?.line,
    order?.shippingAddress?.ward,
    order?.shippingAddress?.district,
    order?.shippingAddress?.province,
  ]
    .filter(Boolean)
    .join(", ");
}

function ProfileOrderDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Đang tải chi tiết đơn hàng" className="grid gap-5" role="status">
      <span className="sr-only">Đang tải chi tiết đơn hàng</span>
      <div className="rounded-3xl border border-white/10 bg-slate-950/42 p-5">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="mt-4 h-9 w-64 max-w-full" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <SkeletonBlock className="h-24 rounded-2xl" key={item} />
          ))}
        </div>
      </div>
      <SkeletonBlock className="h-72 rounded-3xl" />
      <SkeletonBlock className="h-96 rounded-3xl" />
    </div>
  );
}

function SummaryTile({ children, className, icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className={cn("store-action-card rounded-2xl p-4", className)}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/12 text-blue-100">
          <IconComponent size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-caption text-slate-500">{label}</p>
          {children ?? <p className="mt-1 break-words text-sm font-black text-white">{value}</p>}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="max-w-[62%] text-right font-bold text-slate-100">{value || "Đang cập nhật"}</span>
    </div>
  );
}

function OrderItems({ items = [] }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm font-semibold text-slate-400">
        Chưa có dữ liệu sản phẩm cho đơn này.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <MotionDiv
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-inner shadow-white/[0.03] sm:grid-cols-[54px_minmax(0,1fr)_96px_130px] sm:items-center"
          initial={{ opacity: 0, y: 10 }}
          key={`${item.variantId ?? "item"}-${item.variantName}-${index}`}
          transition={{ delay: index * 0.04, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-500/10 text-blue-100">
            <Package size={22} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">{item.variantName}</p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-400">{item.productName}</p>
          </div>
          <p className="text-sm font-bold text-slate-300">x{item.quantity}</p>
          <p className="text-sm font-black text-blue-100 sm:text-right">{formatCurrency(item.price * item.quantity)}</p>
        </MotionDiv>
      ))}
    </div>
  );
}

function ProfileOrderDetail() {
  const { id } = useParams();
  const { userId } = useOutletContext();
  const toast = useToast();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!userId || !id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderDetail = await orderService.getUserOrderById(userId, id);

      setOrder(orderDetail);
    } catch (orderError) {
      setError(orderError);
      setOrder(null);
      toast.showApiError(orderError, {
        title: "Chưa tải được đơn hàng",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast, userId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const address = useMemo(() => getAddress(order), [order]);
  const estimatedDelivery = useMemo(() => getEstimatedDelivery(order ?? {}), [order]);

  if ((!userId && !error) || (isLoading && !order)) {
    return <ProfileOrderDetailSkeleton />;
  }

  if (error && !order) {
    return (
      <section className="store-surface-panel rounded-3xl p-5 lg:p-6">
        <Button as={Link} className="mb-5 rounded-2xl" to="/profile/orders" variant="outline">
          <ArrowLeft size={17} />
          Quay lại đơn hàng
        </Button>
        <ApiErrorAlert actionLabel="Thử lại" error={error} onAction={fetchOrder} surface="store" title="Chưa tải được đơn hàng" />
      </section>
    );
  }

  if (!order) {
    return (
      <EmptyState
        actionIcon={ArrowLeft}
        actionLabel="Quay lại lịch sử đơn"
        actionTo="/profile/orders"
        icon={ReceiptText}
        message="Đơn hàng có thể chưa đồng bộ hoặc không thuộc tài khoản hiện tại."
        title="Không tìm thấy đơn hàng"
      />
    );
  }

  return (
    <section className="grid gap-5">
      <div className="store-surface-panel rounded-3xl p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Button as={Link} className="mb-4 rounded-2xl" size="sm" to="/profile/orders" variant="outline">
              <ArrowLeft size={16} />
              Lịch sử đơn
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="gap-2" variant="primary">
                <ReceiptText size={13} />
                Theo dõi đơn
              </Badge>
              <OrderStatusBadge order={order} />
            </div>
            <h2 className="mt-4 break-words text-2xl font-black text-white sm:text-3xl">Đơn hàng #{order.code}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-400">
              Tạo lúc {formatTrackingDate(order.createdAt)} · {order.items.length} sản phẩm
            </p>
          </div>

          <Button className="rounded-2xl" disabled={isLoading} onClick={fetchOrder} variant="outline">
            <RefreshCcw className={cn(isLoading && "animate-spin")} size={17} />
            Làm mới
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryTile icon={CalendarClock} label="Giao dự kiến" value={estimatedDelivery.label} />
          <SummaryTile icon={Truck} label="Mã vận đơn" value={order.trackingCode || "Chưa có mã"} />
          <SummaryTile icon={CreditCard} label="Thanh toán">
            <p className="mt-1 text-sm font-black text-white">{order.paymentMethod || "Đang cập nhật"}</p>
            <p className="mt-1 text-xs font-bold text-slate-400">{order.paymentStatus || "PENDING"}</p>
          </SummaryTile>
          <SummaryTile icon={WalletCards} label="Tổng thanh toán" value={formatCurrency(order.total)} />
        </div>
      </div>

      <ShipmentProgress order={order} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          <section className="store-surface-panel-strong rounded-3xl p-5 lg:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge className="mb-3 gap-2" variant="primary">
                  <Package size={13} />
                  Sản phẩm
                </Badge>
                <h2 className="text-xl font-black text-white">Sản phẩm trong đơn</h2>
              </div>
              <p className="text-sm font-black text-blue-100">{formatCurrency(order.total)}</p>
            </div>
            <OrderItems items={order.items} />
          </section>

          <OrderTrackingTimeline order={order} />
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-28 xl:self-start">
          <section className="store-surface-panel-strong rounded-3xl p-5">
            <Badge className="mb-4 gap-2" variant="primary">
              <MapPin size={13} />
              Giao hàng
            </Badge>
            <h2 className="text-lg font-black text-white">Thông tin nhận hàng</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-300">
              <p className="flex gap-2">
                <UserRound className="mt-0.5 shrink-0 text-blue-200" size={16} />
                {order.shippingName || order.userFullName || "Đang cập nhật"}
              </p>
              <p>{order.shippingPhone || order.userPhoneNumber || "Đang cập nhật"}</p>
              <p className="flex gap-2 leading-6">
                <MapPin className="mt-1 shrink-0 text-blue-200" size={16} />
                {address || "Địa chỉ đang cập nhật"}
              </p>
              <p className="flex gap-2">
                <Truck className="mt-0.5 shrink-0 text-blue-200" size={16} />
                {order.shippingProvider || "Đơn vị vận chuyển đang cập nhật"}
              </p>
            </div>
          </section>

          <section className="store-surface-panel-strong rounded-3xl p-5">
            <Badge className="mb-4 gap-2" variant="primary">
              <ReceiptText size={13} />
              Tóm tắt
            </Badge>
            <h2 className="text-lg font-black text-white">Tóm tắt đơn hàng</h2>
            <div className="mt-4 space-y-3 border-b border-white/10 pb-4">
              <DetailRow label="Tạm tính" value={formatCurrency(order.subtotal)} />
              <DetailRow label="Giảm giá" value={`-${formatCurrency(order.discount)}`} />
              <DetailRow label="Vận chuyển" value={formatCurrency(order.shippingFee)} />
              <DetailRow label="Mã giảm giá" value={order.couponCode || "Không áp dụng"} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-base font-black text-white">
              <span>Tổng cộng</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </section>

          {order.note && (
            <section className="rounded-3xl border border-amber-300/20 bg-amber-500/10 p-5 text-sm font-semibold leading-6 text-amber-50">
              <p className="font-black text-white">Ghi chú đơn hàng</p>
              <p className="mt-2">{order.note}</p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}

export default ProfileOrderDetail;
