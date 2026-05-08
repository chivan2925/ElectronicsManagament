import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/admin/StatusBadge";
import { staff } from "../../data/mockAdminData";

const columns = [
  { key: "id", label: "Mã NV", render: (item) => <span className="font-bold text-primary">{item.id}</span> },
  { key: "name", label: "Nhân viên", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "role", label: "Vai trò" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Số điện thoại" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Staff() {
  return (
    <CrudPage
      columns={columns}
      data={staff}
      searchPlaceholder="Tìm nhân viên..."
      subtitle="Quản lý tài khoản nhân viên, vai trò và trạng thái đăng nhập admin."
      title="Nhân viên"
    />
  );
}

export default Staff;
