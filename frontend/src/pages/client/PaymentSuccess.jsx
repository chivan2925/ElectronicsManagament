import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3, CreditCard, ReceiptText, ShieldCheck } from "lucide-react";
import paymentService from "../../api/paymentService";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import { formatCurrency } from "../../utils/formatters";

function getQueryStatus(searchParams) {
  return String(searchParams.get("status") || "").toLowerCase();
}

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const queryStatus = getQueryStatus(searchParams);
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
  const status = result?.status || queryStatus || "pending";
  const isPaid = status === "paid";
  const verifiedLabel = useMemo(() => {
    if (isVerifying) {
      return "Đang xác minh";
    }

    if (isPaid && result?.verified) {
      return "Đã xác minh";
    }

    return "Cần kiểm tra";
  }, [isPaid, isVerifying, result?.verified]);

  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-16 pt-6 sm:pt-8">
        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-300/25 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(0,91,255,0.24),transparent_34%),linear-gradient(135deg,rgba(7,17,31,0.98),rgba(2,6,23,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_42px_rgba(16,185,129,0.12)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_36%,rgba(16,185,129,0.1))]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <Badge className="gap-2" variant={isPaid ? "success" : "warning"}>
                {isPaid ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                {verifiedLabel}
              </Badge>
              <h1 className="text-heading mt-5 max-w-3xl">
                {isPaid ? "Thanh toán VNPay thành công" : "Đang kiểm tra thanh toán"}
              </h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                {isPaid
                  ? "Hệ thống đã ghi nhận giao dịch sandbox và cập nhật trạng thái đơn hàng."
                  : "Trang thanh toán đã quay lại, nhưng hệ thống chưa xác nhận trạng thái paid cho đơn này."}
              </p>

              {error && (
                <ApiErrorAlert
                  className="mt-5 max-w-2xl"
                  error={error}
                  surface="store"
                  title="Chưa xác minh được trạng thái thanh toán"
                />
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {orderId && (
                  <Button as={Link} className="rounded-2xl" to={`/profile/orders/${orderId}`}>
                    <ReceiptText size={18} />
                    Xem đơn hàng
                  </Button>
                )}
                <Button as={Link} className="rounded-2xl" to="/products" variant="outline">
                  Tiếp tục mua sắm
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/48 p-4 shadow-inner shadow-white/[0.03]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-300/30">
                <ShieldCheck size={25} />
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Mã đơn</span>
                  <span className="font-black text-white">{result?.orderCode || (orderId ? `#${orderId}` : "Đang cập nhật")}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Giao dịch</span>
                  <span className="font-black text-white">{result?.providerPaymentId || transactionId || "Sandbox"}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Phương thức</span>
                  <span className="font-black text-blue-100">VNPay</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-slate-400">
                  <span>Số tiền</span>
                  <span className="font-black text-emerald-200">{result?.amount ? formatCurrency(result.amount) : "Đang cập nhật"}</span>
                </div>
                <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-3">
                  <div className="flex gap-2">
                    <CreditCard className="mt-0.5 shrink-0 text-blue-200" size={17} />
                    <p className="text-caption text-slate-300">
                      Trạng thái thành công chỉ hiển thị sau khi hệ thống xác minh phản hồi VNPay.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default PaymentSuccess;
