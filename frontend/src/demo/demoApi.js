import { APP_PERMISSIONS } from "../auth/roleHelpers";
import {
  brands as adminBrands,
  categories as adminCategories,
  staff as adminStaff,
  users as adminUsers,
  warehouse as adminWarehouses,
} from "../data/adminMock";
import { products as storeProducts } from "../data/products";
import { normalizeSlug } from "../api/productMapper";
import {
  DEMO_COUPONS,
  DEMO_CUSTOMER_PROFILE,
  DEMO_RESPONSE_DELAY_MS,
  createDemoApiError,
  isDemoModeEnabled,
} from "./demoMode";

const CATEGORY_IDS = {
  "PC Gaming": 7,
  laptop: 2,
  "bàn phím": 5,
  "chuột": 4,
  "ghế gaming": 10,
  "linh kiện PC": 9,
  "lót chuột": 6,
  "máy bộ": 8,
  "phụ kiện gaming": 11,
  "tai nghe": 3,
  "điện thoại": 1,
};

const RESOURCE_ROUTES = [
  { key: "categories", path: "/admin/categories", searchFields: ["name", "slug", "description"] },
  { key: "brands", path: "/admin/brands", searchFields: ["name", "category", "categoryName"] },
  { key: "products", path: "/admin/products", searchFields: ["name", "slug", "brandName", "categoryName", "code"] },
  { key: "variants", path: "/admin/variants", searchFields: ["name", "variantName", "productName", "sku"] },
  { key: "media", path: "/admin/media", searchFields: ["fileName", "productName", "publicId", "imageUrl"] },
  { key: "users", path: "/admin/users", searchFields: ["fullName", "name", "email", "phoneNumber"] },
  { key: "staff", path: "/admin/staffs", searchFields: ["fullName", "name", "email", "roleName"] },
  { key: "roles", path: "/admin/roles", searchFields: ["name", "roleName"] },
  { key: "permissions", path: "/admin/permissions", searchFields: ["code", "name", "resource"] },
  { key: "orders", path: "/admin/orders", searchFields: ["code", "userFullName", "shippingName", "shippingPhone"] },
  { key: "warehouses", path: "/admin/warehouses", searchFields: ["name", "location"] },
  { key: "warehouseTransactions", path: "/admin/warehouse-transactions", searchFields: ["code", "note", "type"] },
  { key: "coupons", path: "/admin/coupons", searchFields: ["code", "type", "status"] },
];

let demoDb = null;
let nextIdCounters = null;

function delay() {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, DEMO_RESPONSE_DELAY_MS);
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function getDigits(value, fallback) {
  const digits = String(value ?? "").match(/\d+/g)?.join("");
  const number = Number(digits);

  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getBrandSeed(products) {
  const brandIds = new Map();
  let nextBrandId = 1;

  products.forEach((product) => {
    if (!brandIds.has(product.brand)) {
      brandIds.set(product.brand, nextBrandId);
      nextBrandId += 1;
    }
  });

  return brandIds;
}

function buildStoreProducts() {
  const brandIds = getBrandSeed(storeProducts);

  return storeProducts.map((product, index) => {
    const id = index + 1;
    const categoryId = CATEGORY_IDS[product.category] ?? 99;
    const brandId = brandIds.get(product.brand) ?? 99;
    const stock = Number(product.stock ?? 0);
    const variant = {
      color: product.tags?.[0] ?? "Standard",
      id,
      name: "Bản tiêu chuẩn",
      price: product.price,
      productId: id,
      productName: product.name,
      sku: `DEMO-${String(id).padStart(3, "0")}`,
      status: "ACTIVE",
      stock,
      totalStock: stock,
      variantId: id,
      variantName: "Bản tiêu chuẩn",
    };

    return {
      brand: { id: brandId, name: product.brand },
      brandId,
      brandName: product.brand,
      category: { id: categoryId, name: product.category },
      categoryId,
      categoryName: product.category,
      code: product.id,
      createdAt: `${product.createdAt}T09:00:00`,
      description: `${product.name} demo seed for a smooth ElectronicsManagement presentation flow.`,
      discountLabel: product.discount,
      featured: index < 8,
      id,
      media: [
        {
          displayOrder: 0,
          fileName: `${product.slug}.png`,
          id: id * 100,
          imageUrl: product.image,
          isPrimary: true,
          productId: id,
          productName: product.name,
          publicId: `demo/products/${product.slug}`,
          status: "ACTIVE",
        },
      ],
      name: product.name,
      oldPrice: product.oldPrice,
      price: product.price,
      productId: id,
      rating: product.rating,
      ratingCount: product.reviews,
      reviews: product.reviews,
      slug: product.slug,
      sold: product.sold,
      soldQuantity: product.sold,
      specsJson: {
        "Demo SKU": `DEMO-${String(id).padStart(3, "0")}`,
        "Điểm nhấn": product.tags?.join(", ") ?? "ElectronicsManagement demo",
        "Tình trạng": stock > 0 ? "Còn hàng" : "Tạm hết hàng",
      },
      status: "ACTIVE",
      stock,
      tags: product.tags,
      totalStock: stock,
      updatedAt: "2026-05-10T08:30:00",
      variants: [variant],
      warrantyMonths: product.category === "điện thoại" || product.category === "laptop" ? 24 : 12,
    };
  });
}

function buildMedia(products) {
  return products.flatMap((product) =>
    product.media.map((media) => ({
      ...media,
      attachmentType: "product",
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      url: media.imageUrl,
    })),
  );
}

function buildCategories() {
  return adminCategories.map((category) => ({
    ...category,
    createdAt: "2026-04-01T09:00:00",
    description: `Demo category for ${category.name} products.`,
    icon: "",
    updatedAt: "2026-05-10T08:30:00",
  }));
}

function buildBrands() {
  return adminBrands.map((brand) => ({
    ...brand,
    categoryName: brand.category,
    createdAt: "2026-04-02T09:00:00",
    updatedAt: "2026-05-10T08:30:00",
  }));
}

function buildUsers() {
  return [
    DEMO_CUSTOMER_PROFILE,
    ...adminUsers.map((user, index) => ({
      ...user,
      createdAt: "2026-04-10T09:00:00",
      fullName: user.name,
      id: getDigits(user.id, 1100 + index),
      phoneNumber: user.phone,
      updatedAt: "2026-05-10T08:30:00",
      username: normalizeSlug(user.name),
    })),
  ];
}

function buildStaff() {
  return [
    {
      email: "demo.admin@electronics.local",
      fullName: "Demo Admin",
      id: 501,
      phoneNumber: "0901000501",
      roleId: 1,
      roleName: "ADMIN",
      staffId: 501,
      status: "ACTIVE",
      username: "demo-admin",
    },
    {
      email: "demo.ops@electronics.local",
      fullName: "Demo Operations",
      id: 502,
      phoneNumber: "0901000502",
      roleId: 2,
      roleName: "STAFF",
      staffId: 502,
      status: "ACTIVE",
      username: "demo-ops",
    },
    ...adminStaff.map((staff, index) => ({
      ...staff,
      assignedAt: "2026-04-05T09:00:00",
      fullName: staff.name,
      id: getDigits(staff.id, 600 + index),
      phoneNumber: staff.phone,
      roleName: staff.role,
      staffId: getDigits(staff.id, 600 + index),
      updatedAt: "2026-05-10T08:30:00",
      username: normalizeSlug(staff.name),
    })),
  ];
}

function buildPermissions() {
  return Object.values(APP_PERMISSIONS).map((code, index) => ({
    code,
    id: index + 1,
    name: code,
    permissionCode: code,
  }));
}

function buildRoles(permissions) {
  const operationsCodes = [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.productView,
    APP_PERMISSIONS.productUpdate,
    APP_PERMISSIONS.variantView,
    APP_PERMISSIONS.mediaView,
    APP_PERMISSIONS.mediaCreate,
    APP_PERMISSIONS.orderView,
    APP_PERMISSIONS.orderUpdate,
    APP_PERMISSIONS.warehouseView,
    APP_PERMISSIONS.revenueReportView,
  ];
  const operationsPermissions = permissions.filter((permission) => operationsCodes.includes(permission.code));

  return [
    {
      id: 1,
      name: "ADMIN",
      permissionCount: permissions.length,
      permissionIds: permissions.map((permission) => permission.id),
      permissions,
      staffCount: 2,
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "STAFF",
      permissionCount: operationsPermissions.length,
      permissionIds: operationsPermissions.map((permission) => permission.id),
      permissions: operationsPermissions,
      staffCount: 3,
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "USER",
      permissionCount: 0,
      permissionIds: [],
      permissions: [],
      staffCount: 0,
      status: "ACTIVE",
    },
  ];
}

function buildWarehouseTransactions() {
  return [
    {
      code: "WHT-DEMO-001",
      createdAt: "2026-05-10T08:15:00",
      id: 701,
      note: "Nhập bổ sung laptop và gear bán chạy cho Gaming Weekend.",
      quantity: 42,
      status: "COMPLETED",
      type: "INBOUND",
      warehouseId: "KHO01",
      warehouseName: "Kho trung tâm TP.HCM",
    },
    {
      code: "WHT-DEMO-002",
      createdAt: "2026-05-10T09:05:00",
      id: 702,
      note: "Xuất kho xử lý đơn online đã thanh toán VNPay.",
      quantity: 18,
      status: "COMPLETED",
      type: "OUTBOUND",
      warehouseId: "KHO02",
      warehouseName: "Kho Hà Nội",
    },
  ];
}

function createOrderItems(products, selections) {
  return selections.map(({ productIndex, quantity }) => {
    const product = products[productIndex];
    const variant = product.variants[0];

    return {
      price: variant.price,
      productId: product.id,
      productName: product.name,
      quantity,
      variantId: variant.id,
      variantName: variant.name,
    };
  });
}

function buildSeedOrders(products) {
  const firstOrderItems = createOrderItems(products, [
    { productIndex: 1, quantity: 1 },
    { productIndex: 3, quantity: 1 },
  ]);
  const secondOrderItems = createOrderItems(products, [
    { productIndex: 6, quantity: 1 },
    { productIndex: 15, quantity: 1 },
  ]);

  return [
    buildOrderRecord({
      couponCode: "LAPTOP1M",
      id: 9001,
      items: firstOrderItems,
      paymentMethod: "DIGITAL",
      paymentStatus: "PAID",
      shippingFee: 0,
      shippingStatus: "SHIPPING",
      status: "PROCESSING",
      trackingCode: "GHN-DEMO-9001",
    }),
    buildOrderRecord({
      couponCode: "GEAR10",
      id: 9002,
      items: secondOrderItems,
      paymentMethod: "CASH",
      paymentStatus: "PENDING",
      shippingFee: 89000,
      shippingStatus: "CONFIRMED",
      status: "PENDING",
      trackingCode: "",
    }),
  ];
}

function buildOrderRecord({
  couponCode = null,
  id,
  items,
  paymentMethod,
  paymentStatus,
  shippingFee,
  shippingStatus,
  status,
  trackingCode,
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = DEMO_COUPONS.find((item) => item.code === couponCode);
  const discount = getCouponDiscount(coupon, subtotal);
  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    activityHistory: [
      { status: "PENDING", time: "2026-05-09T09:12:00", title: "Đơn hàng được tạo" },
      { status: "CONFIRMED", time: "2026-05-09T09:18:00", title: "Nhân viên xác nhận đơn" },
      { status: shippingStatus, time: "2026-05-10T08:35:00", title: "Cập nhật vận chuyển" },
    ],
    code: `DH-DEMO-${id}`,
    couponCode,
    createdAt: "2026-05-09T09:12:00",
    discount,
    estimatedDelivery: "2026-05-13T18:00:00",
    id,
    items,
    note: "Demo order seeded for presentation.",
    orderDetails: items,
    orderId: id,
    paidAt: paymentStatus === "PAID" ? "2026-05-09T09:20:00" : null,
    paymentMethod,
    paymentStatus,
    shippingDistrict: "Quận 1",
    shippingFee,
    shippingLine: "12 Nguyễn Huệ",
    shippingName: DEMO_CUSTOMER_PROFILE.fullName,
    shippingPhone: DEMO_CUSTOMER_PROFILE.phoneNumber,
    shippingProvider: "GHN",
    shippingProvince: "TP.HCM",
    shippingStatus,
    shippingWard: "Bến Nghé",
    status,
    subtotal,
    total,
    trackingCode,
    updatedAt: "2026-05-10T08:35:00",
    userEmail: DEMO_CUSTOMER_PROFILE.email,
    userFullName: DEMO_CUSTOMER_PROFILE.fullName,
    userId: DEMO_CUSTOMER_PROFILE.id,
    userPhoneNumber: DEMO_CUSTOMER_PROFILE.phoneNumber,
  };
}

function getCouponDiscount(coupon, subtotal) {
  if (!coupon || subtotal < coupon.minOrder) {
    return 0;
  }

  const rawDiscount = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

  return Math.min(rawDiscount, coupon.maxDiscount || rawDiscount, subtotal);
}

function createDemoDb() {
  const products = buildStoreProducts();
  const permissions = buildPermissions();

  return {
    brands: buildBrands(),
    categories: buildCategories(),
    coupons: DEMO_COUPONS.map((coupon) => ({ ...coupon, createdAt: "2026-04-01T09:00:00", updatedAt: "2026-05-10T08:30:00" })),
    media: buildMedia(products),
    orders: buildSeedOrders(products),
    permissions,
    products,
    roles: buildRoles(permissions),
    staff: buildStaff(),
    users: buildUsers(),
    variants: products.flatMap((product) => product.variants),
    warehouseTransactions: buildWarehouseTransactions(),
    warehouses: adminWarehouses.map((warehouse) => ({
      ...warehouse,
      createdAt: "2026-04-01T09:00:00",
      updatedAt: "2026-05-10T08:30:00",
    })),
  };
}

function getDemoDb() {
  if (!demoDb) {
    demoDb = createDemoDb();
    nextIdCounters = Object.fromEntries(
      Object.entries(demoDb).map(([key, records]) => [
        key,
        Math.max(0, ...records.map((record) => Number(record.id) || 0)) + 1,
      ]),
    );
  }

  return demoDb;
}

function getRequestPath(url) {
  const parsedUrl = new URL(String(url ?? "/"), "http://demo.local");

  return parsedUrl.pathname.replace(/^\/api(?=\/)/, "") || "/";
}

function getRequestParams(config = {}) {
  const parsedUrl = new URL(String(config.url ?? "/"), "http://demo.local");
  const params = Object.fromEntries(parsedUrl.searchParams.entries());

  Object.entries(config.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });

  return params;
}

function getResourceRoute(path) {
  return RESOURCE_ROUTES.find((route) => path === route.path || path.startsWith(`${route.path}/`)) ?? null;
}

function getResourceRequest(route, path) {
  const remainder = path.slice(route.path.length).replace(/^\/+/, "");
  const [id, action] = remainder.split("/");

  return {
    action,
    id: id || null,
  };
}

function matchesKeyword(record, keyword, fields) {
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  return fields.some((field) => normalizeText(record[field]).includes(normalizedKeyword));
}

function filterRecords(records, params, fields) {
  let filtered = records.filter((record) => matchesKeyword(record, params.keyword ?? params.search ?? params.q, fields));

  if (params.status) {
    filtered = filtered.filter((record) => String(record.status ?? "ACTIVE").toUpperCase() === String(params.status).toUpperCase());
  }

  if (params.timeStatus) {
    filtered = filtered.filter((record) => String(record.timeStatus ?? "VALID").toUpperCase() === String(params.timeStatus).toUpperCase());
  }

  if (params.productId) {
    filtered = filtered.filter((record) => String(record.productId) === String(params.productId));
  }

  if (params.userId) {
    filtered = filtered.filter((record) => String(record.userId) === String(params.userId));
  }

  if (params.primary !== undefined) {
    filtered = filtered.filter((record) => String(Boolean(record.isPrimary)) === String(params.primary));
  }

  return sortRecords(filtered, params.sort);
}

function sortRecords(records, sortValue) {
  const [field = "updatedAt", direction = "desc"] = String(sortValue ?? "updatedAt,desc").split(",");
  const multiplier = direction.toLowerCase() === "asc" ? 1 : -1;

  return [...records].sort((a, b) => {
    const left = a[field] ?? "";
    const right = b[field] ?? "";

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * multiplier;
    }

    return String(left).localeCompare(String(right)) * multiplier;
  });
}

function createPage(records, params) {
  const page = Math.max(Number(params.page) || 0, 0);
  const size = Math.max(Number(params.size) || records.length || 1, 1);
  const start = page * size;
  const content = records.slice(start, start + size);

  return {
    content,
    number: page,
    size,
    totalElements: records.length,
    totalItems: records.length,
    totalPages: Math.max(1, Math.ceil(records.length / size)),
  };
}

function findRecord(records, id) {
  return records.find((record) => String(record.id) === String(id) || String(record.code) === String(id));
}

function getNextId(key) {
  const current = nextIdCounters[key] ?? 1;
  nextIdCounters[key] = current + 1;
  return current;
}

function createRecord(key, payload) {
  const record = {
    ...payload,
    createdAt: payload.createdAt ?? nowIso(),
    id: payload.id ?? getNextId(key),
    status: payload.status ?? "ACTIVE",
    updatedAt: nowIso(),
  };

  getDemoDb()[key].unshift(record);
  return record;
}

function updateRecord(key, id, payload) {
  const records = getDemoDb()[key];
  const index = records.findIndex((record) => String(record.id) === String(id));

  if (index < 0) {
    throw createDemoApiError("Demo record not found.", { code: "DEMO_NOT_FOUND", status: 404 });
  }

  records[index] = {
    ...records[index],
    ...payload,
    updatedAt: nowIso(),
  };

  return records[index];
}

function removeRecord(key, id) {
  const records = getDemoDb()[key];
  const record = findRecord(records, id);

  if (!record) {
    throw createDemoApiError("Demo record not found.", { code: "DEMO_NOT_FOUND", status: 404 });
  }

  if ("status" in record) {
    return updateRecord(key, record.id, { status: "DELETED" });
  }

  getDemoDb()[key] = records.filter((item) => String(item.id) !== String(id));
  return { success: true };
}

function createReviewPage(productId, params) {
  const product = findRecord(getDemoDb().products, productId);
  const reviews = [
    {
      content: `${product?.name ?? "Sản phẩm"} đúng mô tả, đóng gói kỹ và giao nhanh.`,
      createdAt: "2026-05-08",
      id: `${productId}-review-1`,
      rating: 5,
      title: "Rất hài lòng",
      userName: "Nguyễn Minh Anh",
      verifiedPurchase: true,
      variantName: "Bản tiêu chuẩn",
    },
    {
      content: "Hiệu năng ổn trong tầm giá, phù hợp để demo flow đánh giá sản phẩm.",
      createdAt: "2026-05-06",
      id: `${productId}-review-2`,
      rating: 4,
      title: "Trải nghiệm tốt",
      userName: "Phạm Tuấn Kiệt",
      verifiedPurchase: true,
      variantName: "Bản tiêu chuẩn",
    },
  ];

  return createPage(reviews, params);
}

function handleResourceRequest(route, config, params, path) {
  const method = String(config.method ?? "get").toLowerCase();
  const db = getDemoDb();
  const records = db[route.key] ?? [];
  const { action, id } = getResourceRequest(route, path);

  if (route.key === "products" && action === "reviews" && method === "get") {
    return createReviewPage(id, params);
  }

  if (method === "get" && !id) {
    return createPage(filterRecords(records, params, route.searchFields), params);
  }

  if (method === "get") {
    const record = findRecord(records, id);

    if (!record) {
      throw createDemoApiError("Demo record not found.", { code: "DEMO_NOT_FOUND", status: 404 });
    }

    return record;
  }

  if (method === "post" && action === "reset-password") {
    return { message: "Demo password reset generated.", rawPassword: "Demo@12345" };
  }

  if (method === "post" && !id) {
    return createRecord(route.key, config.data ?? {});
  }

  if (["put", "patch"].includes(method) && id) {
    if (action === "status") {
      return updateRecord(route.key, id, { status: config.data?.status ?? "ACTIVE" });
    }

    if (action === "featured") {
      return updateRecord(route.key, id, { featured: Boolean(config.data?.featured) });
    }

    if (action === "primary" && route.key === "media") {
      const target = findRecord(records, id);

      if (!target) {
        throw createDemoApiError("Demo media not found.", { code: "DEMO_NOT_FOUND", status: 404 });
      }

      db.media = records.map((media) =>
        String(media.productId) === String(target.productId)
          ? { ...media, isPrimary: String(media.id) === String(target.id), updatedAt: nowIso() }
          : media,
      );
      return { success: true };
    }

    return updateRecord(route.key, id, config.data ?? {});
  }

  if (method === "delete" && id) {
    return removeRecord(route.key, id);
  }

  return null;
}

function handleMediaUpload(config) {
  const file = config.data?.get?.("file");
  const fileName = file?.name ?? "demo-upload.png";
  const publicId = `demo/uploads/${normalizeSlug(fileName)}-${Date.now()}`;

  return {
    fileName,
    imageUrl: `https://placehold.co/960x720/0B1730/FFFFFF?text=${encodeURIComponent(fileName)}`,
    publicId,
    secureUrl: `https://placehold.co/960x720/0B1730/FFFFFF?text=${encodeURIComponent(fileName)}`,
  };
}

function getProductByVariantId(variantId) {
  return getDemoDb().products.find((product) =>
    product.variants.some((variant) => String(variant.id) === String(variantId)),
  );
}

function createCheckoutOrder(payload) {
  const id = getNextId("orders");
  const items = (payload.items ?? []).map((item) => {
    const product = getProductByVariantId(item.variantId);
    const variant = product?.variants.find((candidate) => String(candidate.id) === String(item.variantId));

    if (!product || !variant) {
      throw createDemoApiError("Demo product variant not found for checkout.", {
        code: "DEMO_VARIANT_NOT_FOUND",
        status: 422,
      });
    }

    return {
      price: variant.price,
      productId: product.id,
      productName: product.name,
      quantity: Number(item.quantity) || 1,
      variantId: variant.id,
      variantName: variant.name,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = DEMO_COUPONS.find((item) => item.code === payload.couponCode);
  const discount = getCouponDiscount(coupon, subtotal);
  const shippingFee = Number(payload.shippingFee ?? 0);
  const total = Math.max(0, subtotal - discount + shippingFee);
  const order = {
    activityHistory: [
      { status: "PENDING", time: nowIso(), title: "Đơn demo được tạo" },
      { status: "CONFIRMED", time: nowIso(), title: "Demo mode tự động xác nhận đơn" },
    ],
    code: `DH-DEMO-${id}`,
    couponCode: payload.couponCode,
    createdAt: nowIso(),
    discount,
    estimatedDelivery: "2026-05-14T18:00:00",
    id,
    items,
    note: payload.note,
    orderDetails: items,
    orderId: id,
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === "CASH" ? "PENDING" : "UNPAID",
    shippingDistrict: payload.shippingDistrict,
    shippingFee,
    shippingLine: payload.shippingLine,
    shippingName: payload.shippingName,
    shippingPhone: payload.shippingPhone,
    shippingProvider: payload.shippingProvider,
    shippingProvince: payload.shippingProvince,
    shippingStatus: "CONFIRMED",
    shippingWard: payload.shippingWard,
    status: "PENDING",
    subtotal,
    total,
    trackingCode: "",
    updatedAt: nowIso(),
    userEmail: DEMO_CUSTOMER_PROFILE.email,
    userFullName: payload.shippingName,
    userId: payload.userId,
    userPhoneNumber: payload.shippingPhone,
  };

  getDemoDb().orders.unshift(order);
  return order;
}

function handleStoreOrders(config, params, path) {
  const method = String(config.method ?? "get").toLowerCase();
  const orderId = path.replace(/^\/orders\/?/, "").split("/")[0];

  if (method === "post" && path === "/orders") {
    return createCheckoutOrder(config.data ?? {});
  }

  if (method === "get" && path === "/orders") {
    return createPage(filterRecords(getDemoDb().orders, params, ["code", "userFullName"]), params);
  }

  if (method === "get" && orderId) {
    const order = findRecord(getDemoDb().orders, orderId);

    if (!order || (params.userId && String(order.userId) !== String(params.userId))) {
      throw createDemoApiError("Demo order not found.", { code: "DEMO_ORDER_NOT_FOUND", status: 404 });
    }

    return order;
  }

  return null;
}

function handleProfile(config, path) {
  const method = String(config.method ?? "get").toLowerCase();
  const match = path.match(/^\/users\/([^/]+)\/profile$/);

  if (!match) {
    return null;
  }

  if (method === "get") {
    return DEMO_CUSTOMER_PROFILE;
  }

  if (method === "put") {
    Object.assign(DEMO_CUSTOMER_PROFILE, config.data ?? {}, {
      id: DEMO_CUSTOMER_PROFILE.id,
      updatedAt: nowIso(),
    });
    return DEMO_CUSTOMER_PROFILE;
  }

  return null;
}

function handlePayment(config, path) {
  const method = String(config.method ?? "get").toLowerCase();
  const createMatch = path.match(/^\/payments\/(vnpay|momo)\/create$/);
  const statusMatch = path.match(/^\/payments\/orders\/([^/]+)\/status$/);

  if (method === "post" && createMatch) {
    const provider = createMatch[1].toUpperCase();
    const orderId = Number(config.data?.orderId);
    const order = findRecord(getDemoDb().orders, orderId);

    if (!order) {
      throw createDemoApiError("Demo order not found for payment.", { code: "DEMO_ORDER_NOT_FOUND", status: 404 });
    }

    order.paymentStatus = "PAID";
    order.paymentProvider = provider;
    order.status = "PROCESSING";
    order.paidAt = nowIso();
    order.updatedAt = nowIso();

    const transactionId = orderId * 10 + (provider === "MOMO" ? 2 : 1);

    return {
      message: `${provider} demo payment URL generated.`,
      orderId,
      paymentUrl: `/payment/success?orderId=${orderId}&transactionId=${transactionId}&provider=${provider}&status=paid&code=00`,
      provider,
      responseCode: "00",
      status: "pending",
      transactionId,
    };
  }

  if (method === "get" && statusMatch) {
    const orderId = statusMatch[1];
    const order = findRecord(getDemoDb().orders, orderId);

    if (!order) {
      throw createDemoApiError("Demo payment order not found.", { code: "DEMO_ORDER_NOT_FOUND", status: 404 });
    }

    return {
      amount: order.total,
      message: "Demo payment verified locally.",
      orderCode: order.code,
      orderId: order.id,
      paymentStatus: order.paymentStatus,
      provider: order.paymentProvider ?? (order.paymentMethod === "DIGITAL" ? "VNPAY" : "COD"),
      providerPaymentId: `DEMO-PAY-${order.id}`,
      responseCode: "00",
      status: order.paymentStatus === "PAID" ? "paid" : "pending",
      transactionId: Number(config.params?.transactionId) || order.id * 10 + 1,
      verified: order.paymentStatus === "PAID",
    };
  }

  return null;
}

export async function handleDemoApiRequest(config = {}) {
  if (!isDemoModeEnabled) {
    return { handled: false };
  }

  const path = getRequestPath(config.url);
  const params = getRequestParams(config);

  await delay();

  if (path === "/admin/auth/logout") {
    return { data: { success: true }, handled: true };
  }

  if (path === "/admin/media/upload") {
    return { data: handleMediaUpload(config), handled: true };
  }

  const profileResponse = handleProfile(config, path);
  if (profileResponse) {
    return { data: clone(profileResponse), handled: true };
  }

  const storeOrderResponse = handleStoreOrders(config, params, path);
  if (storeOrderResponse) {
    return { data: clone(storeOrderResponse), handled: true };
  }

  const paymentResponse = handlePayment(config, path);
  if (paymentResponse) {
    return { data: clone(paymentResponse), handled: true };
  }

  const route = getResourceRoute(path);
  if (route) {
    const response = handleResourceRequest(route, config, params, path);

    if (response) {
      return { data: clone(response), handled: true };
    }
  }

  return { handled: false };
}
