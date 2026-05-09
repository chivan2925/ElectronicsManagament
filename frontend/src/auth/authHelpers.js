import { AUTH_USER_TYPES, inferUserTypeFromRole, normalizePermissions, normalizeRoles } from "./roleHelpers";

export {
  ACCESS_MODES,
  ADMIN_ACCESS_ROLE_NAMES,
  ADMIN_RESOURCES,
  ADMIN_ROLE_NAMES,
  ADMIN_ROUTE_POLICIES,
  APP_PERMISSIONS,
  APP_ROLES,
  AUTH_ROLE_GROUPS,
  AUTH_USER_TYPES,
  STAFF_ROLE_NAMES,
  USER_ROLE_NAMES,
  canAccessAdmin,
  canAccessPolicy,
  canAccessStaff,
  getResourceActionPolicies,
  getResourceActionPolicy,
  getResourcePermission,
  getSessionRoles,
  hasAnyPermission,
  hasAnyRole,
  hasAnySessionRole,
  hasEveryPermission,
  hasPermission,
  hasRole,
  hasSessionRole,
  inferUserTypeFromRole,
  isAdminSession,
  isStaffSession,
  normalizePermissionCode,
  normalizePermissions,
  normalizeRoleName,
  normalizeRoles,
} from "./roleHelpers";

export function normalizeUser(payload) {
  const sourcePayload = payload ?? {};
  const source = sourcePayload.user ?? sourcePayload.staff ?? sourcePayload.customer ?? sourcePayload.profile ?? sourcePayload;

  if (!source || typeof source !== "object") {
    return null;
  }

  const staffId = source.staffId ?? sourcePayload.staffId ?? null;
  const role = source.role ?? source.roleName ?? sourcePayload.role ?? null;
  const hasUserData = Boolean(
    source.id ??
      source.userId ??
      staffId ??
      source.fullName ??
      source.name ??
      source.email ??
      source.phone ??
      role,
  );

  if (!hasUserData) {
    return null;
  }

  const userType =
    source.type ??
    source.userType ??
    sourcePayload.userType ??
    sourcePayload.accountType ??
    (staffId ? AUTH_USER_TYPES.staff : inferUserTypeFromRole(role));

  return {
    ...source,
    email: source.email ?? sourcePayload.email ?? "",
    fullName: source.fullName ?? source.name ?? sourcePayload.fullName ?? "",
    id: source.id ?? source.userId ?? sourcePayload.userId ?? staffId ?? sourcePayload.id ?? null,
    phone: source.phone ?? sourcePayload.phone ?? "",
    role,
    staffId,
    type: userType,
  };
}

export function buildAuthSession(payload = {}) {
  const user = normalizeUser(payload);
  const tokens = payload.tokens ?? {};
  const accessToken =
    payload.accessToken ?? payload.token ?? payload.jwt ?? payload.access_token ?? tokens.accessToken ?? tokens.access_token ?? null;
  const refreshToken =
    payload.refreshToken ?? payload.refresh_token ?? payload.refresh ?? tokens.refreshToken ?? tokens.refresh_token ?? null;
  const roles = normalizeRoles([payload.roles, payload.role, payload.roleName, user?.roles, user?.role, user?.roleName]);
  const permissions = normalizePermissions([
    payload.permissions,
    payload.authorities,
    user?.permissions,
    user?.authorities,
    user?.role?.permissions,
  ]);

  return {
    accessToken,
    permissions,
    refreshToken,
    roles,
    user,
  };
}
