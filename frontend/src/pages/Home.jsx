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
    <div className="min-h-screen bg-[#050B14] text-white">
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
                <h2 className="text-2xl font-black text-white">Sản phẩm nổi bật</h2>
                <p className="mt-1 text-sm text-slate-500">Gear hot, cấu hình mạnh, giá tốt cho game thủ.</p>
              </div>
              <a className="hidden text-sm font-bold text-blue-300 hover:text-white sm:inline" href="/">
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
