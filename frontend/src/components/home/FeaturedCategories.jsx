import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
import { fadeIn, fadeUp, hoverGlow, motionViewport, staggerContainer, tapSoft } from "../../styles/animations";
import SectionTitle from "../ui/SectionTitle";

const MotionDiv = motion.div;
const MotionLink = motion(Link);
const MotionSection = motion.section;

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
    <MotionSection className="section-visual" initial="hidden" variants={fadeIn} viewport={motionViewport} whileInView="visible">
      <SectionTitle
        actionHref="/products"
        actionLabel="Xem tất cả"
        subtitle="Chọn nhanh nhóm sản phẩm bạn đang cần."
        title="Danh mục nổi bật"
      />

      <MotionDiv className="grid-categories" variants={staggerContainer}>
        {featuredCategories.map((category) => {
          const Icon = categoryIcons[category.iconName] ?? Grid3X3;

          return (
            <MotionLink
              className="premium-transition group relative min-h-[108px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,91,255,0.16),transparent_44%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(7,17,31,0.94))] p-3 text-left shadow-xl shadow-black/18 backdrop-blur-xl hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-[0_0_34px_rgba(0,91,255,0.22),0_20px_50px_rgba(0,0,0,0.3)] sm:p-4"
              key={category.id}
              to={`/categories/${category.slug}`}
              variants={{ ...fadeUp, hover: hoverGlow }}
              whileHover="hover"
              whileTap={tapSoft}
            >
              <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-blue-100/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="premium-transition mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 group-hover:bg-[#005BFF] group-hover:text-white group-hover:shadow-[0_0_28px_rgba(0,91,255,0.42)] sm:mb-4">
                <Icon size={21} />
              </div>
              <p className="break-words text-sm font-black leading-snug text-white">{category.name}</p>
            </MotionLink>
          );
        })}
      </MotionDiv>
    </MotionSection>
  );
}

export default FeaturedCategories;
