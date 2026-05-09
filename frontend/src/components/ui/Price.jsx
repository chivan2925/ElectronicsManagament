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
      <p className={cn("font-black text-blue-300", sizeClasses[size] || sizeClasses.md)}>{formatCurrency(value)}</p>
      {oldValue && (
        <p className={cn("mt-1 text-sm text-slate-500 line-through", oldClassName)}>{formatCurrency(oldValue)}</p>
      )}
    </div>
  );
}

export default Price;
