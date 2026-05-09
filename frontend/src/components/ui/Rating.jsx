import { Star } from "lucide-react";
import { cn } from "../../utils/classNames";

const sizeConfig = {
  sm: {
    icon: 15,
    text: "text-sm",
    reviews: "text-xs",
  },
  md: {
    icon: 17,
    text: "text-base",
    reviews: "text-sm",
  },
};

function Rating({ className, label = "đánh giá", reviews, size = "sm", value }) {
  const config = sizeConfig[size] || sizeConfig.sm;

  return (
    <div className={cn("flex items-center gap-2", config.text, className)}>
      <div className="flex items-center gap-1 text-amber-300">
        <Star size={config.icon} fill="currentColor" />
        <span className="font-bold">{value}</span>
      </div>
      {reviews !== undefined && <span className={cn("text-slate-500", config.reviews)}>({reviews} {label})</span>}
    </div>
  );
}

export default Rating;
