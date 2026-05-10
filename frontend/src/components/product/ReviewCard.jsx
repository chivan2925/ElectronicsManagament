import { useState } from "react";
import { Camera, CheckCircle2, Clock3, Image as ImageIcon, ThumbsUp } from "lucide-react";
import Badge from "../ui/Badge";
import Rating from "../ui/Rating";
import { cn } from "../../utils/classNames";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "KH";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatReviewDate(value) {
  if (!value || value === "Đang cập nhật") {
    return "Đang cập nhật";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function ReviewPhoto({ photo, reviewTitle }) {
  const isPlaceholder = typeof photo !== "string";
  const label = isPlaceholder ? photo.label : reviewTitle;

  if (isPlaceholder) {
    return (
      <div className="flex aspect-square min-h-20 items-center justify-center rounded-2xl border border-dashed border-blue-300/25 bg-blue-500/[0.06] p-2 text-center">
        <div>
          <Camera className="mx-auto text-blue-200" size={20} />
          <p className="mt-1 line-clamp-2 text-[11px] font-bold text-slate-400">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      alt={label}
      className="aspect-square min-h-20 rounded-2xl border border-white/10 bg-slate-950/60 object-cover"
      loading="lazy"
      src={photo}
    />
  );
}

function ReviewCard({ className, review }) {
  const [hasVoted, setHasVoted] = useState(false);
  const helpfulCount = Number(review.helpfulCount || 0) + (hasVoted ? 1 : 0);
  const photos = Array.isArray(review.photos) ? review.photos : [];

  return (
    <article className={cn("rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-inner shadow-white/[0.02]", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/12 text-sm font-black text-blue-100 shadow-[0_0_28px_rgba(0,91,255,0.16)]">
            {getInitials(review.author)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-black text-white">{review.author}</p>
              {review.verifiedPurchase && (
                <Badge className="gap-1.5" variant="success">
                  <CheckCircle2 size={12} />
                  Đã mua hàng
                </Badge>
              )}
              {review.pending && (
                <Badge className="gap-1.5" variant="warning">
                  <Clock3 size={12} />
                  Đang ghi nhận
                </Badge>
              )}
            </div>
            <p className="text-caption mt-1 text-slate-400">
              {formatReviewDate(review.date)}
              {review.variant ? ` • ${review.variant}` : ""}
            </p>
          </div>
        </div>

        <Rating value={review.rating} />
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-black text-white">{review.title}</h3>
        <p className="text-muted mt-2 text-sm leading-6">{review.content}</p>
      </div>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.slice(0, 5).map((photo, index) => (
            <ReviewPhoto key={`${review.id}-photo-${index}`} photo={photo} reviewTitle={review.title} />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-caption inline-flex items-center gap-2 text-slate-500">
          <ImageIcon size={14} />
          {photos.length ? `${photos.length} ảnh đánh giá` : "Chưa có ảnh đánh giá"}
        </span>

        <button
          aria-pressed={hasVoted}
          className={cn(
            "transition-default inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-black outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
            hasVoted
              ? "border-blue-300/50 bg-blue-500/12 text-blue-100"
              : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white",
          )}
          onClick={() => setHasVoted((current) => !current)}
          type="button"
        >
          <ThumbsUp size={14} />
          Hữu ích
          {helpfulCount > 0 && <span className="text-slate-400">({helpfulCount})</span>}
        </button>
      </div>
    </article>
  );
}

export default ReviewCard;
