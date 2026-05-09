import { ChevronRight } from "lucide-react";
import { categories } from "../data/mockData";

function CategorySidebar() {
  return (
    <aside className="store-glass hidden rounded-2xl p-3 lg:block">
      <div className="mb-2 px-3 py-2">
        <p className="text-sm font-black text-white">Danh mục sản phẩm</p>
        <p className="mt-1 text-xs font-medium text-slate-400">Thiết bị điện tử & gaming</p>
      </div>

      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              className={`premium-transition flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                category.active
                  ? "bg-[#005BFF] text-white shadow-[0_0_28px_rgba(0,91,255,0.35)]"
                  : "text-slate-300 hover:translate-x-1 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_22px_rgba(0,91,255,0.12)]"
              }`}
              key={category.id}
              type="button"
            >
              <Icon size={18} />
              <span className="flex-1">{category.name}</span>
              <ChevronRight size={16} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default CategorySidebar;
