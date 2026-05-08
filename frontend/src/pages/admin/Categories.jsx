import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/admin/StatusBadge";
import { categories } from "../../data/mockAdminData";

const columns = [
  { key: "id", label: "ID", render: (item) => <span className="font-bold text-primary">#{item.id}</span> },
  { key: "name", label: "Tên danh mục", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "slug", label: "Slug" },
  { key: "products", label: "Sản phẩm" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Categories() {
  return (
    <CrudPage
      columns={columns}
      data={categories}
      searchPlaceholder="Tìm danh mục..."
      subtitle="Quản lý nhóm hàng như laptop, tai nghe, chuột, bàn phím, linh kiện PC."
      title="Danh mục"
    />
  );
}

export default Categories;
