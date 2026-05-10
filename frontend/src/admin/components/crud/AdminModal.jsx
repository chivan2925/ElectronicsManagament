import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../../utils/classNames";

const sizeClasses = {
  lg: "max-w-3xl",
  md: "max-w-xl",
  sm: "max-w-md",
  xl: "max-w-5xl",
};

function AdminModal({
  children,
  className,
  description,
  footer,
  onClose,
  open = false,
  size = "md",
  title,
}) {
  const closeButtonRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

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
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={cn(
          "relative flex max-h-[calc(100vh-3rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/30",
          sizeClasses[size] || sizeClasses.md,
          className,
        )}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            {title ? <h2 className="text-lg font-black text-slate-950" id={titleId}>{title}</h2> : null}
            {description ? <p className="mt-1 text-sm leading-6 text-slate-500" id={descriptionId}>{description}</p> : null}
          </div>
          <button
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:bg-blue-50 hover:text-primary"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4">{footer}</footer> : null}
      </section>
    </div>
  );
}

export default AdminModal;
