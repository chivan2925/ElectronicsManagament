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
    <div className={cn("flex-between mb-5 items-end gap-4", className)}>
      <div>
        <h2 className={cn("text-section", titleClassName)}>{title}</h2>
        {subtitle && <p className="text-muted mt-2 text-sm">{subtitle}</p>}
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
