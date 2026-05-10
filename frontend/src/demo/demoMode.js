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
    label: "Admin owner",
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
    label: "Operations staff",
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
    label: "Customer",
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
    duration: "3 min",
    focus: "Storefront polish",
    route: "/",
    title: "Homepage showcase",
    talkingPoints: ["Dark gaming storefront", "Hero, promo cards, service bar", "Featured products and recommendations"],
  },
  {
    duration: "4 min",
    focus: "Browsing and cart",
    route: "/products?sort=best-seller",
    title: "Catalog search to cart",
    talkingPoints: ["Search/filter/sort", "Product detail", "Wishlist and quick add"],
  },
  {
    duration: "5 min",
    focus: "Checkout",
    route: "/checkout",
    title: "Checkout and payment",
    talkingPoints: ["Profile prefill", "Coupon validation", "COD, VNPay, and MoMo sandbox handoff"],
  },
  {
    duration: "3 min",
    focus: "Customer service",
    route: "/profile/orders",
    title: "Order tracking",
    talkingPoints: ["Order history", "Tracking timeline", "Payment and delivery status"],
  },
  {
    duration: "5 min",
    focus: "Operations",
    route: "/admin/dashboard",
    title: "Admin dashboard",
    talkingPoints: ["Revenue analytics", "Customer funnel", "Inventory health and realtime activity"],
  },
  {
    duration: "4 min",
    focus: "Admin CRUD",
    route: "/admin/products",
    title: "Catalog operations",
    talkingPoints: ["Permission-aware actions", "Product/media management", "Stable mock API in demo mode"],
  },
];

export const DEMO_PRESENTATION_NOTES = [
  "Start with the homepage, then open a product detail and quick-add an in-stock item.",
  "Use coupon GAMING05 for accessories or LAPTOP1M for laptop/PC carts.",
  "Use demo.customer@electronics.local for checkout and order tracking.",
  "Use demo.admin@electronics.local for full admin access; use demo.ops@electronics.local to show staff permissions.",
  "Keep VITE_DEMO_MODE disabled outside local demos because demo auth and mock API responses are intentionally presentation-only.",
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
