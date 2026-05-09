import AnnouncementBar from "../components/AnnouncementBar";
import CategorySidebar from "../components/CategorySidebar";
import FeaturedCategories from "../components/FeaturedCategories";
import FlashSaleCard from "../components/FlashSaleCard";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import PromoCard from "../components/PromoCard";
import ServiceBar from "../components/ServiceBar";
import { featuredProducts, promoCards } from "../data/mockData";

function Home() {
  return (
    <div className="min-h-screen bg-[#050B14] bg-[radial-gradient(circle_at_12%_8%,rgba(0,91,255,0.22),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_50%_88%,rgba(29,78,216,0.16),transparent_32%)] text-white">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto max-w-[1440px] space-y-10 px-4 py-6 lg:px-8">
        <section className="grid gap-5 xl:grid-cols-[280px_1fr_320px]">
          <CategorySidebar />
          <HeroBanner />
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {promoCards.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        </section>

        <ServiceBar />
        <FeaturedCategories />

        <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">Sản phẩm nổi bật</h2>
                <p className="mt-2 text-sm font-medium text-slate-400">Gear hot, cấu hình mạnh, giá tốt cho game thủ.</p>
              </div>
              <a className="premium-transition hidden text-sm font-bold text-blue-300 hover:text-white hover:drop-shadow-[0_0_14px_rgba(0,91,255,0.85)] sm:inline" href="/">
                Xem thêm
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <FlashSaleCard />
        </section>
      </main>
    </div>
  );
}

export default Home;
