import {
  BarChart3,
  Boxes,
  Building2,
  CircuitBoard,
  FileClock,
  Gauge,
  Image,
  Layers3,
  Package,
  PackageSearch,
  Percent,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tag,
  TrendingUp,
  UserCog,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { ADMIN_ROUTE_POLICIES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import { cn } from "../../utils/classNames";
import SidebarSection from "./SidebarSection";

const sidebarSections = [
  {
    access: ADMIN_ROUTE_POLICIES.dashboard,
    end: true,
    icon: Gauge,
    key: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    children: [
      { access: ADMIN_ROUTE_POLICIES.categories, icon: Layers3, key: "categories", label: "Categories", path: "/admin/categories" },
      { access: ADMIN_ROUTE_POLICIES.brands, icon: Building2, key: "brands", label: "Brands", path: "/admin/brands" },
      { access: ADMIN_ROUTE_POLICIES.products, icon: Package, key: "products", label: "Products", path: "/admin/products" },
      { access: ADMIN_ROUTE_POLICIES.variants, icon: Boxes, key: "variants", label: "Variants", path: "/admin/variants" },
      { access: ADMIN_ROUTE_POLICIES.media, icon: Image, key: "media", label: "Media", path: "/admin/media" },
    ],
    icon: PackageSearch,
    key: "catalog",
    label: "Catalog",
  },
  {
    children: [
      { access: ADMIN_ROUTE_POLICIES.users, icon: Users, key: "users", label: "Customers", path: "/admin/users" },
      { access: ADMIN_ROUTE_POLICIES.staff, icon: UserCog, key: "staff", label: "Staff", path: "/admin/staff" },
    ],
    icon: Users,
    key: "users",
    label: "Users",
  },
  {
    access: ADMIN_ROUTE_POLICIES.orders,
    icon: ShoppingCart,
    key: "orders",
    label: "Orders",
    path: "/admin/orders",
  },
  {
    access: ADMIN_ROUTE_POLICIES.warehouse,
    icon: Warehouse,
    key: "warehouse",
    label: "Warehouse",
    path: "/admin/warehouse",
  },
  {
    access: ADMIN_ROUTE_POLICIES.coupons,
    icon: Percent,
    key: "coupons",
    label: "Coupons",
    path: "/admin/coupons",
  },
  {
    access: ADMIN_ROUTE_POLICIES.roles,
    icon: ShieldCheck,
    key: "roles",
    label: "Roles & Permissions",
    path: "/admin/roles",
  },
  {
    children: [
      { access: ADMIN_ROUTE_POLICIES.revenue, icon: BarChart3, key: "revenue", label: "Revenue", path: "/admin/reports/revenue" },
      {
        access: ADMIN_ROUTE_POLICIES.bestSellers,
        icon: TrendingUp,
        key: "best-sellers",
        label: "Best sellers",
        path: "/admin/reports/best-sellers",
      },
      {
        access: ADMIN_ROUTE_POLICIES.activityLogs,
        icon: FileClock,
        key: "activity",
        label: "Activity log",
        path: "/admin/reports/activity",
      },
    ],
    icon: BarChart3,
    key: "analytics",
    label: "Analytics",
  },
  {
    badge: "Soon",
    disabled: true,
    icon: Settings,
    key: "settings",
    label: "Settings",
  },
];

function getVisibleSections(permission) {
  return sidebarSections
    .map((section) => {
      if (section.children?.length) {
        const children = permission.filterAllowed(section.children);

        if (children.length === 0) {
          return null;
        }

        return {
          ...section,
          children,
        };
      }

      if (section.disabled || !section.access || permission.canAccess(section.access)) {
        return section;
      }

      return null;
    })
    .filter(Boolean);
}

function AdminSidebar({ collapsed, mobileOpen, onCloseMobileSidebar }) {
  const permission = usePermissions();
  const visibleSections = getVisibleSections(permission);
  const isDesktopCollapsed = collapsed && !mobileOpen;

  return (
    <>
      <button
        aria-label="Close admin navigation overlay"
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobileSidebar}
        type="button"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col overflow-hidden border-r border-white/10 bg-[#07111F]/95 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl transition-all duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isDesktopCollapsed ? "lg:w-[88px]" : "lg:w-[292px]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,91,255,0.22),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_20%)]" />

        <div className="relative flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#005BFF] shadow-lg shadow-blue-950/40">
            <CircuitBoard size={22} />
          </div>

          {!isDesktopCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black tracking-normal">ElectronicsManagement</p>
              <p className="text-xs font-semibold text-slate-400">Admin console</p>
            </div>
          )}

          <button
            aria-label="Close sidebar"
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-slate-200 transition hover:bg-white/15 lg:hidden"
            onClick={onCloseMobileSidebar}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 space-y-2 overflow-y-auto px-3 py-4">
          {visibleSections.map((section) => (
            <SidebarSection
              collapsed={isDesktopCollapsed}
              key={section.key}
              onNavigate={onCloseMobileSidebar}
              section={section}
            />
          ))}
        </nav>

        <div className="relative border-t border-white/10 p-3">
          <div
            className={cn(
              "rounded-xl border border-white/10 bg-white/[0.07] p-3 shadow-inner shadow-white/5",
              isDesktopCollapsed && "hidden lg:flex lg:h-12 lg:items-center lg:justify-center lg:p-0",
            )}
          >
            {isDesktopCollapsed ? (
              <Sparkles className="text-blue-200" size={18} />
            ) : (
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-blue-100">
                  <Tag size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">Ecommerce ops</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-400">Catalog, orders, and warehouse controls.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
