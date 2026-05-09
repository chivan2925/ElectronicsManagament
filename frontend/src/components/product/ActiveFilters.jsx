import { X } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function ActiveFilters({ items, onClearAll, onRemove }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 shadow-inner shadow-white/[0.03] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="text-caption shrink-0 text-slate-400">Đang lọc:</span>
          {items.map((item) => (
            <Badge
              as="button"
              className="group gap-1.5 border-blue-200/20 bg-blue-500/12 pr-2 text-blue-100 hover:border-blue-200/50 hover:bg-blue-500/20"
              key={`${item.type}-${item.value}`}
              onClick={() => onRemove(item)}
              type="button"
              variant="primary"
            >
              {item.label}
              <X className="text-blue-100/80 group-hover:text-white" size={13} />
            </Badge>
          ))}
        </div>

        <Button className="h-9 rounded-lg px-3 py-0 text-xs" onClick={onClearAll} size="sm" variant="ghost">
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
}

export default ActiveFilters;
