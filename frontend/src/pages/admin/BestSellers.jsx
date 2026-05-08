import DataTable from "../../components/admin/DataTable";
import PageHeader from "../../components/admin/PageHeader";
import { bestSellers } from "../../data/mockAdminData";
import { formatCurrency } from "../../utils/formatters";

const columns = [
  { key: "id", label: "Hạng", render: (item) => <span className="font-black text-primary">#{item.id}</span> },
  { key: "name", label: "Sản phẩm", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "sold", label: "Đã bán" },
  { key: "revenue", label: "Doanh thu", render: (item) => <span className="font-bold">{formatCurrency(item.revenue)}</span> },
];

function BestSellers() {
  return (
    <section>
      <PageHeader subtitle="Danh sách sản phẩm có doanh số tốt nhất trong kỳ." title="Sản phẩm bán chạy" />
      <DataTable columns={columns} data={bestSellers} />
    </section>
  );
}

export default BestSellers;
