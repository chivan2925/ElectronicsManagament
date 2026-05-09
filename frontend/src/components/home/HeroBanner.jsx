import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { fadeIn, fadeUp, hoverLift, imageZoom, staggerContainer, tapSoft } from "../../styles/animations";
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
      className="relative isolate min-h-[520px] overflow-hidden rounded-2xl border border-blue-200/15 bg-[radial-gradient(circle_at_82%_22%,rgba(0,91,255,0.52),transparent_32%),radial-gradient(circle_at_18%_80%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_48%_0%,rgba(255,255,255,0.1),transparent_24%),linear-gradient(135deg,#0D1A34_0%,#07111F_48%,#050B14_100%)] p-6 shadow-[0_34px_100px_rgba(0,0,0,0.44),0_0_46px_rgba(0,91,255,0.16)] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_24%,transparent_70%,rgba(0,91,255,0.18))] before:opacity-70 lg:p-9"
      initial="hidden"
      variants={fadeIn}
    >
      <div className="pointer-events-none absolute -right-28 top-6 h-80 w-80 rounded-full bg-blue-500/24 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-100/50 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050B14]/72 to-transparent" />

      <div className="relative z-10 grid h-full gap-8 lg:grid-cols-[1fr_0.8fr]">
        <MotionDiv className="flex max-w-xl flex-col justify-center" variants={staggerContainer}>
          <MotionDiv variants={fadeUp}>
            <Badge className="mb-5 border-blue-200/50 bg-blue-500/20 shadow-[0_0_30px_rgba(0,91,255,0.34)]" variant="primary">
              {promotion.badge}
            </Badge>
          </MotionDiv>

          <MotionH1 className="text-display max-w-[10ch] drop-shadow-[0_0_34px_rgba(255,255,255,0.14)]" variants={fadeUp}>
            {promotion.title}
          </MotionH1>
          <MotionP className="mt-4 text-xl font-semibold leading-relaxed text-blue-100 drop-shadow-[0_0_18px_rgba(0,91,255,0.2)] lg:text-2xl" variants={fadeUp}>{promotion.subtitle}</MotionP>

          <MotionUl className="mt-7 space-y-3" variants={staggerContainer}>
            {promotion.features.map((feature) => (
              <MotionLi className="text-muted flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm shadow-inner shadow-white/[0.03] backdrop-blur-xl" key={feature} variants={fadeUp}>
                <CheckCircle2 className="text-emerald-300 drop-shadow-[0_0_12px_rgba(110,231,183,0.45)]" size={19} />
                {feature}
              </MotionLi>
            ))}
          </MotionUl>

          <MotionDiv className="mt-8 flex flex-wrap gap-3" variants={fadeUp}>
            <MotionDiv whileHover={hoverLift} whileTap={tapSoft}>
              <Button className="shadow-[0_0_42px_rgba(0,91,255,0.56),0_16px_40px_rgba(0,0,0,0.28)]" size="lg">Mua ngay</Button>
            </MotionDiv>
            <MotionDiv whileHover={hoverLift} whileTap={tapSoft}>
              <Button className="border-blue-200/30 bg-white/[0.045]" size="lg" variant="outline">Xem chi tiết</Button>
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv className="flex-center relative min-h-[320px] lg:justify-end" variants={fadeUp}>
          <div className="absolute right-0 h-[340px] w-[340px] rounded-full border border-blue-100/10 bg-[radial-gradient(circle_at_50%_42%,rgba(96,165,250,0.2),rgba(0,91,255,0.14)_42%,transparent_70%)] shadow-[inset_0_0_60px_rgba(255,255,255,0.04),0_0_80px_rgba(0,91,255,0.22)]" />
          <div className="absolute bottom-9 right-4 h-16 w-72 rounded-full bg-blue-500/24 blur-2xl" />
          <MotionImg
            alt={promotion.imageAlt}
            className="premium-transition relative z-10 max-h-[390px] w-full max-w-[390px] object-contain drop-shadow-[0_34px_72px_rgba(0,91,255,0.36)] hover:scale-[1.03] lg:translate-x-2"
            src={promotion.image}
            whileHover={imageZoom}
          />
        </MotionDiv>
      </div>

      <IconButton aria-label="Slide trước" className="absolute left-5 top-1/2 hidden -translate-y-1/2 lg:flex" size="sm" variant="outline">
        <ArrowLeft size={18} />
      </IconButton>
      <IconButton aria-label="Slide sau" className="absolute right-5 top-1/2 hidden -translate-y-1/2 lg:flex" size="sm" variant="outline">
        <ArrowRight size={18} />
      </IconButton>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-2 w-8 rounded-full bg-[#005BFF] shadow-[0_0_18px_rgba(0,91,255,0.7)]" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
        <span className="premium-transition h-2 w-2 rounded-full bg-slate-600 hover:bg-blue-300" />
      </div>
    </MotionSection>
  );
}

export default HeroBanner;
