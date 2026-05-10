import { unwrapApiPayload } from "./productMapper";

const DEFAULT_USER_STATUS = "ACTIVE";
const CUSTOMER_ROLE_LABEL = "Customer";

const RESOURCE_LABELS = {
  "activity-log": "Activity logs",
  "best-seller-report": "Best seller reports",
  brand: "Brands",
  category: "Categories",
  coupon: "Coupons",
  dashboard: "Dashboard",
  media: "Media library",
  order: "Orders",
  product: "Products",
  "revenue-report": "Revenue reports",
  role: "Roles & permissions",
  staff: "Staff",
  user: "Customers",
  variant: "Variants",
  warehouse: "Warehouse",
};

const ACTION_LABELS = {
  access: "Access",
  create: "Create",
  delete: "Delete",
  manage: "Manage",
  update: "Update",
  view: "View",
};

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  return [];
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toReadableLabel(value) {
  return String(value ?? "")
    .replace(/[:._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function parsePermissionCode(raw = {}) {
  const source = isPlainObject(raw) ? raw : {};
  const code = String(firstDefined(source.code, source.permissionCode, source.name, raw, "")).trim();
  const normalized = code.toLowerCase().replace(/[._\s]+/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
  const parts = normalized.split(":").filter(Boolean);
  const action = firstDefined(source.action, parts.length > 1 ? parts.at(-1) : "access", "access");
  const resource = firstDefined(
    source.resource,
    parts.length > 1 ? parts.slice(0, -1).join(":") : parts[0],
    "system",
  );

  return {
    action,
    actionLabel: ACTION_LABELS[action] ?? toReadableLabel(action),
    resource,
    resourceLabel: RESOURCE_LABELS[resource] ?? toReadableLabel(resource),
  };
}

function toIdArray(value) {
  return toArray(value)
    .map((item) => firstDefined(item?.id, item?.permissionId, item))
    .filter((item) => item !== null && item !== undefined && item !== "")
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item));
}

function getPageItems(response) {
  const payload = unwrapApiPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isPlainObject(payload)) {
    return [];
  }

  return toArray(
    payload.content ??
      payload.items ??
      payload.records ??
      payload.results ??
      payload.list ??
      payload.rows ??
      payload.data,
  );
}

function getPageMeta(response, items) {
  const payload = unwrapApiPayload(response);
  const source = isPlainObject(payload) ? payload : {};
  const page = source.page ?? source.pagination ?? {};
  const pageNumber = firstDefined(source.number, source.pageNumber, source.currentPage, page.number, page.page, page.currentPage, 0);
  const pageSize = firstDefined(source.size, source.pageSize, page.size, page.pageSize, items.length);
  const totalItems = firstDefined(source.totalElements, source.totalItems, source.total, page.totalElements, page.totalItems, page.total, items.length);
  const totalPages = firstDefined(
    source.totalPages,
    page.totalPages,
    Math.max(1, Math.ceil(toNumber(totalItems, items.length) / Math.max(toNumber(pageSize, items.length || 1), 1))),
  );

  return {
    page: toNumber(pageNumber, 0),
    size: toNumber(pageSize, items.length),
    totalItems: toNumber(totalItems, items.length),
    totalPages: Math.max(1, toNumber(totalPages, 1)),
  };
}

export function normalizeAdminUser(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};

  return {
    avatar: firstDefined(source.avatarUrl, source.avatar, ""),
    avatarUrl: firstDefined(source.avatarUrl, source.avatar, ""),
    createdAt: firstDefined(source.createdAt, null),
    dateOfBirth: firstDefined(source.dateOfBirth, ""),
    email: firstDefined(source.email, ""),
    fullName: firstDefined(source.fullName, source.name, ""),
    gender: firstDefined(source.gender, ""),
    id: firstDefined(source.id, source.userId, null),
    name: firstDefined(source.fullName, source.name, source.username, source.email, "Customer"),
    phone: firstDefined(source.phoneNumber, source.phone, ""),
    phoneNumber: firstDefined(source.phoneNumber, source.phone, ""),
    raw: source,
    role: CUSTOMER_ROLE_LABEL,
    roleName: CUSTOMER_ROLE_LABEL,
    status: firstDefined(source.status, DEFAULT_USER_STATUS),
    updatedAt: firstDefined(source.updatedAt, null),
    username: firstDefined(source.username, ""),
  };
}

export function normalizeAdminStaff(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const assignedAt = firstDefined(source.assignedAt, source.createdAt, null);

  return {
    address: firstDefined(source.address, ""),
    assignedAt,
    avatar: firstDefined(source.avatarUrl, source.avatar, ""),
    avatarUrl: firstDefined(source.avatarUrl, source.avatar, ""),
    createdAt: assignedAt,
    dateOfBirth: firstDefined(source.dateOfBirth, ""),
    email: firstDefined(source.email, ""),
    fullName: firstDefined(source.fullName, source.name, ""),
    gender: firstDefined(source.gender, ""),
    id: firstDefined(source.id, source.staffId, null),
    name: firstDefined(source.fullName, source.name, source.username, source.email, "Staff"),
    phone: firstDefined(source.phoneNumber, source.phone, ""),
    phoneNumber: firstDefined(source.phoneNumber, source.phone, ""),
    raw: source,
    rawPassword: firstDefined(source.rawPassword, ""),
    role: firstDefined(source.roleName, source.role?.name, ""),
    roleId: firstDefined(source.roleId, source.role?.id, ""),
    roleName: firstDefined(source.roleName, source.role?.name, ""),
    status: firstDefined(source.status, DEFAULT_USER_STATUS),
    updatedAt: firstDefined(source.updatedAt, null),
    username: firstDefined(source.username, ""),
  };
}

export function normalizeAdminPermission(raw = {}) {
  const payload = unwrapApiPayload(raw);
  const source = isPlainObject(payload) ? payload : { code: payload, name: payload };
  const code = firstDefined(source.code, source.permissionCode, source.name, "");
  const parsed = parsePermissionCode(source);

  return {
    action: parsed.action,
    actionLabel: parsed.actionLabel,
    code,
    createdAt: firstDefined(source.createdAt, null),
    description: firstDefined(source.description, ""),
    groupLabel: parsed.resourceLabel,
    id: firstDefined(source.id, source.permissionId, null),
    name: firstDefined(source.name, toReadableLabel(code), code),
    raw: source,
    resource: parsed.resource,
    updatedAt: firstDefined(source.updatedAt, null),
  };
}

export function normalizeAdminRole(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const permissions = toArray(source.permissions).map(normalizeAdminPermission);
  const explicitPermissionIds = toIdArray(firstDefined(source.permissionIds, source.permissionsIds, []));
  const permissionIds = explicitPermissionIds.length
    ? explicitPermissionIds
    : permissions.map((permission) => permission.id).filter((id) => id !== null && id !== undefined);

  return {
    createdAt: firstDefined(source.createdAt, null),
    id: firstDefined(source.id, source.roleId, null),
    name: firstDefined(source.name, source.roleName, ""),
    permissionCount: toNumber(firstDefined(source.permissionCount, source.permissionsCount, permissions.length), permissions.length),
    permissionIds,
    permissions,
    raw: source,
    staffCount: toNumber(firstDefined(source.staffCount, source.staffsCount, source.employeeCount, 0), 0),
    status: firstDefined(source.status, DEFAULT_USER_STATUS),
    updatedAt: firstDefined(source.updatedAt, null),
  };
}

export function normalizeAdminUserPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeAdminUser);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function normalizeAdminStaffPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeAdminStaff);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function normalizeAdminRolePage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeAdminRole);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function normalizeAdminPermissionPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeAdminPermission);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function buildStaffCreatePayload(values = {}) {
  return {
    address: values.address?.trim() ?? "",
    avatarUrl: values.avatarUrl?.trim() || null,
    dateOfBirth: values.dateOfBirth || null,
    email: values.email?.trim() ?? "",
    fullName: values.fullName?.trim() ?? values.name?.trim() ?? "",
    gender: values.gender || "PREFER_NOT_TO_SAY",
    password: values.password?.trim() || null,
    phoneNumber: values.phoneNumber?.trim() ?? values.phone?.trim() ?? "",
    roleId: values.roleId ? Number(values.roleId) : null,
    status: values.status || DEFAULT_USER_STATUS,
    username: values.username?.trim() ?? "",
  };
}

export function buildStaffUpdatePayload(values = {}) {
  const payload = buildStaffCreatePayload(values);
  delete payload.password;
  return payload;
}

export function buildRolePayload(values = {}) {
  return {
    name: values.name?.trim() ?? "",
    permissionIds: toIdArray(values.permissionIds),
    status: values.status || DEFAULT_USER_STATUS,
  };
}
