import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, Ban, CreditCard, RefreshCw, ShieldAlert } from "lucide-react";
import paymentService from "../../api/paymentService";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import { formatCurrency } from "../../utils/formatters";

function normalizeStatus(value) {
  return String(value || "failed").toLowerCase();
}

function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const queryStatus = normalizeStatus(searchParams.get("status"));
  const queryMessage = searchParams.get("message");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      return undefined;
    }

    let isActive = true;

    paymentService
      .getOrderPaymentStatus(orderId, { transactionId })
      .then((paymentStatus) => {
        if (isActive) {
          setResult(paymentStatus);
        }
      })
      .catch((statusError) => {
        if (isActive) {
          setError(statusError);
        }
      });

    return () => {
      isActive = false;
    };
  }, [orderId, transactionId]);

  const isVerifying = Boolean(orderId) && !result && !error;
  const status = result?.status || queryStatus;
  const isCancelled = status === "cancelled";
  const pageMeta = useMemo(
    () =>
      isCancelled
        ? {
            badge: "Đã hủy",
            description: "Phiên VNPay Sandbox đã được hủy và đơn hàng được đóng để hoàn lại tồn kho giữ chỗ.",
            icon: Ban,
            title: "Thanh toán đã được hủy",
          }
        : {
            badge: isVerifying ? "Đang xác minh" : "Chưa thành công",
            description: "Hệ thống chưa ghi nhận trạng thái paid cho giao dịch này. Bạn có thể kiểm tra lại đơn hoặc tạo checkout mới.",
            icon: ShieldAlert,
            title: "Thanh toán chưa thành công",
          },
    [isCancelled, isVerifying],
  );
  const Icon = pageMeta.icon;

  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-16 pt-6 sm:pt-8">
        <section className="relative isolate overflow-hidden rounded-3xl border border-red-300/25 bg-[radial-gradient(circle_at_18%_0%,rgba(239,68,68,0.22),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(0,91,255,0.18),transparent_32%),linear-gradient(135deg,rgba(7,17,31,0.98),rgba(2,6,23,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_42px_rgba(239,68,68,0.12)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_36%,rgba(239,68,68,0.1))]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <Badge className="gap-2" variant={isCancelled ? "warning" : "danger"}>
                <Icon size={13} />
                {pageMeta.badge}
              </Badge>
              <h1 className="text-heading mt-5 max-w-3xl">{pageMeta.title}</h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">{pageMeta.description}</p>

              {(queryMessage || result?.message) && (
                <div className="mt-5 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex gap-2">
                    <AlertTriangle className="mt-0.5 shrink-0 text-amber-200" size={18} />
                    <p className="text-sm font-bold text-slate-300">{result?.message || queryMessage}</p>
                  </div>
                </div>
              )}

              {error && (
                <ApiErrorAlert
                  className="mt-5 max-w-2xl"
                  error={error}
                  surface="store"
                  title="Chưa xác minh được trạng thái thanh toán"
                />
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button as={Link} className="rounded-2xl" to="/checkout">
                  <RefreshCw size={18} />
                  Quay lại checkout
                </Button>
                <Button as={Link} className="rounded-2xl" to="/cart" variant="outline">
                  Kiểm tra giỏ hàng
                </Button>
                {orderId && (
                  <Button as={Link} className="rounded-2xl" to={`/profile/orders/${orderId}`} variant="outline">
                    Xem đơn
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/48 p-4 shadow-inner shadow-white/[0.03]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-100 ring-1 ring-red-300/30">
                <CreditCard size={25} />
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Mã đơn</span>
                  <span className="font-black text-white">{result?.orderCode || (orderId ? `#${orderId}` : "Đang cập nhật")}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Trạng thái</span>
                  <span className="font-black text-red-100">{status}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Mã phản hồi</span>
                  <span className="font-black text-white">{result?.responseCode || searchParams.get("code") || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Số tiền</span>
                  <span className="font-black text-blue-100">{result?.amount ? formatCurrency(result.amount) : "Đang cập nhật"}</span>
                </div>
                <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-3">
                  <p className="text-caption text-slate-300">
                    Đơn không được đánh dấu đã thanh toán nếu chữ ký, số tiền hoặc trạng thái giao dịch không hợp lệ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default PaymentFailed;
