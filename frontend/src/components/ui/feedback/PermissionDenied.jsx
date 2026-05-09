import { ShieldAlert } from "lucide-react";
import EmptyState from "./EmptyState";

function PermissionDenied({
  className,
  fullPage = false,
  message = "Tài khoản hiện tại không có quyền truy cập khu vực này.",
  primaryLabel = "Về trang chủ",
  primaryTo = "/",
  requiredPermissions = [],
  requiredRoles = [],
  secondaryLabel,
  secondaryTo,
  surface = "store",
  title = "Không có quyền truy cập",
}) {
  const hasRequirements = requiredRoles.length > 0 || requiredPermissions.length > 0;
  const content = (
    <EmptyState
      actionLabel={primaryLabel}
      actionTo={primaryTo}
      className={className}
      eyebrow="Quyền truy cập"
      icon={ShieldAlert}
      message={message}
      secondaryActionLabel={secondaryLabel}
      secondaryActionTo={secondaryTo}
      surface={surface}
      title={title}
    >
      {hasRequirements && (
        <div className="mx-auto grid max-w-md gap-2 text-left text-xs font-semibold">
          {requiredRoles.length > 0 && (
            <p className={surface === "admin" ? "text-slate-500" : "text-slate-300"}>
              Vai trò cần có: {requiredRoles.join(", ")}
            </p>
          )}
          {requiredPermissions.length > 0 && (
            <p className={surface === "admin" ? "text-slate-500" : "text-slate-300"}>
              Quyền cần có: {requiredPermissions.join(", ")}
            </p>
          )}
        </div>
      )}
    </EmptyState>
  );

  if (!fullPage) {
    return content;
  }

  return (
    <div className={`flex min-h-[70vh] items-center justify-center px-4 py-12 ${surface === "admin" ? "bg-slate-50" : "bg-[#050B14]"}`}>
      <div className="w-full max-w-lg">{content}</div>
    </div>
  );
}

export default PermissionDenied;
