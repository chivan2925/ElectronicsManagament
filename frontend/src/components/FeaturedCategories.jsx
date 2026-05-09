import { categories } from "../data/mockData";

function FeaturedCategories() {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">Danh mục nổi bật</h2>
          <p className="mt-2 text-sm font-medium text-slate-400">Chọn nhanh nhóm sản phẩm bạn đang cần.</p>
        </div>
        <a className="premium-transition hidden text-sm font-bold text-blue-300 hover:text-white hover:drop-shadow-[0_0_14px_rgba(0,91,255,0.85)] sm:inline" href="/">
          Xem tất cả
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-10">
        {categories.slice(1).map((category) => {
          const Icon = category.icon;

          return (
            <button
              className="premium-transition group rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/85 to-[#07111F]/90 p-4 text-left shadow-xl shadow-black/15 backdrop-blur-xl hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-[0_0_34px_rgba(0,91,255,0.2)]"
              key={category.id}
              type="button"
            >
              <div className="premium-transition mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 group-hover:bg-[#005BFF] group-hover:text-white group-hover:shadow-[0_0_28px_rgba(0,91,255,0.42)]">
                <Icon size={21} />
              </div>
              <p className="text-sm font-black text-white">{category.name}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedCategories;
