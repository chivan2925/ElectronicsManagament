import { cn } from "../../utils/classNames";

const variantClasses = {
  dark: "border-white/10 bg-slate-950/55 text-white placeholder:text-slate-500 focus-within:border-blue-400/80 focus-within:bg-slate-950/75 focus-within:shadow-[0_0_34px_rgba(0,91,255,0.22)]",
  light: "border-border bg-slate-50 text-slate-700 placeholder:text-slate-400 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100",
};

const sizeClasses = {
  sm: "h-9 rounded-lg text-xs",
  md: "h-10 rounded-lg text-sm",
  lg: "h-11 rounded-xl text-sm",
};

function Input({
  className,
  inputClassName,
  leftIcon,
  rightIcon,
  size = "md",
  variant = "dark",
  ...props
}) {
  return (
    <label
      className={cn(
        "premium-transition flex items-center border px-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl",
        variantClasses[variant] || variantClasses.dark,
        sizeClasses[size] || sizeClasses.md,
        className,
      )}
    >
      {leftIcon && <span className="mr-2 flex shrink-0 text-slate-400">{leftIcon}</span>}
      <input className={cn("min-w-0 flex-1 bg-transparent outline-none", inputClassName)} {...props} />
      {rightIcon && <span className="ml-2 flex shrink-0 text-slate-400">{rightIcon}</span>}
    </label>
  );
}

export default Input;
