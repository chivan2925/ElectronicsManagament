import { useState } from "react";
import { AnalyticsFilters, RevenueAnalytics } from "../../admin/analytics";
import PageHeader from "../../components/ui/admin/PageHeader";
import { adminRevenueAnalytics, analyticsFilterDefaults } from "../../data/adminAnalyticsMock";

function Revenue() {
  const [filters, setFilters] = useState(analyticsFilterDefaults);
  const [exportNotice, setExportNotice] = useState("");

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setExportNotice("");
  };

  const handleExport = (currentFilters) => {
    setExportNotice(
      `Export placeholder queued for revenue report from ${currentFilters.from} to ${currentFilters.to}.`,
    );
  };

  return (
    <section className="space-y-6">
      <PageHeader
        subtitle="Theo dõi doanh thu, order trends, sản phẩm bán chạy, conversion placeholder và sales reports."
        title="Báo cáo doanh thu"
      />

      <AnalyticsFilters onChange={handleFiltersChange} onExport={handleExport} value={filters} />

      {exportNotice ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-primary">
          {exportNotice}
        </div>
      ) : null}

      <RevenueAnalytics data={adminRevenueAnalytics} />
    </section>
  );
}

export default Revenue;
