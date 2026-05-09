import CrudPage from "../../components/ui/admin/CrudPage";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import { users } from "../../data/adminMock";
import { formatCurrency } from "../../utils/formatters";

const columns = [
  { key: "id", label: "Mã KH", render: (item) => <span className="font-bold text-primary">{item.id}</span> },
  { key: "name", label: "Khách hàng", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "email", label: "Email" },
  { key: "phone", label: "Số điện thoại" },
  { key: "orders", label: "Đơn hàng" },
  { key: "total", label: "Chi tiêu", render: (item) => <span className="font-bold">{formatCurrency(item.total)}</span> },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Users() {
  return (
    <CrudPage
      columns={columns}
      data={users}
      permissionResource={ADMIN_RESOURCES.users}
      searchPlaceholder="Tìm người dùng..."
      subtitle="Theo dõi tài khoản khách hàng, lịch sử mua và trạng thái hoạt động."
      title="Người dùng"
    />
  );
}

export default Users;
