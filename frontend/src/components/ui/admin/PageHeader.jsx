import { Plus } from "lucide-react";
import PermissionGate from "../../../auth/PermissionGate";

function PageHeader({ title, subtitle, actionLabel = "Thêm mới", actionPolicy = null }) {
  const actionButton = (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-admin-card transition outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      type="button"
    >
      <Plus size={18} />
      {actionLabel}
    </button>
  );

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-black tracking-normal text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>

      {actionPolicy ? <PermissionGate policy={actionPolicy}>{actionButton}</PermissionGate> : actionButton}
    </div>
  );
}

export default PageHeader;
