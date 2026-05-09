import { ChevronDown, PackageSearch, Search, ShoppingCart, UserRound, Zap } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111F]/70 shadow-[0_16px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 lg:px-8">
        <a className="group flex min-w-fit items-center gap-3" href="/">
          <div className="premium-transition flex h-11 w-11 items-center justify-center rounded-xl bg-[#005BFF] text-white shadow-[0_0_28px_rgba(0,91,255,0.45)] group-hover:scale-105 group-hover:shadow-[0_0_42px_rgba(0,91,255,0.72)]">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-lg font-black leading-none text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.12)]">ElectroStore</p>
            <p className="mt-1 text-xs font-semibold text-blue-300">Smart Choice</p>
          </div>
        </a>

        <button
          className="premium-transition hidden h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-200 shadow-inner shadow-white/[0.03] backdrop-blur-xl hover:border-blue-400/70 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_26px_rgba(0,91,255,0.18)] lg:flex"
          type="button"
        >
          Tất cả danh mục
          <ChevronDown size={16} />
        </button>

        <div className="premium-transition hidden flex-1 items-center rounded-xl border border-white/10 bg-slate-950/55 p-1 shadow-inner shadow-white/[0.03] backdrop-blur-xl focus-within:border-blue-400/80 focus-within:bg-slate-950/75 focus-within:shadow-[0_0_34px_rgba(0,91,255,0.22)] md:flex">
          <Search className="ml-3 text-slate-400" size={19} />
          <input
            className="h-10 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Bạn cần tìm gì hôm nay?"
            type="search"
          />
          <button
            className="premium-transition h-10 rounded-lg bg-[#005BFF] px-5 text-sm font-bold text-white shadow-[0_0_24px_rgba(0,91,255,0.36)] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_0_34px_rgba(0,91,255,0.62)] active:translate-y-0"
            type="button"
          >
            Tìm kiếm
          </button>
        </div>

        <nav className="ml-auto flex items-center gap-2 text-sm text-slate-300">
          <a className="premium-transition hidden items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-white xl:flex" href="/">
            <PackageSearch size={19} />
            Theo dõi đơn hàng
          </a>
          <a className="premium-transition hidden items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/[0.06] hover:text-white sm:flex" href="/">
            <UserRound size={19} />
            Đăng nhập / Đăng ký
          </a>
          <a className="premium-transition relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 font-bold text-white shadow-inner shadow-white/[0.03] hover:-translate-y-0.5 hover:border-blue-400/80 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(0,91,255,0.22)]" href="/">
            <ShoppingCart size={20} />
            <span className="hidden lg:inline">Giỏ hàng</span>
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-black text-white shadow-[0_0_18px_rgba(239,68,68,0.7)]">
              3
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
