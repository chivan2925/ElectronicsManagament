import { Image, Layers3 } from "lucide-react";
import CrudPage from "../../components/admin/CrudPage";
import StatusBadge from "../../components/admin/StatusBadge";
import { products } from "../../data/mockAdminData";
import { formatCurrency } from "../../utils/formatters";

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
        <button className="rounded-lg border border-border p-2 text-slate-500 transition hover:border-primary hover:text-primary" title="Biến thể">
          <Layers3 size={16} />
        </button>
        <button className="rounded-lg border border-border p-2 text-slate-500 transition hover:border-primary hover:text-primary" title="Media">
          <Image size={16} />
        </button>
      </div>
    ),
  },
];

function Products() {
  return (
    <CrudPage
      columns={columns}
      data={products}
      searchPlaceholder="Tìm sản phẩm, danh mục, thương hiệu..."
      subtitle="Quản lý sản phẩm gốc, giá bán, tồn kho và trạng thái hiển thị."
      title="Sản phẩm"
    />
  );
}

export default Products;
