import { useMemo } from "react";
import useAuth from "./useAuth";
import {
  ADMIN_ROUTE_POLICIES,
  canAccessPolicy,
  canAccessStaff,
  getResourceActionPolicy,
  hasAnyPermission,
  hasAnySessionRole,
  hasEveryPermission,
  hasPermission,
  hasSessionRole,
  isAdminSession,
  isStaffSession,
} from "./roleHelpers";

function resolveRoutePolicy(routeKeyOrPolicy) {
  if (!routeKeyOrPolicy || typeof routeKeyOrPolicy !== "string") {
    return routeKeyOrPolicy;
  }

  return ADMIN_ROUTE_POLICIES[routeKeyOrPolicy] ?? null;
}

function usePermissions() {
  const auth = useAuth();

  return useMemo(() => {
    const authState = {
      permissions: auth.permissions,
      roles: auth.roles,
      user: auth.user,
    };

    const canAccess = (policy) => canAccessPolicy(authState, policy);
    const canAccessRoute = (routeKeyOrPolicy) => canAccess(resolveRoutePolicy(routeKeyOrPolicy));

    return {
      canAccess,
      canAccessAdmin: () => canAccessStaff(authState),
      canAccessResourceAction: (resource, action) => canAccess(getResourceActionPolicy(resource, action)),
      canAccessRoute,
      canPerform: (policy) => canAccess(policy),
      filterAllowed: (items = []) => items.filter((item) => canAccess(item.access ?? item.policy)),
      hasAnyPermission: (permissions) => hasAnyPermission(auth.permissions, permissions),
      hasAnyRole: (roles) => hasAnySessionRole(authState, roles),
      hasEveryPermission: (permissions) => hasEveryPermission(auth.permissions, permissions),
      hasPermission: (permission) => hasPermission(auth.permissions, permission),
      hasRole: (role) => hasSessionRole(authState, role),
      isAdmin: () => isAdminSession(authState),
      isStaff: () => isStaffSession(authState),
      loading: auth.loading,
      permissions: auth.permissions,
      roles: auth.roles,
      user: auth.user,
    };
  }, [auth.loading, auth.permissions, auth.roles, auth.user]);
}

export default usePermissions;
