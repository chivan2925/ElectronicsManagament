import { firstDefined, toArray, toNumber, unwrapApiPayload } from "./mapperUtils";
import { compactCurrency, formatCurrency } from "../utils/formatters";

const STATUS_COLORS = {
  CANCELLED: "#EF4444",
  COMPLETED: "#10B981",
  CONFIRMED: "#005BFF",
  DELIVERED: "#10B981",
  PENDING: "#F59E0B",
  PROCESSING: "#8B5CF6",
  REFUNDED: "#64748B",
  RETURNED: "#F43F5E",
  SHIPPING: "#0EA5E9",
};

const STATUS_LABELS = {
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn tất",
  CONFIRMED: "Đã xác nhận",
  DELIVERED: "Đã giao",
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  REFUNDED: "Đã hoàn tiền",
  RETURNED: "Đã trả hàng",
  SHIPPING: "Đang giao",
};

function formatDateInput(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const nextDate = new Date(date);

  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusLabel(status) {
  const normalizedStatus = String(status ?? "").trim().toUpperCase();

  return (STATUS_LABELS[normalizedStatus] ?? normalizedStatus) || "Không rõ";
}

function getReportPercentage(part, total) {
  if (!total) {
    return 0;
  }

  return Number(((part / total) * 100).toFixed(1));
}

function getShortName(name = "") {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  return words.length > 3 ? `${words.slice(0, 3).join(" ")}...` : words.join(" ");
}

function getAverageOrderValue(revenue, orderCount) {
  return orderCount > 0 ? Math.round(revenue / orderCount) : 0;
}

export function getDefaultAdminReportFilters(referenceDate = new Date()) {
  return {
    channel: "all",
    from: formatDateInput(addDays(referenceDate, -29)),
    preset: "30d",
    segment: "all",
    to: formatDateInput(referenceDate),
  };
}

export function getReportParams(filters = {}) {
  return {
    fromDate: filters.from,
    toDate: filters.to,
  };
}

export function getRevenueGroupBy(filters = {}) {
  const preset = String(filters.preset ?? "").toLowerCase();

  return preset === "quarter" || preset === "ytd" ? "MONTH" : "DAY";
}

export function normalizeRevenueBucket(raw = {}) {
  return {
    discount: toNumber(raw.discount, 0),
    endDate: firstDefined(raw.endDate, null),
    itemCount: toNumber(raw.itemCount, 0),
    label: firstDefined(raw.label, raw.period, ""),
    orderCount: toNumber(raw.orderCount, 0),
    period: firstDefined(raw.period, raw.label, ""),
    revenue: toNumber(raw.revenue, 0),
    revenueOrderCount: toNumber(raw.revenueOrderCount, 0),
    shippingFee: toNumber(raw.shippingFee, 0),
    startDate: firstDefined(raw.startDate, null),
    subtotal: toNumber(raw.subtotal, 0),
  };
}

export function normalizeStatusBreakdown(raw = {}) {
  const status = String(firstDefined(raw.status, raw.label, "")).trim().toUpperCase();

  return {
    amount: toNumber(raw.amount, 0),
    color: STATUS_COLORS[status] ?? "#64748B",
    count: toNumber(raw.count, 0),
    label: firstDefined(raw.label, getStatusLabel(status)),
    percentage: toNumber(raw.percentage, 0),
    status,
  };
}

export function normalizeTopProduct(raw = {}, index = 0) {
  const name = firstDefined(raw.productName, raw.name, "Sản phẩm");
  const revenue = toNumber(raw.revenue, 0);
  const sold = toNumber(firstDefined(raw.quantitySold, raw.sold), 0);

  return {
    brandId: firstDefined(raw.brandId, null),
    brandName: firstDefined(raw.brandName, ""),
    categoryId: firstDefined(raw.categoryId, null),
    categoryName: firstDefined(raw.categoryName, ""),
    id: firstDefined(raw.productId, raw.id, index + 1),
    image: firstDefined(raw.image, raw.imageUrl, null),
    margin: 0,
    name,
    orderCount: toNumber(raw.orderCount, 0),
    revenue,
    shortName: getShortName(name),
    sold,
  };
}

export function normalizeAdminReportDashboard(response = {}) {
  const raw = unwrapApiPayload(response) ?? {};
  const revenueSeries = toArray(raw.revenueSeries).map(normalizeRevenueBucket);
  const orderStatusBreakdown = toArray(raw.orderStatusBreakdown).map(normalizeStatusBreakdown);
  const topProducts = toArray(raw.topProducts).map(normalizeTopProduct);

  return {
    averageOrderValue: toNumber(raw.averageOrderValue, 0),
    cancelledOrderCount: toNumber(raw.cancelledOrderCount, 0),
    completedOrderCount: toNumber(raw.completedOrderCount, 0),
    discount: toNumber(raw.discount, 0),
    fromDate: firstDefined(raw.fromDate, ""),
    generatedAt: firstDefined(raw.generatedAt, ""),
    itemCount: toNumber(raw.itemCount, 0),
    orderCount: toNumber(raw.orderCount, 0),
    orderStatusBreakdown,
    paidOrderCount: toNumber(raw.paidOrderCount, 0),
    pendingOrderCount: toNumber(raw.pendingOrderCount, 0),
    revenue: toNumber(raw.revenue, 0),
    revenueOrderCount: toNumber(raw.revenueOrderCount, 0),
    revenueSeries,
    shippingFee: toNumber(raw.shippingFee, 0),
    subtotal: toNumber(raw.subtotal, 0),
    toDate: firstDefined(raw.toDate, ""),
    topProducts,
  };
}

export function buildRevenueAnalyticsData(report) {
  if (!report) {
    return null;
  }

  const revenueTrend = report.revenueSeries.map((bucket) => ({
    ...bucket,
    gross: bucket.revenue,
    label: bucket.label || bucket.period,
    netRevenue: Math.max(0, bucket.revenue - bucket.discount),
    target: Math.round(Math.max(bucket.revenue, report.averageOrderValue) * 1.08),
  }));
  const orderTrend = report.revenueSeries.map((bucket) => ({
    cancelled: 0,
    completed: bucket.revenueOrderCount,
    conversion: getReportPercentage(bucket.revenueOrderCount, bucket.orderCount),
    label: bucket.label || bucket.period,
    orders: bucket.orderCount,
  }));
  const statusMix = report.orderStatusBreakdown.filter((item) => item.count > 0);
  const channelMix = statusMix.length
    ? statusMix.map((item) => ({
        color: item.color,
        name: getStatusLabel(item.status),
        revenue: item.amount,
        value: Number(item.percentage.toFixed(1)),
      }))
    : [{ color: "#94A3B8", name: "Chưa có đơn", revenue: 0, value: 100 }];
  const revenueOrderRate = getReportPercentage(report.revenueOrderCount, report.orderCount);

  return {
    channelMix,
    orderTrend,
    revenueTrend,
    salesReports: report.revenueSeries.slice(-8).map((bucket) => ({
      aov: getAverageOrderValue(bucket.revenue, bucket.revenueOrderCount),
      conversion: getReportPercentage(bucket.revenueOrderCount, bucket.orderCount),
      label: bucket.label || bucket.period,
      orders: bucket.orderCount,
      revenue: bucket.revenue,
      trend: `${bucket.itemCount} sản phẩm`,
    })),
    summary: [
      {
        helper: `${report.revenueOrderCount} đơn được tính doanh thu.`,
        key: "grossRevenue",
        title: "Doanh thu",
        tone: "blue",
        trend: `${report.orderCount} đơn`,
        value: compactCurrency(report.revenue),
      },
      {
        helper: `Sau giảm giá ${formatCurrency(report.discount)}.`,
        key: "netRevenue",
        title: "Doanh thu thuần",
        tone: "emerald",
        trend: `${report.itemCount} sản phẩm`,
        value: compactCurrency(Math.max(0, report.revenue - report.discount)),
      },
      {
        helper: "Giá trị trung bình trên đơn có doanh thu.",
        key: "averageOrder",
        title: "AOV",
        tone: "violet",
        trend: `${report.revenueOrderCount} đơn`,
        value: compactCurrency(report.averageOrderValue),
      },
      {
        helper: "Tỷ lệ đơn được tính doanh thu trong kỳ.",
        key: "orders",
        title: "Đơn doanh thu",
        tone: "amber",
        trend: `${revenueOrderRate}%`,
        value: report.revenueOrderCount.toLocaleString("vi-VN"),
      },
    ],
    topProducts: report.topProducts,
  };
}

export function buildDashboardKpis(report) {
  if (!report) {
    return [];
  }

  const lastBucket =
    [...report.revenueSeries].reverse().find((bucket) => bucket.revenue > 0) ??
    report.revenueSeries[report.revenueSeries.length - 1];

  return [
    {
      helper: lastBucket?.label ? `Ngày/kỳ ${lastBucket.label}` : "Kỳ mới nhất",
      key: "todayRevenue",
      title: "Doanh thu gần nhất",
      tone: "blue",
      trend: `${lastBucket?.orderCount ?? 0} đơn`,
      trendType: "up",
      value: compactCurrency(lastBucket?.revenue ?? 0),
    },
    {
      helper: `${report.fromDate} → ${report.toDate}`,
      key: "monthRevenue",
      title: "Doanh thu kỳ",
      tone: "emerald",
      trend: `${report.revenueOrderCount} đơn doanh thu`,
      trendType: "up",
      value: compactCurrency(report.revenue),
    },
    {
      helper: `${report.pendingOrderCount} đơn chờ xử lý`,
      key: "orders",
      title: "Đơn hàng",
      tone: "violet",
      trend: `${report.completedOrderCount} hoàn tất`,
      trendType: "up",
      value: report.orderCount.toLocaleString("vi-VN"),
    },
    {
      helper: "Tổng số lượng sản phẩm trong đơn",
      key: "items",
      title: "Sản phẩm bán ra",
      tone: "amber",
      trend: `${report.paidOrderCount} đã thanh toán`,
      trendType: "up",
      value: report.itemCount.toLocaleString("vi-VN"),
    },
    {
      helper: "Đơn bị hủy trong kỳ",
      key: "cancelled",
      title: "Đơn hủy",
      tone: report.cancelledOrderCount > 0 ? "rose" : "emerald",
      trend: `${report.cancelledOrderCount} đơn`,
      trendType: report.cancelledOrderCount > 0 ? "down" : "flat",
      value: report.cancelledOrderCount.toLocaleString("vi-VN"),
    },
  ];
}

export function buildTopSellerRows(topProducts = []) {
  return topProducts.map((item, index) => ({
    id: index + 1,
    name: item.name,
    orderCount: item.orderCount,
    revenue: item.revenue,
    sold: item.sold,
  }));
}

export function buildRecentOrderRows(orders = []) {
  return orders.map((order) => ({
    createdAt: formatDateTime(order.createdAt),
    customer: firstDefined(order.customerName, order.userFullName, order.shippingName, "Khách hàng"),
    id: firstDefined(order.code, order.id),
    payment: firstDefined(order.paymentMethod, "CASH"),
    status: firstDefined(order.status, order.stage, "PENDING"),
    total: toNumber(order.total, 0),
  }));
}

export function buildActivityRowsFromOrders(orders = []) {
  return orders.map((order, index) => ({
    action: `Đơn ${firstDefined(order.code, order.id)} cập nhật trạng thái ${getStatusLabel(order.status)}.`,
    actor: firstDefined(order.customerName, order.userFullName, order.shippingName, "Khách hàng"),
    id: firstDefined(order.id, index + 1),
    time: formatDateTime(firstDefined(order.updatedAt, order.createdAt)),
    type: String(order.paymentStatus).toUpperCase() === "PAID" ? "PAYMENT" : "ORDER",
  }));
}
