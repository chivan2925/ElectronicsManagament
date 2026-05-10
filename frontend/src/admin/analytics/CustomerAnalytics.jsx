import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BadgeCheck, MousePointerClick, Repeat2, UsersRound, UserPlus } from "lucide-react";
import AnalyticsLoadingState from "./AnalyticsLoadingState";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import EmptyState from "../../components/ui/feedback/EmptyState";
import { cn } from "../../utils/classNames";
import { compactCurrency } from "../../utils/formatters";

const toneClasses = {
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  blue: "bg-blue-50 text-primary ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
};

const metricIcons = {
  activeCustomers: UsersRound,
  conversion: MousePointerClick,
  newCustomers: UserPlus,
  repeatRate: Repeat2,
  vipCustomers: BadgeCheck,
};

function CustomerTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
      <p className="text-xs font-black text-slate-900">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <p className="text-xs font-semibold" key={`${entry.dataKey}-${entry.name}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    </div>
  );
}

function CustomerMetric({ helper, metricKey, placeholder, title, tone = "blue", trend, value }) {
  const Icon = metricIcons[metricKey] || UsersRound;

  return (
    <div className="admin-panel admin-panel-hover group rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-normal text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <span className={cn("transition-default rounded-xl p-2.5 ring-1 group-hover:scale-105", toneClasses[tone] || toneClasses.blue)}>
          <Icon size={19} />
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {trend ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">{trend}</span>
        ) : null}
        {placeholder ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">Placeholder</span>
        ) : null}
      </div>
      {helper ? <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{helper}</p> : null}
    </div>
  );
}

function CustomerAnalytics({ className, data, error = null, loading = false, onRetry }) {
  if (loading) {
    return (
      <AnalyticsLoadingState
        className={className}
        message="Đang tổng hợp tăng trưởng, phân khúc và retention khách hàng."
        title="Đang tải analytics khách hàng"
      />
    );
  }

  if (error) {
    return (
      <ApiErrorAlert
        actionLabel="Thử lại"
        className={className}
        error={error}
        onAction={onRetry}
        surface="admin"
        title="Chưa tải được analytics khách hàng"
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        className={className}
        icon={UsersRound}
        message="Dữ liệu khách hàng sẽ hiển thị khi API reporting hoặc event tracking trả kết quả."
        size="compact"
        surface="admin"
        title="Chưa có dữ liệu khách hàng"
      />
    );
  }

  return (
    <section className={cn("space-y-6", className)}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((metric) => (
          <CustomerMetric key={metric.key} metricKey={metric.key} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AnalyticsCard description="New, returning, and total customers by day." title="Customer growth">
          <div className="h-[330px] px-2 pb-5 pt-4 sm:px-5">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={data.growthTrend} margin={{ bottom: 0, left: 0, right: 8, top: 18 }}>
                <defs>
                  <linearGradient id="customerNewFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#005BFF" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#005BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="customerReturningFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="label" minTickGap={18} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} width={38} />
                <Tooltip content={<CustomerTooltip />} />
                <Area dataKey="returningCustomers" fill="url(#customerReturningFill)" name="Returning" stroke="#10B981" strokeWidth={2} type="monotone" />
                <Area dataKey="newCustomers" fill="url(#customerNewFill)" name="New" stroke="#005BFF" strokeWidth={3} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        <AnalyticsCard description="Customer segment share for account ownership planning." title="Customer segments">
          <div className="grid gap-4 px-5 pb-5 pt-4 sm:grid-cols-[0.85fr_1fr] xl:grid-cols-1 2xl:grid-cols-[0.85fr_1fr]">
            <div className="h-[230px]">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Tooltip content={<CustomerTooltip />} />
                  <Pie data={data.segments} dataKey="value" innerRadius={52} nameKey="name" outerRadius={78} paddingAngle={4}>
                    {data.segments.map((entry) => (
                      <Cell fill={entry.color} key={entry.name} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 self-center">
              {data.segments.map((segment) => (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3" key={segment.name}>
                  <span className="inline-flex min-w-0 items-center gap-2 text-sm font-black text-slate-800">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="truncate">{segment.name}</span>
                  </span>
                  <span className="text-sm font-black text-slate-950">{segment.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AnalyticsCard
          action={<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">Conversion placeholder</span>}
          description="Funnel data is mocked until storefront event tracking exists."
          title="Conversion metrics"
        >
          <div className="space-y-4 px-5 pb-5 pt-4">
            {data.conversionFunnel.map((stage) => (
              <div key={stage.stage}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-black text-slate-950">{stage.stage}</span>
                  <span className="text-sm font-black text-slate-700">{stage.rate}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ backgroundColor: stage.color, width: `${stage.rate}%` }} />
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-500">{stage.visitors.toLocaleString("vi-VN")} sessions</p>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard description="Retention and repeat purchase quality by cohort." title="Customer retention">
          <div className="h-[320px] px-2 pb-5 pt-4 sm:px-5">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data.cohorts} margin={{ bottom: 0, left: 0, right: 8, top: 18 }}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="label" tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickFormatter={(value) => `${value}%`} tickLine={false} width={42} />
                <Tooltip content={<CustomerTooltip />} />
                <Bar dataKey="firstOrder" fill="#005BFF" name="First order" radius={[8, 8, 0, 0]} />
                <Bar dataKey="repeatPurchase" fill="#10B981" name="Repeat purchase" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>
      </div>

      <AnalyticsCard description="High-value customers and recent order behavior." title="Customer value report">
        <div className="overflow-x-auto px-5 pb-5 pt-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-black uppercase tracking-normal text-slate-400">
                <th className="whitespace-nowrap py-3 pr-4">Customer</th>
                <th className="whitespace-nowrap px-4 py-3">Orders</th>
                <th className="whitespace-nowrap px-4 py-3">Revenue</th>
                <th className="whitespace-nowrap px-4 py-3">Last order</th>
                <th className="whitespace-nowrap py-3 pl-4">Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topCustomers.map((customer) => (
                <tr className="admin-table-row text-sm" key={customer.email}>
                  <td className="whitespace-nowrap py-4 pr-4">
                    <p className="font-black text-slate-950">{customer.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">{customer.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{customer.orders}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-black text-slate-950">{compactCurrency(customer.revenue)}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{customer.lastOrder}</td>
                  <td className="whitespace-nowrap py-4 pl-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-primary">{customer.segment}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnalyticsCard>
    </section>
  );
}

export default CustomerAnalytics;
