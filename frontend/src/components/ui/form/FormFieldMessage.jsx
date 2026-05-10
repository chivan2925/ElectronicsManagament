import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "../../../utils/classNames";

const surfaceToneClasses = {
  admin: {
    error: "text-rose-600",
    helper: "text-slate-500",
    success: "text-emerald-600",
  },
  store: {
    error: "text-red-200",
    helper: "text-slate-400",
    success: "text-emerald-200",
  },
};

const toneIcons = {
  error: AlertCircle,
  helper: Info,
  success: CheckCircle2,
};

function FormFieldMessage({
  children,
  className,
  id,
  surface = "store",
  tone = "helper",
}) {
  if (!children) {
    return null;
  }

  const Icon = toneIcons[tone] || Info;
  const toneClass = surfaceToneClasses[surface]?.[tone] || surfaceToneClasses.store.helper;

  return (
    <p
      className={cn("mt-2 flex items-start gap-1.5 text-xs font-bold leading-5", toneClass, className)}
      id={id}
      role={tone === "error" ? "alert" : undefined}
    >
      <Icon aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
      <span>{children}</span>
    </p>
  );
}

export default FormFieldMessage;
