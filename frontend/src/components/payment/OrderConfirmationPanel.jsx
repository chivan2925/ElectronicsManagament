import { Link } from "react-router-dom";
import { CheckCircle2, ReceiptText } from "lucide-react";
import Button from "../ui/Button";
import PaymentTimeline from "./PaymentTimeline";
import { getOrderConfirmationSteps, getPaymentProviderMeta } from "../../utils/paymentStatus";

function OrderConfirmationPanel({ order, paymentMethod }) {
  const providerMeta = getPaymentProviderMeta(paymentMethod?.provider);
  const steps = getOrderConfirmationSteps(providerMeta.provider);

  return (
    <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4">
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-emerald-200" size={30} />
        <p className="mt-2 font-black text-white">Đơn hàng đã được tạo</p>
        <p className="text-caption mt-1 text-slate-400">
          {order?.code ? `Mã đơn: ${order.code}. ` : ""}
          {providerMeta.provider === "COD"
            ? "Thanh toán COD sẽ được xử lý khi giao hàng."
            : "Theo dõi trạng thái thanh toán trong khu vực tài khoản."}
        </p>
      </div>

      <PaymentTimeline className="mt-4 border-emerald-300/20 bg-slate-950/34 text-left" compact steps={steps} title="" />

      {order?.id && (
        <Button as={Link} className="mt-4 h-11 rounded-2xl" fullWidth to={`/profile/orders/${order.id}`} variant="outline">
          <ReceiptText size={18} />
          Theo dõi đơn hàng
        </Button>
      )}
    </div>
  );
}

export default OrderConfirmationPanel;
