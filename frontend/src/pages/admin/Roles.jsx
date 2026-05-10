import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import permissionService from "../../api/permissionService";
import roleService from "../../api/roleService";
import staffService from "../../api/staffService";
import { AdminDrawer, AdminFilters, AdminSearch, ConfirmDialog, StatusBadge } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal, useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import PermissionMatrix from "./roles/PermissionMatrix";
import RoleForm from "./roles/RoleForm";
import RoleTable from "./roles/RoleTable";

const ROLE_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đã khóa", value: "BLOCKED" },
  { label: "Đã xóa", value: "DELETED" },
];

const initialFormValues = {
  name: "",
  permissionIds: [],
  status: "ACTIVE",
};

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getRoleFormValues(role = {}) {
  return {
    name: role.name ?? "",
    permissionIds: role.permissionIds ?? role.permissions?.map((permission) => permission.id).filter(Boolean) ?? [],
    status: role.status || "ACTIVE",
  };
}

function validateRoleForm(values = {}) {
  const errors = {};

  if (!String(values.name ?? "").trim()) {
    errors.name = "Tên vai trò không được để trống.";
  }

  if (!values.status) {
    errors.status = "Trạng thái không được để trống.";
  }

  if (!Array.isArray(values.permissionIds) || values.permissionIds.length === 0) {
    errors.permissionIds = "Chọn ít nhất một quyền cho vai trò.";
  }

  return errors;
}

function SecurityMetric({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="admin-panel admin-panel-hover rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary ring-1 ring-blue-100">
          <IconComponent size={19} />
        </span>
      </div>
    </div>
  );
}

function Roles() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openCreate, openDelete, openEdit } = modal;
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionsError, setPermissionsError] = useState(null);
  const [staffError, setStaffError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleLoading, setSelectedRoleLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [permissionSearch, setPermissionSearch] = useState("");
  const [formHydrating, setFormHydrating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [staffUpdatingId, setStaffUpdatingId] = useState(null);
  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.roles, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.roles, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.roles, "delete");
  const canAssignStaff = permission.canAccessResourceAction(ADMIN_RESOURCES.staff, "update") || permission.isAdmin();
  const isFormOpen = modal.modalType === ADMIN_MODAL_TYPES.create || modal.modalType === ADMIN_MODAL_TYPES.edit;
  const isEditMode = modal.modalType === ADMIN_MODAL_TYPES.edit;
  const editingRole = isEditMode ? modal.modalPayload : null;
  const deletingRole = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  const loadRoleDetail = useCallback(async (roleId) => {
    if (!roleId) {
      return null;
    }

    setSelectedRoleLoading(true);

    try {
      const detail = await roleService.getById(roleId, { skipGlobalErrorHandler: true });
      setSelectedRole((currentRole) => (currentRole?.id === roleId ? detail : currentRole));
      return detail;
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được chi tiết vai trò" });
      return null;
    } finally {
      setSelectedRoleLoading(false);
    }
  }, [toast]);

  const handleSelectRole = useCallback((role) => {
    if (!role?.id) {
      setSelectedRole(null);
      return;
    }

    setSelectedRole(role);
    loadRoleDetail(role.id);
  }, [loadRoleDetail]);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await roleService.getAll(
        {
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setRoles(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setRoles([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, statusFilter]);

  const loadPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    setPermissionsError(null);

    try {
      const response = await permissionService.getAll(
        {
          page: 0,
          size: 500,
          sort: "code,asc",
        },
        { skipGlobalErrorHandler: true },
      );

      setPermissions(response.items);
    } catch (requestError) {
      setPermissionsError(requestError);
      setPermissions([]);
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    setStaffError(null);

    try {
      const response = await staffService.getAll(
        {
          page: 0,
          size: 100,
          sort: "updatedAt,desc",
          status: "ACTIVE",
        },
        { skipGlobalErrorHandler: true },
      );

      setStaff(response.items);
    } catch (requestError) {
      setStaffError(requestError);
      setStaff([]);
    } finally {
      setStaffLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles, reloadKey]);

  useEffect(() => {
    loadPermissions();
    loadStaff();
  }, [loadPermissions, loadStaff, reloadKey]);

  useEffect(() => {
    if (roles.length === 0) {
      setSelectedRole(null);
      return;
    }

    const currentSelectionExists = roles.some((role) => role.id === selectedRole?.id);

    if (!currentSelectionExists) {
      handleSelectRole(roles[0]);
    }
  }, [handleSelectRole, roles, selectedRole?.id]);

  const activeRoles = useMemo(() => roles.filter((role) => role.status === "ACTIVE"), [roles]);
  const selectedPermissionIds = selectedRole?.permissionIds ?? selectedRole?.permissions?.map((item) => item.id).filter(Boolean) ?? [];
  const activeRoleCount = roles.filter((role) => role.status === "ACTIVE").length;

  const openCreateDrawer = useCallback(() => {
    setFormValues(initialFormValues);
    setFormErrors({});
    setPermissionSearch("");
    openCreate();
  }, [openCreate]);

  const openEditDrawer = useCallback(async (role) => {
    setFormValues(getRoleFormValues(role));
    setFormErrors({});
    setPermissionSearch("");
    openEdit(role);

    if (!role?.id) {
      return;
    }

    setFormHydrating(true);

    try {
      const detail = await roleService.getById(role.id, { skipGlobalErrorHandler: true });
      setFormValues(getRoleFormValues(detail));
      setSelectedRole(detail);
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được quyền của vai trò" });
    } finally {
      setFormHydrating(false);
    }
  }, [openEdit, toast]);

  const closeFormDrawer = useCallback(() => {
    setFormErrors({});
    setFormHydrating(false);
    closeModal();
  }, [closeModal]);

  const handleFormChange = (key, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));

    setFormErrors((currentErrors) => {
      if (!currentErrors[key]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [key]: undefined,
      };
    });
  };

  const handleSubmitRole = async () => {
    const nextErrors = validateRoleForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const savedRole = isEditMode && editingRole?.id
        ? await roleService.update(editingRole.id, formValues, { skipGlobalErrorHandler: true })
        : await roleService.create(formValues, { skipGlobalErrorHandler: true });
      const detail = await roleService.getById(savedRole.id, { skipGlobalErrorHandler: true }).catch(() => savedRole);

      setSelectedRole(detail);
      setRoles((currentRoles) => {
        if (isEditMode) {
          return currentRoles.map((role) => (role.id === savedRole.id ? { ...role, ...savedRole } : role));
        }

        return [savedRole, ...currentRoles];
      });
      setReloadKey((value) => value + 1);
      toast.showSuccess(isEditMode ? "Đã cập nhật vai trò." : "Đã tạo vai trò mới.");
      closeFormDrawer();
    } catch (requestError) {
      toast.showApiError(requestError, {
        title: isEditMode ? "Cập nhật vai trò thất bại" : "Tạo vai trò thất bại",
      });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = useCallback(async (role) => {
    if (!role?.id || role.status === "DELETED") {
      return;
    }

    const previousStatus = role.status;
    const nextStatus = previousStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    setStatusUpdatingId(role.id);
    setRoles((currentRoles) =>
      currentRoles.map((item) => (item.id === role.id ? { ...item, status: nextStatus } : item)),
    );
    setSelectedRole((currentRole) => (currentRole?.id === role.id ? { ...currentRole, status: nextStatus } : currentRole));

    try {
      const updatedRole = await roleService.updateStatus(role.id, nextStatus, { skipGlobalErrorHandler: true });
      setRoles((currentRoles) =>
        currentRoles.map((item) => (item.id === role.id ? { ...item, ...updatedRole } : item)),
      );
      setSelectedRole((currentRole) => (currentRole?.id === role.id ? { ...currentRole, ...updatedRole } : currentRole));
      toast.showSuccess(nextStatus === "ACTIVE" ? `Đã kích hoạt vai trò "${role.name}".` : `Đã khóa vai trò "${role.name}".`);
    } catch (requestError) {
      setRoles((currentRoles) =>
        currentRoles.map((item) => (item.id === role.id ? { ...item, status: previousStatus } : item)),
      );
      setSelectedRole((currentRole) => (currentRole?.id === role.id ? { ...currentRole, status: previousStatus } : currentRole));
      toast.showApiError(requestError, { title: "Cập nhật trạng thái vai trò thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [toast]);

  const handleDeleteRole = async () => {
    if (!deletingRole?.id) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await roleService.remove(deletingRole.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa mềm vai trò "${deletingRole.name}".`);
      closeModal();
      setRoles((currentRoles) => currentRoles.filter((role) => role.id !== deletingRole.id));

      if (selectedRole?.id === deletingRole.id) {
        setSelectedRole(null);
      }

      setReloadKey((value) => value + 1);
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa vai trò thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  const handleAssignStaffRole = async (staffMember, nextRoleId) => {
    if (!canAssignStaff || !staffMember?.id || !nextRoleId || String(staffMember.roleId) === String(nextRoleId)) {
      return;
    }

    setStaffUpdatingId(staffMember.id);
    setStaffError(null);

    try {
      const detail = await staffService.getById(staffMember.id, { skipGlobalErrorHandler: true });
      const updatedStaff = await staffService.update(
        staffMember.id,
        {
          ...detail,
          roleId: nextRoleId,
        },
        { skipGlobalErrorHandler: true },
      );

      setStaff((currentStaff) => currentStaff.map((item) => (item.id === updatedStaff.id ? { ...item, ...updatedStaff } : item)));
      setReloadKey((value) => value + 1);
      toast.showSuccess(`Đã gán vai trò "${updatedStaff.role || "mới"}" cho "${updatedStaff.name}".`);
    } catch (requestError) {
      setStaffError(requestError);
      toast.showApiError(requestError, { title: "Gán vai trò nhân viên thất bại" });
    } finally {
      setStaffUpdatingId(null);
    }
  };

  return (
    <section className="admin-page-shell">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Quản lý vai trò, nhóm quyền và phân quyền nhân viên trong admin.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary"
            onClick={() => setReloadKey((value) => value + 1)}
            type="button"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {canCreate ? (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white transition hover:bg-primary-hover"
              onClick={openCreateDrawer}
              type="button"
            >
              <Plus size={17} />
              Tạo vai trò
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SecurityMetric icon={ShieldCheck} label="Total roles" value={pageMeta.totalItems} />
        <SecurityMetric icon={ShieldCheck} label="Active roles" value={activeRoleCount} />
        <SecurityMetric icon={KeyRound} label="Permissions" value={permissions.length} />
        <SecurityMetric icon={Users} label="Active staff" value={staff.length} />
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
        <AdminSearch
          disabled={loading}
          onChange={(nextValue) => {
            setQuery(nextValue);
            setPage(0);
          }}
          placeholder="Tìm theo tên vai trò..."
          value={query}
        />

        <AdminFilters
          className="p-3"
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: ROLE_STATUS_OPTIONS,
              placeholder: "Tất cả trạng thái",
              type: "select",
            },
          ]}
          onChange={(key, value) => {
            if (key === "status") {
              setStatusFilter(value);
              setPage(0);
            }
          }}
          onReset={() => {
            setStatusFilter("");
            setPage(0);
          }}
          summary="Lọc nhanh vai trò"
          title="Bộ lọc"
          values={{ status: statusFilter }}
        />
      </div>

      {error ? (
        <ApiErrorAlert
          actionLabel="Tải lại"
          error={error}
          onAction={() => setReloadKey((value) => value + 1)}
          onDismiss={() => setError(null)}
          surface="admin"
        />
      ) : null}

      {permissionsError ? (
        <ApiErrorAlert
          actionLabel="Tải lại quyền"
          error={permissionsError}
          onAction={loadPermissions}
          onDismiss={() => setPermissionsError(null)}
          surface="admin"
        />
      ) : null}

      {staffError ? (
        <ApiErrorAlert
          actionLabel="Tải lại nhân viên"
          error={staffError}
          onAction={loadStaff}
          onDismiss={() => setStaffError(null)}
          surface="admin"
        />
      ) : null}

      <RoleTable
        canDelete={canDelete}
        canUpdate={canUpdate}
        data={roles}
        loading={loading}
        onDelete={openDelete}
        onEdit={openEditDrawer}
        onSelect={handleSelectRole}
        onToggleStatus={handleToggleStatus}
        pagination={{
          onPageChange: (nextPage) => setPage(nextPage),
          onPageSizeChange: (nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(0);
          },
          page,
          pageSize,
          totalItems: pageMeta.totalItems,
          totalPages: pageMeta.totalPages,
        }}
        selectedRoleId={selectedRole?.id}
        statusUpdatingId={statusUpdatingId}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <section className="admin-panel space-y-4 rounded-2xl p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black text-slate-950">{selectedRole?.name || "Chọn vai trò"}</h2>
                {selectedRole?.status ? <StatusBadge status={selectedRole.status} /> : null}
                {selectedRoleLoading || permissionsLoading ? <Loader2 className="animate-spin text-slate-400" size={17} /> : null}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Cập nhật lần cuối: {formatDateTime(selectedRole?.updatedAt || selectedRole?.createdAt)}
              </p>
            </div>
            {selectedRole ? (
              <button
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canUpdate || selectedRole.status === "DELETED"}
                onClick={() => openEditDrawer(selectedRole)}
                type="button"
              >
                Sửa quyền
              </button>
            ) : null}
          </div>

          <PermissionMatrix
            className="shadow-none"
            onSearchChange={setPermissionSearch}
            permissions={permissions}
            readOnly
            search={permissionSearch}
            selectedIds={selectedPermissionIds}
            showSearch
            title="Quyền của vai trò"
          />
        </section>

        <section className="admin-panel rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-sm font-black text-slate-950">Gán vai trò cho nhân viên</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">Danh sách nhân viên đang hoạt động</p>
            </div>
            {staffLoading ? <Loader2 className="animate-spin text-slate-400" size={17} /> : null}
          </div>

          <div className="max-h-[520px] divide-y divide-slate-200 overflow-y-auto">
            {staff.length > 0 ? (
              staff.map((staffMember) => (
                <div className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_180px]" key={staffMember.id}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">{staffMember.name}</p>
                    <p className="truncate text-xs font-semibold text-slate-500">
                      @{staffMember.username || `staff-${staffMember.id}`} · {staffMember.email || "No email"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      disabled={!canAssignStaff || staffUpdatingId === staffMember.id || activeRoles.length === 0}
                      onChange={(event) => handleAssignStaffRole(staffMember, event.target.value)}
                      value={staffMember.roleId ? String(staffMember.roleId) : ""}
                    >
                      <option value="">Chọn vai trò</option>
                      {activeRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    {staffUpdatingId === staffMember.id ? <Loader2 className="shrink-0 animate-spin text-slate-400" size={16} /> : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
                Không có nhân viên đang hoạt động để gán vai trò.
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        confirmLabel="Xóa vai trò"
        description={
          deletingRole
            ? `Vai trò "${deletingRole.name}" sẽ bị chuyển sang trạng thái xóa mềm. Không thể xóa nếu đang có nhân viên sử dụng.`
            : "Vai trò sẽ bị chuyển sang trạng thái xóa mềm."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteRole}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa vai trò"
        tone="danger"
      />

      <AdminDrawer
        description="Thiết lập tên, trạng thái và tập quyền cho vai trò."
        onClose={closeFormDrawer}
        open={isFormOpen}
        size="xl"
        title={isEditMode ? "Cập nhật vai trò" : "Tạo vai trò mới"}
      >
        <RoleForm
          errors={formErrors}
          loading={submitting || formHydrating || permissionsLoading}
          mode={isEditMode ? "edit" : "create"}
          onCancel={closeFormDrawer}
          onChange={handleFormChange}
          onPermissionSearchChange={setPermissionSearch}
          onSubmit={handleSubmitRole}
          permissionSearch={permissionSearch}
          permissions={permissions}
          values={formValues}
        />
      </AdminDrawer>
    </section>
  );
}

export default Roles;
