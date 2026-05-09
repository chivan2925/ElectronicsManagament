import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { RouteLoadingFallback } from "./RouteGuardState";
import { canUseRememberedRedirect, getRouteContent, getSafeRedirectPath } from "./routeGuardUtils";

function GuestRoute({
  adminRedirectTo = "/admin/dashboard",
  children,
  clientRedirectTo = "/",
  fallback,
  redirectTo,
}) {
  const auth = useAuth();
  const location = useLocation();
  const surface = location.pathname.startsWith("/admin") ? "admin" : "store";

  if (auth.loading) {
    return fallback ?? <RouteLoadingFallback surface={surface} />;
  }

  if (auth.isAuthenticated) {
    const rememberedPath = getSafeRedirectPath(location.state?.from, null);
    const defaultTarget = redirectTo ?? (auth.canAccessAdmin() ? adminRedirectTo : clientRedirectTo);
    const target = canUseRememberedRedirect(auth, rememberedPath) ? rememberedPath : defaultTarget;

    return <Navigate replace to={target} />;
  }

  return getRouteContent(children);
}

export default GuestRoute;
