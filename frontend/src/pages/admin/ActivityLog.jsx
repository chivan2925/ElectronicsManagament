import DataTable from "../../components/ui/admin/DataTable";
import PageHeader from "../../components/ui/admin/PageHeader";
import { activityLogs } from "../../data/adminMock";

const columns = [
  { key: "id", label: "ID", render: (item) => <span className="font-bold text-primary">#{item.id}</span> },
  { key: "actor", label: "Người thực hiện", render: (item) => <span className="font-bold text-ink">{item.actor}</span> },
  { key: "action", label: "Hoạt động" },
  { key: "type", label: "Nhóm" },
  { key: "time", label: "Thời gian" },
];

function ActivityLog() {
  return (
    <section>
      <PageHeader subtitle="Theo dõi thao tác quan trọng trong hệ thống quản trị." title="Nhật ký hoạt động" />
      <DataTable columns={columns} data={activityLogs} />
    </section>
  );
}

export default ActivityLog;
