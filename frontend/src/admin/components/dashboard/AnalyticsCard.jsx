import { cn } from "../../../utils/classNames";

const variantClasses = {
  dark:
    "border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,91,255,0.24),transparent_34%),linear-gradient(135deg,#07111F,#0B1729)] text-white shadow-2xl shadow-slate-950/20",
  light: "border-slate-200 bg-white text-slate-950 shadow-admin-card",
};

function AnalyticsCard({
  action,
  children,
  className,
  description,
  headerClassName,
  title,
  variant = "light",
}) {
  const isDark = variant === "dark";

  return (
    <article className={cn("overflow-hidden rounded-2xl border", variantClasses[variant] || variantClasses.light, className)}>
      {(title || description || action) && (
        <div className={cn("flex items-start justify-between gap-4 px-5 pt-5", headerClassName)}>
          <div className="min-w-0">
            {title ? (
              <h2 className={cn("text-base font-black tracking-normal", isDark ? "text-white" : "text-slate-950")}>
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className={cn("mt-1 text-sm font-medium", isDark ? "text-slate-300" : "text-slate-500")}>
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}

      {children}
    </article>
  );
}

export default AnalyticsCard;
