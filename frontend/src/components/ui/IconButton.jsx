import { createElement } from "react";
import { cn } from "../../utils/classNames";

const variantClasses = {
  primary:
    "bg-primary text-white shadow-[0_0_24px_rgba(0,91,255,0.36)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_0_36px_rgba(0,91,255,0.65)] active:translate-y-0",
  outline:
    "border border-white/10 bg-black/30 text-white backdrop-blur-xl hover:border-blue-300/70 hover:bg-blue-600 hover:shadow-[0_0_26px_rgba(0,91,255,0.42)]",
  ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white",
};

const sizeClasses = {
  sm: "h-10 w-10 rounded-full",
  md: "h-11 w-11 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
};

function IconButton({
  as: Component = "button",
  children,
  className,
  size = "md",
  type = "button",
  variant = "ghost",
  ...props
}) {
  const buttonProps = Component === "button" ? { type } : {};

  return createElement(
    Component,
    {
      className: cn(
        "premium-transition inline-flex shrink-0 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        variantClasses[variant] || variantClasses.ghost,
        sizeClasses[size] || sizeClasses.md,
        className,
      ),
      ...props,
      ...buttonProps,
    },
    children,
  );
}

export default IconButton;
