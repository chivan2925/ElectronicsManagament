import { motion } from "framer-motion";
import { Crown, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import { fadeUp, hoverGlow } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import Badge from "../ui/Badge";

const MotionArticle = motion.article;

function getDisplayName(profile) {
  return profile?.fullName || profile?.username || profile?.email || "Electro member";
}

function getMemberCode(profile) {
  const source = String(profile?.id || profile?.username || profile?.email || "EM0000");
  const compactSource = source.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();

  return `EM-${compactSource.padStart(6, "0")}`;
}

function LoyaltyCard({
  className,
  level = {
    accent: "Neon Blue",
    current: "Elite",
    next: "Quantum",
    progress: 64,
    rank: "LV.03",
  },
  perks = ["Ưu tiên săn sale", "Voucher sinh nhật", "Hỗ trợ đơn hàng nhanh"],
  points = 12800,
  profile,
}) {
  const safeProgress = Math.max(0, Math.min(Number(level.progress) || 0, 100));
  const memberName = getDisplayName(profile);
  const memberCode = getMemberCode(profile);

  return (
    <MotionArticle
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-blue-300/20 bg-[radial-gradient(circle_at_18%_0%,rgba(0,91,255,0.38),transparent_34%),radial-gradient(circle_at_92%_12%,rgba(34,211,238,0.16),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(7,17,31,0.98))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),0_0_42px_rgba(0,91,255,0.14)] backdrop-blur-xl lg:p-6",
        className,
      )}
      initial="hidden"
      variants={{ ...fadeUp, hover: hoverGlow }}
      whileHover="hover"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_32%,rgba(0,91,255,0.12))]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-400/18 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />

      <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_280px] xl:items-stretch">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge className="gap-2" variant="primary">
              <Crown size={13} />
              Membership
            </Badge>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-100">
              {level.rank}
            </span>
          </div>

          <div className="mt-5">
            <p className="text-caption text-blue-200">Hạng thành viên</p>
            <h2 className="mt-1 text-3xl font-black tracking-normal text-white sm:text-4xl">{level.current}</h2>
            <p className="text-muted mt-2 max-w-xl text-sm">
              Trải nghiệm thành viên dành cho khách hàng thường xuyên mua gear, laptop và phụ kiện gaming.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/38 p-4 shadow-inner shadow-white/[0.03]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-caption text-slate-500">Điểm hiện có</p>
                <p className="mt-1 text-2xl font-black text-white">{points.toLocaleString("vi-VN")}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/12 text-blue-100 shadow-[0_0_24px_rgba(0,91,255,0.18)]">
                <Zap size={22} />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3 text-xs font-black">
                <span className="text-slate-400">{level.current}</span>
                <span className="text-blue-200">{level.next}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <motion.div
                  animate={{ width: `${safeProgress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-emerald-300 shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="text-caption mt-2 text-slate-500">{safeProgress}% tiến độ lên hạng tiếp theo</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(0,91,255,0.34),rgba(2,6,23,0.82)_52%,rgba(15,23,42,0.96))] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(34,211,238,0.24),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-blue-100">ElectroPlus</p>
                <p className="text-caption mt-1 text-slate-300">Digital member card</p>
              </div>
              <Sparkles className="text-cyan-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.55)]" size={24} />
            </div>

            <div>
              <p className="truncate text-lg font-black text-white">{memberName}</p>
              <p className="mt-1 font-mono text-sm font-black tracking-[0.18em] text-blue-100">{memberCode}</p>
            </div>

            <div className="grid gap-2">
              {perks.slice(0, 3).map((perk) => (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200" key={perk}>
                  <ShieldCheck className="text-emerald-200" size={14} />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-caption text-slate-400">{level.accent}</span>
              <span className="flex items-center gap-1 text-xs font-black text-amber-100">
                <Star fill="currentColor" size={13} />
                {level.current}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MotionArticle>
  );
}

export default LoyaltyCard;
