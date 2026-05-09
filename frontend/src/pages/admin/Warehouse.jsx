import CrudPage from "../../components/ui/admin/CrudPage";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import { warehouse } from "../../data/adminMock";

const columns = [
  { key: "id", label: "Mã kho", render: (item) => <span className="font-bold text-primary">{item.id}</span> },
  { key: "name", label: "Tên kho", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "location", label: "Vị trí" },
  { key: "capacity", label: "Sức chứa" },
  {
    key: "stock",
    label: "Tồn hiện tại",
    render: (item) => (
      <div className="min-w-[160px]">
        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
          <span>{item.stock}</span>
          <span>{Math.round((item.stock / item.capacity) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.stock / item.capacity) * 100}%` }} />
        </div>
      </div>
    ),
  },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Warehouse() {
  return (
    <CrudPage
      columns={columns}
      data={warehouse}
      permissionResource={ADMIN_RESOURCES.warehouse}
      searchPlaceholder="Tìm kho hàng..."
      subtitle="Quản lý kho, sức chứa và tồn kho theo khu vực."
      title="Kho hàng"
    />
  );
}

export default Warehouse;
