import { createElement } from "react";
import { cn } from "../../utils/classNames";

const variantClasses = {
  primary:
    "bg-primary text-white shadow-[0_0_28px_rgba(0,91,255,0.42)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_0_42px_rgba(0,91,255,0.68)] active:translate-y-0 active:scale-[0.98]",
  outline:
    "border border-white/15 bg-white/[0.03] text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-blue-300/70 hover:bg-blue-500/10 hover:shadow-[0_0_28px_rgba(0,91,255,0.18)] active:translate-y-0 active:scale-[0.98]",
  ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white active:translate-y-0 active:scale-[0.98]",
};

const sizeClasses = {
  sm: "rounded-lg px-3 py-2 text-xs",
  md: "rounded-xl px-4 py-2.5 text-sm",
  lg: "rounded-xl px-6 py-3 text-sm",
};

function Button({
  as: Component = "button",
  children,
  className,
  fullWidth = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  const buttonProps = Component === "button" ? { type } : {};

  return createElement(
    Component,
    {
      className: cn(
        "transition-default inline-flex items-center justify-center gap-2 font-black outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        "disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        fullWidth && "w-full",
        className,
      ),
      ...props,
      ...buttonProps,
    },
    children,
  );
}

export default Button;
