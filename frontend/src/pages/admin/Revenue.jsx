import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AnalyticsCard from "../../admin/components/dashboard/AnalyticsCard";
import PageHeader from "../../components/ui/admin/PageHeader";
import { revenueData } from "../../data/adminMock";

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const revenue = payload.find((entry) => entry.dataKey === "revenue")?.value ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
      <p className="text-xs font-black text-slate-900">{label}</p>
      <p className="mt-1 text-xs font-semibold text-primary">Doanh thu: {revenue}tr</p>
    </div>
  );
}

function Revenue() {
  return (
    <section className="space-y-4">
      <PageHeader
        subtitle="Theo dõi doanh thu theo ngày, phục vụ mở rộng sang báo cáo theo tháng/quý."
        title="Báo cáo doanh thu"
      />
      <AnalyticsCard
        action={<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-primary">Mock report</span>}
        description="Biểu đồ dùng chung tone, tooltip và spacing với dashboard analytics."
        title="Revenue trend"
      >
        <div className="h-[420px] px-2 pb-5 pt-4 sm:px-5">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={revenueData} margin={{ bottom: 0, left: 0, right: 8, top: 16 }}>
              <defs>
                <linearGradient id="reportRevenueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#005BFF" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#005BFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="day" minTickGap={20} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
              <YAxis
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `${value}tr`}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Area dataKey="revenue" fill="url(#reportRevenueFill)" stroke="#005BFF" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>
    </section>
  );
}

export default Revenue;
