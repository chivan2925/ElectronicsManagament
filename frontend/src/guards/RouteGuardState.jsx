import LoadingState from "../components/ui/feedback/LoadingState";
import PermissionDenied from "../components/ui/feedback/PermissionDenied";

export function RouteLoadingFallback({ message = "Đang khôi phục phiên đăng nhập...", surface = "store" }) {
  return (
    <LoadingState
      className="max-w-[min(92vw,30rem)]"
      message={surface === "admin" ? "Đang kiểm tra quyền truy cập quản trị." : "Đang chuẩn bị phiên mua sắm của bạn."}
      surface={surface}
      title={message}
      variant="page"
    />
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
