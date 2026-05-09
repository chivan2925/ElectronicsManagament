import CrudPage from "../../components/ui/admin/CrudPage";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import { orders } from "../../data/adminMock";
import { formatCurrency } from "../../utils/formatters";

const columns = [
  { key: "id", label: "Mã đơn", render: (item) => <span className="font-bold text-primary">{item.id}</span> },
  { key: "customer", label: "Khách hàng", render: (item) => <span className="font-bold text-ink">{item.customer}</span> },
  { key: "items", label: "Số món" },
  { key: "total", label: "Tổng tiền", render: (item) => <span className="font-bold">{formatCurrency(item.total)}</span> },
  { key: "payment", label: "Thanh toán" },
  { key: "createdAt", label: "Ngày tạo" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Orders() {
  return (
    <CrudPage
      columns={columns}
      data={orders}
      permissionResource={ADMIN_RESOURCES.orders}
      searchPlaceholder="Tìm đơn hàng..."
      subtitle="Theo dõi đơn hàng, thanh toán và trạng thái xử lý."
      title="Đơn hàng"
    />
  );
}

export default Orders;
