import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Grid3X3,
  Menu,
  PackageSearch,
  Search,
  ShoppingCart,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { categories, createMockCartItems } from "../../data";
import { cn } from "../../utils/classNames";
import CartDrawer from "../cart/CartDrawer";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Input from "../ui/Input";

const MotionSpan = motion.span;

const headerLinkClass =
  "premium-transition inline-flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_24px_rgba(0,91,255,0.14)]";

const categoryItems = categories.filter((category) => category.slug !== "tat-ca");

function Header() {
  const [cartItems, setCartItems] = useState(createMockCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCartQuantityChange = (itemId, nextQuantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.min(Math.max(nextQuantity, 1), item.maxQuantity),
            }
          : item,
      ),
    );
  };

  const handleCartRemove = (itemId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const openCartDrawer = () => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(true);
  };

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-2xl transition-default",
        isScrolled
          ? "border-blue-300/20 bg-[#050B14]/88 shadow-[0_18px_70px_rgba(0,0,0,0.44),0_0_34px_rgba(0,91,255,0.12)]"
          : "border-white/10 bg-[#07111F]/64 shadow-[0_16px_60px_rgba(0,0,0,0.22)]",
      )}
    >
      <div className="page-container">
        <div className="flex items-center gap-3 py-3 lg:gap-4 lg:py-4">
          <a className="group flex min-w-fit items-center gap-2 sm:gap-3" href="/">
            <div className="premium-transition flex h-10 w-10 items-center justify-center rounded-xl bg-[#005BFF] text-white shadow-[0_0_28px_rgba(0,91,255,0.45)] group-hover:scale-105 group-hover:shadow-[0_0_42px_rgba(0,91,255,0.72)] sm:h-11 sm:w-11">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-base font-black leading-none text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.12)] sm:text-lg">ElectroStore</p>
              <p className="mt-1 text-[11px] font-semibold text-blue-300 sm:text-xs">Smart Choice</p>
            </div>
          </a>

          <div className="group/category relative hidden lg:block">
            <a
              className="premium-transition flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-200 shadow-inner shadow-white/[0.03] backdrop-blur-xl hover:-translate-y-0.5 hover:border-blue-300/70 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_28px_rgba(0,91,255,0.2)]"
              href="/products"
            >
              <Grid3X3 size={18} />
              Tất cả danh mục
              <ChevronDown className="premium-transition group-hover/category:rotate-180" size={16} />
            </a>

            <div className="invisible absolute left-0 top-[calc(100%+12px)] w-72 translate-y-2 rounded-2xl border border-blue-200/15 bg-[#07111F]/95 p-2 opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.42),0_0_34px_rgba(0,91,255,0.16)] backdrop-blur-2xl transition-default group-hover/category:visible group-hover/category:translate-y-0 group-hover/category:opacity-100 group-focus-within/category:visible group-focus-within/category:translate-y-0 group-focus-within/category:opacity-100">
              <div className="mb-2 px-3 py-2">
                <p className="text-sm font-black text-white">Danh mục gaming</p>
                <p className="text-caption mt-1 text-slate-400">Chọn nhanh nhóm sản phẩm</p>
              </div>
              <div className="grid gap-1">
                {categoryItems.map((category) => (
                  <a
                    className="premium-transition flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_22px_rgba(0,91,255,0.14)]"
                    href={`/products?category=${category.slug}`}
                    key={category.id}
                  >
                    <span>{category.name}</span>
                    <ChevronDown className="-rotate-90 text-blue-300" size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="premium-transition hidden flex-1 items-center rounded-2xl border border-white/10 bg-slate-950/50 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl focus-within:border-blue-300/80 focus-within:bg-slate-950/76 focus-within:shadow-[0_0_34px_rgba(0,91,255,0.24),inset_0_1px_0_rgba(255,255,255,0.05)] md:flex">
            <Input
              className="flex-1 border-0 bg-transparent px-0 shadow-none backdrop-blur-none focus-within:border-transparent focus-within:bg-transparent focus-within:shadow-none"
              inputClassName="h-10 px-1 text-sm"
              leftIcon={<Search className="ml-3 text-blue-200" size={19} />}
              placeholder="Tìm laptop, PC Gaming, tai nghe..."
              type="search"
            />
            <Button className="h-10 rounded-xl px-5 py-0 font-black shadow-[0_0_24px_rgba(0,91,255,0.36)]" size="md">
              Tìm kiếm
            </Button>
          </div>

          <nav className="ml-auto flex shrink-0 items-center gap-1.5 text-sm sm:gap-2">
            <a className={cn(headerLinkClass, "hidden xl:flex")} href="/">
              <PackageSearch size={19} />
              Theo dõi đơn hàng
            </a>
            <a className={cn(headerLinkClass, "hidden sm:flex")} href="/login">
              <UserRound size={19} />
              <span className="hidden xl:inline">Đăng nhập / Đăng ký</span>
              <span className="xl:hidden">Tài khoản</span>
            </a>
            <button className="premium-transition relative flex h-10 min-w-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-2 font-bold text-white shadow-inner shadow-white/[0.03] outline-none hover:-translate-y-0.5 hover:border-blue-300/80 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(0,91,255,0.24)] focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:h-11 sm:min-w-11 sm:px-3" onClick={openCartDrawer} type="button">
              <ShoppingCart size={20} />
              <span className="hidden lg:inline">Giỏ hàng</span>
              {cartItemCount > 0 && (
                <MotionSpan
                  animate={{ scale: [1, 1.12, 1] }}
                  className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-[0_0_18px_rgba(239,68,68,0.7)]"
                  transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 3.2 }}
                >
                  {cartItemCount}
                </MotionSpan>
              )}
            </button>

            <IconButton
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
              className="border-white/10 bg-white/[0.06] text-white hover:border-blue-300/70 hover:bg-blue-500/10 lg:hidden"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              variant="outline"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </IconButton>
          </nav>
        </div>

        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity,padding] duration-300 ease-out lg:hidden",
            isMobileMenuOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0">
            <div className="rounded-2xl border border-blue-200/15 bg-slate-950/52 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
              <div className="premium-transition flex items-center rounded-2xl border border-white/10 bg-slate-950/60 p-1.5 focus-within:border-blue-300/80 focus-within:shadow-[0_0_30px_rgba(0,91,255,0.22)]">
                <Input
                  className="flex-1 border-0 bg-transparent px-0 shadow-none backdrop-blur-none focus-within:border-transparent focus-within:bg-transparent focus-within:shadow-none"
                  inputClassName="h-10 px-1 text-sm"
                  leftIcon={<Search className="ml-3 text-blue-200" size={18} />}
                  placeholder="Tìm gear gaming..."
                  type="search"
                />
                <Button className="h-10 rounded-xl px-4 py-0" size="md">
                  Tìm
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categoryItems.slice(0, 6).map((category) => (
                  <a
                    className="premium-transition rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-200 hover:border-blue-300/60 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_22px_rgba(0,91,255,0.16)]"
                    href={`/products?category=${category.slug}`}
                    key={category.id}
                  >
                    {category.name}
                  </a>
                ))}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <a className={cn(headerLinkClass, "justify-center border border-white/10 bg-white/[0.04]")} href="/">
                  <PackageSearch size={18} />
                  Theo dõi đơn
                </a>
                <a className={cn(headerLinkClass, "justify-center border border-white/10 bg-white/[0.04]")} href="/login">
                  <UserRound size={18} />
                  Tài khoản
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <CartDrawer
      isOpen={isCartOpen}
      itemCount={cartItemCount}
      items={cartItems}
      onClose={() => setIsCartOpen(false)}
      onQuantityChange={handleCartQuantityChange}
      onRemove={handleCartRemove}
      subtotal={cartSubtotal}
    />
    </>
  );
}

export default Header;
