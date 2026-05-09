import { Loader2, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export function RouteLoadingFallback({ message = "Đang khôi phục phiên đăng nhập..." }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#050B14] px-4 text-white">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-[0_0_40px_rgba(0,91,255,0.14)]">
        <Loader2 className="animate-spin text-blue-300" size={20} />
        <span className="text-sm font-bold text-slate-200">{message}</span>
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
  title = "Không có quyền truy cập",
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#050B14] px-4 py-12 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center shadow-[0_0_48px_rgba(0,91,255,0.16)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/15 text-blue-200">
          <ShieldAlert size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-black text-white transition-default hover:bg-blue-500"
            to={primaryTo}
          >
            {primaryLabel}
          </Link>
          {secondaryTo && secondaryLabel && (
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-black text-slate-100 transition-default hover:border-blue-300/50 hover:text-white"
              to={secondaryTo}
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
