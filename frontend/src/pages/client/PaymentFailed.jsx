import { useMemo } from "react";
import { AlertTriangle, Ban, ShieldAlert } from "lucide-react";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import PaymentRetryPanel from "../../components/payment/PaymentRetryPanel";
import PaymentTimeline from "../../components/payment/PaymentTimeline";
import TransactionSummary from "../../components/payment/TransactionSummary";
import Badge from "../../components/ui/Badge";
import Container from "../../components/ui/Container";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import usePaymentResult from "../../hooks/usePaymentResult";
import {
  getPaymentResultCopy,
  getPaymentTimelineSteps,
  isCancelledStatus,
} from "../../utils/paymentStatus";

function PaymentFailed() {
  const paymentResult = usePaymentResult({ defaultStatus: "failed" });
  const {
    amount,
    error,
    isVerifying,
    message,
    orderCode,
    orderId,
    provider,
    providerPaymentId,
    responseCode,
    status,
    transactionId,
    verified,
  } = paymentResult;
  const isCancelled = isCancelledStatus(status);
  const pageMeta = useMemo(
    () => ({
      ...getPaymentResultCopy({ isVerifying, provider, status }),
      icon: isCancelled ? Ban : ShieldAlert,
    }),
    [isCancelled, isVerifying, provider, status],
  );
  const timelineSteps = useMemo(
    () => getPaymentTimelineSteps({ isVerifying, provider, status }),
    [isVerifying, provider, status],
  );
  const Icon = pageMeta.icon;

  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-16 pt-6 sm:pt-8" id="main-content" tabIndex={-1}>
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

              {message && (
                <div className="mt-5 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex gap-2">
                    <AlertTriangle className="mt-0.5 shrink-0 text-amber-200" size={18} />
                    <p className="text-sm font-bold text-slate-300">{message}</p>
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

              <PaymentRetryPanel orderId={orderId} provider={provider} status={status} />
            </div>

            <TransactionSummary
              amount={amount}
              note="Đơn không được đánh dấu đã thanh toán nếu chữ ký, số tiền hoặc trạng thái giao dịch không hợp lệ."
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

        <section className="mt-5">
          <PaymentTimeline steps={timelineSteps} />
        </section>
      </Container>
    </div>
  );
}

export default PaymentFailed;
