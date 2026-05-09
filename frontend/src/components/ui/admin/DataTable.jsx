import { ADMIN_TABLE_ACTIONS } from "../../../admin/tables/tableActions";
import AdminTable from "../../../admin/components/crud/AdminTable";
import usePermissions from "../../../auth/usePermissions";

function DataTable({ columns, data, actionPolicies = null, emptyText = "Không có dữ liệu" }) {
  const permission = usePermissions();
  const visibleActions = actionPolicies
    ? ADMIN_TABLE_ACTIONS.filter((action) => permission.canAccess(actionPolicies[action.key]))
    : ADMIN_TABLE_ACTIONS;
  const rowActions = visibleActions.map((action) => ({
    icon: action.icon,
    key: action.key,
    label: action.title,
  }));

  return (
    <AdminTable
      columns={columns}
      data={data}
      emptyMessage="Thử đổi từ khóa tìm kiếm hoặc kiểm tra lại bộ lọc."
      emptyTitle={emptyText}
      rowActions={rowActions}
    />
  );
}

export default DataTable;
