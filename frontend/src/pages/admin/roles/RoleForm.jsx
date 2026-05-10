import { ShieldCheck } from "lucide-react";
import { AdminForm, StatusBadge } from "../../../admin/components";
import FormFieldMessage from "../../../components/ui/form/FormFieldMessage";
import PermissionMatrix from "./PermissionMatrix";

const ROLE_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đã khóa", value: "BLOCKED" },
];

function RoleForm({
  errors = {},
  loading = false,
  mode = "create",
  onCancel,
  onChange,
  onSubmit,
  permissions = [],
  permissionSearch = "",
  onPermissionSearchChange,
  values = {},
}) {
  const selectedPermissionIds = values.permissionIds ?? [];
  const selectedCount = selectedPermissionIds.length;
  const submitLabel = mode === "edit" ? "Lưu thay đổi" : "Tạo vai trò";

  return (
    <AdminForm
      columns={1}
      errors={errors}
      fields={[
        {
          label: "Tên vai trò",
          name: "name",
          placeholder: "Inventory manager",
          required: true,
        },
        {
          label: "Trạng thái",
          name: "status",
          options: ROLE_STATUS_OPTIONS,
          required: true,
          type: "select",
        },
      ]}
      loading={loading}
      onCancel={onCancel}
      onChange={onChange}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      values={values}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div data-field-name="permissionIds">
          <PermissionMatrix
            disabled={loading}
            onChange={(nextIds) => onChange?.("permissionIds", nextIds)}
            onSearchChange={onPermissionSearchChange}
            permissions={permissions}
            search={permissionSearch}
            selectedIds={selectedPermissionIds}
            showSearch
            title="Gán quyền"
          />
          <FormFieldMessage id="permissionIds-error" surface="admin" tone="error">
            {errors.permissionIds}
          </FormFieldMessage>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#07111F] text-white">
            <ShieldCheck size={19} />
          </div>
          <h3 className="mt-4 text-sm font-black text-slate-950">{values.name?.trim() || "Vai trò mới"}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">Security profile</p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
              <p className="text-xs font-black uppercase tracking-normal text-slate-500">Quyền đã chọn</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{selectedCount}</p>
            </div>
            <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
              <p className="mb-2 text-xs font-black uppercase tracking-normal text-slate-500">Trạng thái</p>
              <StatusBadge status={values.status || "ACTIVE"} />
            </div>
          </div>
        </aside>
      </div>
    </AdminForm>
  );
}

export default RoleForm;
