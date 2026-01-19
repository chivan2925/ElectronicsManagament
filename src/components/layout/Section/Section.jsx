import banner1 from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner2.png";
import ram1 from "../../../assets/ram1.png";
import sao from "../../../assets/item5.png";

export default function Section() {
  return (
    <div
      className="h-[600px] bg-cover bg-center"
      style={{ backgroundImage: `url(${banner1})` }}
    >
      <div className="flex h-full w-full items-center bg-black/60 relative">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between gap-6 items-center">
          <div className="text-white space-y-6">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm">
              Uy tín tạo niềm tin
            </h2>
            <h1 className="text-5xl font-extrabold">
              Bứt phá hiệu năng <br />
              <span className="text-primary">làm chủ cuộc chơi</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-md ">
              Chuyên phân phối Laptop, PC và linh kiện máy tính chính hãng hàng
              đầu Việt Nam. Trải nghiệm công nghệ đỉnh cao cùng dịch vụ chuyên
              nghiệp.
            </p>
            <button className="bg-primary hover:bg-stone-500 hover:text-white text-black px-8 py-3 rounded-full font-semibold transition-all">
              Khám phá ngay
            </button>
          </div>

          <div className="flex justify-center items-center p-10">
            <img
              src={banner2}
              alt="Sản phẩm thương hiệu"
              className="cursor-pointer w-full max-w-[500px] object-contain filter drop-shadow-[0_40px_50px_rgba(59,130,246,0.5)] transition-transform  hover:scale-105"
            />
          </div>
        </div>
        <div className="absolute top-[5%] left-[10%] z-0">
          <img
            src={ram1}
            alt="Trang trí lắc lư"
            className="w-24 h-24 object-contain animate-sway filter drop-shadow-md"
          />
        </div>
  
        <div className="absolute top-[5%] right-[10%] z-0">
          <img
            src={sao}
            alt="Trang trí lắc lư"
            className="w-10 h-24 object-contain animate-sway filter drop-shadow-md"
          />
        </div>
        <div className="absolute bottom-[5%] left-[20%] z-0">
          <img
            src={sao}
            alt="Trang trí lắc lư"
            className="w-10 h-24 object-contain animate-sway filter drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
