import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, LogIn, Send, ShieldCheck, Star, X } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { cn } from "../../utils/classNames";

const MAX_IMAGE_PLACEHOLDERS = 4;

function StarRatingInput({ onChange, value }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const activeRating = hoveredRating || value;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= activeRating;

          return (
            <button
              aria-label={`${star} sao`}
              className={cn(
                "transition-default rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                active ? "text-amber-300" : "text-slate-600 hover:text-amber-200",
              )}
              key={star}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              type="button"
            >
              <Star fill={active ? "currentColor" : "none"} size={24} />
            </button>
          );
        })}
      </div>
      <span className="text-sm font-bold text-slate-400">{value ? `${value}/5 sao` : "Chọn số sao"}</span>
    </div>
  );
}

function getCustomerName(user) {
  return user?.fullName || user?.name || user?.email || "Tài khoản của bạn";
}

function ReviewForm({ authLoading = false, isAuthenticated = false, onSubmit, productName, user }) {
  const [content, setContent] = useState("");
  const [imagePlaceholders, setImagePlaceholders] = useState([]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [touched, setTouched] = useState(false);
  const customerName = useMemo(() => getCustomerName(user), [user]);

  if (authLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-5 shadow-inner shadow-white/[0.03]">
        <div className="skeleton-shimmer h-6 w-32 rounded-full bg-white/[0.06]" />
        <div className="skeleton-shimmer mt-4 h-5 w-3/4 rounded-full bg-white/[0.06]" />
        <div className="skeleton-shimmer mt-3 h-20 rounded-2xl bg-white/[0.06]" />
      </div>
    );
  }

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="rounded-3xl border border-blue-300/20 bg-blue-500/[0.06] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="mb-3 gap-2" variant="primary">
              <ShieldCheck size={13} />
              Đánh giá xác thực
            </Badge>
            <h3 className="text-lg font-black text-white">Đăng nhập để viết đánh giá</h3>
            <p className="text-muted mt-1 text-sm">
              Tài khoản đã mua hàng có thể gửi đánh giá và được gắn nhãn xác thực sau khi hệ thống kiểm tra đơn.
            </p>
          </div>
          <Button as={Link} className="shrink-0" to="/login" variant="primary">
            <LogIn size={16} />
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const titleError = touched && title.trim().length > 0 && title.trim().length < 4;
  const contentError = touched && content.trim().length > 0 && content.trim().length < 12;
  const canSubmit = rating > 0 && title.trim().length >= 4 && content.trim().length >= 12;

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);

    if (!canSubmit) {
      return;
    }

    onSubmit?.({
      content: content.trim(),
      photos: imagePlaceholders.map((item) => ({
        id: item.id,
        label: item.label,
        placeholder: true,
      })),
      rating,
      title: title.trim(),
    });

    setContent("");
    setImagePlaceholders([]);
    setRating(0);
    setTitle("");
    setTouched(false);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, MAX_IMAGE_PLACEHOLDERS - imagePlaceholders.length);

    if (!files.length) {
      return;
    }

    setImagePlaceholders((currentItems) => [
      ...currentItems,
      ...files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}`,
        label: file.name,
      })),
    ]);
    event.target.value = "";
  };

  const removeImage = (id) => {
    setImagePlaceholders((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  return (
    <form className="rounded-3xl border border-white/10 bg-slate-950/35 p-5 shadow-inner shadow-white/[0.03]" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="mb-3 gap-2" variant="primary">
            <ShieldCheck size={13} />
            {customerName}
          </Badge>
          <h3 className="text-lg font-black text-white">Viết đánh giá cho {productName}</h3>
          <p className="text-muted mt-1 text-sm">Chia sẻ trải nghiệm thực tế để khách hàng khác chọn đúng sản phẩm.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label className="text-sm font-black text-white">Chọn số sao</label>
          <div className="mt-2">
            <StarRatingInput onChange={setRating} value={rating} />
          </div>
          {touched && rating <= 0 && <p className="text-caption mt-1 text-red-300">Vui lòng chọn số sao.</p>}
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-black text-white">Tiêu đề</span>
          <input
            className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition-default placeholder:text-slate-500 focus:border-blue-300/60 focus:bg-slate-950/45 focus:ring-2 focus:ring-blue-300/20"
            onBlur={() => setTouched(true)}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ví dụ: Hiệu năng tốt, giao hàng nhanh"
            value={title}
          />
          {titleError && <span className="text-caption text-red-300">Tiêu đề cần ít nhất 4 ký tự.</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black text-white">Nội dung đánh giá</span>
          <textarea
            className="min-h-28 resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold leading-6 text-white outline-none transition-default placeholder:text-slate-500 focus:border-blue-300/60 focus:bg-slate-950/45 focus:ring-2 focus:ring-blue-300/20"
            onBlur={() => setTouched(true)}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Bạn thích điểm nào, sản phẩm có đúng mô tả không, đóng gói và giao hàng ra sao?"
            value={content}
          />
          {contentError && <span className="text-caption text-red-300">Nội dung cần ít nhất 12 ký tự.</span>}
        </label>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-black text-white">Ảnh đánh giá</p>
            <label className="transition-default inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-black text-slate-200 hover:border-blue-300/50 hover:bg-blue-500/10 hover:text-white">
              <Camera size={15} />
              Thêm ảnh
              <input
                accept="image/*"
                className="sr-only"
                disabled={imagePlaceholders.length >= MAX_IMAGE_PLACEHOLDERS}
                multiple
                onChange={handleImageChange}
                type="file"
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {imagePlaceholders.map((item) => (
              <div
                className="relative flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-blue-300/25 bg-blue-500/[0.06] p-2 text-center"
                key={item.id}
              >
                <button
                  aria-label={`Xóa ảnh ${item.label}`}
                  className="absolute right-2 top-2 rounded-lg bg-slate-950/80 p-1 text-slate-300 transition-default hover:text-white"
                  onClick={() => removeImage(item.id)}
                  type="button"
                >
                  <X size={13} />
                </button>
                <div>
                  <Camera className="mx-auto text-blue-200" size={20} />
                  <p className="mt-1 line-clamp-2 text-[11px] font-bold text-slate-400">{item.label}</p>
                </div>
              </div>
            ))}

            {imagePlaceholders.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-slate-500">
                Ảnh đánh giá là tùy chọn. Bạn có thể thêm tối đa {MAX_IMAGE_PLACEHOLDERS} ảnh.
              </div>
            )}
          </div>
        </div>

        <Button className="w-full sm:w-fit" disabled={!canSubmit} type="submit">
          <Send size={16} />
          Gửi đánh giá
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;
