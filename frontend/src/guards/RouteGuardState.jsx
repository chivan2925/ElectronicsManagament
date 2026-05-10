import { Loader2 } from "lucide-react";
import PermissionDenied from "../components/ui/feedback/PermissionDenied";

export function RouteLoadingFallback({ message = "Đang khôi phục phiên đăng nhập...", surface = "store" }) {
  const isAdminSurface = surface === "admin";

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={
        isAdminSurface
          ? "flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 text-slate-950"
          : "flex min-h-[70vh] items-center justify-center bg-[#050B14] px-4 text-white"
      }
      role="status"
    >
      <div
        className={
          isAdminSurface
            ? "flex max-w-[min(92vw,28rem)] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
            : "flex max-w-[min(92vw,28rem)] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-[0_0_40px_rgba(0,91,255,0.14)]"
        }
      >
        <Loader2 className={isAdminSurface ? "shrink-0 animate-spin text-blue-600" : "shrink-0 animate-spin text-blue-300"} size={20} />
        <span className={isAdminSurface ? "min-w-0 text-sm font-bold text-slate-700" : "min-w-0 text-sm font-bold text-slate-200"}>
          {message}
        </span>
      </div>
    </div>
  );
}

export function UnauthorizedRouteState({
  message = "Tài khoản hiện tại không có quyền truy cập khu vực này.",
  primaryLabel = "Về trang chủ",
  primaryTo = "/",
  secondaryLabel,
  secondaryTo,
  surface,
  title = "Không có quyền truy cập",
}) {
  const resolvedSurface = surface ?? (primaryTo.startsWith("/admin") ? "admin" : "store");

  return (
    <PermissionDenied
      fullPage
      message={message}
      primaryLabel={primaryLabel}
      primaryTo={primaryTo}
      secondaryLabel={secondaryLabel}
      secondaryTo={secondaryTo}
      surface={resolvedSurface}
      title={title}
    />
  );
}
