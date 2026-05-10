import {
  Armchair,
  Boxes,
  ChevronRight,
  Cpu,
  Gamepad2,
  Grid3X3,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Phone,
  SquareMousePointer,
} from "lucide-react";
import { Link } from "react-router-dom";

const categoryIcons = {
  Armchair,
  Boxes,
  Cpu,
  Gamepad2,
  Grid3X3,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Phone,
  SquareMousePointer,
};

function CategorySidebar({ categories = [] }) {
  return (
    <aside className="store-glass hidden rounded-2xl p-3 lg:block">
      <div className="mb-2 px-3 py-2">
        <p className="text-sm font-black text-white">Danh mục sản phẩm</p>
        <p className="mt-1 text-xs font-medium text-slate-400">Thiết bị điện tử & gaming</p>
      </div>

      <div className="space-y-1">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.iconName] ?? Grid3X3;
          const isActive = index === 0;

          return (
            <Link
              className={`premium-transition flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                isActive
                  ? "bg-[#005BFF] text-white shadow-[0_0_28px_rgba(0,91,255,0.35)]"
                  : "text-slate-300 hover:translate-x-1 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_22px_rgba(0,91,255,0.12)]"
              }`}
              key={category.id}
              to={category.slug === "tat-ca" ? "/products" : `/categories/${category.slug}`}
            >
              <Icon size={18} />
              <span className="flex-1">{category.name}</span>
              <ChevronRight size={16} />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export default CategorySidebar;
