import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/admin/Sidebar";
import Topbar from "../components/layout/admin/Topbar";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Sidebar collapsed={collapsed} />

      <div className={`min-h-screen transition-all duration-300 ${collapsed ? "pl-[84px]" : "pl-[280px]"}`}>
        <Topbar onToggleSidebar={() => setCollapsed((value) => !value)} />
        <main className="px-5 py-6 lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
