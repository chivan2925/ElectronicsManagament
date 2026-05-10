import { api } from "./client";
import { cleanParams, toArray, unwrapApiPayload } from "./mapperUtils";
import {
  getReportParams,
  getRevenueGroupBy,
  normalizeAdminReportDashboard,
  normalizeRevenueBucket,
  normalizeStatusBreakdown,
  normalizeTopProduct,
} from "./reportMapper";

const ADMIN_REPORT_PATH = "/admin/reports";

export async function getDashboardReport(filters = {}, config = {}) {
  const data = await api.get(`${ADMIN_REPORT_PATH}/dashboard`, {
    ...config,
    params: cleanParams({
      ...getReportParams(filters),
      ...config.params,
    }),
  });

  return normalizeAdminReportDashboard(data);
}

export async function getRevenueReport(filters = {}, config = {}) {
  const data = await api.get(`${ADMIN_REPORT_PATH}/revenue`, {
    ...config,
    params: cleanParams({
      ...getReportParams(filters),
      groupBy: getRevenueGroupBy(filters),
      ...config.params,
    }),
  });

  return toArray(unwrapApiPayload(data)).map(normalizeRevenueBucket);
}

export async function getOrderStatusReport(filters = {}, config = {}) {
  const data = await api.get(`${ADMIN_REPORT_PATH}/order-status`, {
    ...config,
    params: cleanParams({
      ...getReportParams(filters),
      ...config.params,
    }),
  });

  return toArray(unwrapApiPayload(data)).map(normalizeStatusBreakdown);
}

export async function getTopProductsReport(filters = {}, config = {}) {
  const data = await api.get(`${ADMIN_REPORT_PATH}/top-products`, {
    ...config,
    params: cleanParams({
      ...getReportParams(filters),
      limit: filters.limit ?? 10,
      ...config.params,
    }),
  });

  return toArray(unwrapApiPayload(data)).map(normalizeTopProduct);
}

const reportService = {
  getDashboardReport,
  getOrderStatusReport,
  getRevenueReport,
  getTopProductsReport,
};

export default reportService;
