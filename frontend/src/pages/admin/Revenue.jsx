import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/admin/PageHeader";
import { revenueData } from "../../data/adminMock";

function Revenue() {
  return (
    <section>
      <PageHeader
        subtitle="Theo dõi doanh thu theo ngày, phục vụ mở rộng sang báo cáo theo tháng/quý."
        title="Báo cáo doanh thu"
      />
      <Card as="article" className="p-5" variant="admin">
        <div className="h-[420px]">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="reportRevenueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#005BFF" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#005BFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} />
              <XAxis axisLine={false} dataKey="day" tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }} />
              <Area dataKey="revenue" fill="url(#reportRevenueFill)" stroke="#005BFF" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}

export default Revenue;
