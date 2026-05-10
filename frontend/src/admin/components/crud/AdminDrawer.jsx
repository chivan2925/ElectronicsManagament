import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../../utils/classNames";

const placementClasses = {
  left: "left-0 translate-x-0 border-r",
  right: "right-0 translate-x-0 border-l",
};

const sizeClasses = {
  lg: "w-full sm:max-w-2xl",
  md: "w-full sm:max-w-xl",
  sm: "w-full sm:max-w-md",
  xl: "w-full sm:max-w-4xl",
};

function AdminDrawer({
  children,
  description,
  footer,
  onClose,
  open = false,
  placement = "right",
  size = "md",
  title,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      <aside
        aria-modal="true"
        className={cn(
          "absolute inset-y-0 flex flex-col overflow-hidden border-slate-200 bg-white shadow-2xl shadow-slate-950/30",
          placementClasses[placement] || placementClasses.right,
          sizeClasses[size] || sizeClasses.md,
        )}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            {title ? <h2 className="text-lg font-black text-slate-950">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
          </div>
          <button
            aria-label="Close drawer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:bg-blue-50 hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4">{footer}</footer> : null}
      </aside>
    </div>
  );
}

export default AdminDrawer;
