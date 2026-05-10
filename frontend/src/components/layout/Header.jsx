import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Grid3X3,
  Heart,
  Menu,
  PackageSearch,
  Search,
  ShoppingCart,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import useAuth from "../../auth/useAuth";
import { useCart } from "../../cart";
import { categories } from "../../data";
import useWishlist from "../../hooks/useWishlist";
import { preloadRoute } from "../../routes/routeLoaders";
import { cn } from "../../utils/classNames";
import NotificationDropdown from "../notification/NotificationDropdown";
import IconButton from "../ui/IconButton";

const MotionSpan = motion.span;

function lazyWithPreload(loader) {
  const Component = lazy(loader);

  Component.preload = loader;
  return Component;
}

const CartDrawer = lazyWithPreload(() => import("../cart/CartDrawer"));
const SearchOverlay = lazyWithPreload(() => import("../search/SearchOverlay"));

const headerLinkClass =
  "premium-transition inline-flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-300 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_24px_rgba(0,91,255,0.14)]";

const categoryItems = categories.filter((category) => category.slug !== "tat-ca");

function Header() {
  const { isAuthenticated, user } = useAuth();
  const { itemCount: cartItemCount, items: cartItems, removeItem, subtotal: cartSubtotal, updateQuantity } = useCart();
  const { wishlistCount } = useWishlist();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => (typeof window === "undefined" ? false : window.scrollY > 8));
  const [shouldRenderCartDrawer, setShouldRenderCartDrawer] = useState(false);
  const cartUnmountTimerRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (animationFrameId) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        const nextIsScrolled = window.scrollY > 8;

        setIsScrolled((currentIsScrolled) => (currentIsScrolled === nextIsScrolled ? currentIsScrolled : nextIsScrolled));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleSearchShortcut);

    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  useEffect(
    () => () => {
      if (cartUnmountTimerRef.current) {
        window.clearTimeout(cartUnmountTimerRef.current);
      }
    },
    [],
  );

  const openCartDrawer = () => {
    if (cartUnmountTimerRef.current) {
      window.clearTimeout(cartUnmountTimerRef.current);
    }

    setIsMobileMenuOpen(false);
    setShouldRenderCartDrawer(true);
    setIsCartOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartOpen(false);
    cartUnmountTimerRef.current = window.setTimeout(() => {
      setShouldRenderCartDrawer(false);
    }, 360);
  };

  const openSearchOverlay = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNotificationOpenChange = (nextOpen) => {
    if (nextOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const accountHref = isAuthenticated ? "/profile" : "/login";
  const accountLabel = isAuthenticated ? user?.fullName || user?.email || "Tài khoản" : "Đăng nhập / Đăng ký";
  const compactAccountLabel = "Tài khoản";
  const ordersHref = isAuthenticated ? "/profile/orders" : "/login";
  const preloadProductsRoute = useCallback(() => {
    void preloadRoute("products");
  }, []);
  const preloadWishlistRoute = useCallback(() => {
    void preloadRoute("wishlist");
  }, []);
  const preloadAccountRoute = useCallback(() => {
    void preloadRoute(isAuthenticated ? "profileLayout" : "login");
  }, [isAuthenticated]);
  const preloadOrdersRoute = useCallback(() => {
    void preloadRoute(isAuthenticated ? "profileOrders" : "login");
  }, [isAuthenticated]);
  const preloadCartDrawer = useCallback(() => {
    void CartDrawer.preload();
  }, []);
  const preloadSearchOverlay = useCallback(() => {
    void SearchOverlay.preload();
  }, []);

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
          <Link className="group flex min-w-fit items-center gap-2 sm:gap-3" to="/">
            <div className="premium-transition flex h-10 w-10 items-center justify-center rounded-xl bg-[#005BFF] text-white shadow-[0_0_28px_rgba(0,91,255,0.45)] group-hover:scale-105 group-hover:shadow-[0_0_42px_rgba(0,91,255,0.72)] sm:h-11 sm:w-11">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-base font-black leading-none text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.12)] sm:text-lg">ElectroStore</p>
              <p className="mt-1 text-[11px] font-semibold text-blue-300 sm:text-xs">Smart Choice</p>
            </div>
          </Link>

          <div className="group/category relative hidden lg:block">
            <Link
              className="premium-transition flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-200 shadow-inner shadow-white/[0.03] backdrop-blur-xl hover:-translate-y-0.5 hover:border-blue-300/70 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_28px_rgba(0,91,255,0.2)]"
              onFocus={preloadProductsRoute}
              onPointerEnter={preloadProductsRoute}
              to="/products"
            >
              <Grid3X3 size={18} />
              Tất cả danh mục
              <ChevronDown className="premium-transition group-hover/category:rotate-180" size={16} />
            </Link>

            <div className="invisible absolute left-0 top-[calc(100%+12px)] w-72 translate-y-2 rounded-2xl border border-blue-200/15 bg-[#07111F]/95 p-2 opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.42),0_0_34px_rgba(0,91,255,0.16)] backdrop-blur-2xl transition-default group-hover/category:visible group-hover/category:translate-y-0 group-hover/category:opacity-100 group-focus-within/category:visible group-focus-within/category:translate-y-0 group-focus-within/category:opacity-100">
              <div className="mb-2 px-3 py-2">
                <p className="text-sm font-black text-white">Danh mục gaming</p>
                <p className="text-caption mt-1 text-slate-400">Chọn nhanh nhóm sản phẩm</p>
              </div>
              <div className="grid gap-1">
                {categoryItems.map((category) => (
                  <Link
                    className="premium-transition flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:translate-x-1 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_22px_rgba(0,91,255,0.14)]"
                    key={category.id}
                    onFocus={preloadProductsRoute}
                    onPointerEnter={preloadProductsRoute}
                    to={`/categories/${category.slug}`}
                  >
                    <span>{category.name}</span>
                    <ChevronDown className="-rotate-90 text-blue-300" size={15} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <button
            className="premium-transition hidden h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none backdrop-blur-xl hover:border-blue-300/70 hover:bg-slate-950/76 hover:shadow-[0_0_34px_rgba(0,91,255,0.22),inset_0_1px_0_rgba(255,255,255,0.05)] focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:flex"
            onFocus={preloadSearchOverlay}
            onClick={openSearchOverlay}
            onPointerEnter={preloadSearchOverlay}
            type="button"
          >
            <Search className="shrink-0 text-blue-200" size={19} />
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-400">
              Tìm laptop, PC Gaming, tai nghe...
            </span>
            <span className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-black text-slate-500 xl:inline-flex">
              Tìm nhanh
            </span>
          </button>

          <nav className="ml-auto flex shrink-0 items-center gap-1.5 text-sm sm:gap-2">
            <Link className={cn(headerLinkClass, "hidden xl:flex")} onFocus={preloadOrdersRoute} onPointerEnter={preloadOrdersRoute} to={ordersHref}>
              <PackageSearch size={19} />
              Theo dõi đơn hàng
            </Link>
            <Link className={cn(headerLinkClass, "hidden xl:flex")} onFocus={preloadWishlistRoute} onPointerEnter={preloadWishlistRoute} to="/wishlist">
              <span className="relative flex">
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <MotionSpan
                    animate={{ scale: [1, 1.12, 1] }}
                    className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-[0_0_16px_rgba(239,68,68,0.7)]"
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {wishlistCount}
                  </MotionSpan>
                )}
              </span>
              Yêu thích
            </Link>
            <NotificationDropdown onOpenChange={handleNotificationOpenChange} />
            <Link className={cn(headerLinkClass, "hidden sm:flex")} onFocus={preloadAccountRoute} onPointerEnter={preloadAccountRoute} to={accountHref}>
              <UserRound size={19} />
              <span className="hidden max-w-40 truncate xl:inline">{accountLabel}</span>
              <span className="xl:hidden">{compactAccountLabel}</span>
            </Link>
            <button className="premium-transition relative flex h-10 min-w-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-2 font-bold text-white shadow-inner shadow-white/[0.03] outline-none hover:-translate-y-0.5 hover:border-blue-300/80 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(0,91,255,0.24)] focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:h-11 sm:min-w-11 sm:px-3" onClick={openCartDrawer} onFocus={preloadCartDrawer} onPointerEnter={preloadCartDrawer} type="button">
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
              <button
                className="premium-transition flex h-12 w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-left outline-none hover:border-blue-300/80 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(0,91,255,0.22)] focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                onFocus={preloadSearchOverlay}
                onClick={openSearchOverlay}
                onPointerEnter={preloadSearchOverlay}
                type="button"
              >
                <Search className="shrink-0 text-blue-200" size={18} />
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-400">Tìm gear gaming...</span>
                <span className="rounded-xl bg-primary px-3 py-1.5 text-xs font-black text-white shadow-[0_0_18px_rgba(0,91,255,0.36)]">
                  Tìm
                </span>
              </button>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categoryItems.slice(0, 6).map((category) => (
                  <Link
                    className="premium-transition rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-200 hover:border-blue-300/60 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_22px_rgba(0,91,255,0.16)]"
                    key={category.id}
                    onClick={closeMobileMenu}
                    onFocus={preloadProductsRoute}
                    onPointerEnter={preloadProductsRoute}
                    to={`/categories/${category.slug}`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Link className={cn(headerLinkClass, "justify-center border border-white/10 bg-white/[0.04]")} onClick={closeMobileMenu} onFocus={preloadOrdersRoute} onPointerEnter={preloadOrdersRoute} to={ordersHref}>
                  <PackageSearch size={18} />
                  Theo dõi đơn
                </Link>
                <Link className={cn(headerLinkClass, "justify-center border border-white/10 bg-white/[0.04]")} onClick={closeMobileMenu} onFocus={preloadWishlistRoute} onPointerEnter={preloadWishlistRoute} to="/wishlist">
                  <span className="relative flex">
                    <Heart size={18} />
                    {wishlistCount > 0 && (
                      <MotionSpan
                        animate={{ scale: [1, 1.12, 1] }}
                        className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-[0_0_16px_rgba(239,68,68,0.7)]"
                        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        {wishlistCount}
                      </MotionSpan>
                    )}
                  </span>
                  Yêu thích
                </Link>
                <Link className={cn(headerLinkClass, "justify-center border border-white/10 bg-white/[0.04] sm:col-span-2")} onClick={closeMobileMenu} onFocus={preloadAccountRoute} onPointerEnter={preloadAccountRoute} to={accountHref}>
                  <UserRound size={18} />
                  Tài khoản
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    {shouldRenderCartDrawer && (
      <Suspense fallback={null}>
        <CartDrawer
          isOpen={isCartOpen}
          itemCount={cartItemCount}
          items={cartItems}
          onClose={closeCartDrawer}
          onQuantityChange={updateQuantity}
          onRemove={removeItem}
          subtotal={cartSubtotal}
        />
      </Suspense>
    )}
    {isSearchOpen && (
      <Suspense fallback={null}>
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </Suspense>
    )}
    </>
  );
}

export default Header;
