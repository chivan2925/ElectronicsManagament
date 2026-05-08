import { ChevronRight } from "lucide-react";
import { categories } from "../data/mockData";

function CategorySidebar() {
  return (
    <aside className="hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-[#07111F] p-3 shadow-2xl shadow-black/20 lg:block">
      <div className="mb-2 px-3 py-2">
        <p className="text-sm font-black text-white">Danh mục sản phẩm</p>
        <p className="mt-1 text-xs text-slate-500">Thiết bị điện tử & gaming</p>
      </div>

      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                category.active
                  ? "bg-[#005BFF] text-white shadow-lg shadow-blue-950/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
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
