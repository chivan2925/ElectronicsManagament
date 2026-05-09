import { MessageSquareText, Star } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Rating from "../ui/Rating";

function ProductReviews({ breakdown, product, reviews }) {
  const maxCount = Math.max(...breakdown.map((item) => item.count), 1);

  return (
    <section className="store-glass-soft rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <MessageSquareText size={13} />
            Đánh giá khách hàng
          </Badge>
          <h2 className="text-section">Người dùng nói gì</h2>
          <p className="text-muted mt-2 text-sm">Tổng hợp đánh giá theo trải nghiệm mua hàng tại ElectronicsManagement.</p>
        </div>
        <Button variant="outline">Viết đánh giá</Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-5 text-center shadow-inner shadow-white/[0.03]">
          <p className="text-5xl font-black text-white">{product.rating}</p>
          <Rating className="mt-2 justify-center" reviews={product.reviews} size="md" value={product.rating} />

          <div className="mt-5 grid gap-2">
            {breakdown.map((item) => (
              <div className="grid grid-cols-[42px_1fr_42px] items-center gap-2" key={item.star}>
                <span className="flex items-center gap-1 text-xs font-black text-slate-300">
                  {item.star}
                  <Star className="text-amber-300" fill="currentColor" size={12} />
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-blue-300"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </span>
                <span className="text-right text-xs font-bold text-slate-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {reviews.map((review) => (
            <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-4" key={review.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-white">{review.author}</p>
                    <Badge variant="success">Đã mua hàng</Badge>
                  </div>
                  <p className="text-caption mt-1 text-slate-400">{review.date} • {review.variant}</p>
                </div>
                <Rating value={review.rating} />
              </div>

              <h3 className="mt-3 text-sm font-black text-white">{review.title}</h3>
              <p className="text-muted mt-2 text-sm">{review.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductReviews;
