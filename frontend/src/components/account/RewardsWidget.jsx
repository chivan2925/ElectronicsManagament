import { motion } from "framer-motion";
import { ArrowRight, Gift, Sparkles, Star, Target, Trophy, Zap } from "lucide-react";
import { fadeUp, motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const MotionDiv = motion.div;

const defaultMilestones = [
  { label: "Đổi voucher", points: 5000, reached: true },
  { label: "Free ship", points: 9000, reached: true },
  { label: "Quà gaming", points: 15000, reached: false },
];

const defaultStats = [
  {
    icon: Zap,
    label: "Điểm khả dụng",
    value: "12.800",
  },
  {
    icon: Trophy,
    label: "Điểm chờ cộng",
    value: "1.240",
  },
  {
    icon: Gift,
    label: "Sắp hết hạn",
    value: "0",
  },
];

function RewardStat({ icon, label, value }) {
  const StatIcon = icon;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-inner shadow-white/[0.03]">
      <div className="flex items-center justify-between gap-3">
        <StatIcon className="text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.46)]" size={20} />
        <Star className="text-slate-600" size={15} />
      </div>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
      <p className="text-caption mt-1 text-slate-500">{label}</p>
    </div>
  );
}

function RewardsWidget({
  className,
  milestones = defaultMilestones,
  nextReward = {
    description: "Dùng điểm để đổi voucher cho phụ kiện, bàn phím, chuột hoặc đơn PC Gaming.",
    pointsNeeded: 2200,
    title: "Còn 2.200 điểm để mở quà gaming",
  },
  stats = defaultStats,
}) {
  return (
    <MotionDiv
      animate="visible"
      className={cn(
        "rounded-3xl border border-white/10 bg-slate-950/36 p-5 shadow-inner shadow-white/[0.03] backdrop-blur-xl lg:p-6",
        className,
      )}
      initial="hidden"
      variants={staggerContainer}
      viewport={motionViewport}
      whileInView="visible"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <Sparkles size={13} />
            Reward points
          </Badge>
          <h2 className="text-section text-xl">Điểm thưởng</h2>
          <p className="text-muted mt-2 text-sm">Theo dõi điểm, mốc đổi quà và quyền lợi sắp mở trong khu vực tài khoản.</p>
        </div>

        <Button as="a" className="rounded-2xl" href="/products" variant="outline">
          Tích điểm
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <MotionDiv key={stat.label} variants={fadeUp}>
            <RewardStat {...stat} />
          </MotionDiv>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-blue-300/15 bg-blue-500/[0.055] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-white">
              <Target className="text-blue-200" size={18} />
              {nextReward.title}
            </p>
            <p className="text-muted mt-2 text-sm">{nextReward.description}</p>
          </div>
          <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-100">
            {Number(nextReward.pointsNeeded || 0).toLocaleString("vi-VN")} điểm
          </span>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {milestones.map((milestone) => (
            <div
              className={cn(
                "rounded-2xl border p-3",
                milestone.reached
                  ? "border-emerald-300/20 bg-emerald-500/10"
                  : "border-white/10 bg-slate-950/34",
              )}
              key={milestone.label}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-black text-white">{milestone.label}</span>
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    milestone.reached ? "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.75)]" : "bg-slate-600",
                  )}
                />
              </div>
              <p className="text-caption mt-1 text-slate-400">{milestone.points.toLocaleString("vi-VN")} điểm</p>
            </div>
          ))}
        </div>
      </div>
    </MotionDiv>
  );
}

export default RewardsWidget;
