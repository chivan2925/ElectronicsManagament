import { useCallback, useEffect, useMemo, useState } from "react";
import orderService from "../../api/orderService";
import reportService from "../../api/reportService";
import {
  buildActivityRowsFromOrders,
  buildDashboardKpis,
  buildRecentOrderRows,
  buildRevenueAnalyticsData,
} from "../../api/reportMapper";

function useAdminReportDashboard(filters, { includeRecentOrders = false, recentOrderLimit = 5 } = {}) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [report, setReport] = useState(null);
  const from = filters?.from;
  const to = filters?.to;

  const refresh = useCallback(() => {
    setRefreshIndex((currentIndex) => currentIndex + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) {
          return null;
        }

        setIsLoading(true);
        setError(null);

        return Promise.all([
          reportService.getDashboardReport({ from, to }),
          includeRecentOrders
            ? orderService.getAll({
                page: 0,
                size: recentOrderLimit,
                sort: "updatedAt,desc",
              })
            : Promise.resolve({ items: [] }),
        ]);
      })
      .then((result) => {
        if (!isActive || !result) {
          return;
        }

        const [nextReport, orderPage] = result;

        setReport(nextReport);
        setRecentOrders(orderPage.items ?? []);
      })
      .catch((loadError) => {
        if (!isActive) {
          return;
        }

        setError(loadError);
        setReport(null);
        setRecentOrders([]);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [from, includeRecentOrders, recentOrderLimit, refreshIndex, to]);

  const dashboardKpis = useMemo(() => buildDashboardKpis(report), [report]);
  const recentActivity = useMemo(() => buildActivityRowsFromOrders(recentOrders), [recentOrders]);
  const recentOrderRows = useMemo(() => buildRecentOrderRows(recentOrders), [recentOrders]);
  const revenueAnalytics = useMemo(() => buildRevenueAnalyticsData(report), [report]);

  return {
    dashboardKpis,
    error,
    isLoading,
    recentActivity,
    recentOrderRows,
    refresh,
    report,
    revenueAnalytics,
  };
}

export default useAdminReportDashboard;
