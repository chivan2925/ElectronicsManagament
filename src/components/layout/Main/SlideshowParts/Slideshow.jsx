import { useState } from "react";
import { products } from "./products";
import SlideCard from "./SlideCard";
import SlideNavigation from "./SlideNavigation";

export default function Slideshow() {
  const [current, setCurrent] = useState(Math.floor(products.length / 2));

  const setStyle = (chiSo) => {
    let khoangCach = chiSo - current;
    const tongSo = products.length;

    if (khoangCach > tongSo / 2) khoangCach -= tongSo;
    else if (khoangCach < -tongSo / 2) khoangCach += tongSo;

    const khoangCachTuyetDoi = Math.abs(khoangCach);

    return {
      transform: `
        translateX(${khoangCach * 200}px) 
        scale(${1 - khoangCachTuyetDoi * 0.2})
      `,
      zIndex: 10 - khoangCachTuyetDoi,
      opacity: 1 - khoangCachTuyetDoi * 0,
      filter: khoangCach === 0 ? "none" : "brightness(60%)",
    };
  };

  const handlePrev = () => {
    setCurrent((v) => (v === 0 ? products.length - 1 : v - 1));
  };

  const handleNext = () => {
    setCurrent((v) => (v === products.length - 1 ? 0 : v + 1));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-dark w-full h-screen overflow-hidden">
      <div className="relative w-full h-[500px] flex justify-center items-center">
        {products.map((product, index) => (
          <SlideCard
            key={product.id}
            product={product}
            style={setStyle(index)}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      <SlideNavigation onPrev={handlePrev} onNext={handleNext} />
    </div>
  );
}
