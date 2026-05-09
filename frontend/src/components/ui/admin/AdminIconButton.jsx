import { createElement } from "react";
import { cn } from "../../../utils/classNames";

const toneClasses = {
  neutral: "hover:border-blue-200 hover:bg-blue-50 hover:text-primary",
  warning: "hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600",
  danger: "hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600",
};

const sizeClasses = {
  sm: "h-8 w-8 rounded-md",
  md: "h-10 w-10 rounded-lg",
};

const iconSizes = {
  sm: 16,
  md: 18,
};

function AdminIconButton({
  "aria-label": ariaLabel,
  children,
  className,
  icon,
  size = "sm",
  title,
  tone = "neutral",
  type = "button",
  ...props
}) {
  return (
    <button
      aria-label={ariaLabel || title}
      className={cn(
        "inline-flex items-center justify-center border border-border bg-white text-slate-500 transition outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        toneClasses[tone] || toneClasses.neutral,
        sizeClasses[size] || sizeClasses.sm,
        className,
      )}
      title={title}
      type={type}
      {...props}
    >
      {icon ? createElement(icon, { size: iconSizes[size] || iconSizes.sm }) : null}
      {children}
    </button>
  );
}

export default AdminIconButton;
