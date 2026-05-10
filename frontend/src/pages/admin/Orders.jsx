import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, Loader2, PackageCheck, ReceiptText, Truck } from "lucide-react";
import orderService from "../../api/orderService";
import { getOrderStageFilterParams, mapStageToBackend } from "../../api/orderMapper";
import { AdminDrawer, AdminFilters, AdminSearch } from "../../admin/components";
import { useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import { REALTIME_EVENT_TYPES } from "../../realtime/realtimeEvents";
import { publishRealtimeEvent } from "../../hooks/useRealtime";
import { formatCurrency } from "../../utils/formatters";
import OrderDetail from "./orders/OrderDetail";
import OrderTable from "./orders/OrderTable";
import { ORDER_STAGE_OPTIONS, PAYMENT_STATUS_OPTIONS, SHIPPING_STATUS_OPTIONS } from "./orders/orderOptions";

const STAGE_FILTER_OPTIONS = ORDER_STAGE_OPTIONS.map((option) => ({
  label: option.label,
  value: option.value,
}));

const paymentRealtimeEventByStatus = {
  CANCELLED: REALTIME_EVENT_TYPES.PAYMENT_CANCELLED,
  FAILED: REALTIME_EVENT_TYPES.PAYMENT_FAILED,
  PAID: REALTIME_EVENT_TYPES.PAYMENT_SUCCEEDED,
};

function toFormValues(order = {}) {
  return {
    paymentStatus: order.paymentStatus || "PENDING",
    shippingProvider: order.shippingProvider || "OTHER",
    shippingStatus: order.shippingStatus || "PENDING",
    stage: order.stage || "pending",
    status: order.status || "PENDING",
    trackingCode: order.trackingCode || "",
  };
}

function OrderStat({ icon, label, value }) {
  return (
    <div className="admin-panel admin-panel-hover rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
          {createElement(icon, { size: 18 })}
        </span>
        <span className="text-xl font-black text-slate-950">{value}</span>
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
    </div>
  );
}

function Orders() {
  const permission = usePermissions();
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [stageFilter, setStageFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [shippingFilter, setShippingFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formValues, setFormValues] = useState(toFormValues());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [reloadKey, setReloadKey] = useState(0);

  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.orders, "update");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stageParams = getOrderStageFilterParams(stageFilter);
      const response = await orderService.getAll(
        {
          ...stageParams,
          keyword: debouncedQuery || undefined,
          page,
          paymentStatus: paymentFilter || undefined,
          shippingStatus: shippingFilter || stageParams.shippingStatus || undefined,
          size: pageSize,
          sort: "updatedAt,desc",
        },
        { skipGlobalErrorHandler: true },
      );

      setOrders(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setOrders([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, paymentFilter, shippingFilter, stageFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, reloadKey]);

  const stats = useMemo(
    () => [
      { icon: ReceiptText, label: "Orders in result", value: pageMeta.totalItems },
      { icon: PackageCheck, label: "Delivered on page", value: orders.filter((order) => order.stage === "delivered").length },
      { icon: Truck, label: "Shipping on page", value: orders.filter((order) => order.stage === "shipping").length },
      { icon: CreditCard, label: "Revenue on page", value: formatCurrency(orders.reduce((total, order) => total + (order.total || 0), 0)) },
    ],
    [orders, pageMeta.totalItems],
  );

  const filterValues = useMemo(
    () => ({
      paymentStatus: paymentFilter,
      shippingStatus: shippingFilter,
      stage: stageFilter,
    }),
    [paymentFilter, shippingFilter, stageFilter],
  );

  const handleFilterChange = (key, value) => {
    if (key === "stage") {
      setStageFilter(value);
    }

    if (key === "paymentStatus") {
      setPaymentFilter(value);
    }

    if (key === "shippingStatus") {
      setShippingFilter(value);
    }

    setPage(0);
  };

  const handleResetFilters = () => {
    setQuery("");
    setStageFilter("");
    setPaymentFilter("");
    setShippingFilter("");
    setPage(0);
  };

  const openOrderDetail = useCallback(
    async (order) => {
      setSelectedOrder(order);
      setFormValues(toFormValues(order));
      setDetailLoading(true);

      try {
        const detail = await orderService.getById(order.id, { skipGlobalErrorHandler: true });
        setSelectedOrder(detail);
        setFormValues(toFormValues(detail));
      } catch (requestError) {
        toast.showApiError(requestError, { title: "Không tải được chi tiết đơn hàng" });
      } finally {
        setDetailLoading(false);
      }
    },
    [toast],
  );

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    setFormValues(toFormValues());
  };

  const handleFormChange = (key, value) => {
    setFormValues((currentValues) => {
      if (key === "stage") {
        const mappedStatus = mapStageToBackend(value, currentValues);

        return {
          ...currentValues,
          ...mappedStatus,
          stage: value,
        };
      }

      return {
        ...currentValues,
        [key]: value,
      };
    });
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder?.id) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updatedOrder = await orderService.update(selectedOrder.id, formValues, { skipGlobalErrorHandler: true });
      const refreshedDetail = await orderService.getById(selectedOrder.id, { skipGlobalErrorHandler: true });

      setOrders((currentOrders) =>
        currentOrders.map((order) => (String(order.id) === String(updatedOrder.id) ? { ...order, ...updatedOrder } : order)),
      );
      setSelectedOrder(refreshedDetail);
      setFormValues(toFormValues(refreshedDetail));
      toast.showSuccess("Đã cập nhật đơn hàng.");
      const orderCode = refreshedDetail.code || updatedOrder.code || selectedOrder.code || selectedOrder.id;
      const paymentStatus = String(formValues.paymentStatus || "").toUpperCase();
      const eventType = paymentRealtimeEventByStatus[paymentStatus] || REALTIME_EVENT_TYPES.ORDER_STATUS_CHANGED;

      publishRealtimeEvent(
        {
          channel: "all",
          id: `admin-order-updated-${selectedOrder.id}-${Date.now()}`,
          message: `Order #${orderCode} was updated to ${formValues.stage || formValues.status}.`,
          payload: {
            orderCode,
            orderId: selectedOrder.id,
            paymentStatus: formValues.paymentStatus,
            shippingStatus: formValues.shippingStatus,
            status: formValues.status,
            stage: formValues.stage,
          },
          priority: eventType === REALTIME_EVENT_TYPES.ORDER_STATUS_CHANGED ? "medium" : "high",
          source: "admin-orders",
          title: eventType === REALTIME_EVENT_TYPES.ORDER_STATUS_CHANGED ? "Order status updated" : "Payment status updated",
          type: eventType,
        },
        { queue: true },
      );
      setReloadKey((value) => value + 1);
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Cập nhật đơn hàng thất bại" });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-page-shell">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order Management</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Track customer orders, payment state, shipping handoff, and operational timeline.
          </p>
        </div>
        {loading ? (
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-500">
            <Loader2 className="animate-spin" size={16} />
            Syncing orders
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <OrderStat icon={stat.icon} key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.9fr)]">
        <AdminSearch
          disabled={loading}
          onChange={(nextValue) => {
            setQuery(nextValue);
            setPage(0);
          }}
          placeholder="Search by order code, customer name, or phone..."
          value={query}
        />

        <AdminFilters
          className="p-3"
          filters={[
            {
              key: "stage",
              label: "Order status",
              options: STAGE_FILTER_OPTIONS,
              placeholder: "All statuses",
              type: "select",
            },
            {
              key: "paymentStatus",
              label: "Payment",
              options: PAYMENT_STATUS_OPTIONS,
              placeholder: "All payments",
              type: "select",
            },
            {
              key: "shippingStatus",
              label: "Shipping",
              options: SHIPPING_STATUS_OPTIONS,
              placeholder: "All shipping",
              type: "select",
            },
          ]}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          summary="Operational queue"
          title="Filters"
          values={filterValues}
        />
      </div>

      {error ? (
        <ApiErrorAlert
          actionLabel="Tải lại"
          error={error}
          onAction={() => setReloadKey((value) => value + 1)}
          onDismiss={() => setError(null)}
          surface="admin"
        />
      ) : null}

      <OrderTable
        canUpdate={canUpdate}
        data={orders}
        loading={loading}
        onView={openOrderDetail}
        pagination={{
          onPageChange: (nextPage) => setPage(nextPage),
          onPageSizeChange: (nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(0);
          },
          page,
          pageSize,
          totalItems: pageMeta.totalItems,
          totalPages: pageMeta.totalPages,
        }}
      />

      <AdminDrawer
        description="Review customer, payment, shipping, items, and timeline before changing states."
        onClose={closeOrderDetail}
        open={Boolean(selectedOrder)}
        size="lg"
        title={selectedOrder ? `Order ${selectedOrder.code || selectedOrder.id}` : "Order detail"}
      >
        <OrderDetail
          canUpdate={canUpdate}
          formValues={formValues}
          loading={detailLoading}
          onChange={handleFormChange}
          onSubmit={handleUpdateOrder}
          order={selectedOrder}
          submitting={submitting}
        />
      </AdminDrawer>
    </section>
  );
}

export default Orders;
