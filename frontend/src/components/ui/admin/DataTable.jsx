import { Eye, Inbox, Pencil, Trash2 } from "lucide-react";
import usePermissions from "../../../auth/usePermissions";
import Card from "../Card";
import EmptyState from "../feedback/EmptyState";
import AdminIconButton from "./AdminIconButton";

const tableActions = [
  { icon: Eye, key: "view", title: "Xem" },
  { icon: Pencil, key: "update", title: "Sửa", tone: "warning" },
  { icon: Trash2, key: "delete", title: "Xóa", tone: "danger" },
];

function DataTable({ columns, data, actionPolicies = null, emptyText = "Không có dữ liệu" }) {
  const permission = usePermissions();
  const visibleActions = actionPolicies
    ? tableActions.filter((action) => permission.canAccess(actionPolicies[action.key]))
    : tableActions;
  const showActions = visibleActions.length > 0;

  return (
    <Card className="overflow-hidden" variant="admin">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-5 py-3.5 text-left text-xs font-bold uppercase tracking-normal text-slate-500 ${
                    column.className || ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {showActions && (
                <th className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-bold uppercase tracking-normal text-slate-500">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-panel">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50">
                  {columns.map((column) => (
                    <td
                      key={`${item.id}-${column.key}`}
                      className={`whitespace-nowrap px-5 py-4 text-sm text-slate-700 ${
                        column.cellClassName || ""
                      }`}
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1 rounded-lg bg-slate-50 p-1 ring-1 ring-border">
                        {visibleActions.map((action) => (
                          <AdminIconButton
                            icon={action.icon}
                            key={action.key}
                            title={action.title}
                            tone={action.tone}
                          />
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-10" colSpan={columns.length + (showActions ? 1 : 0)}>
                  <EmptyState
                    framed={false}
                    icon={Inbox}
                    message="Thử đổi từ khóa tìm kiếm hoặc kiểm tra lại bộ lọc."
                    size="compact"
                    surface="admin"
                    title={emptyText}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default DataTable;
