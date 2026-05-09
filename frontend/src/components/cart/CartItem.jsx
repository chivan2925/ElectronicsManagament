import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import IconButton from "../ui/IconButton";

function CartItem({ item, layout = "drawer", onQuantityChange, onRemove }) {
  const { product, quantity, variant } = item;
  const maxQuantity = item.maxQuantity ?? 99;
  const canDecrease = quantity > 1;
  const canIncrease = quantity < maxQuantity;
  const lineTotal = product.price * quantity;

  const quantityControls = (className) => (
    <div className={cn("flex h-10 items-center rounded-xl border border-white/10 bg-slate-950/45 p-1", className)}>
      <IconButton
        aria-label="Giảm số lượng"
        className="h-8 w-8 rounded-lg disabled:pointer-events-none disabled:opacity-40"
        disabled={!canDecrease}
        onClick={() => onQuantityChange(item.id, quantity - 1)}
        size="sm"
        variant="ghost"
      >
        <Minus size={15} />
      </IconButton>

      <span className="flex h-8 min-w-9 items-center justify-center rounded-lg bg-white/[0.04] px-2 text-sm font-black text-white">
        {quantity}
      </span>

      <IconButton
        aria-label="Tăng số lượng"
        className="h-8 w-8 rounded-lg disabled:pointer-events-none disabled:opacity-40"
        disabled={!canIncrease}
        onClick={() => onQuantityChange(item.id, quantity + 1)}
        size="sm"
        variant="ghost"
      >
        <Plus size={15} />
      </IconButton>
    </div>
  );

  if (layout === "page") {
    return (
      <article className="group rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-inner shadow-white/[0.03] transition-default hover:border-blue-300/40 hover:bg-blue-500/[0.065] md:p-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_116px_154px_134px_44px] md:items-center">
          <div className="grid min-w-0 grid-cols-[88px_1fr] gap-3 sm:grid-cols-[104px_1fr]">
            <Link
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.24),rgba(15,23,42,0.78)_48%,rgba(2,6,23,0.96)_100%)] p-2"
              to={`/products/${product.slug}`}
            >
              <div className="pointer-events-none absolute inset-x-4 bottom-3 h-8 rounded-full bg-blue-500/20 blur-xl" />
              <img
                alt={product.name}
                className="premium-transition relative z-10 h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.42)] group-hover:scale-105"
                src={product.image}
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
                  onClick={() => onRemove(item.id)}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>

              <p className="text-caption mt-2 w-fit max-w-full truncate rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-slate-400">
                {variant}
              </p>
              <p className="text-caption mt-2 text-slate-500">Tồn kho khả dụng: {maxQuantity}</p>
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
              <p className="text-sm font-black text-white">{formatCurrency(lineTotal)}</p>
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
            onClick={() => onRemove(item.id)}
            variant="outline"
          >
            <Trash2 size={17} />
          </IconButton>
        </div>
      </article>
    );
  }

  return (
    <article className="group rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-inner shadow-white/[0.03] transition-default hover:border-blue-300/40 hover:bg-blue-500/[0.07]">
      <div className="grid grid-cols-[88px_1fr] gap-3">
        <Link
          className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.24),rgba(15,23,42,0.78)_48%,rgba(2,6,23,0.96)_100%)] p-2"
          to={`/products/${product.slug}`}
        >
          <div className="pointer-events-none absolute inset-x-4 bottom-3 h-8 rounded-full bg-blue-500/20 blur-xl" />
          <img
            alt={product.name}
            className="premium-transition relative z-10 h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.42)] group-hover:scale-105"
            src={product.image}
          />
        </Link>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-caption text-blue-200">{product.brand}</p>
              <Link className="mt-1 line-clamp-2 text-sm font-black leading-snug text-white hover:text-blue-100" to={`/products/${product.slug}`}>
                {product.name}
              </Link>
            </div>

            <IconButton
              aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
              className="h-9 w-9 rounded-xl border-white/10 bg-slate-950/40 text-slate-400 hover:border-red-300/50 hover:bg-red-500/10 hover:text-red-100"
              onClick={() => onRemove(item.id)}
              size="sm"
              variant="outline"
            >
              <Trash2 size={16} />
            </IconButton>
          </div>

          <p className="text-caption mt-2 w-fit max-w-full truncate rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-slate-400">
            {variant}
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black text-blue-200">{formatCurrency(product.price)}</p>
              <p className="text-caption mt-1 text-slate-500">Tổng: {formatCurrency(lineTotal)}</p>
            </div>

            {quantityControls()}
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
