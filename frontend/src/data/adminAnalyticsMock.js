import {
  dashboardLowStockProducts,
  dashboardOrdersData,
  dashboardRevenueData,
  dashboardTopProducts,
} from "./adminMock";

export const analyticsFilterDefaults = {
  channel: "all",
  from: "2026-04-10",
  preset: "30d",
  segment: "all",
  to: "2026-05-09",
};

export const adminRevenueAnalytics = {
  channelMix: [
    { color: "#005BFF", name: "Storefront", revenue: 1647000000, value: 58 },
    { color: "#10B981", name: "Admin assisted", revenue: 766800000, value: 27 },
    { color: "#8B5CF6", name: "Marketplace", revenue: 425600000, value: 15 },
  ],
  orderTrend: dashboardOrdersData.map((item, index) => ({
    ...item,
    conversion: [3.7, 4.1, 3.9, 4.6, 4.9, 5.2, 4.8][index],
  })),
  revenueTrend: dashboardRevenueData.map((item, index) => ({
    ...item,
    gross: item.revenue,
    netRevenue: Math.round(item.revenue * [0.89, 0.9, 0.88, 0.91, 0.92, 0.9, 0.93, 0.91, 0.89, 0.92, 0.94, 0.91, 0.93, 0.9][index]),
  })),
  salesReports: [
    { aov: 2210000, conversion: 4.8, label: "All sales", orders: 1284, revenue: 2840000000, trend: "+12.8%" },
    { aov: 1870000, conversion: 5.4, label: "Gaming accessories", orders: 642, revenue: 1201000000, trend: "+18.4%" },
    { aov: 31200000, conversion: 2.7, label: "Laptop and PC", orders: 118, revenue: 3681000000, trend: "+9.6%" },
    { aov: 2490000, conversion: 4.1, label: "Audio gear", orders: 268, revenue: 667300000, trend: "+6.3%" },
  ],
  summary: [
    {
      helper: "COD, VNPay Sandbox, and MoMo Sandbox order revenue.",
      key: "grossRevenue",
      title: "Gross revenue",
      tone: "blue",
      trend: "+12.8%",
      value: "2.84 tỷ",
    },
    {
      helper: "Estimated after discounts, refunds, and unpaid online orders.",
      key: "netRevenue",
      title: "Net revenue",
      tone: "emerald",
      trend: "+10.9%",
      value: "2.56 tỷ",
    },
    {
      helper: "Average order value across storefront and assisted orders.",
      key: "averageOrder",
      title: "AOV",
      tone: "violet",
      trend: "+9.1%",
      value: "2.21tr",
    },
    {
      helper: "Placeholder until storefront event tracking is connected.",
      key: "conversion",
      placeholder: true,
      title: "Conversion",
      tone: "amber",
      trend: "+0.6%",
      value: "4.8%",
    },
  ],
  topProducts: dashboardTopProducts.map((item, index) => ({
    ...item,
    margin: [31, 18, 37, 29][index],
    shortName: ["G Pro X", "ROG G16", "BlackShark", "K70 RGB"][index],
  })),
};

export const adminCustomerAnalytics = {
  cohorts: [
    { firstOrder: 82, label: "W1", repeatPurchase: 34, retention: 41 },
    { firstOrder: 76, label: "W2", repeatPurchase: 31, retention: 39 },
    { firstOrder: 94, label: "W3", repeatPurchase: 42, retention: 45 },
    { firstOrder: 88, label: "W4", repeatPurchase: 38, retention: 43 },
  ],
  conversionFunnel: [
    { color: "#005BFF", rate: 100, stage: "Sessions", visitors: 28420 },
    { color: "#10B981", rate: 62, stage: "Product views", visitors: 17620 },
    { color: "#8B5CF6", rate: 24, stage: "Add to cart", visitors: 6810 },
    { color: "#F59E0B", rate: 8, stage: "Checkout started", visitors: 2274 },
    { color: "#F43F5E", rate: 4.8, stage: "Orders placed", visitors: 1365 },
  ],
  growthTrend: [
    { label: "26/04", newCustomers: 38, returningCustomers: 112, totalCustomers: 150 },
    { label: "27/04", newCustomers: 44, returningCustomers: 118, totalCustomers: 162 },
    { label: "28/04", newCustomers: 36, returningCustomers: 103, totalCustomers: 139 },
    { label: "29/04", newCustomers: 52, returningCustomers: 136, totalCustomers: 188 },
    { label: "30/04", newCustomers: 61, returningCustomers: 144, totalCustomers: 205 },
    { label: "01/05", newCustomers: 57, returningCustomers: 148, totalCustomers: 205 },
    { label: "02/05", newCustomers: 66, returningCustomers: 161, totalCustomers: 227 },
    { label: "03/05", newCustomers: 48, returningCustomers: 139, totalCustomers: 187 },
    { label: "04/05", newCustomers: 42, returningCustomers: 132, totalCustomers: 174 },
    { label: "05/05", newCustomers: 54, returningCustomers: 151, totalCustomers: 205 },
    { label: "06/05", newCustomers: 68, returningCustomers: 171, totalCustomers: 239 },
    { label: "07/05", newCustomers: 63, returningCustomers: 159, totalCustomers: 222 },
    { label: "08/05", newCustomers: 71, returningCustomers: 184, totalCustomers: 255 },
    { label: "09/05", newCustomers: 55, returningCustomers: 146, totalCustomers: 201 },
  ],
  segments: [
    { color: "#005BFF", name: "Returning", value: 52 },
    { color: "#10B981", name: "New", value: 31 },
    { color: "#8B5CF6", name: "VIP", value: 11 },
    { color: "#F59E0B", name: "At risk", value: 6 },
  ],
  summary: [
    { helper: "Customers with at least one order in the selected range.", key: "activeCustomers", title: "Active customers", tone: "blue", trend: "+7.4%", value: "9,420" },
    { helper: "First purchase or first registered account this period.", key: "newCustomers", title: "New customers", tone: "emerald", trend: "+12.1%", value: "728" },
    { helper: "Repeat purchase share across known customer accounts.", key: "repeatRate", title: "Repeat rate", tone: "violet", trend: "+3.2%", value: "43%" },
    { helper: "Placeholder until event-level conversion tracking is available.", key: "conversion", placeholder: true, title: "Checkout conversion", tone: "amber", trend: "+0.6%", value: "4.8%" },
  ],
  topCustomers: [
    { email: "minhanh@gmail.com", lastOrder: "09/05/2026", name: "Nguyễn Minh Anh", orders: 12, revenue: 68400000, segment: "VIP" },
    { email: "kietpt@gmail.com", lastOrder: "08/05/2026", name: "Phạm Tuấn Kiệt", orders: 7, revenue: 37600000, segment: "Returning" },
    { email: "huytd@gmail.com", lastOrder: "09/05/2026", name: "Trần Đức Huy", orders: 5, revenue: 22490000, segment: "Returning" },
    { email: "baolg@gmail.com", lastOrder: "08/05/2026", name: "Lê Gia Bảo", orders: 2, revenue: 4890000, segment: "At risk" },
  ],
};

export const adminInventoryAnalytics = {
  lowStock: dashboardLowStockProducts,
  movementTrend: [
    { inbound: 118, label: "T2", outbound: 92, reserved: 38 },
    { inbound: 84, label: "T3", outbound: 101, reserved: 42 },
    { inbound: 96, label: "T4", outbound: 89, reserved: 36 },
    { inbound: 132, label: "T5", outbound: 117, reserved: 51 },
    { inbound: 148, label: "T6", outbound: 126, reserved: 58 },
    { inbound: 176, label: "T7", outbound: 138, reserved: 62 },
    { inbound: 102, label: "CN", outbound: 96, reserved: 44 },
  ],
  replenishmentReports: [
    { incomingUnits: 420, inventoryValue: 6120000000, openPurchaseOrders: 6, risk: "Normal", warehouse: "Kho trung tâm" },
    { incomingUnits: 180, inventoryValue: 2840000000, openPurchaseOrders: 3, risk: "High", warehouse: "Kho Hà Nội" },
    { incomingUnits: 96, inventoryValue: 1210000000, openPurchaseOrders: 2, risk: "Normal", warehouse: "Kho Đà Nẵng" },
    { incomingUnits: 34, inventoryValue: 420000000, openPurchaseOrders: 1, risk: "High", warehouse: "Kho bảo hành" },
  ],
  stockByCategory: [
    { available: 324, category: "laptop", lowStock: 8, reserved: 42 },
    { available: 286, category: "điện thoại", lowStock: 5, reserved: 37 },
    { available: 612, category: "linh kiện PC", lowStock: 18, reserved: 74 },
    { available: 428, category: "phụ kiện", lowStock: 11, reserved: 53 },
    { available: 96, category: "PC Gaming", lowStock: 6, reserved: 18 },
  ],
  stockHealth: [
    { color: "#10B981", name: "Healthy", value: 68 },
    { color: "#005BFF", name: "Reserved", value: 18 },
    { color: "#F59E0B", name: "Watch", value: 9 },
    { color: "#F43F5E", name: "Low stock", value: 5 },
  ],
  summary: [
    { helper: "Sellable stock across active warehouses.", key: "availableStock", title: "Available units", tone: "blue", trend: "+4.2%", value: "5,770" },
    { helper: "Reserved by unpaid or processing orders.", key: "reservedStock", title: "Reserved units", tone: "amber", trend: "+12.6%", value: "226" },
    { helper: "SKUs below reorder threshold.", key: "lowStock", title: "Low-stock SKUs", tone: "rose", trend: "18 items", value: "18" },
    { helper: "Estimated inventory turnover for the period.", key: "turnover", title: "Turnover", tone: "emerald", trend: "+0.4x", value: "3.8x" },
  ],
};
