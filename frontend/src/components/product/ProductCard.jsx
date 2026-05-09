import { ShoppingCart } from "lucide-react";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import IconButton from "../ui/IconButton";
import Price from "../ui/Price";
import Rating from "../ui/Rating";

function ProductCard({ product }) {
  return (
    <Card as="article" variant="product">
      {product.discount && (
        <Badge className="absolute left-4 top-4 z-10" variant="danger">
          {product.discount}
        </Badge>
      )}

      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_30%,rgba(0,91,255,0.16),rgba(2,6,23,0.86)_54%)] p-3 ring-1 ring-white/10">
        <img alt={product.name} className="premium-transition h-full w-full object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:drop-shadow-[0_24px_44px_rgba(0,91,255,0.24)]" src={product.image} />
      </div>

      <div className="relative z-10 mt-4">
        <h3 className="min-h-[44px] text-sm font-black leading-snug text-white md:text-base">{product.name}</h3>

        <Rating className="mt-3" reviews={product.reviews} value={product.rating} />

        <div className="mt-4 flex items-end justify-between gap-3">
          <Price oldValue={product.oldPrice} value={product.price} />
          <IconButton aria-label="Thêm vào giỏ hàng" title="Thêm vào giỏ hàng" variant="primary">
            <ShoppingCart size={19} />
          </IconButton>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
