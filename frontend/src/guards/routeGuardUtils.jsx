import { Navigate, Outlet } from "react-router-dom";
import { canAccessPolicy } from "../auth/roleHelpers";

const GUEST_ONLY_PATHS = new Set(["/login", "/register", "/admin/login"]);

export function getRouteContent(children) {
  return children ?? <Outlet />;
}

export function createRedirectState(location) {
  return {
    from: {
      hash: location.hash,
      pathname: location.pathname,
      search: location.search,
    },
  };
}

function normalizePath(path) {
  if (!path || typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    return null;
  }

  return path;
}

export function getSafeRedirectPath(from, fallback = "/") {
  if (typeof from === "string") {
    return normalizePath(from) ?? fallback;
  }

  if (from && typeof from === "object") {
    const pathname = normalizePath(from.pathname);

    if (!pathname) {
      return fallback;
    }

    return `${pathname}${from.search ?? ""}${from.hash ?? ""}`;
  }

  return fallback;
}

export function isGuestOnlyPath(path) {
  const pathname = String(path ?? "").split(/[?#]/)[0];

  return GUEST_ONLY_PATHS.has(pathname);
}

export function canUseRememberedRedirect(auth, path) {
  if (!path || isGuestOnlyPath(path)) {
    return false;
  }

  if (path.startsWith("/admin")) {
    return auth.canAccessAdmin();
  }

  return true;
}

export function hasRequiredPermissions(auth, requiredPermissions = [], requireAllPermissions = false) {
  return requireAllPermissions
    ? auth.hasEveryPermission(requiredPermissions)
    : auth.hasAnyPermission(requiredPermissions);
}

export function hasRequiredPolicy(auth, policy) {
  return canAccessPolicy(auth, policy);
}

export function getUnauthorizedRedirect(deniedTo, location) {
  if (!deniedTo) {
    return null;
  }

  return <Navigate replace state={{ deniedFrom: createRedirectState(location).from }} to={deniedTo} />;
}
