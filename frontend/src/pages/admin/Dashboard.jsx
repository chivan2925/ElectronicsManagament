import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Package, ShoppingCart, Timer, Users, Wallet } from "lucide-react";
import DataTable from "../../components/ui/admin/DataTable";
import StatCard from "../../components/ui/admin/StatCard";
import StatusBadge from "../../components/ui/admin/StatusBadge";
import {
  bestSellers,
  kpiCards,
  orderStatusData,
  orders,
  products,
  revenueData,
} from "../../data/adminMock";
import { compactCurrency, formatCurrency } from "../../utils/formatters";

const statIcons = [Wallet, ShoppingCart, Package, Users, Timer];

const orderColumns = [
  { key: "id", label: "Mã đơn", render: (item) => <span className="font-bold text-primary">{item.id}</span> },
  { key: "customer", label: "Khách hàng" },
  { key: "total", label: "Tổng tiền", render: (item) => <span className="font-bold">{formatCurrency(item.total)}</span> },
  { key: "payment", label: "Thanh toán" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

const latestProductColumns = [
  {
    key: "name",
    label: "Sản phẩm",
    render: (item) => (
      <div className="flex items-center gap-3">
        <img alt={item.name} className="h-11 w-11 rounded-lg object-cover" src={item.image} />
        <div>
          <p className="font-bold text-ink">{item.name}</p>
          <p className="text-xs text-muted">{item.category}</p>
        </div>
      </div>
    ),
  },
  { key: "brand", label: "Thương hiệu" },
  { key: "price", label: "Giá", render: (item) => <span className="font-bold">{formatCurrency(item.price)}</span> },
  { key: "stock", label: "Tồn kho" },
  { key: "status", label: "Trạng thái", render: (item) => <StatusBadge status={item.status} /> },
];

function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-normal text-ink">Tổng quan</h1>
          <p className="mt-1 text-sm text-muted">Theo dõi vận hành cửa hàng thiết bị điện tử và gaming.</p>
        </div>
        <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary">
          Xuất báo cáo
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpiCards.map((item, index) => (
          <StatCard
            icon={statIcons[index]}
            key={item.title}
            title={item.title}
            tone={item.tone}
            trend={item.trend}
            value={item.value}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-lg border border-border bg-panel p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-ink">Doanh thu 7 ngày</h2>
              <p className="text-sm text-muted">Đơn vị: triệu đồng</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">+18.2%</span>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#005BFF" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#005BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
                <XAxis axisLine={false} dataKey="day" tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Area
                  dataKey="revenue"
                  fill="url(#revenueFill)"
                  stroke="#005BFF"
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-lg border border-border bg-panel p-5 shadow-sm">
          <h2 className="text-lg font-black text-ink">Trạng thái đơn hàng</h2>
          <p className="text-sm text-muted">Phân bổ theo trạng thái hiện tại</p>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={orderStatusData}
                  dataKey="value"
                  innerRadius={68}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {orderStatusData.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {orderStatusData.map((item) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2" key={item.name}>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-ink">{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-border bg-panel p-5 shadow-sm">
          <h2 className="text-lg font-black text-ink">Sản phẩm bán chạy</h2>
          <div className="mt-4 space-y-3">
            {bestSellers.map((item, index) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3" key={item.id}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{item.name}</p>
                    <p className="text-xs text-muted">{item.sold} sản phẩm đã bán</p>
                  </div>
                </div>
                <p className="text-sm font-black text-ink">{compactCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </article>

        <DataTable columns={orderColumns} data={orders} />
      </div>

      <DataTable columns={latestProductColumns} data={products.slice(0, 5)} />
    </section>
  );
}

export default Dashboard;
