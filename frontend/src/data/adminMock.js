export const kpiCards = [
  {
    title: "Doanh thu hôm nay",
    value: "128.4tr",
    trend: "+18.2%",
    tone: "blue",
  },
  {
    title: "Đơn hàng hôm nay",
    value: "84",
    trend: "+12 đơn",
    tone: "green",
  },
  {
    title: "Sản phẩm",
    value: "1,248",
    trend: "+34 mới",
    tone: "violet",
  },
  {
    title: "Người dùng",
    value: "9,420",
    trend: "+7.4%",
    tone: "amber",
  },
  {
    title: "Đơn chờ xử lý",
    value: "16",
    trend: "Cần kiểm tra",
    tone: "red",
  },
];

export const revenueData = [
  { day: "T2", revenue: 48 },
  { day: "T3", revenue: 64 },
  { day: "T4", revenue: 58 },
  { day: "T5", revenue: 82 },
  { day: "T6", revenue: 96 },
  { day: "T7", revenue: 118 },
  { day: "CN", revenue: 128 },
];

export const orderStatusData = [
  { name: "Đang xử lý", value: 38, color: "#005BFF" },
  { name: "Đang giao", value: 24, color: "#F59E0B" },
  { name: "Hoàn tất", value: 126, color: "#16A34A" },
  { name: "Đã hủy", value: 9, color: "#EF4444" },
];

export const categories = [
  { id: 1, name: "điện thoại", slug: "dien-thoai", products: 84, status: "ACTIVE" },
  { id: 2, name: "laptop", slug: "laptop", products: 126, status: "ACTIVE" },
  { id: 3, name: "tai nghe", slug: "tai-nghe", products: 58, status: "ACTIVE" },
  { id: 4, name: "chuột", slug: "chuot", products: 74, status: "ACTIVE" },
  { id: 5, name: "bàn phím", slug: "ban-phim", products: 63, status: "ACTIVE" },
  { id: 6, name: "lót chuột", slug: "lot-chuot", products: 31, status: "ACTIVE" },
  { id: 7, name: "PC Gaming", slug: "pc-gaming", products: 22, status: "ACTIVE" },
  { id: 8, name: "máy bộ", slug: "may-bo", products: 18, status: "ACTIVE" },
  { id: 9, name: "linh kiện PC", slug: "linh-kien-pc", products: 206, status: "ACTIVE" },
  { id: 10, name: "ghế gaming", slug: "ghe-gaming", products: 27, status: "ACTIVE" },
  { id: 11, name: "phụ kiện gaming", slug: "phu-kien-gaming", products: 98, status: "ACTIVE" },
];

export const brands = [
  { id: 1, name: "Apple", category: "điện thoại", products: 36, status: "ACTIVE" },
  { id: 2, name: "ASUS ROG", category: "laptop", products: 48, status: "ACTIVE" },
  { id: 3, name: "Logitech G", category: "phụ kiện gaming", products: 62, status: "ACTIVE" },
  { id: 4, name: "Razer", category: "chuột", products: 44, status: "ACTIVE" },
  { id: 5, name: "Corsair", category: "linh kiện PC", products: 57, status: "ACTIVE" },
  { id: 6, name: "Secretlab", category: "ghế gaming", products: 12, status: "HIDDEN" },
];

export const products = [
  {
    id: "SP001",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80",
    name: "Laptop ASUS ROG Strix G16",
    category: "laptop",
    brand: "ASUS ROG",
    price: 38990000,
    stock: 24,
    status: "ACTIVE",
  },
  {
    id: "SP002",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=120&q=80",
    name: "iPhone 15 Pro Max 256GB",
    category: "điện thoại",
    brand: "Apple",
    price: 29990000,
    stock: 42,
    status: "ACTIVE",
  },
  {
    id: "SP003",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=120&q=80",
    name: "Tai nghe Razer BlackShark V2",
    category: "tai nghe",
    brand: "Razer",
    price: 2490000,
    stock: 88,
    status: "ACTIVE",
  },
  {
    id: "SP004",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=120&q=80",
    name: "Chuột Logitech G Pro X Superlight",
    category: "chuột",
    brand: "Logitech G",
    price: 3290000,
    stock: 64,
    status: "ACTIVE",
  },
  {
    id: "SP005",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=120&q=80",
    name: "Bàn phím Corsair K70 RGB",
    category: "bàn phím",
    brand: "Corsair",
    price: 3690000,
    stock: 16,
    status: "LOW_STOCK",
  },
  {
    id: "SP006",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=120&q=80",
    name: "PC Gaming RTX 4070 Super",
    category: "PC Gaming",
    brand: "PCE Custom",
    price: 42990000,
    stock: 9,
    status: "ACTIVE",
  },
];

export const variants = [
  { id: "VR001", product: "Laptop ASUS ROG Strix G16", name: "i7 / 16GB / RTX 4060", color: "Eclipse Gray", price: 38990000, stock: 12, status: "ACTIVE" },
  { id: "VR002", product: "Laptop ASUS ROG Strix G16", name: "i9 / 32GB / RTX 4070", color: "Volt Green", price: 52990000, stock: 6, status: "ACTIVE" },
  { id: "VR003", product: "iPhone 15 Pro Max 256GB", name: "256GB", color: "Titan Tự nhiên", price: 29990000, stock: 18, status: "ACTIVE" },
  { id: "VR004", product: "Chuột Logitech G Pro X Superlight", name: "Wireless", color: "White", price: 3290000, stock: 28, status: "ACTIVE" },
  { id: "VR005", product: "Bàn phím Corsair K70 RGB", name: "Cherry MX Red", color: "Black", price: 3690000, stock: 4, status: "LOW_STOCK" },
];

export const media = [
  { id: "MD001", product: "Laptop ASUS ROG Strix G16", type: "Ảnh chính", url: "rog-strix-g16.jpg", status: "ACTIVE" },
  { id: "MD002", product: "iPhone 15 Pro Max 256GB", type: "Ảnh gallery", url: "iphone-15-pro.jpg", status: "ACTIVE" },
  { id: "MD003", product: "Tai nghe Razer BlackShark V2", type: "Ảnh chính", url: "blackshark-v2.jpg", status: "ACTIVE" },
  { id: "MD004", product: "PC Gaming RTX 4070 Super", type: "Ảnh cấu hình", url: "pc-4070-super.jpg", status: "HIDDEN" },
];

export const users = [
  { id: "KH001", name: "Nguyễn Minh Anh", email: "minhanh@gmail.com", phone: "0901123456", orders: 12, total: 68400000, status: "ACTIVE" },
  { id: "KH002", name: "Trần Đức Huy", email: "huytd@gmail.com", phone: "0912233445", orders: 5, total: 22490000, status: "ACTIVE" },
  { id: "KH003", name: "Lê Gia Bảo", email: "baolg@gmail.com", phone: "0987000111", orders: 2, total: 4890000, status: "BLOCKED" },
  { id: "KH004", name: "Phạm Tuấn Kiệt", email: "kietpt@gmail.com", phone: "0933555777", orders: 7, total: 37600000, status: "ACTIVE" },
];

export const staff = [
  { id: "NV001", name: "Nguyễn Văn Khang", role: "Quản trị viên", email: "khang@pce.vn", phone: "0901000001", status: "ACTIVE" },
  { id: "NV002", name: "Hoàng Minh Huy", role: "Quản lý kho", email: "huy@pce.vn", phone: "0901000002", status: "ACTIVE" },
  { id: "NV003", name: "Phạm Việt Anh", role: "Nhân viên bán hàng", email: "sales@pce.vn", phone: "0901000003", status: "ACTIVE" },
  { id: "NV004", name: "Lê Thanh Ngân", role: "CSKH", email: "support@pce.vn", phone: "0901000004", status: "BLOCKED" },
];

export const roles = [
  { id: 1, name: "Quản trị viên", permissions: 42, description: "Toàn quyền quản trị hệ thống", status: "ACTIVE" },
  { id: 2, name: "Quản lý kho", permissions: 14, description: "Quản lý tồn kho và phiếu nhập xuất", status: "ACTIVE" },
  { id: 3, name: "Nhân viên bán hàng", permissions: 18, description: "Quản lý đơn hàng, khách hàng, sản phẩm", status: "ACTIVE" },
  { id: 4, name: "CSKH", permissions: 9, description: "Xem đơn hàng và xử lý yêu cầu khách hàng", status: "HIDDEN" },
];

export const orders = [
  { id: "DH10041", customer: "Nguyễn Minh Anh", items: 3, total: 42190000, payment: "VNPay", status: "PROCESSING", createdAt: "09/05/2026 09:12" },
  { id: "DH10040", customer: "Trần Đức Huy", items: 1, total: 3290000, payment: "COD", status: "PENDING", createdAt: "09/05/2026 08:44" },
  { id: "DH10039", customer: "Phạm Tuấn Kiệt", items: 2, total: 32480000, payment: "Momo", status: "COMPLETED", createdAt: "08/05/2026 22:10" },
  { id: "DH10038", customer: "Lê Gia Bảo", items: 1, total: 2490000, payment: "COD", status: "CANCELLED", createdAt: "08/05/2026 18:35" },
];

export const warehouse = [
  { id: "KHO01", name: "Kho trung tâm TP.HCM", location: "Quận 7, TP.HCM", capacity: 5000, stock: 3480, status: "ACTIVE" },
  { id: "KHO02", name: "Kho Hà Nội", location: "Cầu Giấy, Hà Nội", capacity: 3200, stock: 2190, status: "ACTIVE" },
  { id: "KHO03", name: "Kho Đà Nẵng", location: "Hải Châu, Đà Nẵng", capacity: 1600, stock: 840, status: "ACTIVE" },
  { id: "KHO04", name: "Kho bảo hành", location: "Thủ Đức, TP.HCM", capacity: 800, stock: 120, status: "HIDDEN" },
];

export const coupons = [
  { id: "CP001", code: "GAMING05", type: "Phần trăm", value: "5%", minOrder: 3000000, used: 142, status: "ACTIVE" },
  { id: "CP002", code: "LAPTOP1M", type: "Cố định", value: "1,000,000đ", minOrder: 20000000, used: 38, status: "ACTIVE" },
  { id: "CP003", code: "GEAR10", type: "Phần trăm", value: "10%", minOrder: 1000000, used: 220, status: "ACTIVE" },
  { id: "CP004", code: "OLDSTOCK", type: "Cố định", value: "300,000đ", minOrder: 2000000, used: 12, status: "EXPIRED" },
];

export const bestSellers = [
  { id: 1, name: "Chuột Logitech G Pro X Superlight", sold: 186, revenue: 611940000 },
  { id: 2, name: "Laptop ASUS ROG Strix G16", sold: 72, revenue: 2807280000 },
  { id: 3, name: "Tai nghe Razer BlackShark V2", sold: 154, revenue: 383460000 },
  { id: 4, name: "Bàn phím Corsair K70 RGB", sold: 93, revenue: 343170000 },
];

export const activityLogs = [
  { id: 1, actor: "Nguyễn Văn Khang", action: "Tạo sản phẩm Laptop ASUS ROG Strix G16", time: "09/05/2026 09:30", type: "PRODUCT" },
  { id: 2, actor: "Hoàng Minh Huy", action: "Cập nhật tồn kho PC Gaming RTX 4070 Super", time: "09/05/2026 09:12", type: "WAREHOUSE" },
  { id: 3, actor: "Hệ thống", action: "Tự động hủy đơn DH10037 quá hạn thanh toán", time: "09/05/2026 08:59", type: "ORDER" },
  { id: 4, actor: "Phạm Việt Anh", action: "Xác nhận đơn hàng DH10039 hoàn tất", time: "08/05/2026 22:15", type: "ORDER" },
];
