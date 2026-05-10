import { useMemo } from "react";
import AdminSearch from "../../../admin/components/crud/AdminSearch";
import { useAdminTable } from "../../../admin/hooks";
import { getResourceActionPolicies } from "../../../auth/roleHelpers";
import Card from "../Card";
import DataTable from "./DataTable";
import PageHeader from "./PageHeader";

function CrudPage({ title, subtitle, data, columns, onCreate, permissionResource = null, searchPlaceholder = "Tìm kiếm..." }) {
  const table = useAdminTable({ columns, data });
  const actionPolicies = useMemo(
    () => (permissionResource ? getResourceActionPolicies(permissionResource) : null),
    [permissionResource],
  );

  return (
    <section>
      <PageHeader actionLabel="Thêm mới" actionPolicy={actionPolicies?.create} onAction={onCreate} title={title} subtitle={subtitle} />

      <Card className="mb-4 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between" variant="admin">
        <AdminSearch className="md:max-w-md" onChange={table.setQuery} placeholder={searchPlaceholder} value={table.query} />

        <p className="text-sm font-semibold text-slate-500">
          {table.filteredCount} bản ghi
        </p>
      </Card>

      <DataTable actionPolicies={actionPolicies} columns={columns} data={table.rows} />
    </section>
  );
}

export default CrudPage;
