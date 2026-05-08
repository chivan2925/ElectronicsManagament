import { categories } from "../data/mockData";

function FeaturedCategories() {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Danh mục nổi bật</h2>
          <p className="mt-1 text-sm text-slate-500">Chọn nhanh nhóm sản phẩm bạn đang cần.</p>
        </div>
        <a className="hidden text-sm font-bold text-blue-300 hover:text-white sm:inline" href="/">
          Xem tất cả
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-10">
        {categories.slice(1).map((category) => {
          const Icon = category.icon;

          return (
            <button
              className="group rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-[#07111F] p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-500/70"
              key={category.id}
              type="button"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 transition group-hover:bg-[#005BFF] group-hover:text-white">
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
