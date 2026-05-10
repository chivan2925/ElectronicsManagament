import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, PackageSearch, Settings, ShieldCheck, UserRound } from "lucide-react";
import authService from "../../api/authService";
import OptimizedImage from "../common/OptimizedImage";
import { useToast } from "../ui/toast";
import { cn } from "../../utils/classNames";

const navItems = [
  {
    icon: UserRound,
    label: "Hồ sơ",
    to: "/profile",
  },
  {
    icon: PackageSearch,
    label: "Đơn hàng",
    to: "/profile/orders",
  },
  {
    icon: Settings,
    label: "Cài đặt",
    to: "/profile/settings",
  },
];

function getInitials(profile) {
  const name = profile?.fullName || profile?.username || profile?.email || "EM";
  const words = name.trim().split(/\s+/).filter(Boolean);

  return words
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function AccountSidebar({ isLoading = false, profile }) {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.showSuccess("Bạn đã đăng xuất khỏi tài khoản.", {
        title: "Đăng xuất",
      });
    } catch {
      toast.showInfo("Phiên đăng nhập đã được xóa trên trình duyệt.", {
        title: "Đăng xuất",
      });
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-3xl border border-blue-300/15 bg-slate-950/52 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl">
        <div className="flex items-center gap-3 lg:block">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-blue-200/20 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.45),transparent_34%),linear-gradient(135deg,#005BFF,#07111F)] shadow-[0_0_34px_rgba(0,91,255,0.38)] lg:h-20 lg:w-20">
            {profile?.avatarUrl ? (
              <OptimizedImage alt={profile.fullName || "Avatar"} className="h-full w-full object-cover" fallbackKind="avatar" sizes="80px" src={profile.avatarUrl} />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-black text-white lg:text-2xl">
                {getInitials(profile)}
              </span>
            )}
          </div>

          <div className="min-w-0 lg:mt-4">
            <p className="truncate text-base font-black text-white">{isLoading ? "Đang tải..." : profile?.fullName || "Tài khoản"}</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-400">{profile?.email || "Chưa có email"}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-100">
              <ShieldCheck size={13} />
              {profile?.status || "ACTIVE"}
            </div>
          </div>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0" aria-label="Account navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "premium-transition flex min-w-fit items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                    isActive
                      ? "border-blue-300/50 bg-blue-500/16 text-white shadow-[0_0_28px_rgba(0,91,255,0.2)]"
                      : "border-white/10 bg-white/[0.035] text-slate-300 hover:-translate-y-0.5 hover:border-blue-300/45 hover:bg-blue-500/10 hover:text-white",
                  )
                }
                end={item.to === "/profile"}
                key={item.to}
                to={item.to}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          className="premium-transition mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-100 outline-none hover:-translate-y-0.5 hover:border-red-200/45 hover:bg-red-500/16 hover:text-white focus-visible:ring-2 focus-visible:ring-red-200/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default AccountSidebar;
