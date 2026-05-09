import {
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
} from "lucide-react";
import SectionTitle from "../ui/SectionTitle";

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

function FeaturedCategories({ categories = [] }) {
  const featuredCategories = categories.filter((category) => category.slug !== "tat-ca");

  return (
    <section>
      <SectionTitle
        actionLabel="Xem tất cả"
        subtitle="Chọn nhanh nhóm sản phẩm bạn đang cần."
        title="Danh mục nổi bật"
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-10">
        {featuredCategories.map((category) => {
          const Icon = categoryIcons[category.iconName] ?? Grid3X3;

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
