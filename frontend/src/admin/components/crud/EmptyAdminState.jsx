import { createElement } from "react";
import { Inbox } from "lucide-react";
import { cn } from "../../../utils/classNames";

function EmptyAdminState({
  action,
  className,
  icon: Icon = Inbox,
  message = "Try adjusting search, filters, or refresh the data source.",
  title = "No records found",
}) {
  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        {createElement(Icon, { size: 22 })}
      </div>
      <h3 className="mt-4 text-base font-black text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyAdminState;
