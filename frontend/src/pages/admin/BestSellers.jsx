import { useEffect, useState } from "react";
import { AnalyticsFilters } from "../../admin/analytics";
import reportService from "../../api/reportService";
import { buildTopSellerRows, getDefaultAdminReportFilters } from "../../api/reportMapper";
import DataTable from "../../components/ui/admin/DataTable";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import PageHeader from "../../components/ui/admin/PageHeader";
import { formatCurrency } from "../../utils/formatters";

const columns = [
  { key: "id", label: "Hạng", render: (item) => <span className="font-black text-primary">#{item.id}</span> },
  { key: "name", label: "Sản phẩm", render: (item) => <span className="font-bold text-ink">{item.name}</span> },
  { key: "sold", label: "Đã bán" },
  { key: "revenue", label: "Doanh thu", render: (item) => <span className="font-bold">{formatCurrency(item.revenue)}</span> },
];

function BestSellers() {
  const [error, setError] = useState(null);
  const [exportNotice, setExportNotice] = useState("");
  const [filters, setFilters] = useState(() => getDefaultAdminReportFilters());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const from = filters.from;
  const to = filters.to;

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) {
          return null;
        }

        setIsLoading(true);
        setError(null);

        return reportService.getTopProductsReport({ from, limit: 20, to });
      })
      .then((items) => {
        if (isActive && items) {
          setTopProducts(buildTopSellerRows(items));
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(loadError);
          setTopProducts([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [from, refreshIndex, to]);

  return (
    <section className="admin-page-shell">
      <PageHeader subtitle="Danh sách sản phẩm có doanh số tốt nhất từ API báo cáo backend." title="Sản phẩm bán chạy" />
      <AnalyticsFilters
        onChange={(nextFilters) => {
          setFilters(nextFilters);
          setExportNotice("");
        }}
        onExport={(currentFilters) => {
          setExportNotice(`Export chưa triển khai. Dữ liệu bán chạy đang lấy từ ${currentFilters.from} đến ${currentFilters.to}.`);
        }}
        value={filters}
      />
      {exportNotice ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-primary">
          {exportNotice}
        </div>
      ) : null}
      {error ? (
        <ApiErrorAlert
          actionLabel="Tải lại"
          error={error}
          onAction={() => setRefreshIndex((currentIndex) => currentIndex + 1)}
          surface="admin"
          title="Chưa tải được sản phẩm bán chạy"
        />
      ) : null}
      <DataTable columns={columns} data={topProducts} emptyText="Chưa có dữ liệu bán chạy" loading={isLoading} />
    </section>
  );
}

export default BestSellers;
