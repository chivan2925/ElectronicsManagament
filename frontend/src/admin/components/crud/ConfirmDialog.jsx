import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "../../../utils/classNames";
import AdminModal from "./AdminModal";

const toneClasses = {
  danger: "bg-rose-50 text-rose-600 ring-rose-100",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  warning: "bg-amber-50 text-amber-600 ring-amber-100",
};

const buttonClasses = {
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  neutral: "bg-slate-900 text-white hover:bg-slate-800",
  warning: "bg-amber-500 text-white hover:bg-amber-600",
};

function ConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  description = "This action cannot be undone.",
  loading = false,
  onCancel,
  onConfirm,
  open = false,
  title = "Confirm action",
  tone = "danger",
}) {
  const footer = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        disabled={loading}
        onClick={onCancel}
        type="button"
      >
        {cancelLabel}
      </button>
      <button
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto",
          buttonClasses[tone] || buttonClasses.danger,
        )}
        disabled={loading}
        onClick={onConfirm}
        type="button"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : null}
        {confirmLabel}
      </button>
    </div>
  );

  return (
    <AdminModal footer={footer} onClose={loading ? undefined : onCancel} open={open} size="sm">
      <div className="flex gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1", toneClasses[tone])}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
    </AdminModal>
  );
}

export default ConfirmDialog;
