import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import Cart from "./Cart/Cart";

export default function Header() {
  const [openCart, setOpenCart] = useState(false);
  return (
    <header className="bg-dark w-full sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto h-[70px] px-6 flex items-center justify-between">
        {/* logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-[40px] w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* menu */}
        <nav className="flex gap-7 text-white text-[15px] font-medium whitespace-nowrap ">
          <span className="cursor-pointer hover:text-primary ">
            Giới thiệu
          </span>
          <span className="cursor-pointer hover:text-primary ">
            Sản phẩm
          </span>
          <span className="cursor-pointer hover:text-primary ">
            Laptop
          </span>
          <span className="cursor-pointer hover:text-primary ">
            Bàn phím
          </span>
          <span className="cursor-pointer hover:text-primary ">
            Chuột
          </span>
          <span className="cursor-pointer hover:text-primary ">
            Loa
          </span>
          <span className="cursor-pointer hover:text-primary ">
            Phụ kiện
          </span>
          <span className="cursor-pointer hover:text-primary ">
            Liên hệ
          </span>
        </nav>

        {/* button */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-60 bg-[#222] border border-gray-700 rounded-full py-2 px-4 pr-10 text-sm text-white focus:outline-none focus:border-secondary "
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          </div>

          <div className="flex items-center gap-5 text-white text-xl">
              <div className="relative cursor-pointer hover:text-primary transition-colors" onClick={()=> setOpenCart(!openCart)}>
                <FaShoppingCart />
                <span className="text-dark absolute -top-2 -right-2 bg-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  10
                </span>
                {openCart && <Cart onClose={() => setOpenCart(false)} />}
              </div>
            <div className="cursor-pointer hover:text-primary transition-colors">
              <FaUser />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
