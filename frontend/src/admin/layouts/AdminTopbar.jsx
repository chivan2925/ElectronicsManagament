import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import { ADMIN_ROUTE_POLICIES } from "../../auth/roleHelpers";
import useAuth from "../../auth/useAuth";
import usePermissions from "../../auth/usePermissions";
import AdminIconButton from "../../components/ui/admin/AdminIconButton";
import { useToast } from "../../components/ui/toast";
import { cn } from "../../utils/classNames";
import AdminNotificationDropdown from "../components/realtime/AdminNotificationDropdown";
import Breadcrumbs from "./Breadcrumbs";

const topbarSearchItems = [
  {
    access: ADMIN_ROUTE_POLICIES.dashboard,
    group: "Overview",
    keywords: ["analytics", "kpi", "dashboard"],
    label: "Dashboard analytics",
    path: "/admin/dashboard",
  },
  {
    access: ADMIN_ROUTE_POLICIES.categories,
    group: "Catalog",
    keywords: ["category", "danh muc"],
    label: "Categories",
    path: "/admin/categories",
  },
  {
    access: ADMIN_ROUTE_POLICIES.brands,
    group: "Catalog",
    keywords: ["brand", "thuong hieu"],
    label: "Brands",
    path: "/admin/brands",
  },
  {
    access: ADMIN_ROUTE_POLICIES.products,
    group: "Catalog",
    keywords: ["product", "catalog", "san pham"],
    label: "Products",
    path: "/admin/products",
  },
  {
    access: ADMIN_ROUTE_POLICIES.variants,
    group: "Catalog",
    keywords: ["variant", "sku", "bien the"],
    label: "Variants",
    path: "/admin/variants",
  },
  {
    access: ADMIN_ROUTE_POLICIES.media,
    group: "Catalog",
    keywords: ["media", "asset", "cloudinary", "image"],
    label: "Media library",
    path: "/admin/media",
  },
  {
    access: ADMIN_ROUTE_POLICIES.orders,
    group: "Operations",
    keywords: ["order", "checkout", "shipping", "don hang"],
    label: "Orders",
    path: "/admin/orders",
  },
  {
    access: ADMIN_ROUTE_POLICIES.warehouse,
    group: "Operations",
    keywords: ["warehouse", "inventory", "stock", "kho"],
    label: "Warehouse",
    path: "/admin/warehouse",
  },
  {
    access: ADMIN_ROUTE_POLICIES.coupons,
    group: "Marketing",
    keywords: ["coupon", "discount", "voucher"],
    label: "Coupons",
    path: "/admin/coupons",
  },
  {
    access: ADMIN_ROUTE_POLICIES.users,
    group: "People",
    keywords: ["customer", "user", "nguoi dung"],
    label: "Customers",
    path: "/admin/users",
  },
  {
    access: ADMIN_ROUTE_POLICIES.staff,
    group: "People",
    keywords: ["staff", "employee", "nhan vien"],
    label: "Staff",
    path: "/admin/staff",
  },
  {
    access: ADMIN_ROUTE_POLICIES.roles,
    group: "Security",
    keywords: ["role", "permission", "security"],
    label: "Roles & permissions",
    path: "/admin/roles",
  },
  {
    access: ADMIN_ROUTE_POLICIES.revenue,
    group: "Reports",
    keywords: ["revenue", "report", "doanh thu"],
    label: "Revenue report",
    path: "/admin/reports/revenue",
  },
  {
    access: ADMIN_ROUTE_POLICIES.bestSellers,
    group: "Reports",
    keywords: ["best sellers", "report", "top products"],
    label: "Best sellers report",
    path: "/admin/reports/best-sellers",
  },
  {
    access: ADMIN_ROUTE_POLICIES.activityLogs,
    group: "Reports",
    keywords: ["activity", "audit", "log"],
    label: "Activity log",
    path: "/admin/reports/activity",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function AdminTopbar({ collapsed, onOpenMobileSidebar, onToggleSidebar }) {
  const auth = useAuth();
  const permission = usePermissions();
  const navigate = useNavigate();
  const toast = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const displayName = auth.user?.fullName || auth.user?.name || auth.user?.email || "Admin PCE";
  const displayRole = auth.user?.roleName || auth.user?.role || auth.roles?.[0] || "Administrator";
  const initials = getInitials(displayName) || "AD";
  const searchResults = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return topbarSearchItems
      .filter((item) => permission.canAccess(item.access))
      .filter((item) => {
        if (!keyword) {
          return true;
        }

        return [item.label, item.group, item.path, ...(item.keywords ?? [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword));
      })
      .slice(0, 8);
  }, [permission, searchQuery]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);

    try {
      await authService.logout();
      toast.showSuccess("Signed out of the admin dashboard.");
    } catch {
      auth.logout();
      toast.showInfo("Local admin session was cleared.");
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const handleSearchSelect = (path) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    navigate(path);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (searchResults[0]?.path) {
      handleSearchSelect(searchResults[0].path);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 shadow-sm shadow-slate-200/40 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <AdminIconButton
          className="lg:hidden"
          icon={Menu}
          onClick={onOpenMobileSidebar}
          size="md"
          title="Open admin navigation"
        />
        <AdminIconButton
          className="hidden lg:inline-flex"
          icon={collapsed ? PanelLeftOpen : PanelLeftClose}
          onClick={onToggleSidebar}
          size="md"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        />

        <div className="min-w-0 flex-1">
          <Breadcrumbs className="hidden sm:flex" />
          <p className="truncate text-sm font-black text-slate-900 sm:hidden">Admin console</p>
        </div>

        <form className="relative hidden w-full max-w-md lg:block" onSubmit={handleSearchSubmit} ref={searchRef}>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/90 pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100"
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search admin modules..."
            type="search"
            value={searchQuery}
          />
          {searchQuery ? (
            <button
              aria-label="Clear admin search"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(true);
              }}
              type="button"
            >
              <X size={15} />
            </button>
          ) : null}

          {isSearchOpen ? (
            <div className="absolute right-0 top-12 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
              <div className="max-h-96 overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50"
                      key={item.path}
                      onClick={() => handleSearchSelect(item.path)}
                      type="button"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-slate-900">{item.label}</span>
                        <span className="block truncate text-xs font-semibold text-slate-500">{item.path}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
                        {item.group}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
                    <p className="text-sm font-bold text-slate-700">No matching admin module</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <AdminNotificationDropdown />

          <div className="relative" ref={profileRef}>
            <button
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-1.5 pr-2 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => {
                setIsProfileOpen((value) => !value);
              }}
              type="button"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#005BFF] text-xs font-black text-white shadow-sm shadow-blue-200">
                {initials}
              </span>
              <span className="hidden min-w-0 leading-tight sm:block">
                <span className="block max-w-36 truncate text-sm font-black text-slate-950">{displayName}</span>
                <span className="block max-w-36 truncate text-xs font-semibold text-slate-500">{displayRole}</span>
              </span>
              <ChevronDown
                className={cn("hidden text-slate-400 transition-transform sm:block", isProfileOpen && "rotate-180")}
                size={15}
              />
            </button>

            {isProfileOpen ? (
              <div
                className="absolute right-0 top-12 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80 backdrop-blur-xl"
                role="menu"
              >
                <div className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#005BFF] text-sm font-black text-white">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">{displayName}</p>
                      <p className="truncate text-xs font-semibold text-slate-500">{displayRole}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-primary"
                    onClick={() => setIsProfileOpen(false)}
                    role="menuitem"
                    to="/admin/dashboard"
                  >
                    <UserRound size={17} />
                    Admin overview
                  </Link>
                  <button
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400"
                    disabled
                    role="menuitem"
                    type="button"
                  >
                    <Settings size={17} />
                    Settings placeholder
                  </button>
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                    onClick={handleLogout}
                    role="menuitem"
                    type="button"
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
