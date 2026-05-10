import AdminTable from "../../../admin/components/crud/AdminTable";
import usePermissions from "../../../auth/usePermissions";

function DataTable({ columns, data, actionPolicies = null, emptyText = "Không có dữ liệu", loading = false, rowActions = [] }) {
  const permission = usePermissions();
  const visibleActions = actionPolicies
    ? rowActions.filter((action) => permission.canAccess(actionPolicies[action.key]))
    : rowActions;

  return (
    <AdminTable
      columns={columns}
      data={data}
      emptyMessage="Thử đổi từ khóa tìm kiếm hoặc kiểm tra lại bộ lọc."
      emptyTitle={emptyText}
      loading={loading}
      rowActions={visibleActions}
    />
  );
}

export default DataTable;
