import { ChevronDown, PackageSearch, Search, ShoppingCart, UserRound, Zap } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#07111F]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 lg:px-8">
        <a className="flex min-w-fit items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#005BFF] text-white shadow-lg shadow-blue-950/40">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-lg font-black leading-none text-white">ElectroStore</p>
            <p className="mt-1 text-xs font-semibold text-blue-300">Smart Choice</p>
          </div>
        </a>

        <button
          className="hidden h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white lg:flex"
          type="button"
        >
          Tất cả danh mục
          <ChevronDown size={16} />
        </button>

        <div className="hidden flex-1 items-center rounded-xl border border-slate-700 bg-slate-950/70 p-1 transition focus-within:border-blue-500 md:flex">
          <Search className="ml-3 text-slate-500" size={19} />
          <input
            className="h-10 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Bạn cần tìm gì hôm nay?"
            type="search"
          />
          <button
            className="h-10 rounded-lg bg-[#005BFF] px-5 text-sm font-bold text-white transition hover:bg-blue-700"
            type="button"
          >
            Tìm kiếm
          </button>
        </div>

        <nav className="ml-auto flex items-center gap-2 text-sm text-slate-300">
          <a className="hidden items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-900 hover:text-white xl:flex" href="/">
            <PackageSearch size={19} />
            Theo dõi đơn hàng
          </a>
          <a className="hidden items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-900 hover:text-white sm:flex" href="/">
            <UserRound size={19} />
            Đăng nhập / Đăng ký
          </a>
          <a className="relative flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-bold text-white transition hover:border-blue-500" href="/">
            <ShoppingCart size={20} />
            <span className="hidden lg:inline">Giỏ hàng</span>
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white">
              3
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
