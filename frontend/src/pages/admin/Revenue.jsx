import { useState } from "react";
import { AnalyticsFilters, RevenueAnalytics } from "../../admin/analytics";
import useAdminReportDashboard from "../../admin/hooks/useAdminReportDashboard";
import { getDefaultAdminReportFilters } from "../../api/reportMapper";
import PageHeader from "../../components/ui/admin/PageHeader";

function Revenue() {
  const [filters, setFilters] = useState(() => getDefaultAdminReportFilters());
  const [exportNotice, setExportNotice] = useState("");
  const {
    error: reportError,
    isLoading: isLoadingReport,
    refresh: refreshReport,
    revenueAnalytics,
  } = useAdminReportDashboard(filters);

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setExportNotice("");
  };

  const handleExport = (currentFilters) => {
    setExportNotice(
      `Export chưa triển khai. Báo cáo đang lấy dữ liệu thật từ ${currentFilters.from} đến ${currentFilters.to}.`,
    );
  };

  return (
    <section className="admin-page-shell">
      <PageHeader
        subtitle="Theo dõi doanh thu, đơn hàng và sản phẩm bán chạy từ API báo cáo backend."
        title="Báo cáo doanh thu"
      />

      <AnalyticsFilters onChange={handleFiltersChange} onExport={handleExport} value={filters} />

      {exportNotice ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-primary">
          {exportNotice}
        </div>
      ) : null}

      <RevenueAnalytics
        data={revenueAnalytics}
        error={reportError}
        loading={isLoadingReport}
        onRetry={refreshReport}
      />
    </section>
  );
}

export default Revenue;
