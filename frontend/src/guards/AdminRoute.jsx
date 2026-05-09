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

function AdminRoute({
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

  if (!auth.isAdmin() || (!policy && !auth.hasAnyRole(requiredRoles))) {
    return (
      getUnauthorizedRedirect(deniedTo, location) ??
      unauthorizedElement ?? (
        <UnauthorizedRouteState
          message="Chỉ tài khoản admin mới có quyền mở khu vực quản trị nhạy cảm này."
          primaryLabel="Về dashboard"
          primaryTo="/admin/dashboard"
          title="Cần quyền admin"
        />
      )
    );
  }

  if (policy && !hasRequiredPolicy(auth, policy)) {
    return (
      getUnauthorizedRedirect(deniedTo, location) ??
      unauthorizedElement ?? (
        <UnauthorizedRouteState
          message="Tài khoản admin hiện tại không có phạm vi quyền phù hợp để mở trang này."
          primaryLabel="Về dashboard"
          primaryTo="/admin/dashboard"
          title="Thiếu quyền truy cập"
        />
      )
    );
  }

  if (!policy && !hasRequiredPermissions(auth, requiredPermissions, requireAllPermissions)) {
    return (
      getUnauthorizedRedirect(deniedTo, location) ??
      unauthorizedElement ?? (
        <UnauthorizedRouteState
          message="Tài khoản admin hiện tại thiếu permission cần thiết để mở trang này."
          primaryLabel="Về dashboard"
          primaryTo="/admin/dashboard"
          title="Thiếu permission"
        />
      )
    );
  }

  return getRouteContent(children);
}

export default AdminRoute;
