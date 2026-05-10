import { useCallback, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ChevronLeft, ChevronRight, PackageSearch, RefreshCcw } from "lucide-react";
import orderService from "../../api/orderService";
import OrdersTable from "../../components/account/OrdersTable";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/toast";

const PAGE_SIZE = 8;

function ProfileOrders() {
  const { userId } = useOutletContext();
  const toast = useToast();
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [pageMeta, setPageMeta] = useState({
    page: 0,
    size: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setDetail(null);
      setDetailError(null);
      setIsLoading(false);
      setIsLoadingDetail(false);
      setOrders([]);
      setOrdersError(null);
      setSelectedOrderId(null);
      setPageMeta({
        page: 0,
        size: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
      });
      return;
    }

    setIsLoading(true);
    setOrdersError(null);

    try {
      const orderPage = await orderService.getUserOrders(userId, {
        page,
        size: PAGE_SIZE,
        sort: "createdAt,desc",
      });

      setOrders(orderPage.items);
      setPageMeta(orderPage.meta);
    } catch (error) {
      setOrdersError(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetail = async (order) => {
    if (!userId) {
      return;
    }

    if (String(selectedOrderId) === String(order.id)) {
      setSelectedOrderId(null);
      setDetail(null);
      setDetailError(null);
      return;
    }

    setSelectedOrderId(order.id);
    setIsLoadingDetail(true);
    setDetail(null);
    setDetailError(null);

    try {
      const orderDetail = await orderService.getUserOrderById(userId, order.id);

      setDetail(orderDetail);
    } catch (error) {
      setDetailError(error);
      toast.showApiError(error, {
        title: "Chưa tải được chi tiết đơn",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const canGoPrevious = page > 0;
  const canGoNext = page + 1 < pageMeta.totalPages;

  return (
    <section className="store-surface-panel rounded-3xl p-5 lg:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <PackageSearch size={13} />
            Order history
          </Badge>
          <h2 className="text-section">Lịch sử đơn hàng</h2>
          <p className="text-muted mt-2 text-sm">Danh sách và chi tiết đơn hàng lấy từ Order API theo tài khoản đăng nhập.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button as={Link} className="rounded-2xl" to="/products" variant="outline">
            Mua thêm
          </Button>
          <Button className="rounded-2xl" disabled={isLoading} onClick={fetchOrders} variant="outline">
            <RefreshCcw size={17} />
            Làm mới
          </Button>
        </div>
      </div>

      {ordersError && (
        <ApiErrorAlert
          actionLabel="Thử lại"
          className="mt-5"
          error={ordersError}
          onAction={fetchOrders}
          surface="store"
          title="Chưa tải được đơn hàng"
        />
      )}

      {detailError && <ApiErrorAlert className="mt-5" error={detailError} surface="store" title="Chưa tải được chi tiết đơn" />}

      <div className="mt-6">
        <OrdersTable
          detail={detail}
          isLoading={isLoading}
          isLoadingDetail={isLoadingDetail}
          onViewDetail={handleViewDetail}
          orders={orders}
          selectedOrderId={selectedOrderId}
        />
      </div>

      {pageMeta.totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-slate-400">
            Trang <span className="text-white">{page + 1}</span> / {pageMeta.totalPages} · {pageMeta.totalItems} đơn hàng
          </p>
          <div className="flex gap-2">
            <Button
              className="rounded-2xl"
              disabled={!canGoPrevious || isLoading}
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
              variant="outline"
            >
              <ChevronLeft size={17} />
              Trước
            </Button>
            <Button
              className="rounded-2xl"
              disabled={!canGoNext || isLoading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              variant="outline"
            >
              Sau
              <ChevronRight size={17} />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProfileOrders;
