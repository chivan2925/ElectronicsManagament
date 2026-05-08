import {
  Armchair,
  Boxes,
  Cpu,
  Gamepad2,
  Grid3X3,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Phone,
  SquareMousePointer,
} from "lucide-react";

export const categories = [
  { id: "all", name: "Tất cả danh mục", icon: Grid3X3, active: true },
  { id: "phones", name: "Điện thoại", icon: Phone },
  { id: "laptops", name: "Laptop", icon: Laptop },
  { id: "headphones", name: "Tai nghe", icon: Headphones },
  { id: "mice", name: "Chuột", icon: Mouse },
  { id: "keyboards", name: "Bàn phím", icon: Keyboard },
  { id: "mousepads", name: "Lót chuột", icon: SquareMousePointer },
  { id: "pc-gaming", name: "PC Gaming", icon: Monitor },
  { id: "desktop", name: "Máy bộ", icon: Boxes },
  { id: "components", name: "Linh kiện PC", icon: Cpu },
  { id: "chairs", name: "Ghế Gaming", icon: Armchair },
  { id: "accessories", name: "Phụ kiện Gaming", icon: Gamepad2 },
];

export const promoCards = [
  {
    id: 1,
    title: "Laptop Gaming",
    discount: "Giảm đến 20%",
    image: "https://placehold.co/180x140/0B1730/FFFFFF?text=ROG",
    gradient: "from-blue-600/30 via-indigo-600/20 to-slate-900",
  },
  {
    id: 2,
    title: "PC Gaming",
    discount: "Giảm đến 15%",
    image: "https://placehold.co/180x140/101827/FFFFFF?text=RTX+PC",
    gradient: "from-violet-600/30 via-blue-600/20 to-slate-900",
  },
  {
    id: 3,
    title: "Phụ kiện Gaming",
    discount: "Giảm đến 30%",
    image: "https://placehold.co/180x140/121A2B/FFFFFF?text=Gear",
    gradient: "from-cyan-600/25 via-blue-700/20 to-slate-900",
  },
];

export const services = [
  { id: 1, title: "Giao hàng nhanh", description: "Nội thành 2 giờ" },
  { id: 2, title: "Bảo hành chính hãng", description: "Cam kết 100%" },
  { id: 3, title: "Đổi trả dễ dàng", description: "Trong 7 ngày" },
  { id: 4, title: "Thanh toán an toàn", description: "Bảo mật giao dịch" },
  { id: 5, title: "Hỗ trợ 24/7", description: "1900 1234" },
];

export const featuredProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    image: "https://placehold.co/460x360/0A1324/FFFFFF?text=iPhone+15+Pro+Max",
    rating: 4.9,
    reviews: 328,
    price: 29990000,
    oldPrice: 34990000,
    discount: "-14%",
  },
  {
    id: 2,
    name: "ASUS ROG Zephyrus G14 2024",
    image: "https://placehold.co/460x360/0D182B/FFFFFF?text=ROG+G14",
    rating: 4.8,
    reviews: 186,
    price: 42990000,
    oldPrice: 48990000,
    discount: "-12%",
  },
  {
    id: 3,
    name: "Logitech G Pro X Wireless",
    image: "https://placehold.co/460x360/101827/FFFFFF?text=G+Pro+X",
    rating: 4.7,
    reviews: 214,
    price: 3190000,
    oldPrice: 3890000,
    discount: "-18%",
  },
  {
    id: 4,
    name: "Razer DeathAdder V3 Pro",
    image: "https://placehold.co/460x360/081322/FFFFFF?text=Razer+Mouse",
    rating: 4.8,
    reviews: 142,
    price: 3290000,
    oldPrice: 3990000,
    discount: "-17%",
  },
  {
    id: 5,
    name: "Keychron K8 Pro",
    image: "https://placehold.co/460x360/111827/FFFFFF?text=Keychron+K8",
    rating: 4.6,
    reviews: 96,
    price: 2590000,
    oldPrice: 2990000,
    discount: "-13%",
  },
  {
    id: 6,
    name: "PC Gaming AMD Ryzen 7 7700X",
    image: "https://placehold.co/460x360/0B1730/FFFFFF?text=Ryzen+Gaming+PC",
    rating: 4.9,
    reviews: 72,
    price: 38990000,
    oldPrice: null,
    discount: null,
  },
];

export const flashSaleProduct = {
  name: "HyperX Cloud III Wireless",
  image: "https://placehold.co/420x320/081322/FFFFFF?text=HyperX+Cloud+III",
  rating: 4.8,
  reviews: 124,
  price: 2390000,
  oldPrice: 2990000,
  discount: "-20%",
};
