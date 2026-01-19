import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import lap1 from "../../../../assets/lap1.png";
import lap2 from "../../../../assets/lap2.png";
import CartProduct from "./CartProduct";
import { useState, useEffect } from "react";

function Cart({ onClose }) {
  const [cartProducts, setCartProducts] = useState([
    { id: 1, name: "Sản phẩm 1", price: "100.000đ", quantity: 1, image: lap1 },
    { id: 2, name: "Sản phẩm 2", price: "250.000đ", quantity: 2, image: lap2 },
    { id: 3, name: "Sản phẩm 3", price: "250.000đ", quantity: 2, image: lap2 },
    { id: 4, name: "Sản phẩm 4", price: "250.000đ", quantity: 2, image: lap2 },
  ]);
  const [show, setShow] = useState(false);

    useEffect(() => {
      setShow(true);
    }, []);
  const total = cartProducts.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const handleDeleteProduct = (id) => {
    setCartProducts((prev) => prev.filter((item) => item.id !== id));
  };
  // Ngăn đóng Cart khi click bên trong
  const handleCartClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
  className={`
    absolute top-full right-0 mt-2
    w-96 max-w-[calc(100vw-2rem)]
    bg-white rounded-lg shadow-xl z-50
    text-dark flex flex-col max-h-[500px]
    transition-all duration-500 ease-in-out
    ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
  `}
  onClick={handleCartClick}
>

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h4 className="font-semibold text-lg">
          Giỏ hàng ({cartProducts.length})
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Đóng giỏ hàng"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Danh sách sản phẩm  */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartProducts.length > 0 ? (
          cartProducts.map((item) => (
            <CartProduct
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              image={item.image}
              onDelete={handleDeleteProduct}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Giỏ hàng trống</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {cartProducts.length === 0 ? (
        <div className="border-t border-gray-200 p-4 bg-gray-50 hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="text-xl font-bold text-red-600">
              {total.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            Thanh toán
          </Link>
        </div>
      ) : (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="text-xl font-bold text-red-600">
              {total.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-red-700 hover:bg-red-900 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            Thanh toán
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
