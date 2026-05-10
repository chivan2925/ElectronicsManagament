import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";
import { fadeIn, fadeUp, hoverLift, imageZoom, staggerContainer, tapSoft } from "../../styles/animations";
import OptimizedImage from "../common/OptimizedImage";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionImg = motion.img;
const MotionLi = motion.li;
const MotionP = motion.p;
const MotionSection = motion.section;
const MotionUl = motion.ul;

function HeroBanner({ promotion }) {
  return (
    <MotionSection
      animate="visible"
      className="relative isolate min-h-0 overflow-hidden rounded-2xl border border-blue-200/15 bg-[radial-gradient(circle_at_82%_22%,rgba(0,91,255,0.52),transparent_32%),radial-gradient(circle_at_18%_80%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_48%_0%,rgba(255,255,255,0.1),transparent_24%),linear-gradient(135deg,#0D1A34_0%,#07111F_48%,#050B14_100%)] p-5 shadow-[0_34px_100px_rgba(0,0,0,0.44),0_0_46px_rgba(0,91,255,0.16)] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_24%,transparent_70%,rgba(0,91,255,0.18))] before:opacity-70 sm:p-6 md:min-h-[500px] lg:p-8 xl:min-h-[520px] xl:p-9"
      initial="hidden"
      variants={fadeIn}
    >
      <div className="pointer-events-none absolute -right-24 top-6 h-64 w-64 rounded-full bg-blue-500/24 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-100/50 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050B14]/72 to-transparent" />

      <div className="relative z-10 grid h-full gap-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.82fr)] md:items-center lg:gap-8">
        <MotionDiv className="flex max-w-xl flex-col justify-center" variants={staggerContainer}>
          <MotionDiv variants={fadeUp}>
            <Badge className="mb-4 border-blue-200/50 bg-blue-500/20 shadow-[0_0_30px_rgba(0,91,255,0.34)] sm:mb-5" variant="primary">
              {promotion.badge}
            </Badge>
          </MotionDiv>

          <MotionH1 className="text-display max-w-[10ch] drop-shadow-[0_0_34px_rgba(255,255,255,0.14)]" variants={fadeUp}>
            {promotion.title}
          </MotionH1>
          <MotionP className="mt-3 text-lg font-semibold leading-relaxed text-blue-100 drop-shadow-[0_0_18px_rgba(0,91,255,0.2)] sm:mt-4 sm:text-xl lg:text-2xl" variants={fadeUp}>{promotion.subtitle}</MotionP>

          <MotionUl className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-3" variants={staggerContainer}>
            {promotion.features.map((feature) => (
              <MotionLi className="text-muted flex w-full items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm shadow-inner shadow-white/[0.03] backdrop-blur-xl sm:w-fit sm:items-center sm:gap-3" key={feature} variants={fadeUp}>
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300 drop-shadow-[0_0_12px_rgba(110,231,183,0.45)] sm:mt-0" size={19} />
                {feature}
              </MotionLi>
            ))}
          </MotionUl>

          <MotionDiv className="mt-6 flex flex-wrap gap-3 sm:mt-8" variants={fadeUp}>
            <MotionDiv whileHover={hoverLift} whileTap={tapSoft}>
              <Button as={Link} className="shadow-[0_0_42px_rgba(0,91,255,0.56),0_16px_40px_rgba(0,0,0,0.28)]" size="lg" to="/products">
                <ShoppingBag size={18} />
                Mua ngay
              </Button>
            </MotionDiv>
            <MotionDiv whileHover={hoverLift} whileTap={tapSoft}>
              <Button as={Link} className="border-blue-200/30 bg-white/[0.045]" size="lg" to="/products?sort=best-selling" variant="outline">
                Xem chi tiết
                <ArrowRight size={18} />
              </Button>
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv className="flex-center relative min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[320px] lg:justify-end" variants={fadeUp}>
          <div className="absolute right-1/2 h-56 w-56 translate-x-1/2 rounded-full border border-blue-100/10 bg-[radial-gradient(circle_at_50%_42%,rgba(96,165,250,0.2),rgba(0,91,255,0.14)_42%,transparent_70%)] shadow-[inset_0_0_60px_rgba(255,255,255,0.04),0_0_80px_rgba(0,91,255,0.22)] sm:h-72 sm:w-72 lg:right-0 lg:h-[340px] lg:w-[340px] lg:translate-x-0" />
          <div className="absolute bottom-8 right-1/2 h-12 w-48 translate-x-1/2 rounded-full bg-blue-500/24 blur-2xl sm:h-16 sm:w-72 lg:right-4 lg:translate-x-0" />
          <OptimizedImage
            as={MotionImg}
            alt={promotion.imageAlt}
            className="premium-transition relative z-10 max-h-[250px] w-full max-w-[300px] object-contain drop-shadow-[0_34px_72px_rgba(0,91,255,0.36)] hover:scale-[1.03] sm:max-h-[300px] sm:max-w-[340px] lg:max-h-[390px] lg:max-w-[390px] lg:translate-x-2"
            priority
            sizes="(max-width: 768px) 300px, 390px"
            src={promotion.image}
            whileHover={imageZoom}
          />
        </MotionDiv>
      </div>

      <IconButton aria-label="Slide trước" className="absolute bottom-5 left-5 hidden lg:flex" size="sm" variant="outline">
        <ArrowLeft size={18} />
      </IconButton>
      <IconButton aria-label="Slide sau" className="absolute bottom-5 right-5 hidden lg:flex" size="sm" variant="outline">
        <ArrowRight size={18} />
      </IconButton>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
        <span className="h-2 w-8 rounded-full bg-[#005BFF] shadow-[0_0_18px_rgba(0,91,255,0.7)]" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
      </div>
    </MotionSection>
  );
}

export default HeroBanner;
