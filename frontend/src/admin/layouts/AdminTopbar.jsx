import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import useAuth from "../../auth/useAuth";
import AdminIconButton from "../../components/ui/admin/AdminIconButton";
import { useToast } from "../../components/ui/toast";
import { cn } from "../../utils/classNames";
import Breadcrumbs from "./Breadcrumbs";

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
  const navigate = useNavigate();
  const toast = useToast();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const displayName = auth.user?.fullName || auth.user?.name || auth.user?.email || "Admin PCE";
  const displayRole = auth.user?.roleName || auth.user?.role || auth.roles?.[0] || "Administrator";
  const initials = getInitials(displayName) || "AD";

  useEffect(() => {
    function handlePointerDown(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
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

        <label className="relative hidden w-full max-w-md lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/90 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Search products, orders, customers..."
            type="search"
          />
        </label>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="relative" ref={notificationRef}>
            <AdminIconButton
              className="relative"
              icon={Bell}
              onClick={() => {
                setIsNotificationsOpen((value) => !value);
                setIsProfileOpen(false);
              }}
              size="md"
              title="Notifications"
            >
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-danger" />
            </AdminIconButton>

            {isNotificationsOpen ? (
              <div className="absolute right-0 top-12 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80 backdrop-blur-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-black text-slate-950">Notifications</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">Placeholder for admin alerts.</p>
                </div>
                <div className="p-4">
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
                    <p className="text-sm font-bold text-slate-700">No live notifications yet</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Order, inventory, and staff alerts can be connected here later.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-1.5 pr-2 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => {
                setIsProfileOpen((value) => !value);
                setIsNotificationsOpen(false);
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
