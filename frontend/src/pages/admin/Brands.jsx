import CrudPage from "../../components/ui/admin/CrudPage";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import { brands } from "../../data/adminMock";

const columns = [
  { key: "id", label: "ID", render: (item) => <span className="font-bold text-primary">#{item.id}</span> },
  { key: "name", label: "Thương hiệu", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "category", label: "Nhóm chính" },
  { key: "products", label: "Sản phẩm" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Brands() {
  return (
    <CrudPage
      columns={columns}
      data={brands}
      permissionResource={ADMIN_RESOURCES.brands}
      searchPlaceholder="Tìm thương hiệu..."
      subtitle="Theo dõi thương hiệu điện tử, gaming gear và linh kiện."
      title="Thương hiệu"
    />
  );
}

export default Brands;
