import { AlertTriangle, CheckCircle2, PackageCheck } from "lucide-react";
import { getCartStockInsights } from "../../cart/cartInsights";
import { cn } from "../../utils/classNames";

function StockValidationPanel({ className, compact = false, items = [], showHealthy = true }) {
  const { hasBlockingIssues, hasWarnings, stockIssues, stockWarnings } = getCartStockInsights(items);
  const tone = hasBlockingIssues ? "danger" : hasWarnings ? "warning" : "success";
  const Icon = hasBlockingIssues ? AlertTriangle : hasWarnings ? PackageCheck : CheckCircle2;
  const visibleItems = hasBlockingIssues ? stockIssues : stockWarnings;

  if (!showHealthy && !hasBlockingIssues && !hasWarnings) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-3 shadow-inner shadow-white/[0.03]",
        tone === "danger" && "border-red-300/30 bg-red-500/10",
        tone === "warning" && "border-amber-300/30 bg-amber-500/10",
        tone === "success" && "border-emerald-300/25 bg-emerald-500/10",
        className,
      )}
    >
      <div className="flex gap-3">
        <Icon
          className={cn(
            "mt-0.5 shrink-0",
            tone === "danger" && "text-red-200",
            tone === "warning" && "text-amber-200",
            tone === "success" && "text-emerald-200",
          )}
          size={compact ? 17 : 19}
        />
        <div className="min-w-0">
          <p className="text-sm font-black text-white">
            {hasBlockingIssues ? "Cần kiểm tra tồn kho" : hasWarnings ? "Tồn kho giới hạn" : "Tồn kho đã sẵn sàng"}
          </p>
          <p className="text-caption mt-1 text-slate-400">
            {hasBlockingIssues
              ? "Một số sản phẩm vượt quá tồn kho khả dụng, hãy giảm số lượng trước khi thanh toán."
              : hasWarnings
                ? "Một số sản phẩm gần hết hàng, nên checkout sớm để giữ lựa chọn hiện tại."
                : "Các sản phẩm trong giỏ đang nằm trong tồn kho khả dụng."}
          </p>

          {visibleItems.length > 0 && (
            <div className="mt-2 grid gap-1.5">
              {visibleItems.slice(0, 3).map((item) => (
                <p className="text-caption rounded-xl border border-white/10 bg-slate-950/35 px-2.5 py-1.5 text-slate-300" key={item.id}>
                  <span className="font-black text-white">{item.productName}</span>: {item.message}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StockValidationPanel;
