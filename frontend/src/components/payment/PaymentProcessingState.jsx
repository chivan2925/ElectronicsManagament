import { Loader2, ShieldCheck } from "lucide-react";
import PaymentTimeline from "./PaymentTimeline";
import {
  getCheckoutPaymentSteps,
  getPaymentProcessingCopy,
  getPaymentProviderMeta,
} from "../../utils/paymentStatus";

function PaymentProcessingState({ provider }) {
  const providerMeta = getPaymentProviderMeta(provider);
  const copy = getPaymentProcessingCopy(provider);
  const steps = getCheckoutPaymentSteps({ isRedirecting: true, provider });

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mt-4 rounded-2xl border border-blue-300/30 bg-blue-500/10 p-3 text-sm font-bold text-blue-100"
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-300/30">
          <Loader2 className="animate-spin" size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-white">{copy.title}</p>
          <p className="text-caption mt-1 text-blue-100/80">{copy.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {providerMeta.trust.slice(0, 2).map((item) => (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-300/20 bg-slate-950/30 px-2.5 py-1 text-[11px] font-black text-blue-100" key={item}>
                <ShieldCheck size={12} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <PaymentTimeline className="mt-3 border-blue-300/20 bg-slate-950/34" compact steps={steps} title="" />
    </div>
  );
}

export default PaymentProcessingState;
