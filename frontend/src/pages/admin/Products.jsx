import { Image, Layers3 } from "lucide-react";
import CrudPage from "../../components/ui/admin/CrudPage";
import AdminIconButton from "../../components/ui/admin/AdminIconButton";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import PermissionGate from "../../auth/PermissionGate";
import { ADMIN_RESOURCES, getResourceActionPolicy } from "../../auth/roleHelpers";
import { products } from "../../data/adminMock";
import { formatCurrency } from "../../utils/formatters";

const variantToolPolicy = getResourceActionPolicy(ADMIN_RESOURCES.variants, "view");
const mediaToolPolicy = getResourceActionPolicy(ADMIN_RESOURCES.media, "view");

const columns = [
  {
    key: "name",
    label: "Sản phẩm",
    render: (item) => (
      <div className="flex min-w-[300px] items-center gap-3">
        <img alt={item.name} className="h-12 w-12 rounded-lg object-cover ring-1 ring-border" src={item.image} />
        <div>
          <p className="font-bold text-ink">{item.name}</p>
          <p className="text-xs text-muted">{item.id}</p>
        </div>
      </div>
    ),
  },
  { key: "category", label: "Danh mục" },
  { key: "brand", label: "Thương hiệu" },
  { key: "price", label: "Giá", render: (item) => <span className="font-bold">{formatCurrency(item.price)}</span> },
  { key: "stock", label: "Tồn kho", render: (item) => <span className="font-bold">{item.stock}</span> },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
  {
    key: "tools",
    label: "Quản lý",
    render: () => (
      <div className="flex items-center gap-2">
        <PermissionGate policy={variantToolPolicy}>
          <AdminIconButton icon={Layers3} title="Biến thể" />
        </PermissionGate>
        <PermissionGate policy={mediaToolPolicy}>
          <AdminIconButton icon={Image} title="Media" />
        </PermissionGate>
      </div>
    ),
  },
];

function Products() {
  return (
    <CrudPage
      columns={columns}
      data={products}
      permissionResource={ADMIN_RESOURCES.products}
      searchPlaceholder="Tìm sản phẩm, danh mục, thương hiệu..."
      subtitle="Quản lý sản phẩm gốc, giá bán, tồn kho và trạng thái hiển thị."
      title="Sản phẩm"
    />
  );
}

export default Products;
