export const APP_ROLES = Object.freeze({
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
  admin: "ADMIN",
  staff: "STAFF",
  user: "USER",
});

export const AUTH_USER_TYPES = Object.freeze({
  admin: "admin",
  staff: "staff",
  user: "user",
});

export const ACCESS_MODES = Object.freeze({
  all: "all",
  any: "any",
});

export const ADMIN_ROLE_NAMES = ["admin", "administrator", "super admin"];
export const STAFF_ROLE_NAMES = ["staff", "manager", "employee", "nhân viên", "quan ly", "quản lý"];
export const USER_ROLE_NAMES = ["user", "customer", "client", "khách hàng", "khach hang"];
export const ADMIN_ACCESS_ROLE_NAMES = [...ADMIN_ROLE_NAMES, ...STAFF_ROLE_NAMES];

export const AUTH_ROLE_GROUPS = Object.freeze({
  admin: ADMIN_ROLE_NAMES,
  adminAccess: ADMIN_ACCESS_ROLE_NAMES,
  staff: STAFF_ROLE_NAMES,
  user: USER_ROLE_NAMES,
});

export const ADMIN_RESOURCES = Object.freeze({
  activityLogs: "activityLogs",
  bestSellers: "bestSellers",
  brands: "brands",
  categories: "categories",
  coupons: "coupons",
  dashboard: "dashboard",
  media: "media",
  orders: "orders",
  products: "products",
  revenue: "revenue",
  roles: "roles",
  staff: "staff",
  users: "users",
  variants: "variants",
  warehouse: "warehouse",
});

export const APP_PERMISSIONS = Object.freeze({
  activityLogView: "activity-log:view",
  bestSellerReportView: "best-seller-report:view",
  brandCreate: "brand:create",
  brandDelete: "brand:delete",
  brandUpdate: "brand:update",
  brandView: "brand:view",
  categoryCreate: "category:create",
  categoryDelete: "category:delete",
  categoryUpdate: "category:update",
  categoryView: "category:view",
  couponCreate: "coupon:create",
  couponDelete: "coupon:delete",
  couponUpdate: "coupon:update",
  couponView: "coupon:view",
  dashboardView: "dashboard:view",
  mediaCreate: "media:create",
  mediaDelete: "media:delete",
  mediaUpdate: "media:update",
  mediaView: "media:view",
  orderCreate: "order:create",
  orderDelete: "order:delete",
  orderUpdate: "order:update",
  orderView: "order:view",
  productCreate: "product:create",
  productDelete: "product:delete",
  productUpdate: "product:update",
  productView: "product:view",
  revenueReportView: "revenue-report:view",
  roleCreate: "role:create",
  roleDelete: "role:delete",
  roleManage: "role:manage",
  roleUpdate: "role:update",
  roleView: "role:view",
  staffCreate: "staff:create",
  staffDelete: "staff:delete",
  staffUpdate: "staff:update",
  staffView: "staff:view",
  userCreate: "user:create",
  userDelete: "user:delete",
  userUpdate: "user:update",
  userView: "user:view",
  variantCreate: "variant:create",
  variantDelete: "variant:delete",
  variantUpdate: "variant:update",
  variantView: "variant:view",
  warehouseCreate: "warehouse:create",
  warehouseDelete: "warehouse:delete",
  warehouseUpdate: "warehouse:update",
  warehouseView: "warehouse:view",
});

export const ADMIN_ROUTE_POLICIES = Object.freeze({
  activityLogs: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  bestSellers: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  brands: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  categories: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  coupons: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  dashboard: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  media: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  orders: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  products: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  revenue: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  roles: { roles: [APP_ROLES.admin] },
  root: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  staff: { roles: [APP_ROLES.admin] },
  users: { roles: [APP_ROLES.admin] },
  variants: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
  warehouse: { roles: [APP_ROLES.admin, APP_ROLES.staff] },
});

const RESOURCE_PERMISSION_MAP = Object.freeze({
  [ADMIN_RESOURCES.activityLogs]: { view: APP_PERMISSIONS.activityLogView },
  [ADMIN_RESOURCES.bestSellers]: { view: APP_PERMISSIONS.bestSellerReportView },
  [ADMIN_RESOURCES.brands]: {
    create: APP_PERMISSIONS.brandCreate,
    delete: APP_PERMISSIONS.brandDelete,
    update: APP_PERMISSIONS.brandUpdate,
    view: APP_PERMISSIONS.brandView,
  },
  [ADMIN_RESOURCES.categories]: {
    create: APP_PERMISSIONS.categoryCreate,
    delete: APP_PERMISSIONS.categoryDelete,
    update: APP_PERMISSIONS.categoryUpdate,
    view: APP_PERMISSIONS.categoryView,
  },
  [ADMIN_RESOURCES.coupons]: {
    create: APP_PERMISSIONS.couponCreate,
    delete: APP_PERMISSIONS.couponDelete,
    update: APP_PERMISSIONS.couponUpdate,
    view: APP_PERMISSIONS.couponView,
  },
  [ADMIN_RESOURCES.dashboard]: { view: APP_PERMISSIONS.dashboardView },
  [ADMIN_RESOURCES.media]: {
    create: APP_PERMISSIONS.mediaCreate,
    delete: APP_PERMISSIONS.mediaDelete,
    update: APP_PERMISSIONS.mediaUpdate,
    view: APP_PERMISSIONS.mediaView,
  },
  [ADMIN_RESOURCES.orders]: {
    create: APP_PERMISSIONS.orderCreate,
    delete: APP_PERMISSIONS.orderDelete,
    update: APP_PERMISSIONS.orderUpdate,
    view: APP_PERMISSIONS.orderView,
  },
  [ADMIN_RESOURCES.products]: {
    create: APP_PERMISSIONS.productCreate,
    delete: APP_PERMISSIONS.productDelete,
    update: APP_PERMISSIONS.productUpdate,
    view: APP_PERMISSIONS.productView,
  },
  [ADMIN_RESOURCES.revenue]: { view: APP_PERMISSIONS.revenueReportView },
  [ADMIN_RESOURCES.roles]: {
    create: APP_PERMISSIONS.roleCreate,
    delete: APP_PERMISSIONS.roleDelete,
    manage: APP_PERMISSIONS.roleManage,
    update: APP_PERMISSIONS.roleUpdate,
    view: APP_PERMISSIONS.roleView,
  },
  [ADMIN_RESOURCES.staff]: {
    create: APP_PERMISSIONS.staffCreate,
    delete: APP_PERMISSIONS.staffDelete,
    update: APP_PERMISSIONS.staffUpdate,
    view: APP_PERMISSIONS.staffView,
  },
  [ADMIN_RESOURCES.users]: {
    create: APP_PERMISSIONS.userCreate,
    delete: APP_PERMISSIONS.userDelete,
    update: APP_PERMISSIONS.userUpdate,
    view: APP_PERMISSIONS.userView,
  },
  [ADMIN_RESOURCES.variants]: {
    create: APP_PERMISSIONS.variantCreate,
    delete: APP_PERMISSIONS.variantDelete,
    update: APP_PERMISSIONS.variantUpdate,
    view: APP_PERMISSIONS.variantView,
  },
  [ADMIN_RESOURCES.warehouse]: {
    create: APP_PERMISSIONS.warehouseCreate,
    delete: APP_PERMISSIONS.warehouseDelete,
    update: APP_PERMISSIONS.warehouseUpdate,
    view: APP_PERMISSIONS.warehouseView,
  },
});

const PERMISSION_RESOURCE_ALIASES = Object.freeze({
  "activity-log": ["activity-log", "activity-logs", "activity-log-report"],
  "best-seller-report": ["best-seller", "best-seller-report", "best-sellers"],
  brand: ["brand", "brands"],
  category: ["category", "categories"],
  coupon: ["coupon", "coupons"],
  dashboard: ["dashboard", "admin-dashboard"],
  media: ["media", "file", "files"],
  order: ["order", "orders"],
  product: ["product", "products"],
  "revenue-report": ["revenue", "revenue-report", "report-revenue"],
  role: ["role", "roles", "permission", "permissions"],
  staff: ["staff", "employee", "employees"],
  user: ["user", "users", "customer", "customers"],
  variant: ["variant", "variants"],
  warehouse: ["warehouse", "warehouses", "inventory"],
});

const PERMISSION_ACTION_ALIASES = Object.freeze({
  create: ["add", "create", "insert", "write"],
  delete: ["delete", "remove"],
  manage: ["manage", "management", "write"],
  update: ["edit", "modify", "update", "write"],
  view: ["list", "read", "view"],
});

function flattenAuthValues(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenAuthValues(item));
  }

  if (value instanceof Set) {
    return Array.from(value).flatMap((item) => flattenAuthValues(item));
  }

  return [value];
}

function getAuthValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (typeof value === "object") {
    return String(
      value.code ??
        value.name ??
        value.key ??
        value.value ??
        value.permissionCode ??
        value.permissionName ??
        value.role ??
        value.roleName ??
        value.authority ??
        "",
    ).trim();
  }

  return "";
}

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function normalizeRoleName(role) {
  return getAuthValue(role)
    .toLowerCase()
    .replace(/^role[_\s-]+/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

export function normalizePermissionCode(permission) {
  return getAuthValue(permission)
    .toLowerCase()
    .replace(/^permission[:_\s-]+/, "")
    .replace(/[._\s-]+/g, ":")
    .replace(/:+/g, ":")
    .replace(/^:|:$/g, "")
    .trim();
}

function splitPermission(permission) {
  const parts = normalizePermissionCode(permission).split(":").filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  return {
    action: parts.at(-1),
    resource: parts.slice(0, -1).join(":"),
  };
}

function createPermissionAliases(permission) {
  const parsed = splitPermission(permission);

  if (!parsed) {
    return [normalizePermissionCode(permission)];
  }

  const resourceNames = PERMISSION_RESOURCE_ALIASES[parsed.resource] ?? [parsed.resource];
  const actionNames = PERMISSION_ACTION_ALIASES[parsed.action] ?? [parsed.action];
  const values = [];

  resourceNames.forEach((resourceName) => {
    actionNames.forEach((actionName) => {
      values.push(
        `${resourceName}:${actionName}`,
        `${actionName}:${resourceName}`,
        `${resourceName}.${actionName}`,
        `${actionName}.${resourceName}`,
        `${resourceName}_${actionName}`,
        `${actionName}_${resourceName}`,
      );
    });
  });

  return uniqueValues(values.map(normalizePermissionCode));
}

function expandPermissionRequirement(permission) {
  return createPermissionAliases(permission);
}

export function inferUserTypeFromRole(role) {
  const roleName = normalizeRoleName(role);

  if (ADMIN_ROLE_NAMES.includes(roleName)) {
    return AUTH_USER_TYPES.admin;
  }

  if (STAFF_ROLE_NAMES.includes(roleName)) {
    return AUTH_USER_TYPES.staff;
  }

  return AUTH_USER_TYPES.user;
}

export function normalizeRoles(roles) {
  return uniqueValues(flattenAuthValues(roles).map(getAuthValue));
}

export function normalizePermissions(permissions) {
  return uniqueValues(flattenAuthValues(permissions).map(getAuthValue));
}

export function hasRole(currentRoles, requiredRole) {
  const required = normalizeRoleName(requiredRole);

  if (!required) {
    return false;
  }

  return normalizeRoles(currentRoles).some((role) => normalizeRoleName(role) === required);
}

export function hasAnyRole(currentRoles, requiredRoles = []) {
  const roles = normalizeRoles(requiredRoles);

  if (roles.length === 0) {
    return true;
  }

  return roles.some((role) => hasRole(currentRoles, role));
}

export function hasPermission(currentPermissions, requiredPermission) {
  const requiredCodes = expandPermissionRequirement(requiredPermission);

  if (requiredCodes.length === 0) {
    return false;
  }

  const currentCodes = normalizePermissions(currentPermissions).map(normalizePermissionCode);

  return requiredCodes.some((requiredCode) => currentCodes.includes(requiredCode));
}

export function hasAnyPermission(currentPermissions, requiredPermissions = []) {
  const permissions = normalizePermissions(requiredPermissions);

  if (permissions.length === 0) {
    return true;
  }

  return permissions.some((permission) => hasPermission(currentPermissions, permission));
}

export function hasEveryPermission(currentPermissions, requiredPermissions = []) {
  const permissions = normalizePermissions(requiredPermissions);

  if (permissions.length === 0) {
    return true;
  }

  return permissions.every((permission) => hasPermission(currentPermissions, permission));
}

export function getSessionRoles(authState = {}) {
  const user = authState.user ?? {};

  return normalizeRoles([
    authState.roles,
    user.roles,
    user.role,
    user.roleName,
    user.type,
    user.staffId ? APP_ROLES.staff : null,
  ]);
}

export function hasSessionRole(authState = {}, requiredRole) {
  return hasRole(getSessionRoles(authState), requiredRole);
}

export function hasAnySessionRole(authState = {}, requiredRoles = []) {
  return hasAnyRole(getSessionRoles(authState), requiredRoles);
}

export function isAdminSession(authState = {}) {
  const user = authState.user ?? null;
  const userType = String(user?.type ?? "").toLowerCase();

  if (userType === AUTH_USER_TYPES.admin) {
    return true;
  }

  return hasAnySessionRole(authState, ADMIN_ROLE_NAMES);
}

export function isStaffSession(authState = {}) {
  const user = authState.user ?? null;
  const userType = String(user?.type ?? "").toLowerCase();

  if (user?.staffId || userType === AUTH_USER_TYPES.staff) {
    return true;
  }

  return hasAnySessionRole(authState, STAFF_ROLE_NAMES);
}

export function canAccessAdmin(authState = {}) {
  return isAdminSession(authState) || isStaffSession(authState) || hasAnySessionRole(authState, ADMIN_ACCESS_ROLE_NAMES);
}

export function canAccessStaff(authState = {}) {
  return canAccessAdmin(authState);
}

export function canAccessPolicy(authState = {}, policy = {}) {
  if (!policy) {
    return true;
  }

  const roles = normalizeRoles(policy.roles ?? policy.requiredRoles);
  const permissions = normalizePermissions(policy.permissions ?? policy.requiredPermissions);
  const hasRoleRequirement = roles.length > 0;
  const hasPermissionRequirement = permissions.length > 0;

  if (!hasRoleRequirement && !hasPermissionRequirement) {
    return true;
  }

  if (policy.allowAdmin !== false && isAdminSession(authState)) {
    return true;
  }

  const roleAccess = !hasRoleRequirement || hasAnySessionRole(authState, roles);
  const permissionAccess =
    !hasPermissionRequirement ||
    (policy.requireAllPermissions
      ? hasEveryPermission(authState.permissions, permissions)
      : hasAnyPermission(authState.permissions, permissions));

  if (policy.mode === ACCESS_MODES.any) {
    return (hasRoleRequirement && roleAccess) || (hasPermissionRequirement && permissionAccess);
  }

  return roleAccess && permissionAccess;
}

export function getResourcePermission(resource, action) {
  return RESOURCE_PERMISSION_MAP[resource]?.[action] ?? null;
}

export function getResourceActionPolicy(resource, action) {
  const permission = getResourcePermission(resource, action);

  if (action === "view") {
    return {
      mode: ACCESS_MODES.any,
      permissions: permission ? [permission] : [],
      roles: [APP_ROLES.admin, APP_ROLES.staff],
    };
  }

  return {
    mode: ACCESS_MODES.any,
    permissions: permission ? [permission] : [],
    roles: [APP_ROLES.admin],
  };
}

export function getResourceActionPolicies(resource) {
  return {
    create: getResourceActionPolicy(resource, "create"),
    delete: getResourceActionPolicy(resource, "delete"),
    update: getResourceActionPolicy(resource, "update"),
    view: getResourceActionPolicy(resource, "view"),
  };
}
