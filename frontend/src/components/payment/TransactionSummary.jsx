import { CreditCard, ReceiptText, ShieldCheck } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import {
  getPaymentProviderLabel,
  getPaymentStatusLabel,
  getPaymentStatusTone,
} from "../../utils/paymentStatus";
import { cn } from "../../utils/classNames";

const toneStyles = {
  danger: {
    accent: "text-red-100",
    icon: "bg-red-500/15 text-red-100 ring-red-300/30",
    value: "text-red-100",
  },
  pending: {
    accent: "text-blue-100",
    icon: "bg-blue-500/15 text-blue-100 ring-blue-300/30",
    value: "text-blue-100",
  },
  success: {
    accent: "text-emerald-100",
    icon: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/30",
    value: "text-emerald-200",
  },
  warning: {
    accent: "text-amber-100",
    icon: "bg-amber-500/15 text-amber-100 ring-amber-300/30",
    value: "text-amber-100",
  },
};

function SummaryRow({ label, value, valueClassName = "text-white" }) {
  return (
    <div className="flex items-center justify-between gap-3 text-slate-400">
      <span>{label}</span>
      <span className={cn("min-w-0 truncate text-right font-black", valueClassName)}>{value || "Đang cập nhật"}</span>
    </div>
  );
}

function TransactionSummary({
  amount,
  className = "",
  note,
  orderCode,
  orderId,
  provider,
  providerPaymentId,
  responseCode,
  status,
  transactionId,
  verified,
}) {
  const providerLabel = getPaymentProviderLabel(provider);
  const statusLabel = getPaymentStatusLabel(status);
  const tone = toneStyles[getPaymentStatusTone(status)] || toneStyles.pending;

  return (
    <div className={cn("rounded-3xl border border-white/10 bg-slate-950/48 p-4 shadow-inner shadow-white/[0.03]", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1", tone.icon)}>
          <ShieldCheck size={25} />
        </div>
        <div className="min-w-0 text-right">
          <p className="text-caption text-slate-500">Trạng thái</p>
          <p className={cn("mt-1 font-black", tone.accent)}>{statusLabel}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="Mã đơn" value={orderCode || (orderId ? `#${orderId}` : "")} />
        <SummaryRow label="Giao dịch" value={providerPaymentId || transactionId || "Sandbox"} />
        <SummaryRow label="Phương thức" value={providerLabel} valueClassName="text-blue-100" />
        <SummaryRow label="Xác minh" value={verified ? "Đã xác minh" : "Đang kiểm tra"} valueClassName={verified ? "text-emerald-200" : "text-amber-100"} />
        <SummaryRow label="Mã phản hồi" value={responseCode || "N/A"} />
        <SummaryRow label="Số tiền" value={amount ? formatCurrency(amount) : ""} valueClassName={tone.value} />
      </div>

      <div className="mt-4 rounded-2xl border border-blue-300/20 bg-blue-500/10 p-3">
        <div className="flex gap-2">
          <CreditCard className="mt-0.5 shrink-0 text-blue-200" size={17} />
          <p className="text-caption text-slate-300">
            {note || `Trạng thái chỉ hiển thị sau khi hệ thống xác minh phản hồi ${providerLabel}.`}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
        <div className="flex gap-2">
          <ReceiptText className="mt-0.5 shrink-0 text-slate-300" size={17} />
          <p className="text-caption text-slate-400">Mã đơn và mã giao dịch giúp đội hỗ trợ đối soát khi cần kiểm tra thanh toán.</p>
        </div>
      </div>
    </div>
  );
}

export default TransactionSummary;
