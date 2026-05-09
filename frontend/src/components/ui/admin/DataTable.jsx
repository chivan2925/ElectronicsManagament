import { Eye, Pencil, Trash2 } from "lucide-react";
import Card from "../Card";
import AdminIconButton from "./AdminIconButton";

function DataTable({ columns, data, emptyText = "Không có dữ liệu" }) {
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
              <th className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-bold uppercase tracking-normal text-slate-500">
                Thao tác
              </th>
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
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1 rounded-lg bg-slate-50 p-1 ring-1 ring-border">
                      <AdminIconButton icon={Eye} title="Xem" />
                      <AdminIconButton icon={Pencil} title="Sửa" tone="warning" />
                      <AdminIconButton icon={Trash2} title="Xóa" tone="danger" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-10 text-center text-sm text-muted" colSpan={columns.length + 1}>
                  {emptyText}
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
