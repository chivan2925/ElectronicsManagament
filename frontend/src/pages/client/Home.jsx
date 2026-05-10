import { lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DeferredSectionBoundary from "../../components/common/DeferredSectionBoundary";
import AnnouncementBar from "../../components/layout/AnnouncementBar";
import Header from "../../components/layout/Header";
import CategorySidebar from "../../components/home/CategorySidebar";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import FlashSaleCard from "../../components/home/FlashSaleCard";
import HeroBanner from "../../components/home/HeroBanner";
import PromoCard from "../../components/home/PromoCard";
import ServiceBar from "../../components/home/ServiceBar";
import ProductCard from "../../components/product/ProductCard";
import SEOHead from "../../components/seo/SEOHead";
import {
  BannerSkeleton,
  CategorySkeleton,
  HeaderSkeleton,
  ProductCardSkeleton,
  SkeletonBlock,
} from "../../components/skeletons";
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
import { buildHomeMetadata } from "../../seo/metadata";
import { motionViewport, staggerContainer } from "../../styles/animations";

const MotionDiv = motion.div;
const RecentlyViewedSection = lazy(() => import("../../components/product/RecentlyViewedSection"));
const TrendingProducts = lazy(() => import("../../components/product/TrendingProducts"));
const BestSellerSection = lazy(() => import("../../components/product/BestSellerSection"));

function Home() {
  const [isLoadingDemo, setIsLoadingDemo] = useState(true);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      setIsLoadingDemo(false);
    }, 650);

    return () => window.clearTimeout(loadingTimer);
  }, []);

  return (
    <div className="store-page-shell">
      <SEOHead metadata={buildHomeMetadata({ categories, products: featuredProducts })} />
      <AnnouncementBar />
      {isLoadingDemo ? <HeaderSkeleton /> : <Header />}

      <Container as="main" className="section-wrapper" id="main-content" tabIndex={-1}>
        {isLoadingDemo ? (
          <>
            <section className="grid gap-5 xl:grid-cols-[280px_1fr_320px]">
              <CategorySkeleton count={categories.length} variant="sidebar" />
              <BannerSkeleton />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 [&>*:last-child]:sm:col-span-2 [&>*:last-child]:lg:col-span-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <BannerSkeleton key={index} variant="promo" />
                ))}
              </div>
            </section>

            <section className="section-visual skeleton-card grid gap-3 rounded-2xl p-3 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="flex items-center gap-3 rounded-xl bg-[#07111F]/70 p-4 ring-1 ring-white/10" key={index}>
                  <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-24 rounded-full" />
                    <SkeletonBlock className="h-3 w-32 rounded-full" />
                  </div>
                </div>
              ))}
            </section>

            <section className="section-visual">
              <div className="mb-5 flex-between gap-4">
                <div className="space-y-2">
                  <SkeletonBlock className="h-7 w-48 rounded-full" />
                  <SkeletonBlock className="h-4 w-64 rounded-full" />
                </div>
                <SkeletonBlock className="hidden h-4 w-20 rounded-full sm:block" />
              </div>
              <CategorySkeleton count={10} />
            </section>

            <section className="section-visual grid gap-6 xl:grid-cols-[1fr_340px]">
              <div>
                <div className="mb-5 flex-between gap-4">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-7 w-48 rounded-full" />
                    <SkeletonBlock className="h-4 w-72 rounded-full" />
                  </div>
                  <SkeletonBlock className="hidden h-4 w-20 rounded-full sm:block" />
                </div>

                <div className="grid-products">
                  {Array.from({ length: featuredProducts.length }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              </div>

              <ProductCardSkeleton variant="feature" />
            </section>
          </>
        ) : (
          <>
            <section className="grid gap-5 xl:grid-cols-[280px_1fr_320px]">
              <CategorySidebar categories={categories} />
              <HeroBanner promotion={heroPromotion} />
              <MotionDiv
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 [&>*:last-child]:sm:col-span-2 [&>*:last-child]:lg:col-span-1"
                initial="hidden"
                variants={staggerContainer}
                viewport={motionViewport}
                whileInView="visible"
              >
                {promoCards.map((promo) => (
                  <PromoCard key={promo.id} promo={promo} />
                ))}
              </MotionDiv>
            </section>

            <ServiceBar services={services} />
            <FeaturedCategories categories={categories} />

            <section className="section-visual grid gap-6 xl:grid-cols-[1fr_340px]">
              <div>
                <SectionTitle
                  actionHref="/products"
                  actionLabel="Xem thêm"
                  subtitle="Gear hot, cấu hình mạnh, giá tốt cho game thủ."
                  title="Sản phẩm nổi bật"
                />

                <MotionDiv
                  className="grid-products"
                  initial="hidden"
                  variants={staggerContainer}
                  viewport={motionViewport}
                  whileInView="visible"
                >
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </MotionDiv>
              </div>

              <FlashSaleCard product={flashSaleProduct} />
            </section>

            <DeferredSectionBoundary fallbackProps={{ cardCount: 4, surface: "home" }}>
              <RecentlyViewedSection
                limit={10}
                surface="home"
                subtitle="Sản phẩm bạn vừa xem được lưu tạm để quay lại so sánh nhanh."
                title="Tiếp tục xem sản phẩm"
              />
            </DeferredSectionBoundary>

            <DeferredSectionBoundary fallbackProps={{ cardCount: 4, surface: "home" }}>
              <TrendingProducts />
            </DeferredSectionBoundary>

            <DeferredSectionBoundary fallbackProps={{ cardCount: 4, surface: "home" }}>
              <BestSellerSection />
            </DeferredSectionBoundary>
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;
