import { Plus } from "lucide-react";
import PermissionGate from "../../../auth/PermissionGate";

function PageHeader({ actionLabel = null, actionPolicy = null, onAction, title, subtitle }) {
  const shouldShowAction = Boolean(actionLabel && onAction);
  const actionButton = shouldShowAction ? (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white shadow-admin-card transition outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      onClick={onAction}
      type="button"
    >
      <Plus size={17} />
      {actionLabel}
    </button>
  ) : null;

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-black tracking-normal text-slate-950">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p> : null}
      </div>

      {actionPolicy && actionButton ? <PermissionGate policy={actionPolicy}>{actionButton}</PermissionGate> : actionButton}
    </div>
  );
}

export default PageHeader;
