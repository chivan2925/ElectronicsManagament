import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch, ShoppingCart, X } from "lucide-react";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

const MotionAside = motion.aside;
const MotionDiv = motion.div;

function CartDrawer({ isOpen, itemCount, items, onClose, onQuantityChange, onRemove, subtotal }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[80]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <button
            aria-label="Đóng giỏ hàng"
            className="absolute inset-0 bg-slate-950/72 backdrop-blur-md"
            onClick={onClose}
            type="button"
          />

          <MotionAside
            animate={{ x: 0 }}
            aria-label="Giỏ hàng"
            className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col overflow-hidden border-l border-blue-200/20 bg-[#07111F]/96 shadow-[0_0_80px_rgba(0,0,0,0.55),0_0_52px_rgba(0,91,255,0.18)] backdrop-blur-2xl sm:rounded-l-3xl"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative border-b border-white/10 p-4">
              <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_0_28px_rgba(0,91,255,0.45)]">
                    <ShoppingCart size={21} />
                  </div>
                  <div>
                    <h2 className="text-section text-xl">Giỏ hàng</h2>
                    <p className="text-caption mt-1 text-slate-400">{itemCount} sản phẩm trong giỏ</p>
                  </div>
                </div>

                <IconButton
                  aria-label="Đóng giỏ hàng"
                  className="border-white/10 bg-white/[0.05]"
                  onClick={onClose}
                  variant="outline"
                >
                  <X size={19} />
                </IconButton>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {items.length ? (
                <div className="grid gap-3">
                  {items.map((item) => (
                    <CartItem
                      item={item}
                      key={item.id}
                      onQuantityChange={onQuantityChange}
                      onRemove={onRemove}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center">
                  <div>
                    <PackageSearch className="mx-auto text-blue-200 drop-shadow-[0_0_18px_rgba(0,91,255,0.55)]" size={48} />
                    <h3 className="text-section mt-4 text-xl">Giỏ hàng đang trống</h3>
                    <p className="text-muted mx-auto mt-2 max-w-xs text-sm">
                      Chọn thêm gear gaming, laptop hoặc phụ kiện để bắt đầu đơn hàng.
                    </p>
                    <Button className="mt-5" onClick={onClose} variant="outline">
                      Tiếp tục mua sắm
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <CartSummary itemCount={itemCount} onClose={onClose} subtotal={subtotal} />
            )}
          </MotionAside>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
