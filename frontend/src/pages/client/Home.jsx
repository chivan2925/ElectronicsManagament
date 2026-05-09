import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import CategorySidebar from "../../components/home/CategorySidebar";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import FlashSaleCard from "../../components/home/FlashSaleCard";
import HeroBanner from "../../components/home/HeroBanner";
import PromoCard from "../../components/home/PromoCard";
import ServiceBar from "../../components/home/ServiceBar";
import ProductCard from "../../components/product/ProductCard";
import Container from "../../components/ui/Container";
import SectionTitle from "../../components/ui/SectionTitle";
import {
  categories,
  featuredProducts,
  flashSaleProduct,
  heroPromotion,
  promoCards,
  services,
} from "../../data";

function Home() {
  return (
    <div className="store-page-shell">
      <AnnouncementBar />
      <Header />

      <Container as="main" className="space-y-10 py-6">
        <section className="grid gap-5 xl:grid-cols-[280px_1fr_320px]">
          <CategorySidebar categories={categories} />
          <HeroBanner promotion={heroPromotion} />
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {promoCards.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        </section>

        <ServiceBar services={services} />
        <FeaturedCategories categories={categories} />

        <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div>
            <SectionTitle
              actionLabel="Xem thêm"
              subtitle="Gear hot, cấu hình mạnh, giá tốt cho game thủ."
              title="Sản phẩm nổi bật"
            />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <FlashSaleCard product={flashSaleProduct} />
        </section>
      </Container>
    </div>
  );
}

export default Home;
