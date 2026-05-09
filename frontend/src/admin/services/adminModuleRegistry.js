import brandService from "../../api/brandService";
import categoryService from "../../api/categoryService";
import couponService from "../../api/couponService";
import mediaService from "../../api/mediaService";
import orderService from "../../api/orderService";
import permissionService from "../../api/permissionService";
import productService from "../../api/productService";
import roleService from "../../api/roleService";
import staffService from "../../api/staffService";
import userService from "../../api/userService";
import variantService from "../../api/variantService";
import warehouseService from "../../api/warehouseService";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";

export const ADMIN_MODULE_KEYS = Object.freeze({
  brands: "brands",
  categories: "categories",
  coupons: "coupons",
  media: "media",
  orders: "orders",
  permissions: "permissions",
  products: "products",
  roles: "roles",
  staff: "staff",
  users: "users",
  variants: "variants",
  warehouses: "warehouses",
});

export const ADMIN_MODULES = Object.freeze({
  [ADMIN_MODULE_KEYS.categories]: {
    key: ADMIN_MODULE_KEYS.categories,
    label: "Danh mục",
    path: "/admin/categories",
    resource: ADMIN_RESOURCES.categories,
    service: categoryService,
  },
  [ADMIN_MODULE_KEYS.brands]: {
    key: ADMIN_MODULE_KEYS.brands,
    label: "Thương hiệu",
    path: "/admin/brands",
    resource: ADMIN_RESOURCES.brands,
    service: brandService,
  },
  [ADMIN_MODULE_KEYS.products]: {
    key: ADMIN_MODULE_KEYS.products,
    label: "Sản phẩm",
    path: "/admin/products",
    resource: ADMIN_RESOURCES.products,
    service: productService,
  },
  [ADMIN_MODULE_KEYS.variants]: {
    key: ADMIN_MODULE_KEYS.variants,
    label: "Biến thể",
    path: "/admin/variants",
    resource: ADMIN_RESOURCES.variants,
    service: variantService,
  },
  [ADMIN_MODULE_KEYS.media]: {
    key: ADMIN_MODULE_KEYS.media,
    label: "Media",
    path: "/admin/media",
    resource: ADMIN_RESOURCES.media,
    service: mediaService,
  },
  [ADMIN_MODULE_KEYS.users]: {
    key: ADMIN_MODULE_KEYS.users,
    label: "Người dùng",
    path: "/admin/users",
    resource: ADMIN_RESOURCES.users,
    service: userService,
  },
  [ADMIN_MODULE_KEYS.staff]: {
    key: ADMIN_MODULE_KEYS.staff,
    label: "Nhân viên",
    path: "/admin/staff",
    resource: ADMIN_RESOURCES.staff,
    service: staffService,
  },
  [ADMIN_MODULE_KEYS.roles]: {
    key: ADMIN_MODULE_KEYS.roles,
    label: "Vai trò",
    path: "/admin/roles",
    resource: ADMIN_RESOURCES.roles,
    service: roleService,
  },
  [ADMIN_MODULE_KEYS.permissions]: {
    capabilities: { create: false, remove: false, update: false },
    key: ADMIN_MODULE_KEYS.permissions,
    label: "Quyền",
    path: "/admin/roles",
    resource: ADMIN_RESOURCES.roles,
    service: permissionService,
  },
  [ADMIN_MODULE_KEYS.orders]: {
    key: ADMIN_MODULE_KEYS.orders,
    label: "Đơn hàng",
    path: "/admin/orders",
    resource: ADMIN_RESOURCES.orders,
    service: orderService,
  },
  [ADMIN_MODULE_KEYS.warehouses]: {
    key: ADMIN_MODULE_KEYS.warehouses,
    label: "Kho hàng",
    path: "/admin/warehouse",
    resource: ADMIN_RESOURCES.warehouse,
    service: warehouseService,
  },
  [ADMIN_MODULE_KEYS.coupons]: {
    key: ADMIN_MODULE_KEYS.coupons,
    label: "Mã giảm giá",
    path: "/admin/coupons",
    resource: ADMIN_RESOURCES.coupons,
    service: couponService,
  },
});

export const ADMIN_MODULE_ORDER = Object.freeze([
  ADMIN_MODULE_KEYS.categories,
  ADMIN_MODULE_KEYS.brands,
  ADMIN_MODULE_KEYS.products,
  ADMIN_MODULE_KEYS.variants,
  ADMIN_MODULE_KEYS.media,
  ADMIN_MODULE_KEYS.users,
  ADMIN_MODULE_KEYS.staff,
  ADMIN_MODULE_KEYS.roles,
  ADMIN_MODULE_KEYS.permissions,
  ADMIN_MODULE_KEYS.orders,
  ADMIN_MODULE_KEYS.warehouses,
  ADMIN_MODULE_KEYS.coupons,
]);

export function getAdminModuleConfig(moduleKey) {
  return ADMIN_MODULES[moduleKey] ?? null;
}

export function getAdminModuleService(moduleKey) {
  return getAdminModuleConfig(moduleKey)?.service ?? null;
}

export function getAdminModules() {
  return ADMIN_MODULE_ORDER.map((moduleKey) => ADMIN_MODULES[moduleKey]).filter(Boolean);
}
