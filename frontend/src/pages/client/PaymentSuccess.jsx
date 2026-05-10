import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, ReceiptText } from "lucide-react";
import PaymentTimeline from "../../components/payment/PaymentTimeline";
import TransactionSummary from "../../components/payment/TransactionSummary";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import LoadingState from "../../components/ui/feedback/LoadingState";
import { useCart } from "../../cart";
import usePaymentResult from "../../hooks/usePaymentResult";
import { clearPendingPaymentOrderId, getPendingPaymentOrderId } from "../../utils/checkoutSession";
import {
  getPaymentResultCopy,
  getPaymentTimelineSteps,
  isPaidStatus,
} from "../../utils/paymentStatus";

function PaymentSuccess() {
  const { clearCart } = useCart();
  const paymentResult = usePaymentResult({ defaultStatus: "pending" });
  const {
    amount,
    clientIssue,
    error,
    isVerifying,
    message,
    orderCode,
    orderId,
    provider,
    providerLabel,
    providerPaymentId,
    responseCode,
    status,
    transactionId,
    verified,
  } = paymentResult;
  const isPaid = isPaidStatus(status);
  const pageMeta = useMemo(
    () => getPaymentResultCopy({ isVerifying, provider, status }),
    [isVerifying, provider, status],
  );
  const timelineSteps = useMemo(
    () => getPaymentTimelineSteps({ isVerifying, provider, status }),
    [isVerifying, provider, status],
  );
  const verifiedLabel = useMemo(() => {
    if (isVerifying) {
      return "Đang xác minh";
    }

    if (isPaid && verified) {
      return "Đã xác minh";
    }

    return "Cần kiểm tra";
  }, [isPaid, isVerifying, verified]);

  useEffect(() => {
    if (!isPaid || !orderId) {
      return;
    }

    if (getPendingPaymentOrderId() === String(orderId)) {
      clearCart();
      clearPendingPaymentOrderId(orderId);
    }
  }, [clearCart, isPaid, orderId]);

  return (
    <>
      <Container as="main" className="pb-16 pt-6 sm:pt-8" id="main-content" tabIndex={-1}>
        <section className="relative isolate overflow-hidden rounded-3xl border border-emerald-300/25 bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.24),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(0,91,255,0.24),transparent_34%),linear-gradient(135deg,rgba(7,17,31,0.98),rgba(2,6,23,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_42px_rgba(16,185,129,0.12)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_36%,rgba(16,185,129,0.1))]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <Badge className="gap-2" variant={isPaid ? "success" : "warning"}>
                {isPaid ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                {verifiedLabel}
              </Badge>
              <h1 className="text-heading mt-5 max-w-3xl">
                {isPaid ? pageMeta.title : "Đang kiểm tra thanh toán"}
              </h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                {isPaid
                  ? pageMeta.description
                  : "Trang thanh toán đã quay lại, nhưng hệ thống chưa xác nhận trạng thái paid cho đơn này."}
              </p>

              {isVerifying && (
                <LoadingState
                  className="mt-5 max-w-2xl"
                  message={`Đang đối soát phản hồi ${providerLabel} với server trước khi cập nhật đơn hàng.`}
                  surface="store"
                  title="Đang xác minh thanh toán"
                  variant="inline"
                />
              )}

              {error && (
                <ApiErrorAlert
                  className="mt-5 max-w-2xl"
                  error={error}
                  surface="store"
                  title="Chưa xác minh được trạng thái thanh toán"
                />
              )}

              {clientIssue && !error && (
                <ApiErrorAlert
                  className="mt-5 max-w-2xl"
                  message={message}
                  surface="store"
                  title="Thiếu thông tin xác minh thanh toán"
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

            <TransactionSummary
              amount={amount}
              note={`Trạng thái thành công chỉ hiển thị sau khi hệ thống xác minh phản hồi ${providerLabel}.`}
              orderCode={orderCode}
              orderId={orderId}
              provider={provider}
              providerPaymentId={providerPaymentId}
              responseCode={responseCode}
              status={status}
              transactionId={transactionId}
              verified={verified}
            />
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <PaymentTimeline steps={timelineSteps} />
          <div className="rounded-2xl border border-white/10 bg-slate-950/36 p-4">
            <p className="text-sm font-black text-white">Phản hồi giao dịch</p>
            <p className="text-caption mt-2 text-slate-400">
              {message || `${providerLabel} Sandbox đã được ghi nhận qua kênh return/IPN và xác minh server-side.`}
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}

export default PaymentSuccess;
