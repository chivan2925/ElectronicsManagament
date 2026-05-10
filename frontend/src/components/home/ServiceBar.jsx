import { motion } from "framer-motion";
import { CreditCard, Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { fadeUp, hoverLift, motionViewport, staggerContainer, tapSoft } from "../../styles/animations";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const serviceIcons = {
  CreditCard,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
};

function ServiceBar({ services = [] }) {
  return (
    <MotionSection
      className="section-visual store-glass-soft grid gap-3 rounded-2xl p-3 sm:grid-cols-2 lg:grid-cols-5"
      initial="hidden"
      variants={staggerContainer}
      viewport={motionViewport}
      whileInView="visible"
    >
      {services.map((service) => {
        const Icon = serviceIcons[service.iconName] ?? Truck;

        return (
          <MotionDiv className="store-premium-sheen premium-transition group flex items-center gap-3 rounded-xl bg-[#07111F]/80 p-3 ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-blue-500/10 hover:ring-blue-300/40 hover:shadow-[0_0_28px_rgba(0,91,255,0.18)] last:sm:col-span-2 last:lg:col-span-1 sm:p-4" key={service.id} variants={fadeUp} whileHover={hoverLift} whileTap={tapSoft}>
            <div className="premium-transition flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 group-hover:scale-105 group-hover:bg-blue-500/20 group-hover:text-blue-100">
              <Icon size={21} />
            </div>
            <div>
              <p className="text-card-title">{service.title}</p>
              <p className="text-muted text-caption mt-1">{service.description}</p>
            </div>
          </MotionDiv>
        );
      })}
    </MotionSection>
  );
}

export default ServiceBar;
