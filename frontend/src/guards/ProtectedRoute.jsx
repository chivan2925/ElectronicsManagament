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

function ProtectedRoute({
  children,
  deniedTo = null,
  fallback,
  policy = null,
  redirectTo = "/login",
  requireAllPermissions = false,
  requiredPermissions = [],
  requiredRoles = [],
  unauthorizedElement,
}) {
  const location = useLocation();
  const auth = useAuth();

  if (auth.loading) {
    return fallback ?? <RouteLoadingFallback />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate replace state={createRedirectState(location)} to={redirectTo} />;
  }

  if (policy && !hasRequiredPolicy(auth, policy)) {
    return (
      getUnauthorizedRedirect(deniedTo, location) ??
      unauthorizedElement ?? (
        <UnauthorizedRouteState message="Tài khoản hiện tại không có quyền phù hợp để mở trang này." />
      )
    );
  }

  if (!policy && !auth.hasAnyRole(requiredRoles)) {
    return (
      getUnauthorizedRedirect(deniedTo, location) ??
      unauthorizedElement ?? (
        <UnauthorizedRouteState message="Tài khoản hiện tại không có vai trò phù hợp để mở trang này." />
      )
    );
  }

  if (!policy && !hasRequiredPermissions(auth, requiredPermissions, requireAllPermissions)) {
    return (
      getUnauthorizedRedirect(deniedTo, location) ??
      unauthorizedElement ?? (
        <UnauthorizedRouteState message="Tài khoản hiện tại thiếu quyền cần thiết để thực hiện thao tác này." />
      )
    );
  }

  return getRouteContent(children);
}

export default ProtectedRoute;
