import Slideshow from "./Slideshow";
export default function ProductSlideShow() {
  return (
    <div className="h-[100vh] bg-dark text-white">
      <h2 className="items-center justify-center flex text-4xl font-bold p-4">
        Sản phẩm bán chạy
      </h2>
      <Slideshow />
    </div>
  );
}
