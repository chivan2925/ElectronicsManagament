import { cn } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

function Price({ className, oldClassName, oldValue, size = "md", value }) {
  return (
    <div className={className}>
      <p className={cn("text-price", sizeClasses[size] || sizeClasses.md)}>{formatCurrency(value)}</p>
      {oldValue && (
        <p className={cn("text-muted mt-1 text-sm line-through", oldClassName)}>{formatCurrency(oldValue)}</p>
      )}
    </div>
  );
}

export default Price;
