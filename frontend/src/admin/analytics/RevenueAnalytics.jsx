import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CircleDollarSign, MousePointerClick, ReceiptText, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import AnalyticsLoadingState from "./AnalyticsLoadingState";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import OptimizedImage from "../../components/common/OptimizedImage";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import EmptyState from "../../components/ui/feedback/EmptyState";
import { cn } from "../../utils/classNames";
import { compactCurrency, formatCurrency } from "../../utils/formatters";

const metricToneClasses = {
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  blue: "bg-blue-50 text-primary ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
};

const metricIcons = {
  averageOrder: ReceiptText,
  conversion: MousePointerClick,
  grossRevenue: CircleDollarSign,
  netRevenue: Wallet,
  orders: ShoppingBag,
};

function formatTooltipValue(entry) {
  const key = entry.dataKey ?? "";

  if (key.toLowerCase().includes("revenue") || key === "target" || key === "gross") {
    return compactCurrency(entry.value);
  }

  if (key.toLowerCase().includes("conversion")) {
    return `${entry.value}%`;
  }

  return entry.value;
}

function ChartTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
      <p className="text-xs font-black text-slate-900">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <p className="text-xs font-semibold" key={`${entry.dataKey}-${entry.name}`} style={{ color: entry.color }}>
            {entry.name}: {formatTooltipValue(entry)}
          </p>
        ))}
      </div>
    </div>
  );
}

function MetricTile({ helper, metricKey, placeholder, title, tone = "blue", trend, value }) {
  const Icon = metricIcons[metricKey] || TrendingUp;

  return (
    <div className="admin-panel admin-panel-hover group rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-normal text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <span className={cn("transition-default rounded-xl p-2.5 ring-1 group-hover:scale-105", metricToneClasses[tone] || metricToneClasses.blue)}>
          <Icon size={19} />
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {trend ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">{trend}</span>
        ) : null}
        {placeholder ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">Dự kiến</span>
        ) : null}
      </div>
      {helper ? <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{helper}</p> : null}
    </div>
  );
}

function RevenueAnalytics({ className, data, error = null, loading = false, onRetry }) {
  if (loading) {
    return (
      <AnalyticsLoadingState
        className={className}
        message="Đang lấy doanh thu, đơn hàng và báo cáo bán chạy."
        title="Đang tải báo cáo doanh thu"
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
        title="Chưa tải được báo cáo doanh thu"
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        className={className}
        icon={ReceiptText}
        message="Chọn lại khoảng thời gian hoặc làm mới khi API reporting sẵn sàng."
        size="compact"
        surface="admin"
        title="Chưa có dữ liệu doanh thu"
      />
    );
  }

  return (
    <section className={cn("space-y-6", className)}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((metric) => (
          <MetricTile key={metric.key} metricKey={metric.key} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <AnalyticsCard
          action={<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-primary">Phân tích doanh thu</span>}
          description="Xu hướng doanh thu gộp, mục tiêu và doanh thu thuần trong kỳ."
          title="Xu hướng doanh thu"
        >
          <div className="h-[360px] px-2 pb-5 pt-4 sm:px-5">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={data.revenueTrend} margin={{ bottom: 0, left: 0, right: 8, top: 18 }}>
                <defs>
                  <linearGradient id="adminRevenueGrossFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#005BFF" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#005BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adminRevenueNetFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="label" minTickGap={18} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  tickFormatter={(value) => compactCurrency(value)}
                  tickLine={false}
                  width={58}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area dataKey="target" fill="#FFFFFF00" name="Mục tiêu" stroke="#8B5CF6" strokeDasharray="5 5" strokeWidth={2} type="monotone" />
                <Area dataKey="netRevenue" fill="url(#adminRevenueNetFill)" name="Doanh thu thuần" stroke="#10B981" strokeWidth={2} type="monotone" />
                <Area
                  activeDot={{ fill: "#005BFF", r: 5, stroke: "#FFFFFF", strokeWidth: 2 }}
                  dataKey="revenue"
                  fill="url(#adminRevenueGrossFill)"
                  name="Doanh thu gộp"
                  stroke="#005BFF"
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        <AnalyticsCard
          action={<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Xu hướng đơn hàng</span>}
          description="Đơn hàng, số lượng hoàn tất, hủy đơn và chuyển đổi dự kiến."
          title="Đơn hàng và chuyển đổi"
        >
          <div className="h-[360px] px-2 pb-5 pt-4 sm:px-5">
            <ResponsiveContainer height="100%" width="100%">
              <ComposedChart data={data.orderTrend} margin={{ bottom: 0, left: 0, right: 8, top: 18 }}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="label" tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} width={34} yAxisId="orders" />
                <YAxis
                  axisLine={false}
                  orientation="right"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                  width={38}
                  yAxisId="conversion"
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="orders" fill="#005BFF" name="Đơn hàng" radius={[8, 8, 0, 0]} yAxisId="orders" />
                <Line dataKey="completed" dot={false} name="Hoàn tất" stroke="#10B981" strokeWidth={3} type="monotone" yAxisId="orders" />
                <Line
                  dataKey="conversion"
                  dot={{ fill: "#F59E0B", r: 3 }}
                  name="Chuyển đổi"
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  type="monotone"
                  yAxisId="conversion"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <AnalyticsCard description="Tỷ trọng trạng thái đơn hàng và giá trị đơn trong kỳ." title="Order status mix">
          <div className="grid gap-4 px-5 pb-5 pt-4 lg:grid-cols-[0.82fr_1fr]">
            <div className="h-[260px]">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Tooltip content={<ChartTooltip />} />
                  <Pie data={data.channelMix} dataKey="value" innerRadius={58} nameKey="name" outerRadius={86} paddingAngle={4}>
                    {data.channelMix.map((entry) => (
                      <Cell fill={entry.color} key={entry.name} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 self-center">
              {data.channelMix.map((channel) => (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3" key={channel.name}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex min-w-0 items-center gap-2 text-sm font-black text-slate-800">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: channel.color }} />
                      <span className="truncate">{channel.name}</span>
                    </span>
                    <span className="text-sm font-black text-slate-950">{channel.value}%</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{compactCurrency(channel.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsCard>

        <AnalyticsCard description="Sản phẩm bán chạy theo số lượng và doanh thu từ đơn hàng thật." title="Top selling products">
          <div className="grid gap-5 px-5 pb-5 pt-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="h-[280px]">
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={data.topProducts} layout="vertical" margin={{ bottom: 0, left: 0, right: 8, top: 8 }}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" horizontal={false} />
                  <XAxis axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} type="number" />
                  <YAxis
                    axisLine={false}
                    dataKey="shortName"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickLine={false}
                    type="category"
                    width={98}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="sold" fill="#005BFF" name="Đã bán" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {data.topProducts.map((item, index) => (
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm" key={item.id}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-primary">
                    {index + 1}
                  </span>
                  <OptimizedImage
                    alt={item.name}
                    className="h-full w-full object-cover"
                    fallbackKind="product"
                    placeholderClassName="rounded-xl bg-slate-100"
                    sizes="48px"
                    src={item.image}
                    wrapperClassName="h-12 w-12 shrink-0 rounded-xl bg-slate-100 ring-1 ring-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-950">{item.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">
                      Đã bán {item.sold} · {item.orderCount} đơn
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-black text-slate-950">{compactCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsCard>
      </div>

      <AnalyticsCard
        action={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">Báo cáo bán hàng</span>}
        description="Doanh thu, số đơn và AOV được tổng hợp từ API reporting."
        title="Chi tiết báo cáo bán hàng"
      >
        <div className="overflow-x-auto px-5 pb-5 pt-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-black uppercase tracking-normal text-slate-400">
                <th className="whitespace-nowrap py-3 pr-4">Kỳ báo cáo</th>
                <th className="whitespace-nowrap px-4 py-3">Đơn hàng</th>
                <th className="whitespace-nowrap px-4 py-3">Doanh thu</th>
                <th className="whitespace-nowrap px-4 py-3">AOV</th>
                <th className="whitespace-nowrap px-4 py-3">Chuyển đổi</th>
                <th className="whitespace-nowrap py-3 pl-4">Xu hướng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.salesReports.map((report) => (
                <tr className="admin-table-row text-sm" key={report.label}>
                  <td className="whitespace-nowrap py-4 pr-4 font-black text-slate-950">{report.label}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{report.orders}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-black text-slate-950">{formatCurrency(report.revenue)}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{formatCurrency(report.aov)}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{report.conversion}%</td>
                  <td className="whitespace-nowrap py-4 pl-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">{report.trend}</span>
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

export default RevenueAnalytics;
