import { APP_PERMISSIONS, APP_ROLES, AUTH_USER_TYPES } from "../auth/roleHelpers";

const DEMO_MODE_VALUES = new Set(["1", "true", "yes", "on", "demo"]);

export const isDemoModeEnabled = DEMO_MODE_VALUES.has(
  String(import.meta.env.VITE_DEMO_MODE ?? "").trim().toLowerCase(),
);

export const DEMO_RESPONSE_DELAY_MS = 180;
export const DEMO_PASSWORD = "Demo@12345";

const allAdminPermissions = Object.values(APP_PERMISSIONS);

const operationsPermissions = [
  APP_PERMISSIONS.dashboardView,
  APP_PERMISSIONS.productView,
  APP_PERMISSIONS.productUpdate,
  APP_PERMISSIONS.variantView,
  APP_PERMISSIONS.variantUpdate,
  APP_PERMISSIONS.mediaView,
  APP_PERMISSIONS.mediaCreate,
  APP_PERMISSIONS.orderView,
  APP_PERMISSIONS.orderUpdate,
  APP_PERMISSIONS.warehouseView,
  APP_PERMISSIONS.warehouseUpdate,
  APP_PERMISSIONS.couponView,
  APP_PERMISSIONS.revenueReportView,
  APP_PERMISSIONS.bestSellerReportView,
  APP_PERMISSIONS.activityLogView,
];

export const DEMO_ACCOUNTS = [
  {
    email: "demo.admin@electronics.local",
    id: "demo-admin",
    label: "Quản trị viên (Chủ)",
    password: DEMO_PASSWORD,
    permissions: allAdminPermissions,
    redirectTo: "/admin/dashboard",
    roles: [APP_ROLES.ADMIN],
    surface: "admin",
    user: {
      email: "demo.admin@electronics.local",
      fullName: "Demo Admin",
      id: 501,
      phone: "0901000501",
      role: APP_ROLES.ADMIN,
      roleName: APP_ROLES.ADMIN,
      roles: [APP_ROLES.ADMIN],
      staffId: 501,
      status: "ACTIVE",
      type: AUTH_USER_TYPES.admin,
      username: "demo-admin",
    },
  },
  {
    email: "demo.ops@electronics.local",
    id: "demo-ops",
    label: "Nhân viên vận hành",
    password: DEMO_PASSWORD,
    permissions: operationsPermissions,
    redirectTo: "/admin/dashboard",
    roles: [APP_ROLES.STAFF],
    surface: "admin",
    user: {
      email: "demo.ops@electronics.local",
      fullName: "Demo Operations",
      id: 502,
      phone: "0901000502",
      role: APP_ROLES.STAFF,
      roleName: APP_ROLES.STAFF,
      roles: [APP_ROLES.STAFF],
      staffId: 502,
      status: "ACTIVE",
      type: AUTH_USER_TYPES.staff,
      username: "demo-ops",
    },
  },
  {
    email: "demo.customer@electronics.local",
    id: "demo-customer",
    label: "Khách hàng",
    password: DEMO_PASSWORD,
    permissions: [],
    redirectTo: "/",
    roles: [APP_ROLES.USER],
    surface: "store",
    user: {
      email: "demo.customer@electronics.local",
      fullName: "Nguyễn Minh Anh",
      id: 1001,
      phone: "0901123456",
      role: APP_ROLES.USER,
      roleName: APP_ROLES.USER,
      roles: [APP_ROLES.USER],
      status: "ACTIVE",
      type: AUTH_USER_TYPES.user,
      username: "minhanh.demo",
    },
  },
];

export const DEMO_CUSTOMER_PROFILE = {
  avatarUrl: "",
  createdAt: "2026-04-12T09:00:00",
  dateOfBirth: "1998-08-18",
  email: "demo.customer@electronics.local",
  fullName: "Nguyễn Minh Anh",
  gender: "FEMALE",
  id: 1001,
  phoneNumber: "0901123456",
  status: "ACTIVE",
  updatedAt: "2026-05-10T08:30:00",
  username: "minhanh.demo",
};

export const DEMO_COUPONS = [
  {
    code: "GAMING05",
    endDate: "2026-12-31T23:59:59",
    id: 301,
    maxDiscount: 500000,
    minOrder: 3000000,
    startDate: "2026-04-01T00:00:00",
    status: "ACTIVE",
    timeStatus: "VALID",
    type: "PERCENT",
    usageLimit: 500,
    usedCount: 142,
    value: 5,
  },
  {
    code: "LAPTOP1M",
    endDate: "2026-12-31T23:59:59",
    id: 302,
    maxDiscount: 1000000,
    minOrder: 20000000,
    startDate: "2026-04-01T00:00:00",
    status: "ACTIVE",
    timeStatus: "VALID",
    type: "FIXED",
    usageLimit: 120,
    usedCount: 38,
    value: 1000000,
  },
  {
    code: "GEAR10",
    endDate: "2026-12-31T23:59:59",
    id: 303,
    maxDiscount: 300000,
    minOrder: 1000000,
    startDate: "2026-04-01T00:00:00",
    status: "ACTIVE",
    timeStatus: "VALID",
    type: "PERCENT",
    usageLimit: 800,
    usedCount: 220,
    value: 10,
  },
];

export const DEMO_SCENARIOS = [
  {
    duration: "3 phút",
    focus: "Giao diện storefront",
    route: "/",
    title: "Trình diễn trang chủ",
    talkingPoints: ["Giao diện tối chuyên cho gaming", "Banner, thẻ khuyến mãi, thanh dịch vụ", "Sản phẩm nổi bật và gợi ý"],
  },
  {
    duration: "4 phút",
    focus: "Duyệt sản phẩm và giỏ hàng",
    route: "/products?sort=best-seller",
    title: "Tìm kiếm sản phẩm và thêm giỏ",
    talkingPoints: ["Tìm kiếm/lọc/sắp xếp", "Chi tiết sản phẩm", "Danh sách yêu thích và thêm nhanh"],
  },
  {
    duration: "5 phút",
    focus: "Thanh toán",
    route: "/checkout",
    title: "Thanh toán và đơn hàng",
    talkingPoints: ["Tự động điền thông tin", "Kiểm tra mã giảm giá", "Tích hợp sandbox COD, VNPay và MoMo"],
  },
  {
    duration: "3 phút",
    focus: "Chăm sóc khách hàng",
    route: "/profile/orders",
    title: "Theo dõi đơn hàng",
    talkingPoints: ["Lịch sử đơn hàng", "Tiến trình giao hàng", "Trạng thái thanh toán và vận chuyển"],
  },
  {
    duration: "5 phút",
    focus: "Vận hành",
    route: "/admin/dashboard",
    title: "Dashboard quản trị",
    talkingPoints: ["Phân tích doanh thu", "Phễu khách hàng", "Sức khỏe tồn kho và hoạt động trực tiếp"],
  },
  {
    duration: "4 phút",
    focus: "Quản lý dữ liệu",
    route: "/admin/products",
    title: "Vận hành catalog",
    talkingPoints: ["Phân quyền thao tác", "Quản lý sản phẩm/media", "Mock API ổn định trong chế độ demo"],
  },
];

export const DEMO_PRESENTATION_NOTES = [
  "Bắt đầu từ trang chủ, sau đó mở chi tiết sản phẩm và thêm nhanh một mặt hàng còn hàng.",
  "Sử dụng mã GAMING05 cho phụ kiện hoặc LAPTOP1M cho giỏ hàng laptop/PC.",
  "Sử dụng demo.customer@electronics.local để thanh toán và theo dõi đơn hàng.",
  "Sử dụng demo.admin@electronics.local cho quyền admin toàn phần; dùng demo.ops@electronics.local để cho thấy quyền của nhân viên.",
  "Giữ VITE_DEMO_MODE tắt ngoài môi trường demo vì các phản hồi giả lập chỉ dành riêng cho việc trình bày.",
];

export function getDemoAccountsForSurface(surface) {
  return DEMO_ACCOUNTS.filter((account) => account.surface === surface);
}

export function getDemoAccountByEmail(email) {
  const normalizedEmail = String(email ?? "").trim().toLowerCase();

  return DEMO_ACCOUNTS.find((account) => account.email.toLowerCase() === normalizedEmail) ?? null;
}

function encodeBase64Url(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  const encoded = globalThis.btoa(text);

  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function createDemoJwt(account) {
  const header = encodeBase64Url({ alg: "none", typ: "JWT" });
  const payload = encodeBase64Url({
    demo: true,
    exp: 4102444800,
    roles: account.roles,
    sub: account.email,
    type: account.user.type,
  });

  return `${header}.${payload}.demo`;
}

export function createDemoAuthResponse(account) {
  return {
    accessToken: createDemoJwt(account),
    demo: true,
    permissions: account.permissions,
    refreshToken: null,
    roles: account.roles,
    user: {
      ...account.user,
      permissions: account.permissions,
      roles: account.roles,
    },
  };
}

export function createDemoApiError(message, options = {}) {
  const status = options.status ?? 400;
  const error = new Error(message);

  error.apiError = {
    code: options.code ?? "DEMO_API_ERROR",
    details: options.details ?? null,
    isForbidden: status === 403,
    isNetworkError: false,
    isServerError: status >= 500,
    isTimeout: false,
    isUnauthorized: status === 401,
    isValidationError: [400, 409, 422].includes(status),
    message,
    method: options.method ?? null,
    path: options.path ?? null,
    status,
    type: status === 401 ? "unauthorized" : status === 403 ? "forbidden" : "client",
    url: options.url ?? null,
  };
  error.normalizedError = error.apiError;

  return error;
}
