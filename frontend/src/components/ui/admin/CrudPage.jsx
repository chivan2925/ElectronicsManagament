import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getResourceActionPolicies } from "../../../auth/roleHelpers";
import Card from "../Card";
import DataTable from "./DataTable";
import PageHeader from "./PageHeader";

function CrudPage({ title, subtitle, data, columns, permissionResource = null, searchPlaceholder = "Tìm kiếm..." }) {
  const [query, setQuery] = useState("");
  const actionPolicies = useMemo(
    () => (permissionResource ? getResourceActionPolicies(permissionResource) : null),
    [permissionResource],
  );

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return data;
    }

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(keyword),
      ),
    );
  }, [data, query]);

  return (
    <section>
      <PageHeader actionPolicy={actionPolicies?.create} title={title} subtitle={subtitle} />

      <Card className="mb-4 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between" variant="admin">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="h-10 w-full rounded-lg border border-border bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={query}
          />
        </div>

        <p className="text-sm font-semibold text-slate-500">
          {filteredData.length} bản ghi
        </p>
      </Card>

      <DataTable actionPolicies={actionPolicies} columns={columns} data={filteredData} />
    </section>
  );
}

export default CrudPage;
