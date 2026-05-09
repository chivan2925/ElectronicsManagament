import { unwrapApiPayload } from "./productMapper";

const DEFAULT_USER_STATUS = "ACTIVE";
const CUSTOMER_ROLE_LABEL = "Customer";

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

export function normalizeAdminRole(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};

  return {
    createdAt: firstDefined(source.createdAt, null),
    id: firstDefined(source.id, source.roleId, null),
    name: firstDefined(source.name, source.roleName, ""),
    permissions: toArray(source.permissions).map((permission) => ({
      code: firstDefined(permission.code, ""),
      description: firstDefined(permission.description, ""),
      id: firstDefined(permission.id, permission.permissionId, null),
      name: firstDefined(permission.name, permission.code, ""),
    })),
    raw: source,
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
