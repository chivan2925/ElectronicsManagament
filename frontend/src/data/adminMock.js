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

export const dashboardKpis = [
  {
    helper: "COD, VNPay, Momo",
    key: "todayRevenue",
    title: "Doanh thu hôm nay",
    tone: "blue",
    trend: "+18.2%",
    trendType: "up",
    value: "128.4tr",
  },
  {
    helper: "So với mục tiêu 3.2 tỷ",
    key: "monthRevenue",
    title: "Doanh thu tháng",
    tone: "emerald",
    trend: "+12.8%",
    trendType: "up",
    value: "2.84 tỷ",
  },
  {
    helper: "16 đơn cần xử lý",
    key: "orders",
    title: "Đơn hàng",
    tone: "violet",
    trend: "+24 đơn",
    trendType: "up",
    value: "1,284",
  },
  {
    helper: "Khách hàng hoạt động",
    key: "users",
    title: "Users",
    tone: "amber",
    trend: "+7.4%",
    trendType: "up",
    value: "9,420",
  },
  {
    helper: "Dưới ngưỡng nhập lại",
    key: "lowStock",
    title: "Tồn kho thấp",
    tone: "rose",
    trend: "5 SKU",
    trendType: "down",
    value: "18",
  },
];

export const dashboardRevenueData = [
  { label: "26/04", revenue: 82000000, target: 76000000 },
  { label: "27/04", revenue: 96000000, target: 79000000 },
  { label: "28/04", revenue: 74400000, target: 82000000 },
  { label: "29/04", revenue: 118000000, target: 85000000 },
  { label: "30/04", revenue: 142000000, target: 92000000 },
  { label: "01/05", revenue: 134000000, target: 94000000 },
  { label: "02/05", revenue: 156000000, target: 98000000 },
  { label: "03/05", revenue: 121000000, target: 100000000 },
  { label: "04/05", revenue: 109000000, target: 101000000 },
  { label: "05/05", revenue: 136000000, target: 104000000 },
  { label: "06/05", revenue: 165000000, target: 108000000 },
  { label: "07/05", revenue: 149000000, target: 110000000 },
  { label: "08/05", revenue: 172000000, target: 114000000 },
  { label: "09/05", revenue: 128400000, target: 116000000 },
];

export const dashboardOrdersData = [
  { label: "T2", cancelled: 3, completed: 68, orders: 76 },
  { label: "T3", cancelled: 5, completed: 74, orders: 86 },
  { label: "T4", cancelled: 4, completed: 71, orders: 82 },
  { label: "T5", cancelled: 6, completed: 89, orders: 104 },
  { label: "T6", cancelled: 7, completed: 108, orders: 126 },
  { label: "T7", cancelled: 8, completed: 124, orders: 142 },
  { label: "CN", cancelled: 5, completed: 96, orders: 118 },
];

export const dashboardSalesOverview = {
  channels: [
    { label: "Online storefront", value: 58, revenue: 1647000000 },
    { label: "Admin assisted", value: 27, revenue: 766800000 },
    { label: "Marketplace", value: 15, revenue: 425600000 },
  ],
  metrics: [
    { label: "AOV", value: "2.21tr", helper: "+9.1%" },
    { label: "Conversion", value: "4.8%", helper: "+0.6%" },
    { label: "Refund rate", value: "1.2%", helper: "-0.3%" },
    { label: "Fulfillment", value: "92%", helper: "+3.4%" },
  ],
};

export const dashboardTopProducts = [
  {
    category: "Chuột",
    id: "TP001",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=120&q=80",
    name: "Chuột Logitech G Pro X Superlight",
    revenue: 611940000,
    sold: 186,
  },
  {
    category: "Laptop",
    id: "TP002",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80",
    name: "Laptop ASUS ROG Strix G16",
    revenue: 2807280000,
    sold: 72,
  },
  {
    category: "Tai nghe",
    id: "TP003",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=120&q=80",
    name: "Tai nghe Razer BlackShark V2",
    revenue: 383460000,
    sold: 154,
  },
  {
    category: "Bàn phím",
    id: "TP004",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=120&q=80",
    name: "Bàn phím Corsair K70 RGB",
    revenue: 343170000,
    sold: 93,
  },
];

export const dashboardLowStockProducts = [
  { id: "LS001", name: "Corsair K70 RGB Cherry MX Red", reorderAt: 12, sku: "KB-COR-K70-RGB", stock: 4, warehouse: "Kho trung tâm" },
  { id: "LS002", name: "PC Gaming RTX 4070 Super", reorderAt: 10, sku: "PC-PCE-4070S", stock: 6, warehouse: "Kho Hà Nội" },
  { id: "LS003", name: "Secretlab Titan Evo Black", reorderAt: 8, sku: "CH-SL-TITAN-BK", stock: 3, warehouse: "Kho TP.HCM" },
  { id: "LS004", name: "SSD Samsung 990 Pro 2TB", reorderAt: 20, sku: "SSD-SS-990P-2T", stock: 9, warehouse: "Kho Đà Nẵng" },
  { id: "LS005", name: "Nguồn Corsair RM850x", reorderAt: 15, sku: "PSU-COR-RM850X", stock: 7, warehouse: "Kho trung tâm" },
];

export const dashboardRecentActivity = [
  { id: 1, actor: "Nguyễn Văn Khang", action: "Duyệt chiến dịch giảm giá Gaming Weekend.", time: "09/05/2026 10:21", type: "PRODUCT" },
  { id: 2, actor: "Hệ thống", action: "Gắn cờ 5 SKU dưới ngưỡng nhập lại.", time: "09/05/2026 10:05", type: "WAREHOUSE" },
  { id: 3, actor: "Phạm Việt Anh", action: "Xác nhận thanh toán VNPay cho đơn DH10041.", time: "09/05/2026 09:48", type: "PAYMENT" },
  { id: 4, actor: "Hoàng Minh Huy", action: "Chuyển 12 laptop ROG sang kho Hà Nội.", time: "09/05/2026 09:31", type: "WAREHOUSE" },
  { id: 5, actor: "Hệ thống", action: "Tạo nhắc việc xử lý 16 đơn đang chờ.", time: "09/05/2026 09:02", type: "ORDER" },
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
  { id: 1, name: "Điện thoại", slug: "dien-thoai", products: 84, status: "ACTIVE" },
  { id: 2, name: "Laptop", slug: "laptop", products: 126, status: "ACTIVE" },
  { id: 3, name: "Tai nghe", slug: "tai-nghe", products: 58, status: "ACTIVE" },
  { id: 4, name: "Chuột", slug: "chuot", products: 74, status: "ACTIVE" },
  { id: 5, name: "Bàn phím", slug: "ban-phim", products: 63, status: "ACTIVE" },
  { id: 6, name: "Lót chuột", slug: "lot-chuot", products: 31, status: "ACTIVE" },
  { id: 7, name: "PC Gaming", slug: "pc-gaming", products: 22, status: "ACTIVE" },
  { id: 8, name: "Máy bộ", slug: "may-bo", products: 18, status: "ACTIVE" },
  { id: 9, name: "Linh kiện PC", slug: "linh-kien-pc", products: 206, status: "ACTIVE" },
  { id: 10, name: "Ghế gaming", slug: "ghe-gaming", products: 27, status: "ACTIVE" },
  { id: 11, name: "Phụ kiện gaming", slug: "phu-kien-gaming", products: 98, status: "ACTIVE" },
];

export const brands = [
  { id: 1, name: "Apple", category: "Điện thoại", products: 36, status: "ACTIVE" },
  { id: 2, name: "ASUS ROG", category: "Laptop", products: 48, status: "ACTIVE" },
  { id: 3, name: "Logitech G", category: "Phụ kiện gaming", products: 62, status: "ACTIVE" },
  { id: 4, name: "Razer", category: "Chuột", products: 44, status: "ACTIVE" },
  { id: 5, name: "Corsair", category: "Linh kiện PC", products: 57, status: "ACTIVE" },
  { id: 6, name: "Secretlab", category: "Ghế gaming", products: 12, status: "HIDDEN" },
];

export const products = [
  {
    id: "SP001",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80",
    name: "Laptop ASUS ROG Strix G16",
    category: "Laptop",
    brand: "ASUS ROG",
    price: 38990000,
    stock: 24,
    status: "ACTIVE",
  },
  {
    id: "SP002",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=120&q=80",
    name: "iPhone 15 Pro Max 256GB",
    category: "Điện thoại",
    brand: "Apple",
    price: 29990000,
    stock: 42,
    status: "ACTIVE",
  },
  {
    id: "SP003",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=120&q=80",
    name: "Tai nghe Razer BlackShark V2",
    category: "Tai nghe",
    brand: "Razer",
    price: 2490000,
    stock: 88,
    status: "ACTIVE",
  },
  {
    id: "SP004",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=120&q=80",
    name: "Chuột Logitech G Pro X Superlight",
    category: "Chuột",
    brand: "Logitech G",
    price: 3290000,
    stock: 64,
    status: "ACTIVE",
  },
  {
    id: "SP005",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=120&q=80",
    name: "Bàn phím Corsair K70 RGB",
    category: "Bàn phím",
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
