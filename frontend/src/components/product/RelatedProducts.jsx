import { Link } from "react-router-dom";
import { ArrowRight, PackageCheck } from "lucide-react";
import Badge from "../ui/Badge";
import Price from "../ui/Price";
import Rating from "../ui/Rating";

function RelatedProducts({ products }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="store-glass-soft rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-4 gap-2" variant="primary">
            <PackageCheck size={13} />
            Gợi ý cùng nhóm
          </Badge>
          <h2 className="text-section">Sản phẩm liên quan</h2>
          <p className="text-muted mt-2 text-sm">Các lựa chọn gần với sản phẩm bạn đang xem.</p>
        </div>
        <Link className="premium-transition inline-flex items-center gap-2 text-sm font-black text-blue-200 hover:text-white" to="/products">
          Xem tất cả
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            className="transition-default group rounded-3xl border border-white/10 bg-slate-950/35 p-3 shadow-inner shadow-white/[0.03] hover:-translate-y-1 hover:border-blue-300/60 hover:bg-blue-500/10 hover:shadow-[0_0_30px_rgba(0,91,255,0.18)]"
            key={product.id}
            to={`/products/${product.slug}`}
          >
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.22),rgba(15,23,42,0.75)_48%,rgba(2,6,23,0.94)_100%)] p-3">
              <img
                alt={product.name}
                className="premium-transition h-full w-full object-contain drop-shadow-[0_16px_34px_rgba(0,0,0,0.42)] group-hover:scale-105"
                src={product.image}
              />
            </div>

            <p className="text-caption mt-3 text-blue-200">{product.brand}</p>
            <h3 className="mt-1 line-clamp-2 min-h-[44px] text-sm font-black leading-snug text-white">{product.name}</h3>
            <div className="mt-2">
              <Rating reviews={product.reviews} value={product.rating} />
            </div>
            <Price className="mt-3" oldClassName="text-xs" oldValue={product.oldPrice} size="sm" value={product.price} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
