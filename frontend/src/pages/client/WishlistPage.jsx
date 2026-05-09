import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Clock3,
  Eye,
  Heart,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import ProductCard from "../../components/product/ProductCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import useWishlist from "../../hooks/useWishlist";
import { motionViewport, staggerContainer } from "../../styles/animations";

const MotionDiv = motion.div;

function EmptyWishlistState() {
  return (
    <section className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-center shadow-inner shadow-white/[0.03] backdrop-blur-xl">
      <div>
        <PackageSearch className="mx-auto text-blue-200 drop-shadow-[0_0_18px_rgba(0,91,255,0.55)]" size={54} />
        <Badge className="mx-auto mt-5" variant="primary">Wishlist trống</Badge>
        <h2 className="text-heading mt-4 text-3xl">Chưa có sản phẩm yêu thích</h2>
        <p className="text-muted mx-auto mt-3 max-w-md text-sm">
          Bấm biểu tượng trái tim trên product card để lưu laptop, tai nghe, chuột hoặc linh kiện bạn muốn quay lại xem.
        </p>
        <Button as={Link} className="mt-6 rounded-2xl" to="/products">
          Khám phá sản phẩm
          <ChevronRight size={18} />
        </Button>
      </div>
    </section>
  );
}

function ProductGrid({ products }) {
  return (
    <MotionDiv
      animate="visible"
      className="grid grid-cols-2 gap-4 md:gap-5 xl:grid-cols-3"
      initial="hidden"
      variants={staggerContainer}
      viewport={motionViewport}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </MotionDiv>
  );
}

function RecentlyViewedSection({ onClear, products }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/36 p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <Clock3 size={13} />
            Recently viewed
          </Badge>
          <h2 className="text-section">Đã xem gần đây</h2>
          <p className="text-muted mt-2 text-sm">Lưu tạm trên trình duyệt để bạn quay lại so sánh nhanh.</p>
        </div>

        {products.length > 0 && (
          <Button className="w-full rounded-2xl sm:w-auto" onClick={onClear} variant="outline">
            <Trash2 size={17} />
            Xóa lịch sử
          </Button>
        )}
      </div>

      {products.length ? (
        <MotionDiv
          animate="visible"
          className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          variants={staggerContainer}
          viewport={motionViewport}
        >
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </MotionDiv>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center">
          <Eye className="mx-auto text-slate-500" size={32} />
          <p className="mt-3 font-black text-white">Chưa có lịch sử xem</p>
          <p className="text-caption mx-auto mt-1 max-w-md text-slate-400">
            Mở một trang chi tiết sản phẩm để phần này bắt đầu ghi nhận sản phẩm đã xem.
          </p>
        </div>
      )}
    </section>
  );
}

function WishlistPage() {
  const { clearWishlist, wishlistCount, wishlistProducts } = useWishlist();
  const { clearRecentlyViewed, recentlyViewedCount, recentlyViewedProducts } = useRecentlyViewed();

  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="pb-16 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold text-slate-400">
          <Link className="premium-transition hover:text-white" to="/">
            Trang chủ
          </Link>
          <ChevronRight className="text-slate-600" size={15} />
          <span className="text-blue-200">Yêu thích</span>
        </nav>

        <section className="relative isolate overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_14%_0%,rgba(0,91,255,0.34),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(7,17,31,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_42px_rgba(0,91,255,0.14)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <Badge className="mb-4 gap-2" variant="primary">
                <Heart size={13} fill="currentColor" />
                Saved gear
              </Badge>
              <h1 className="text-heading max-w-3xl">Danh sách yêu thích</h1>
              <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
                Lưu nhanh các sản phẩm đang cân nhắc, quay lại so sánh và tiếp tục mua sắm với trải nghiệm dark ecommerce nhất quán.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Heart, label: `${wishlistCount} sản phẩm`, value: "Đang yêu thích" },
                { icon: Clock3, label: `${recentlyViewedCount} đã xem`, value: "Lưu trên trình duyệt" },
                { icon: ShieldCheck, label: "Lưu tạm", value: "Sẵn sàng mua sau" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div className="store-stat-card rounded-2xl p-3" key={item.label}>
                    <Icon className="mb-3 text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.55)]" size={20} />
                    <p className="text-sm font-black text-white">{item.label}</p>
                    <p className="text-caption mt-1 text-slate-400">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-6">
          <section className="rounded-3xl border border-white/10 bg-slate-950/36 p-4 shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="mb-4 gap-2" variant="primary">
                  <Sparkles size={13} />
                  Saved products
                </Badge>
                <h2 className="text-section">Sản phẩm đã lưu</h2>
                <p className="text-muted mt-2 text-sm">Trái tim trên product card sẽ cập nhật danh sách này tức thì.</p>
              </div>

              {wishlistProducts.length > 0 && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button as={Link} className="rounded-2xl" to="/products" variant="outline">
                    <ShoppingBag size={17} />
                    Mua thêm
                  </Button>
                  <Button className="rounded-2xl" onClick={clearWishlist} variant="outline">
                    <Trash2 size={17} />
                    Xóa tất cả
                  </Button>
                </div>
              )}
            </div>

            {wishlistProducts.length ? <ProductGrid products={wishlistProducts} /> : <EmptyWishlistState />}
          </section>

          <RecentlyViewedSection onClear={clearRecentlyViewed} products={recentlyViewedProducts} />
        </div>
      </Container>
    </div>
  );
}

export default WishlistPage;
