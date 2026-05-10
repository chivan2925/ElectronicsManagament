import { useState } from "react";
import { AlertTriangle, CalendarDays, ShoppingCart, TrendingUp, Users, Wallet } from "lucide-react";
import ActivityFeed from "../../admin/components/dashboard/ActivityFeed";
import AnalyticsCard from "../../admin/components/dashboard/AnalyticsCard";
import StatCard from "../../admin/components/dashboard/StatCard";
import AdminRealtimeActivity from "../../admin/components/realtime/AdminRealtimeActivity";
import { AnalyticsFilters, CustomerAnalytics, InventoryAnalytics, RevenueAnalytics } from "../../admin/analytics";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import {
  adminCustomerAnalytics,
  adminInventoryAnalytics,
  adminRevenueAnalytics,
  analyticsFilterDefaults,
} from "../../data/adminAnalyticsMock";
import {
  dashboardKpis,
  dashboardRecentActivity,
  orders,
} from "../../data/adminMock";
import { formatCurrency } from "../../utils/formatters";

const kpiIcons = {
  lowStock: AlertTriangle,
  monthRevenue: TrendingUp,
  orders: ShoppingCart,
  todayRevenue: Wallet,
  users: Users,
};

function RecentOrders({ items }) {
  return (
    <AnalyticsCard
      action={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">Live mock</span>}
      description="Latest checkout activity from admin mock data."
      title="Recent orders"
    >
      <div className="overflow-x-auto px-5 pb-5 pt-4">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-black uppercase tracking-normal text-slate-400">
              <th className="whitespace-nowrap py-3 pr-4">Mã đơn</th>
              <th className="whitespace-nowrap px-4 py-3">Khách hàng</th>
              <th className="whitespace-nowrap px-4 py-3">Thanh toán</th>
              <th className="whitespace-nowrap px-4 py-3">Tổng tiền</th>
              <th className="whitespace-nowrap py-3 pl-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr className="admin-table-row text-sm" key={item.id}>
                <td className="whitespace-nowrap py-4 pr-4">
                  <div>
                    <p className="font-black text-primary">{item.id}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-400">{item.createdAt}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{item.customer}</td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-500">{item.payment}</td>
                <td className="whitespace-nowrap px-4 py-4 font-black text-slate-950">{formatCurrency(item.total)}</td>
                <td className="whitespace-nowrap py-4 pl-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnalyticsCard>
  );
}

function Dashboard() {
  const [filters, setFilters] = useState(analyticsFilterDefaults);
  const [exportNotice, setExportNotice] = useState("");

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setExportNotice("");
  };

  const handleExport = (currentFilters) => {
    setExportNotice(
      `Export placeholder queued for ${currentFilters.from} to ${currentFilters.to}. Reporting API integration is pending.`,
    );
  };

  return (
    <section className="admin-page-shell">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-primary">
            <CalendarDays size={14} />
            09/05/2026 · Admin analytics
          </div>
          <h1 className="text-2xl font-black tracking-normal text-slate-950 md:text-3xl">Dashboard analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tổng quan doanh thu, đơn hàng, khách hàng, tồn kho và hoạt động vận hành cho cửa hàng electronics gaming.
          </p>
        </div>
      </div>

      <AnalyticsFilters onChange={handleFiltersChange} onExport={handleExport} value={filters} />

      {exportNotice ? (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-primary">
          {exportNotice}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardKpis.map((item) => (
          <StatCard icon={kpiIcons[item.key]} key={item.key} {...item} />
        ))}
      </div>

      <AdminRealtimeActivity />

      <RevenueAnalytics data={adminRevenueAnalytics} />

      <CustomerAnalytics data={adminCustomerAnalytics} />

      <InventoryAnalytics data={adminInventoryAnalytics} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RecentOrders items={orders} />
        <ActivityFeed items={dashboardRecentActivity} />
      </div>
    </section>
  );
}

export default Dashboard;
