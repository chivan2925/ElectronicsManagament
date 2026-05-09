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
import { NavLink } from "react-router-dom";

const menuGroups = [
  {
    label: "Tổng quan",
    items: [{ label: "Dashboard", path: "/admin/dashboard", icon: Home }],
  },
  {
    label: "Quản lý",
    items: [
      { label: "Danh mục", path: "/admin/categories", icon: Layers3 },
      { label: "Thương hiệu", path: "/admin/brands", icon: Building2 },
      { label: "Sản phẩm", path: "/admin/products", icon: Package },
      { label: "Biến thể Variant", path: "/admin/variants", icon: Boxes },
      { label: "Media", path: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Quản lý người dùng",
    items: [
      { label: "Người dùng", path: "/admin/users", icon: Users },
      { label: "Nhân viên", path: "/admin/staff", icon: UserCog },
      { label: "Vai trò / Quyền", path: "/admin/roles", icon: ShieldCheck },
    ],
  },
  {
    label: "Bán hàng",
    items: [
      { label: "Đơn hàng", path: "/admin/orders", icon: ShoppingCart },
      { label: "Kho hàng", path: "/admin/warehouse", icon: Warehouse },
      { label: "Mã giảm giá", path: "/admin/coupons", icon: Percent },
    ],
  },
  {
    label: "Báo cáo",
    items: [
      { label: "Doanh thu", path: "/admin/reports/revenue", icon: BarChart3 },
      { label: "Sản phẩm bán chạy", path: "/admin/reports/best-sellers", icon: TrendingUp },
      { label: "Nhật ký hoạt động", path: "/admin/reports/activity", icon: FileClock },
    ],
  },
];

const getNavClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-primary text-white shadow-sm"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

function Sidebar({ collapsed }) {
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
        {menuGroups.map((group) => (
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
                    <Icon className="shrink-0" size={19} />
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
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
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
