import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/admin/StatusBadge";
import { variants } from "../../data/mockAdminData";
import { formatCurrency } from "../../utils/formatters";

const columns = [
  { key: "id", label: "Mã", render: (item) => <span className="font-bold text-primary">{item.id}</span> },
  { key: "product", label: "Sản phẩm", render: (item) => <span className="font-bold text-ink">{item.product}</span> },
  { key: "name", label: "Biến thể" },
  { key: "color", label: "Màu" },
  { key: "price", label: "Giá", render: (item) => <span className="font-bold">{formatCurrency(item.price)}</span> },
  { key: "stock", label: "Tồn kho" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Variants() {
  return (
    <CrudPage
      columns={columns}
      data={variants}
      searchPlaceholder="Tìm biến thể..."
      subtitle="Quản lý cấu hình, màu sắc, giá và tồn kho theo từng biến thể."
      title="Biến thể Variant"
    />
  );
}

export default Variants;
