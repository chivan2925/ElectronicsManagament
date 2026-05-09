import CrudPage from "../../components/ui/admin/CrudPage";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import { coupons } from "../../data/adminMock";
import { formatCurrency } from "../../utils/formatters";

const columns = [
  { key: "code", label: "Mã", render: (item) => <span className="font-bold text-primary">{item.code}</span> },
  { key: "type", label: "Loại" },
  { key: "value", label: "Giá trị", render: (item) => <span className="font-bold text-ink">{item.value}</span> },
  { key: "minOrder", label: "Đơn tối thiểu", render: (item) => formatCurrency(item.minOrder) },
  { key: "used", label: "Đã dùng" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Coupons() {
  return (
    <CrudPage
      columns={columns}
      data={coupons}
      searchPlaceholder="Tìm mã giảm giá..."
      subtitle="Quản lý voucher, điều kiện áp dụng và hiệu quả sử dụng."
      title="Mã giảm giá"
    />
  );
}

export default Coupons;
