import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { compactCurrency } from "../../../utils/formatters";
import AnalyticsCard from "./AnalyticsCard";

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const revenue = payload.find((entry) => entry.dataKey === "revenue")?.value ?? 0;
  const target = payload.find((entry) => entry.dataKey === "target")?.value ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
      <p className="text-xs font-black text-slate-900">{label}</p>
      <p className="mt-1 text-xs font-semibold text-primary">Doanh thu: {compactCurrency(revenue)}</p>
      <p className="text-xs font-semibold text-slate-500">Mục tiêu: {compactCurrency(target)}</p>
    </div>
  );
}

function RevenueChart({ data }) {
  return (
    <AnalyticsCard
      action={<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-primary">+18.2%</span>}
      description="Theo dõi doanh thu và mục tiêu từng ngày."
      title="Revenue chart"
    >
      <div className="h-[340px] px-2 pb-4 pt-4 sm:px-5">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data} margin={{ bottom: 0, left: 0, right: 8, top: 16 }}>
            <defs>
              <linearGradient id="dashboardRevenueFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#005BFF" stopOpacity={0.26} />
                <stop offset="95%" stopColor="#005BFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dashboardTargetFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
            <XAxis axisLine={false} dataKey="label" minTickGap={20} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
            <YAxis
              axisLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000000}tr`}
              tickLine={false}
              width={54}
            />
            <Tooltip content={<RevenueTooltip />} />
            <Area
              dataKey="target"
              fill="url(#dashboardTargetFill)"
              stroke="#8B5CF6"
              strokeDasharray="5 5"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              activeDot={{ fill: "#005BFF", r: 5, stroke: "#FFFFFF", strokeWidth: 2 }}
              dataKey="revenue"
              fill="url(#dashboardRevenueFill)"
              stroke="#005BFF"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}

export default RevenueChart;
