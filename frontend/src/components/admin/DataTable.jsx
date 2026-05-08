import { Eye, Pencil, Trash2 } from "lucide-react";

function DataTable({ columns, data, emptyText = "Không có dữ liệu" }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-panel shadow-sm">
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
                    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-white p-1">
                      <button className="rounded-md p-2 text-slate-500 transition hover:bg-blue-50 hover:text-primary" title="Xem">
                        <Eye size={16} />
                      </button>
                      <button className="rounded-md p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600" title="Sửa">
                        <Pencil size={16} />
                      </button>
                      <button className="rounded-md p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600" title="Xóa">
                        <Trash2 size={16} />
                      </button>
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
    </div>
  );
}

export default DataTable;
