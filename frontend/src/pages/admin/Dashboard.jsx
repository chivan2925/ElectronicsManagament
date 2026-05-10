import { AlertTriangle, CalendarDays, Download, ShoppingCart, TrendingUp, Users, Wallet } from "lucide-react";
import ActivityFeed from "../../admin/components/dashboard/ActivityFeed";
import AnalyticsCard from "../../admin/components/dashboard/AnalyticsCard";
import OrdersChart from "../../admin/components/dashboard/OrdersChart";
import RevenueChart from "../../admin/components/dashboard/RevenueChart";
import StatCard from "../../admin/components/dashboard/StatCard";
import AdminRealtimeActivity from "../../admin/components/realtime/AdminRealtimeActivity";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import {
  dashboardKpis,
  dashboardLowStockProducts,
  dashboardOrdersData,
  dashboardRecentActivity,
  dashboardRevenueData,
  dashboardSalesOverview,
  dashboardTopProducts,
  orders,
} from "../../data/adminMock";
import { compactCurrency, formatCurrency } from "../../utils/formatters";

const kpiIcons = {
  lowStock: AlertTriangle,
  monthRevenue: TrendingUp,
  orders: ShoppingCart,
  todayRevenue: Wallet,
  users: Users,
};

function SalesOverview({ data }) {
  return (
    <AnalyticsCard
      className="h-full"
      description="Revenue mix, operating quality, and checkout efficiency."
      title="Sales overview"
      variant="dark"
    >
      <div className="grid gap-5 px-5 pb-5 pt-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          {data.channels.map((channel) => (
            <div key={channel.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="truncate text-sm font-bold text-slate-200">{channel.label}</span>
                <span className="text-sm font-black text-white">{channel.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#005BFF]" style={{ width: `${channel.value}%` }} />
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-400">{compactCurrency(channel.revenue)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.metrics.map((metric) => (
            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4" key={metric.label}>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-400">{metric.label}</p>
              <p className="mt-2 text-xl font-black text-white">{metric.value}</p>
              <p className="mt-1 text-xs font-bold text-emerald-300">{metric.helper}</p>
            </div>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}

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
              <tr className="text-sm" key={item.id}>
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

function TopProducts({ items }) {
  return (
    <AnalyticsCard description="Products driving the highest revenue this period." title="Top products">
      <div className="space-y-4 px-5 pb-5 pt-4">
        {items.map((item, index) => (
          <div className="flex items-center gap-3" key={item.id}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-primary">
              {index + 1}
            </span>
            <img alt={item.name} className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200" src={item.image} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-950">{item.name}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">
                {item.category} · {item.sold} sold
              </p>
            </div>
            <span className="shrink-0 text-sm font-black text-slate-950">{compactCurrency(item.revenue)}</span>
          </div>
        ))}
      </div>
    </AnalyticsCard>
  );
}

function LowStockProducts({ items }) {
  return (
    <AnalyticsCard description="SKUs below reorder threshold." title="Low stock products">
      <div className="space-y-4 px-5 pb-5 pt-4">
        {items.map((item) => {
          const stockPercent = Math.min(100, Math.round((item.stock / item.reorderAt) * 100));

          return (
            <div key={item.id}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">{item.name}</p>
                  <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                    {item.sku} · {item.warehouse}
                  </p>
                </div>
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-600">
                  {item.stock}/{item.reorderAt}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-rose-500" style={{ width: `${stockPercent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsCard>
  );
}

function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-primary">
            <CalendarDays size={14} />
            09/05/2026 · Admin analytics
          </div>
          <h1 className="text-2xl font-black tracking-normal text-slate-950 md:text-3xl">Dashboard analytics</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tổng quan doanh thu, đơn hàng, tồn kho và hoạt động vận hành cho cửa hàng electronics gaming.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-admin-card transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
          <Download size={17} />
          Export report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardKpis.map((item) => (
          <StatCard icon={kpiIcons[item.key]} key={item.key} {...item} />
        ))}
      </div>

      <AdminRealtimeActivity />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <RevenueChart data={dashboardRevenueData} />
        <OrdersChart data={dashboardOrdersData} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SalesOverview data={dashboardSalesOverview} />
        <RecentOrders items={orders} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr_0.9fr]">
        <TopProducts items={dashboardTopProducts} />
        <LowStockProducts items={dashboardLowStockProducts} />
        <ActivityFeed items={dashboardRecentActivity} />
      </div>
    </section>
  );
}

export default Dashboard;
