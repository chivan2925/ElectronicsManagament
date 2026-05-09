import { Bell, Menu, Moon, Search } from "lucide-react";
import AdminIconButton from "../../ui/admin/AdminIconButton";

function Topbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-5 lg:px-7">
        <AdminIconButton icon={Menu} onClick={onToggleSidebar} size="md" title="Thu gọn sidebar" />

        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-10 w-full max-w-xl rounded-lg border border-border bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder="Tìm sản phẩm, đơn hàng, khách hàng..."
            type="search"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <AdminIconButton icon={Moon} size="md" title="Chế độ tối" />
          <AdminIconButton className="relative" icon={Bell} size="md" title="Thông báo">
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </AdminIconButton>

          <div className="ml-2 flex items-center gap-3 rounded-lg border border-border bg-white px-2.5 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              AD
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-bold text-ink">Admin PCE</p>
              <p className="text-xs text-muted">Quản trị viên</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
