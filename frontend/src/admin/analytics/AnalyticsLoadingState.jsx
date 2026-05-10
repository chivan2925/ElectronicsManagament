import LoadingState from "../../components/ui/feedback/LoadingState";
import { cn } from "../../utils/classNames";

function AdminSkeletonBlock({ className, style }) {
  return <span aria-hidden="true" className={cn("block animate-pulse rounded-xl bg-slate-100", className)} style={style} />;
}

function AnalyticsMetricSkeleton() {
  return (
    <div className="admin-panel rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <AdminSkeletonBlock className="h-3 w-24 rounded-full" />
          <AdminSkeletonBlock className="mt-3 h-7 w-28 rounded-full" />
        </div>
        <AdminSkeletonBlock className="h-11 w-11 rounded-xl" />
      </div>
      <AdminSkeletonBlock className="mt-4 h-5 w-20 rounded-full" />
      <AdminSkeletonBlock className="mt-3 h-3 w-full rounded-full" />
    </div>
  );
}

function AnalyticsChartSkeleton({ compact = false }) {
  return (
    <div className="admin-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <AdminSkeletonBlock className="h-5 w-36 rounded-full" />
          <AdminSkeletonBlock className="mt-3 h-3 w-64 max-w-full rounded-full" />
        </div>
        <AdminSkeletonBlock className="h-7 w-24 rounded-full" />
      </div>
      <div className={cn("mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4", compact ? "h-56" : "h-80")}>
        <div className="flex h-full items-end gap-3">
          {[42, 68, 54, 78, 62, 86, 70, 92].map((height, index) => (
            <AdminSkeletonBlock
              className="w-full rounded-t-xl rounded-b-sm"
              key={`analytics-chart-bar-${index}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsLoadingState({
  className,
  message = "Đang lấy số liệu, bảng và biểu đồ cho khoảng thời gian đã chọn.",
  title = "Đang tải analytics",
}) {
  return (
    <section aria-busy="true" className={cn("space-y-6", className)} role="status">
      <LoadingState
        message={message}
        surface="admin"
        title={title}
        variant="inline"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <AnalyticsMetricSkeleton key={`analytics-metric-skeleton-${index}`} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AnalyticsChartSkeleton />
        <AnalyticsChartSkeleton compact />
      </div>
    </section>
  );
}

export default AnalyticsLoadingState;
