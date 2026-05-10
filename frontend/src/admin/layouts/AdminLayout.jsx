import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "../../utils/classNames";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_18%_0%,rgba(0,91,255,0.075),transparent_28%),linear-gradient(180deg,#F8FAFC_0%,#F6F8FB_38%,#EEF3F8_100%)] font-sans text-slate-950">
      <AdminSidebar
        collapsed={isSidebarCollapsed}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          "min-h-screen transition-[padding] duration-300 ease-out",
          isSidebarCollapsed ? "lg:pl-[88px]" : "lg:pl-[292px]",
        )}
      >
        <AdminTopbar
          collapsed={isSidebarCollapsed}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)}
        />

        <main className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
