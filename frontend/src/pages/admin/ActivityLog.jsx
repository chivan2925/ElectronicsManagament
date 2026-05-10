import { useEffect, useState } from "react";
import orderService from "../../api/orderService";
import { buildActivityRowsFromOrders } from "../../api/reportMapper";
import DataTable from "../../components/ui/admin/DataTable";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import PageHeader from "../../components/ui/admin/PageHeader";

const columns = [
  { key: "id", label: "ID", render: (item) => <span className="font-bold text-primary">#{item.id}</span> },
  { key: "actor", label: "Người thực hiện", render: (item) => <span className="font-bold text-ink">{item.actor}</span> },
  { key: "action", label: "Hoạt động" },
  { key: "type", label: "Nhóm" },
  { key: "time", label: "Thời gian" },
];

function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (!isActive) {
          return null;
        }

        setIsLoading(true);
        setError(null);

        return orderService.getAll({
          page: 0,
          size: 20,
          sort: "updatedAt,desc",
        });
      })
      .then((page) => {
        if (isActive && page) {
          setActivities(buildActivityRowsFromOrders(page.items ?? []));
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setActivities([]);
          setError(loadError);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [refreshIndex]);

  return (
    <section className="admin-page-shell">
      <PageHeader subtitle="Theo dõi hoạt động đơn hàng mới nhất từ database." title="Nhật ký hoạt động" />
      {error ? (
        <ApiErrorAlert
          actionLabel="Tải lại"
          error={error}
          onAction={() => setRefreshIndex((currentIndex) => currentIndex + 1)}
          surface="admin"
          title="Chưa tải được nhật ký hoạt động"
        />
      ) : null}
      <DataTable columns={columns} data={activities} emptyText="Chưa có hoạt động đơn hàng" loading={isLoading} />
    </section>
  );
}

export default ActivityLog;
