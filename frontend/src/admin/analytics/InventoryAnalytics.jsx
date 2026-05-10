import {
  Area,
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
import { AlertTriangle, Boxes, PackageCheck, PackageOpen, Truck } from "lucide-react";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import { cn } from "../../utils/classNames";
import { compactCurrency } from "../../utils/formatters";

const toneClasses = {
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  blue: "bg-blue-50 text-primary ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
};

const metricIcons = {
  availableStock: Boxes,
  lowStock: AlertTriangle,
  reservedStock: PackageOpen,
  turnover: PackageCheck,
  replenishment: Truck,
};

function InventoryTooltip({ active, label, payload }) {
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

function InventoryMetric({ helper, metricKey, title, tone = "blue", trend, value }) {
  const Icon = metricIcons[metricKey] || Boxes;

  return (
    <div className="admin-panel admin-panel-hover rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase tracking-normal text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <span className={cn("rounded-xl p-2.5 ring-1", toneClasses[tone] || toneClasses.blue)}>
          <Icon size={19} />
        </span>
      </div>
      {trend ? <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">{trend}</span> : null}
      {helper ? <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{helper}</p> : null}
    </div>
  );
}

function InventoryAnalytics({ className, data }) {
  if (!data) {
    return null;
  }

  return (
    <section className={cn("space-y-6", className)}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.summary.map((metric) => (
          <InventoryMetric key={metric.key} metricKey={metric.key} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AnalyticsCard description="Available, reserved, and low-stock units by product category." title="Inventory by category">
          <div className="h-[350px] px-2 pb-5 pt-4 sm:px-5">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data.stockByCategory} margin={{ bottom: 0, left: 0, right: 8, top: 18 }}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="category" minTickGap={16} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} width={42} />
                <Tooltip content={<InventoryTooltip />} />
                <Bar dataKey="available" fill="#005BFF" name="Available" radius={[8, 8, 0, 0]} />
                <Bar dataKey="reserved" fill="#8B5CF6" name="Reserved" radius={[8, 8, 0, 0]} />
                <Bar dataKey="lowStock" fill="#F43F5E" name="Low stock" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        <AnalyticsCard description="Inventory health and replenishment pressure." title="Stock health">
          <div className="grid gap-4 px-5 pb-5 pt-4 sm:grid-cols-[0.85fr_1fr] xl:grid-cols-1 2xl:grid-cols-[0.85fr_1fr]">
            <div className="h-[240px]">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Tooltip content={<InventoryTooltip />} />
                  <Pie data={data.stockHealth} dataKey="value" innerRadius={54} nameKey="name" outerRadius={80} paddingAngle={4}>
                    {data.stockHealth.map((entry) => (
                      <Cell fill={entry.color} key={entry.name} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 self-center">
              {data.stockHealth.map((item) => (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3" key={item.name}>
                  <span className="inline-flex min-w-0 items-center gap-2 text-sm font-black text-slate-800">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="text-sm font-black text-slate-950">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </AnalyticsCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AnalyticsCard description="Inbound, outbound, and reserved stock movement." title="Inventory movement">
          <div className="h-[320px] px-2 pb-5 pt-4 sm:px-5">
            <ResponsiveContainer height="100%" width="100%">
              <ComposedChart data={data.movementTrend} margin={{ bottom: 0, left: 0, right: 8, top: 18 }}>
                <defs>
                  <linearGradient id="inventoryReservedFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#005BFF" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#005BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="label" tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} width={42} />
                <Tooltip content={<InventoryTooltip />} />
                <Area dataKey="reserved" fill="url(#inventoryReservedFill)" name="Reserved" stroke="#005BFF" strokeWidth={2} type="monotone" />
                <Bar dataKey="inbound" fill="#10B981" name="Inbound" radius={[8, 8, 0, 0]} />
                <Line dataKey="outbound" dot={false} name="Outbound" stroke="#F59E0B" strokeWidth={3} type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        <AnalyticsCard description="SKUs below reorder threshold with warehouse context." title="Low stock watchlist">
          <div className="space-y-4 px-5 pb-5 pt-4">
            {data.lowStock.map((item) => {
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
      </div>

      <AnalyticsCard description="Inventory analytics report for purchasing and warehouse planning." title="Replenishment report">
        <div className="overflow-x-auto px-5 pb-5 pt-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-black uppercase tracking-normal text-slate-400">
                <th className="whitespace-nowrap py-3 pr-4">Warehouse</th>
                <th className="whitespace-nowrap px-4 py-3">Open POs</th>
                <th className="whitespace-nowrap px-4 py-3">Incoming units</th>
                <th className="whitespace-nowrap px-4 py-3">Inventory value</th>
                <th className="whitespace-nowrap py-3 pl-4">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.replenishmentReports.map((report) => (
                <tr className="admin-table-row text-sm" key={report.warehouse}>
                  <td className="whitespace-nowrap py-4 pr-4 font-black text-slate-950">{report.warehouse}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{report.openPurchaseOrders}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-700">{report.incomingUnits}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-black text-slate-950">{compactCurrency(report.inventoryValue)}</td>
                  <td className="whitespace-nowrap py-4 pl-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-black",
                        report.risk === "High" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700",
                      )}
                    >
                      {report.risk}
                    </span>
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

export default InventoryAnalytics;
