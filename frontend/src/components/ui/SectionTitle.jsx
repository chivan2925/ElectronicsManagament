import { cn } from "../../utils/classNames";

function SectionTitle({
  action,
  actionHref = "/",
  actionLabel,
  className,
  subtitle,
  title,
  titleClassName,
}) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className={cn("text-2xl font-black leading-tight text-white md:text-3xl", titleClassName)}>{title}</h2>
        {subtitle && <p className="mt-2 text-sm font-medium text-slate-400">{subtitle}</p>}
      </div>

      {action ||
        (actionLabel && (
          <a
            className="premium-transition hidden text-sm font-bold text-blue-300 hover:text-white hover:drop-shadow-[0_0_14px_rgba(0,91,255,0.85)] sm:inline"
            href={actionHref}
          >
            {actionLabel}
          </a>
        ))}
    </div>
  );
}

export default SectionTitle;
