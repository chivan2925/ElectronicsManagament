import { ACCESS_MODES } from "./roleHelpers";
import usePermissions from "./usePermissions";

function PermissionGate({
  allowAdmin = true,
  children,
  fallback = null,
  loadingFallback = null,
  mode = ACCESS_MODES.all,
  permissions = [],
  policy = null,
  requireAllPermissions = false,
  roles = [],
}) {
  const permission = usePermissions();

  if (permission.loading) {
    return loadingFallback;
  }

  const allowed = permission.canAccess(
    policy ?? {
      allowAdmin,
      mode,
      permissions,
      requireAllPermissions,
      roles,
    },
  );

  return allowed ? children : fallback;
}

export default PermissionGate;
