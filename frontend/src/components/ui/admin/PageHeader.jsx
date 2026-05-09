import { Plus } from "lucide-react";

function PageHeader({ title, subtitle, actionLabel = "Thêm mới" }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-black tracking-normal text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>

      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
        type="button"
      >
        <Plus size={18} />
        {actionLabel}
      </button>
    </div>
  );
}

export default PageHeader;
