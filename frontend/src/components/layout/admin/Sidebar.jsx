import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  Database,
  FileClock,
  Headphones,
  Home,
  Image,
  Layers3,
  LogOut,
  Package,
  PackageSearch,
  Percent,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../../api/authService";
import { ADMIN_ROUTE_POLICIES } from "../../../auth/roleHelpers";
import useAuth from "../../../auth/useAuth";
import usePermissions from "../../../auth/usePermissions";
import { useToast } from "../../ui/toast";

const menuGroups = [
  {
    label: "Tổng quan",
    items: [{ access: ADMIN_ROUTE_POLICIES.dashboard, label: "Dashboard", path: "/admin/dashboard", icon: Home }],
  },
  {
    label: "Quản lý",
    items: [
      { access: ADMIN_ROUTE_POLICIES.categories, label: "Danh mục", path: "/admin/categories", icon: Layers3 },
      { access: ADMIN_ROUTE_POLICIES.brands, label: "Thương hiệu", path: "/admin/brands", icon: Building2 },
      { access: ADMIN_ROUTE_POLICIES.products, label: "Sản phẩm", path: "/admin/products", icon: Package },
      { access: ADMIN_ROUTE_POLICIES.variants, label: "Biến thể Variant", path: "/admin/variants", icon: Boxes },
      { access: ADMIN_ROUTE_POLICIES.media, label: "Media", path: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Quản lý người dùng",
    items: [
      { access: ADMIN_ROUTE_POLICIES.users, label: "Người dùng", path: "/admin/users", icon: Users },
      { access: ADMIN_ROUTE_POLICIES.staff, label: "Nhân viên", path: "/admin/staff", icon: UserCog },
      { access: ADMIN_ROUTE_POLICIES.roles, label: "Vai trò / Quyền", path: "/admin/roles", icon: ShieldCheck },
    ],
  },
  {
    label: "Bán hàng",
    items: [
      { access: ADMIN_ROUTE_POLICIES.orders, label: "Đơn hàng", path: "/admin/orders", icon: ShoppingCart },
      { access: ADMIN_ROUTE_POLICIES.warehouse, label: "Kho hàng", path: "/admin/warehouse", icon: Warehouse },
      { access: ADMIN_ROUTE_POLICIES.coupons, label: "Mã giảm giá", path: "/admin/coupons", icon: Percent },
    ],
  },
  {
    label: "Báo cáo",
    items: [
      { access: ADMIN_ROUTE_POLICIES.revenue, label: "Doanh thu", path: "/admin/reports/revenue", icon: BarChart3 },
      { access: ADMIN_ROUTE_POLICIES.bestSellers, label: "Sản phẩm bán chạy", path: "/admin/reports/best-sellers", icon: TrendingUp },
      { access: ADMIN_ROUTE_POLICIES.activityLogs, label: "Nhật ký hoạt động", path: "/admin/reports/activity", icon: FileClock },
    ],
  },
];

const getNavClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-primary text-white shadow-admin-card"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

function Sidebar({ collapsed }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const permission = usePermissions();
  const toast = useToast();
  const visibleMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      items: permission.filterAllowed(group.items),
    }))
    .filter((group) => group.items.length > 0);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.showSuccess("Đã đăng xuất khỏi admin dashboard.");
    } catch {
      auth.logout();
      toast.showInfo("Phiên đăng nhập đã được xóa trên trình duyệt.");
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-navy text-white transition-all duration-300 ${
        collapsed ? "w-[84px]" : "w-[280px]"
      }`}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Headphones size={22} />
        </div>
        {!collapsed && (
          <div>
            <p className="text-base font-black tracking-normal">PCE Gaming</p>
            <p className="text-xs text-slate-400">Admin Console</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {visibleMenuGroups.map((group) => (
          <section key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-normal text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink className={getNavClass} end={item.path === "/admin/dashboard"} key={item.path} to={item.path}>
                    <Icon className="shrink-0" size={18} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        {!collapsed && (
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/10 p-2">
                <Database size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">Cửa hàng của bạn</p>
                <p className="text-xs text-slate-400">11 loại sản phẩm</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
              <ClipboardList size={14} />
              <span>84 đơn hàng hôm nay</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
              <PackageSearch size={14} />
              <span>1,248 sản phẩm</span>
            </div>
          </div>
        )}

        <button
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-300 transition outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-300/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={18} />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
