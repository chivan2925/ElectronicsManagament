import { Link } from "react-router-dom";
import { RefreshCw, ShoppingCart, ShieldAlert } from "lucide-react";
import Button from "../ui/Button";
import { getPaymentProviderLabel, isCancelledStatus } from "../../utils/paymentStatus";

function PaymentRetryPanel({ orderId, provider, status }) {
  const providerLabel = getPaymentProviderLabel(provider);
  const isCancelled = isCancelledStatus(status);

  return (
    <div className="mt-5 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-100 ring-1 ring-amber-300/30">
          <ShieldAlert size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-black text-white">{isCancelled ? "Phiên thanh toán đã hủy" : "Có thể thanh toán lại"}</p>
          <p className="text-caption mt-1 text-slate-400">
            Để giữ tồn kho và trạng thái đơn đồng bộ, hãy quay lại checkout để tạo phiên {providerLabel} mới hoặc chọn phương thức khác.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button as={Link} className="rounded-2xl" to="/checkout">
          <RefreshCw size={18} />
          Thử lại tại checkout
        </Button>
        <Button as={Link} className="rounded-2xl" to="/cart" variant="outline">
          <ShoppingCart size={18} />
          Kiểm tra giỏ hàng
        </Button>
        {orderId && (
          <Button as={Link} className="rounded-2xl" to={`/profile/orders/${orderId}`} variant="outline">
            Xem đơn
          </Button>
        )}
      </div>
    </div>
  );
}

export default PaymentRetryPanel;
