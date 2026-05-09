import { createElement } from "react";
import { cn } from "../../utils/classNames";

const variantClasses = {
  primary: "border border-blue-300/40 bg-blue-500/15 text-blue-100 shadow-[0_0_24px_rgba(0,91,255,0.22)] backdrop-blur-xl",
  danger: "bg-red-500/90 text-white ring-1 ring-red-200/30 shadow-[0_0_18px_rgba(239,68,68,0.55)]",
  soft: "border border-white/10 bg-white/[0.06] text-slate-200 backdrop-blur-xl",
  success: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-300/30",
  warning: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-300/30",
};

const sizeClasses = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1 text-xs",
  lg: "px-3.5 py-1.5 text-sm",
};

function Badge({ as: Component = "span", children, className, size = "sm", type = "button", variant = "soft", ...props }) {
  const badgeProps = Component === "button" ? { type } : {};

  return createElement(
    Component,
    {
      className: cn(
        "inline-flex w-fit items-center rounded-full font-black",
        variantClasses[variant] || variantClasses.soft,
        sizeClasses[size] || sizeClasses.sm,
        className,
      ),
      ...props,
      ...badgeProps,
    },
    children,
  );
}

export default Badge;
