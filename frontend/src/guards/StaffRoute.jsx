import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { RouteLoadingFallback, UnauthorizedRouteState } from "./RouteGuardState";
import {
  createRedirectState,
  getRouteContent,
  getUnauthorizedRedirect,
  hasRequiredPermissions,
  hasRequiredPolicy,
} from "./routeGuardUtils";

function StaffRoute({
  children,
  deniedTo = null,
  fallback,
  policy = null,
  redirectTo = "/admin/login",
  requireAllPermissions = false,
  requiredPermissions = [],
  requiredRoles = [],
  unauthorizedElement,
}) {
  const location = useLocation();
  const auth = useAuth();

  if (auth.loading) {
    return fallback ?? <RouteLoadingFallback surface="admin" />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate replace state={createRedirectState(location)} to={redirectTo} />;
  }

  const hasStaffAccess = auth.canAccessStaff() && (!policy ? auth.hasAnyRole(requiredRoles) : true);
  const hasPermissionAccess = policy
    ? hasRequiredPolicy(auth, policy)
    : hasRequiredPermissions(auth, requiredPermissions, requireAllPermissions);

  if (!hasStaffAccess || !hasPermissionAccess) {
    return (
      getUnauthorizedRedirect(deniedTo, location) ??
      unauthorizedElement ?? (
        <UnauthorizedRouteState
          message="Tài khoản hiện tại không thuộc nhóm admin hoặc staff được phép vào khu vực quản trị."
          title="Không có quyền truy cập admin"
        />
      )
    );
  }

  return getRouteContent(children);
}

export default StaffRoute;
