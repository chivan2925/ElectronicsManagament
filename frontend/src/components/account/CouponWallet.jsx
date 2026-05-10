import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock3, Copy, Gift, Percent, Sparkles, TicketPercent, WalletCards } from "lucide-react";
import { fadeUp, motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const MotionDiv = motion.div;

const defaultCoupons = [
  {
    code: "GEAR10",
    description: "Giảm cho bàn phím, chuột, tai nghe và phụ kiện gaming.",
    discount: "10%",
    expiresAt: "31/05",
    minOrder: 1000000,
    status: "Sẵn sàng",
    title: "Gear starter",
  },
  {
    code: "PCBUILD",
    description: "Ưu đãi cho đơn PC Gaming, linh kiện và combo nâng cấp.",
    discount: "500K",
    expiresAt: "15/06",
    minOrder: 15000000,
    status: "Elite",
    title: "Build PC bonus",
  },
  {
    code: "FREESHIP",
    description: "Miễn phí vận chuyển cho đơn hàng đủ điều kiện trong nội thành.",
    discount: "Ship",
    expiresAt: "30/06",
    minOrder: 2000000,
    status: "Tự động",
    title: "Freeship gaming",
  },
];

const defaultOffers = [
  {
    icon: Sparkles,
    label: "Member early access",
    text: "Mở sớm deal laptop gaming và PC custom trong các đợt flash sale.",
  },
  {
    icon: Gift,
    label: "Birthday reward",
    text: "Quà sinh nhật sẽ được mở khi hồ sơ có đủ ngày sinh.",
  },
];

function CouponCard({ coupon, copiedCode, onCopy }) {
  const isCopied = copiedCode === coupon.code;

  return (
    <MotionDiv
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-inner shadow-white/[0.03]"
      variants={fadeUp}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/16 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/12 text-blue-100 shadow-[0_0_24px_rgba(0,91,255,0.18)]">
              <Percent size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">{coupon.title}</p>
              <p className="text-caption mt-1 text-slate-400">{coupon.description}</p>
            </div>
          </div>

          <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-100">
            {coupon.discount}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/34 p-3">
            <p className="text-caption text-slate-500">Mã</p>
            <p className="mt-1 font-mono text-sm font-black tracking-[0.16em] text-white">{coupon.code}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/34 p-3">
            <p className="text-caption text-slate-500">Đơn tối thiểu</p>
            <p className="mt-1 text-sm font-black text-white">{formatCurrency(coupon.minOrder)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/34 p-3">
            <p className="text-caption text-slate-500">Hạn dùng</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-white">
              <Clock3 className="text-blue-200" size={14} />
              {coupon.expiresAt}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-100">
            <TicketPercent size={13} />
            {coupon.status}
          </span>
          <button
            className="premium-transition inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-black text-slate-200 outline-none hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            onClick={() => onCopy(coupon.code)}
            type="button"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            {isCopied ? "Đã lưu mã" : "Sao chép mã"}
          </button>
        </div>
      </div>
    </MotionDiv>
  );
}

function CouponWallet({ className, coupons = defaultCoupons, offers = defaultOffers }) {
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = async (code) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // Keep the wallet interaction responsive even when clipboard access is unavailable.
    }

    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode((currentCode) => (currentCode === code ? "" : currentCode)), 1600);
  };

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
            <WalletCards size={13} />
            Coupon wallet
          </Badge>
          <h2 className="text-section text-xl">Ví voucher</h2>
          <p className="text-muted mt-2 text-sm">Các mã ưu đãi và quyền lợi đặc biệt được gom trong khu vực thành viên.</p>
        </div>

        <Button as={Link} className="rounded-2xl" to="/cart" variant="outline">
          Dùng voucher
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-5 grid gap-3">
        {coupons.map((coupon) => (
          <CouponCard copiedCode={copiedCode} coupon={coupon} key={coupon.code} onCopy={handleCopy} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {offers.map((offer) => {
          const Icon = offer.icon || Sparkles;

          return (
            <MotionDiv
              className={cn(
                "rounded-2xl border border-blue-300/15 bg-blue-500/[0.055] p-4 shadow-inner shadow-white/[0.03]",
                "hover:border-blue-300/35 hover:bg-blue-500/[0.08]",
              )}
              key={offer.label}
              variants={fadeUp}
            >
              <Icon className="text-blue-200 drop-shadow-[0_0_14px_rgba(0,91,255,0.46)]" size={21} />
              <p className="mt-3 text-sm font-black text-white">{offer.label}</p>
              <p className="text-muted mt-1 text-sm">{offer.text}</p>
            </MotionDiv>
          );
        })}
      </div>
    </MotionDiv>
  );
}

export default CouponWallet;
