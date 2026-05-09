import CrudPage from "../../components/ui/admin/CrudPage";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import { roles } from "../../data/adminMock";

const columns = [
  { key: "id", label: "ID", render: (item) => <span className="font-bold text-primary">#{item.id}</span> },
  { key: "name", label: "Vai trò", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "permissions", label: "Số quyền" },
  { key: "description", label: "Mô tả" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Roles() {
  return (
    <CrudPage
      columns={columns}
      data={roles}
      permissionResource={ADMIN_RESOURCES.roles}
      searchPlaceholder="Tìm vai trò..."
      subtitle="Quản lý vai trò, nhóm quyền và phạm vi thao tác trong admin."
      title="Vai trò / Quyền"
    />
  );
}

export default Roles;
