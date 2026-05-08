import { Bell, Menu, Moon, Search } from "lucide-react";

function Topbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-5 lg:px-7">
        <button
          className="rounded-lg border border-border p-2 text-slate-600 transition hover:border-primary hover:text-primary"
          onClick={onToggleSidebar}
          type="button"
          title="Thu gọn sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-10 w-full max-w-xl rounded-lg border border-border bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder="Tìm sản phẩm, đơn hàng, khách hàng..."
            type="search"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="rounded-lg border border-border p-2 text-slate-600 transition hover:border-primary hover:text-primary"
            type="button"
            title="Chế độ tối"
          >
            <Moon size={19} />
          </button>
          <button
            className="relative rounded-lg border border-border p-2 text-slate-600 transition hover:border-primary hover:text-primary"
            type="button"
            title="Thông báo"
          >
            <Bell size={19} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>

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
