import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AnalyticsCard from "./AnalyticsCard";

function OrdersTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const total = payload.find((entry) => entry.dataKey === "orders")?.value ?? 0;
  const completed = payload.find((entry) => entry.dataKey === "completed")?.value ?? 0;
  const cancelled = payload.find((entry) => entry.dataKey === "cancelled")?.value ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
      <p className="text-xs font-black text-slate-900">{label}</p>
      <p className="mt-1 text-xs font-semibold text-primary">Đơn hàng: {total}</p>
      <p className="text-xs font-semibold text-emerald-600">Hoàn tất: {completed}</p>
      <p className="text-xs font-semibold text-rose-600">Đã hủy: {cancelled}</p>
    </div>
  );
}

function OrdersChart({ data }) {
  return (
    <AnalyticsCard
      action={<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">92% fulfilled</span>}
      description="Khối lượng đơn và đơn hoàn tất theo ngày."
      title="Orders chart"
    >
      <div className="h-[340px] px-2 pb-4 pt-4 sm:px-5">
        <ResponsiveContainer height="100%" width="100%">
          <ComposedChart data={data} margin={{ bottom: 0, left: 0, right: 8, top: 16 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
            <XAxis axisLine={false} dataKey="label" minTickGap={20} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} width={36} />
            <Tooltip content={<OrdersTooltip />} />
            <Bar dataKey="orders" fill="#005BFF" radius={[8, 8, 0, 0]} />
            <Bar dataKey="cancelled" fill="#F43F5E" radius={[8, 8, 0, 0]} />
            <Line
              dataKey="completed"
              dot={false}
              stroke="#10B981"
              strokeLinecap="round"
              strokeWidth={3}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}

export default OrdersChart;
