import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/admin/StatusBadge";
import { media } from "../../data/mockAdminData";

const columns = [
  { key: "id", label: "Mã", render: (item) => <span className="font-bold text-primary">{item.id}</span> },
  { key: "product", label: "Sản phẩm", render: (item) => <span className="font-bold text-ink">{item.product}</span> },
  { key: "type", label: "Loại media" },
  { key: "url", label: "Tệp" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Media() {
  return (
    <CrudPage
      columns={columns}
      data={media}
      searchPlaceholder="Tìm media..."
      subtitle="Quản lý ảnh sản phẩm, ảnh gallery và thứ tự hiển thị."
      title="Media"
    />
  );
}

export default Media;
