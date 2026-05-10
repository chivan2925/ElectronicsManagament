import { LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react";
import { getPaymentProviderMeta } from "../../utils/paymentStatus";
import { cn } from "../../utils/classNames";

const icons = [LockKeyhole, ShieldCheck, ReceiptText];

function PaymentTrustIndicators({ className = "", compact = false, provider }) {
  const providerMeta = getPaymentProviderMeta(provider);
  const items = providerMeta.trust.slice(0, 3);

  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-3", className)}>
      {items.map((item, index) => {
        const Icon = icons[index] || ShieldCheck;

        return (
          <div className="store-stat-card rounded-2xl p-3" key={item}>
            <Icon className="mb-2 text-blue-200" size={18} />
            <p className="text-caption text-slate-400">{item}</p>
          </div>
        );
      })}
    </div>
  );
}

export default PaymentTrustIndicators;
