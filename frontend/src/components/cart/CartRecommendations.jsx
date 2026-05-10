import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Sparkles, Star } from "lucide-react";
import productService from "../../api/productService";
import { useCart } from "../../cart";
import { fadeUp, motionViewport, staggerContainer } from "../../styles/animations";
import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";
import { getProductAliases } from "../../utils/productIdentity";
import OptimizedImage from "../common/OptimizedImage";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { useToast } from "../ui/toast";

const MotionDiv = motion.div;

const complementaryCategories = {
  "điện thoại": ["tai nghe", "phụ kiện gaming"],
  laptop: ["chuột", "bàn phím", "lót chuột", "tai nghe"],
  "tai nghe": ["chuột", "bàn phím", "phụ kiện gaming"],
  "chuột": ["lót chuột", "bàn phím", "tai nghe"],
  "bàn phím": ["chuột", "lót chuột", "tai nghe"],
  "PC Gaming": ["chuột", "bàn phím", "tai nghe", "ghế gaming", "linh kiện PC"],
  "máy bộ": ["chuột", "bàn phím", "lót chuột", "tai nghe"],
  "linh kiện PC": ["PC Gaming", "phụ kiện gaming"],
  "ghế gaming": ["chuột", "bàn phím", "tai nghe"],
  "phụ kiện gaming": ["tai nghe", "chuột", "bàn phím"],
};

function getCartRecommendationProducts(items = [], catalogProducts = [], limit = 8) {
  const cartAliases = new Set(items.flatMap((item) => getProductAliases(item.product)));
  const cartCategories = new Set(items.map((item) => item.product?.category).filter(Boolean));
  const preferredCategories = Array.from(cartCategories).flatMap((category) => complementaryCategories[category] || []);

  return catalogProducts
    .filter((product) => product.stock > 0 && !getProductAliases(product).some((alias) => cartAliases.has(alias)))
    .map((product) => {
      const preferredIndex = preferredCategories.indexOf(product.category);
      const score =
        (preferredIndex >= 0 ? 120 - preferredIndex * 8 : 0) +
        (cartCategories.has(product.category) ? 20 : 0) +
        (product.sold || 0) * 0.5 +
        (product.rating || 0) * 20 +
        (product.discount ? 24 : 0);

      return { product, score };
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map((item) => item.product);
}

function RecommendationMiniCard({ onAdd, product }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/38 p-3 shadow-inner shadow-white/[0.03] transition-default hover:-translate-y-0.5 hover:border-blue-300/45 hover:bg-blue-500/[0.07]">
      <Link
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,91,255,0.22),rgba(15,23,42,0.78)_52%,rgba(2,6,23,0.96)_100%)] p-2"
        to={`/products/${product.slug}`}
      >
        <div className="pointer-events-none absolute inset-x-5 bottom-3 h-8 rounded-full bg-blue-500/20 blur-xl" />
        <OptimizedImage
          alt={product.name}
          className="premium-transition relative z-10 h-full w-full object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.42)] group-hover:scale-105"
          fallbackKind="product"
          placeholderClassName="rounded-lg bg-slate-950/70"
          sizes="238px"
          src={product.image}
          wrapperClassName="relative z-10 flex h-full w-full items-center justify-center rounded-lg"
        />
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <p className="text-caption truncate text-blue-200">{product.brand}</p>
          <span className="inline-flex items-center gap-1 text-xs font-black text-amber-200">
            <Star fill="currentColor" size={12} />
            {product.rating}
          </span>
        </div>
        <Link className="mt-1 line-clamp-2 min-h-[40px] text-sm font-black leading-snug text-white hover:text-blue-100" to={`/products/${product.slug}`}>
          {product.name}
        </Link>
        <p className="mt-2 text-sm font-black text-blue-100">{formatCurrency(product.price)}</p>
        <Button className="mt-3 h-10 rounded-xl px-3 py-0 text-xs" fullWidth onClick={() => onAdd(product)}>
          <Plus size={15} />
          Thêm nhanh
        </Button>
      </div>
    </div>
  );
}

function CartRecommendations({ className, compact = false, items = [], limit = 8 }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [catalogProducts, setCatalogProducts] = useState([]);

  useEffect(() => {
    let isActive = true;

    productService
      .getCatalogProducts({
        page: 0,
        size: 24,
        sort: "featured",
        status: "ACTIVE",
      })
      .then((page) => {
        if (isActive) {
          setCatalogProducts(page.items);
        }
      })
      .catch(() => {
        if (isActive) {
          setCatalogProducts([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const recommendations = useMemo(
    () => getCartRecommendationProducts(items, catalogProducts, limit),
    [catalogProducts, items, limit],
  );

  const handleAddRecommendation = async (product) => {
    const result = await addItem(product);

    if (!result.ok) {
      toast.showWarning("Sản phẩm gợi ý này đang hết hàng.");
      return;
    }

    toast.showSuccess("Đã thêm sản phẩm gợi ý vào giỏ.", {
      title: "Giỏ hàng đã cập nhật",
    });
  };

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className={cn("store-surface-panel rounded-3xl p-4 sm:p-5", className)}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-3 gap-2" variant="primary">
            <Sparkles size={13} />
            Gợi ý thêm nhanh
          </Badge>
          <h2 className={cn("text-section", compact && "text-xl")}>Hoàn thiện setup trong giỏ</h2>
          <p className="text-muted mt-2 text-sm">Phụ kiện và gear bổ trợ dựa trên các sản phẩm bạn đang chuẩn bị checkout.</p>
        </div>
      </div>

      <MotionDiv initial="hidden" variants={staggerContainer} viewport={motionViewport} whileInView="visible">
        <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {recommendations.map((product) => (
            <MotionDiv
              className="min-w-[220px] snap-start sm:min-w-[238px] lg:min-w-[224px] xl:min-w-[238px]"
              key={product.id}
              variants={fadeUp}
            >
              <RecommendationMiniCard onAdd={handleAddRecommendation} product={product} />
            </MotionDiv>
          ))}
        </div>
      </MotionDiv>
    </section>
  );
}

export default CartRecommendations;
