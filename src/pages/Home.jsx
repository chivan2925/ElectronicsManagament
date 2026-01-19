import Header from "../components/layout/Header/Header";
import ProductSlideShow from "../components/layout/Main/SlideshowParts/ProductSlideShow";
import HomeBanner from "../components/layout/Main/HomeBanner";
import Footer from "../components/layout/Footer/Footer";
import ProductContainer from "../components/layout/Main/Container/ProductContainer";
function Home() {
  return (
    <>
      <HomeBanner />
      <ProductSlideShow />
      <ProductContainer />
    </>
  );
}


export default Home;
