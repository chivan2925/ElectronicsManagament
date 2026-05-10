import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Minus, PackageCheck, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import OptimizedImage from "../common/OptimizedImage";
import IconButton from "../ui/IconButton";
import { useToast } from "../ui/toast";

const MotionArticle = motion.article;
const MotionSpan = motion.span;

function CartItem({ item, layout = "drawer", onQuantityChange, onRemove }) {
  const { product, quantity, variant } = item;
  const toast = useToast();
  const maxQuantity = item.maxQuantity ?? 99;
  const canDecrease = quantity > 1;
  const canIncrease = quantity < maxQuantity;
  const lineTotal = product.price * quantity;
  const hasStockIssue = maxQuantity <= 0 || quantity > maxQuantity;
  const isAtMaxStock = maxQuantity > 0 && quantity >= maxQuantity;
  const isLowStock = maxQuantity > 0 && maxQuantity <= 5;
  const StockIcon = hasStockIssue ? AlertTriangle : isAtMaxStock || isLowStock ? PackageCheck : CheckCircle2;
  const stockMessage = hasStockIssue
    ? "Vượt tồn kho khả dụng"
    : isAtMaxStock
      ? "Đã chọn tối đa tồn kho"
      : isLowStock
        ? `Chỉ còn ${maxQuantity} sản phẩm`
        : `Tồn kho khả dụng: ${maxQuantity}`;

  const handleDecrease = () => {
    if (!canDecrease) {
      return;
    }

    onQuantityChange(item.id, quantity - 1);
  };

  const handleIncrease = () => {
    if (!canIncrease) {
      toast.showWarning(`Chỉ còn ${maxQuantity} sản phẩm khả dụng cho lựa chọn này.`, {
        title: "Tồn kho giới hạn",
      });
      return;
    }

    onQuantityChange(item.id, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
    toast.showInfo("Đã xóa sản phẩm khỏi giỏ hàng.", {
      duration: 2400,
      title: "Giỏ hàng đã cập nhật",
    });
  };

  const quantityControls = (className) => (
    <div
      aria-label={`Số lượng ${product.name}`}
      className={cn("flex h-10 items-center rounded-xl border border-white/10 bg-slate-950/45 p-1", className)}
      role="group"
    >
      <IconButton
        aria-label={`Giảm số lượng ${product.name}`}
        className="h-8 w-8 rounded-lg disabled:pointer-events-none disabled:opacity-40"
        disabled={!canDecrease}
        onClick={handleDecrease}
        size="sm"
        variant="ghost"
      >
        <Minus size={15} />
      </IconButton>

      <span className="relative flex h-8 min-w-9 items-center justify-center overflow-hidden rounded-lg bg-white/[0.04] px-2 text-sm font-black text-white">
        <AnimatePresence mode="wait" initial={false}>
          <MotionSpan
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={quantity}
            transition={{ duration: 0.16 }}
          >
            {quantity}
          </MotionSpan>
        </AnimatePresence>
      </span>

      <IconButton
        aria-label={`Tăng số lượng ${product.name}`}
        className="h-8 w-8 rounded-lg disabled:pointer-events-none disabled:opacity-40"
        disabled={!canIncrease}
        onClick={handleIncrease}
        size="sm"
        variant="ghost"
      >
        <Plus size={15} />
      </IconButton>
    </div>
  );

  if (layout === "page") {
    return (
      <MotionArticle
        className={cn(
          "group rounded-3xl border bg-white/[0.035] p-3 shadow-inner shadow-white/[0.03] transition-default hover:border-blue-300/40 hover:bg-blue-500/[0.065] md:p-4",
          hasStockIssue ? "border-red-300/35" : "border-white/10",
        )}
        layout
        role="listitem"
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_116px_154px_134px_44px] md:items-center">
          <div className="grid min-w-0 grid-cols-[88px_1fr] gap-3 sm:grid-cols-[104px_1fr]">
            <Link
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.24),rgba(15,23,42,0.78)_48%,rgba(2,6,23,0.96)_100%)] p-2"
              to={`/products/${product.slug}`}
            >
              <div className="pointer-events-none absolute inset-x-4 bottom-3 h-8 rounded-full bg-blue-500/20 blur-xl" />
              <OptimizedImage
                alt={product.name}
                className="premium-transition relative z-10 h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.42)] group-hover:scale-105"
                fallbackKind="product"
                placeholderClassName="rounded-xl bg-slate-950/70"
                sizes="104px"
                src={product.image}
                wrapperClassName="relative z-10 flex h-full w-full items-center justify-center rounded-xl"
              />
            </Link>

            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-caption text-blue-200">{product.brand}</p>
                  <Link className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white hover:text-blue-100 sm:text-base" to={`/products/${product.slug}`}>
                    {product.name}
                  </Link>
                </div>

                <IconButton
                  aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
                  className="h-9 w-9 rounded-xl border-white/10 bg-slate-950/40 text-slate-400 hover:border-red-300/50 hover:bg-red-500/10 hover:text-red-100 md:hidden"
                  onClick={handleRemove}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>

              <p className="text-caption mt-2 w-fit max-w-full truncate rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-slate-400">
                {variant}
              </p>
              <p
                className={cn(
                  "text-caption mt-2 flex w-fit max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1",
                  hasStockIssue
                    ? "border-red-300/35 bg-red-500/10 text-red-100"
                    : isAtMaxStock || isLowStock
                      ? "border-amber-300/30 bg-amber-500/10 text-amber-100"
                      : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100",
                )}
              >
                <StockIcon size={13} />
                {stockMessage}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 md:block md:border-0 md:pt-0">
            <span className="text-caption text-slate-500 md:hidden">Đơn giá</span>
            <span className="text-sm font-black text-blue-100">{formatCurrency(product.price)}</span>
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-start">
            <span className="text-caption text-slate-500 md:hidden">Số lượng</span>
            {quantityControls("justify-center")}
          </div>

          <div className="flex items-end justify-between gap-3 md:block">
            <span className="text-caption text-slate-500 md:hidden">Thành tiền</span>
            <div className="text-right md:text-left">
              <AnimatePresence mode="wait" initial={false}>
                <MotionSpan
                  animate={{ opacity: 1, y: 0 }}
                  className="block text-sm font-black text-white"
                  exit={{ opacity: 0, y: -6 }}
                  initial={{ opacity: 0, y: 6 }}
                  key={lineTotal}
                  transition={{ duration: 0.18 }}
                >
                  {formatCurrency(lineTotal)}
                </MotionSpan>
              </AnimatePresence>
              {product.oldPrice && (
                <p className="text-caption mt-1 text-emerald-200">
                  Tiết kiệm {formatCurrency((product.oldPrice - product.price) * quantity)}
                </p>
              )}
            </div>
          </div>

          <IconButton
            aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
            className="hidden h-11 w-11 rounded-xl border-white/10 bg-slate-950/40 text-slate-400 hover:border-red-300/50 hover:bg-red-500/10 hover:text-red-100 md:inline-flex"
            onClick={handleRemove}
            variant="outline"
          >
            <Trash2 size={17} />
          </IconButton>
        </div>
      </MotionArticle>
    );
  }

  return (
    <MotionArticle
      className={cn(
        "group rounded-3xl border bg-white/[0.035] p-3 shadow-inner shadow-white/[0.03] transition-default hover:border-blue-300/40 hover:bg-blue-500/[0.07]",
        hasStockIssue ? "border-red-300/35" : "border-white/10",
      )}
      layout
      role="listitem"
    >
      <div className="grid grid-cols-[88px_1fr] gap-3">
        <Link
          className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.24),rgba(15,23,42,0.78)_48%,rgba(2,6,23,0.96)_100%)] p-2"
          to={`/products/${product.slug}`}
        >
          <div className="pointer-events-none absolute inset-x-4 bottom-3 h-8 rounded-full bg-blue-500/20 blur-xl" />
          <OptimizedImage
            alt={product.name}
            className="premium-transition relative z-10 h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.42)] group-hover:scale-105"
            fallbackKind="product"
            placeholderClassName="rounded-xl bg-slate-950/70"
            sizes="88px"
            src={product.image}
            wrapperClassName="relative z-10 flex h-full w-full items-center justify-center rounded-xl"
          />
        </Link>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link className="line-clamp-2 text-sm font-black leading-snug text-white hover:text-blue-100" to={`/products/${product.slug}`}>
              {product.name}
            </Link>

            <IconButton
              aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
              className="h-9 w-9 shrink-0 rounded-xl border-white/10 bg-slate-950/40 text-slate-400 hover:border-red-300/50 hover:bg-red-500/10 hover:text-red-100"
              onClick={handleRemove}
              size="sm"
              variant="outline"
            >
              <Trash2 size={16} />
            </IconButton>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <p className="text-caption w-fit max-w-full truncate rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-0.5 text-slate-400">
              {variant}
            </p>
            {(hasStockIssue || isAtMaxStock || isLowStock) && (
              <p
                className={cn(
                  "text-caption flex w-fit max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5",
                  hasStockIssue
                    ? "border-red-300/35 bg-red-500/10 text-red-100"
                    : "border-amber-300/30 bg-amber-500/10 text-amber-100",
                )}
              >
                <StockIcon size={12} />
                {stockMessage}
              </p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black text-blue-200">{formatCurrency(product.price)}</p>
              {quantity > 1 && (
                <AnimatePresence mode="wait" initial={false}>
                  <MotionSpan
                    animate={{ opacity: 1, y: 0 }}
                    className="text-caption mt-0.5 block text-slate-500"
                    exit={{ opacity: 0, y: -6 }}
                    initial={{ opacity: 0, y: 6 }}
                    key={lineTotal}
                    transition={{ duration: 0.18 }}
                  >
                    Tổng: {formatCurrency(lineTotal)}
                  </MotionSpan>
                </AnimatePresence>
              )}
            </div>

            {quantityControls()}
          </div>
        </div>
      </div>
    </MotionArticle>
  );
}

export default CartItem;
