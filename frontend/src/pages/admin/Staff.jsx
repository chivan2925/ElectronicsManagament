import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Loader2, Lock, Pencil, Plus, Trash2, Unlock } from "lucide-react";
import roleService from "../../api/roleService";
import staffService from "../../api/staffService";
import { AdminDrawer, AdminFilters, AdminForm, AdminSearch, AdminTable, ConfirmDialog, StatusBadge } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";

const STAFF_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đã khóa", value: "BLOCKED" },
  { label: "Đã xóa", value: "DELETED" },
];

const GENDER_OPTIONS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
  { label: "Không tiết lộ", value: "PREFER_NOT_TO_SAY" },
];

const initialFormValues = {
  address: "",
  avatarUrl: "",
  dateOfBirth: "",
  email: "",
  fullName: "",
  gender: "PREFER_NOT_TO_SAY",
  password: "",
  phoneNumber: "",
  roleId: "",
  status: "ACTIVE",
  username: "",
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

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getInitials(name) {
  return String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Avatar({ item, size = "md" }) {
  const sizeClass = size === "lg" ? "h-16 w-16 rounded-2xl text-lg" : "h-11 w-11 rounded-xl text-sm";

  return (
    <div className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-100 font-black text-slate-500`}>
      {item.avatar ? (
        <img alt={item.name} className="h-full w-full object-cover" src={item.avatar} />
      ) : (
        <span>{getInitials(item.name)}</span>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">{value || "—"}</p>
    </div>
  );
}

function validateStaffForm(values, isEditMode) {
  const errors = {};

  if (!String(values.fullName ?? "").trim()) {
    errors.fullName = "Họ tên không được để trống.";
  }

  if (!String(values.username ?? "").trim()) {
    errors.username = "Username không được để trống.";
  }

  if (!String(values.email ?? "").trim()) {
    errors.email = "Email không được để trống.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Email không hợp lệ.";
  }

  if (!String(values.phoneNumber ?? "").trim()) {
    errors.phoneNumber = "Số điện thoại không được để trống.";
  } else if (!/^[0-9]{10}$/.test(values.phoneNumber)) {
    errors.phoneNumber = "Số điện thoại phải có đúng 10 chữ số.";
  }

  if (!values.roleId) {
    errors.roleId = "Vai trò không được để trống.";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Ngày sinh không được để trống.";
  }

  if (!values.gender) {
    errors.gender = "Giới tính không được để trống.";
  }

  if (!String(values.address ?? "").trim()) {
    errors.address = "Địa chỉ không được để trống.";
  }

  if (!values.status) {
    errors.status = "Trạng thái không được để trống.";
  }

  if (!isEditMode && values.password && values.password.length < 6) {
    errors.password = "Mật khẩu nên có ít nhất 6 ký tự.";
  }

  return errors;
}

function Staff() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openCreate, openDelete, openEdit, openView } = modal;
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rolesError, setRolesError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [detailStaff, setDetailStaff] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.staff, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.staff, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.staff, "delete");
  const currentStaffId = String(permission.user?.staffId ?? permission.user?.id ?? "");
  const isFormOpen = modal.modalType === ADMIN_MODAL_TYPES.create || modal.modalType === ADMIN_MODAL_TYPES.edit;
  const isEditMode = modal.modalType === ADMIN_MODAL_TYPES.edit;
  const editingStaff = isEditMode ? modal.modalPayload : null;
  const viewedStaff = detailStaff ?? (modal.modalType === ADMIN_MODAL_TYPES.view ? modal.modalPayload : null);
  const deletingStaff = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  const isCurrentStaff = useCallback((item) => {
    if (!currentStaffId || !item?.id) {
      return false;
    }

    return String(item.id) === currentStaffId;
  }, [currentStaffId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 320);

    return () => window.clearTimeout(timer);
  }, [query]);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await staffService.getAll(
        {
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setStaff(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setStaff([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, statusFilter]);

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError(null);

    try {
      const response = await roleService.getAll(
        {
          page: 0,
          size: 100,
          sort: "name,asc",
          status: "ACTIVE",
        },
        { skipGlobalErrorHandler: true },
      );

      setRoles(response.items);
    } catch (requestError) {
      setRolesError(requestError);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff, reloadKey]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const roleOptions = useMemo(
    () =>
      roles.map((role) => ({
        label: role.name,
        value: String(role.id),
      })),
    [roles],
  );

  const openCreateDrawer = useCallback(() => {
    setFormValues(initialFormValues);
    setFormErrors({});
    openCreate();
  }, [openCreate]);

  const openEditDrawer = useCallback((staffMember) => {
    setFormValues({
      address: staffMember.address ?? "",
      avatarUrl: staffMember.avatarUrl ?? "",
      dateOfBirth: staffMember.dateOfBirth ?? "",
      email: staffMember.email ?? "",
      fullName: staffMember.fullName ?? "",
      gender: staffMember.gender || "PREFER_NOT_TO_SAY",
      password: "",
      phoneNumber: staffMember.phoneNumber ?? "",
      roleId: staffMember.roleId ? String(staffMember.roleId) : "",
      status: staffMember.status ?? "ACTIVE",
      username: staffMember.username ?? "",
    });
    setFormErrors({});
    openEdit(staffMember);
  }, [openEdit]);

  const closeFormDrawer = useCallback(() => {
    setFormErrors({});
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

  const openDetailDrawer = useCallback(async (staffMember) => {
    setDetailStaff(staffMember);
    openView(staffMember);
    setDetailLoading(true);

    try {
      const detail = await staffService.getById(staffMember.id, { skipGlobalErrorHandler: true });
      setDetailStaff(detail);
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được chi tiết nhân viên" });
    } finally {
      setDetailLoading(false);
    }
  }, [openView, toast]);

  const closeDetailDrawer = useCallback(() => {
    setDetailStaff(null);
    closeModal();
  }, [closeModal]);

  const handleSubmitStaff = async () => {
    const nextErrors = validateStaffForm(formValues, isEditMode);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const savedStaff = isEditMode && editingStaff?.id
        ? await staffService.update(editingStaff.id, formValues, { skipGlobalErrorHandler: true })
        : await staffService.create(formValues, { skipGlobalErrorHandler: true });

      setStaff((currentStaff) => {
        if (isEditMode) {
          return currentStaff.map((item) => (item.id === savedStaff.id ? { ...item, ...savedStaff } : item));
        }

        return currentStaff;
      });

      if (!isEditMode) {
        setReloadKey((value) => value + 1);
      }

      if (savedStaff.rawPassword) {
        toast.showWarning(`Mật khẩu tạm cho "${savedStaff.name}": ${savedStaff.rawPassword}`, {
          duration: 12000,
          title: "Mật khẩu tạm",
        });
      } else {
        toast.showSuccess(isEditMode ? "Đã cập nhật nhân viên." : "Đã tạo nhân viên mới.");
      }

      closeFormDrawer();
    } catch (requestError) {
      toast.showApiError(requestError, {
        title: isEditMode ? "Cập nhật nhân viên thất bại" : "Tạo nhân viên thất bại",
      });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = useCallback(async (staffMember) => {
    if (!staffMember?.id || staffMember.status === "DELETED" || isCurrentStaff(staffMember)) {
      return;
    }

    const previousStatus = staffMember.status;
    const nextStatus = previousStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    setStatusUpdatingId(staffMember.id);
    setStaff((currentStaff) =>
      currentStaff.map((item) => (item.id === staffMember.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      const updatedStaff = await staffService.updateStatus(staffMember.id, nextStatus, { skipGlobalErrorHandler: true });
      setStaff((currentStaff) =>
        currentStaff.map((item) => (item.id === staffMember.id ? { ...item, ...updatedStaff } : item)),
      );
      setDetailStaff((currentDetail) =>
        currentDetail?.id === staffMember.id ? { ...currentDetail, ...updatedStaff } : currentDetail,
      );
      toast.showSuccess(
        nextStatus === "ACTIVE"
          ? `Đã kích hoạt nhân viên "${staffMember.name}".`
          : `Đã khóa nhân viên "${staffMember.name}".`,
      );
    } catch (requestError) {
      setStaff((currentStaff) =>
        currentStaff.map((item) => (item.id === staffMember.id ? { ...item, status: previousStatus } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật trạng thái thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [isCurrentStaff, toast]);

  const handleDeleteStaff = async () => {
    if (!deletingStaff?.id || isCurrentStaff(deletingStaff)) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await staffService.remove(deletingStaff.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa mềm nhân viên "${deletingStaff.name}".`);
      closeModal();
      setStaff((currentStaff) => currentStaff.filter((item) => item.id !== deletingStaff.id));

      if (staff.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        setReloadKey((value) => value + 1);
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa nhân viên thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Nhân viên",
        render: (item) => (
          <div className="flex min-w-[240px] items-center gap-3">
            <Avatar item={item} />
            <div>
              <p className="font-black text-slate-900">{item.name}</p>
              <p className="text-xs font-semibold text-slate-500">@{item.username || `staff-${item.id}`}</p>
            </div>
          </div>
        ),
      },
      {
        key: "email",
        label: "Email",
        render: (item) => <span className="text-sm font-semibold text-slate-700">{item.email || "—"}</span>,
      },
      {
        key: "phone",
        label: "Điện thoại",
        render: (item) => <span className="text-sm font-semibold text-slate-700">{item.phone || "—"}</span>,
      },
      {
        key: "role",
        label: "Vai trò",
        render: (item) => (
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-primary ring-1 ring-blue-100">
            {item.role || "Chưa gán"}
          </span>
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        render: (item) => (
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            {canUpdate && item.status !== "DELETED" ? (
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:bg-blue-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                disabled={statusUpdatingId === item.id || isCurrentStaff(item)}
                onClick={() => handleToggleStatus(item)}
                title={isCurrentStaff(item) ? "Không thể khóa tài khoản đang đăng nhập" : item.status === "ACTIVE" ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
                type="button"
              >
                {statusUpdatingId === item.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : item.status === "ACTIVE" ? (
                  <Lock size={16} />
                ) : (
                  <Unlock size={16} />
                )}
              </button>
            ) : null}
          </div>
        ),
      },
      {
        key: "createdAt",
        label: "Ngày tạo",
        render: (item) => <span className="text-sm font-semibold text-slate-600">{formatDateTime(item.createdAt)}</span>,
      },
    ],
    [canUpdate, handleToggleStatus, isCurrentStaff, statusUpdatingId],
  );

  const rowActions = useMemo(
    () =>
      [
        {
          icon: Eye,
          key: "view",
          label: "Xem chi tiết",
          onClick: (item) => openDetailDrawer(item),
        },
        canUpdate
          ? {
              disabled: (item) => item.status === "DELETED" || isCurrentStaff(item),
              icon: Pencil,
              key: "edit",
              label: "Sửa nhân viên",
              onClick: (item) => openEditDrawer(item),
            }
          : null,
        canDelete
          ? {
              disabled: (item) => item.status === "DELETED" || isCurrentStaff(item),
              icon: Trash2,
              key: "delete",
              label: "Xóa nhân viên",
              onClick: (item) => openDelete(item),
            }
          : null,
      ].filter(Boolean),
    [canDelete, canUpdate, isCurrentStaff, openDelete, openDetailDrawer, openEditDrawer],
  );

  const formFields = useMemo(
    () =>
      [
        {
          label: "Họ tên",
          name: "fullName",
          placeholder: "Nguyễn Văn A",
          required: true,
        },
        {
          label: "Username",
          name: "username",
          placeholder: "nguyenvana",
          required: true,
        },
        {
          label: "Email",
          name: "email",
          placeholder: "staff@shop.com",
          required: true,
          type: "email",
        },
        {
          label: "Số điện thoại",
          name: "phoneNumber",
          placeholder: "0900000000",
          required: true,
        },
        {
          label: "Vai trò",
          name: "roleId",
          options: roleOptions,
          placeholder: rolesLoading ? "Đang tải vai trò..." : "Chọn vai trò",
          required: true,
          type: "select",
        },
        {
          label: "Trạng thái",
          name: "status",
          options: STAFF_STATUS_OPTIONS,
          required: true,
          type: "select",
        },
        {
          label: "Giới tính",
          name: "gender",
          options: GENDER_OPTIONS,
          required: true,
          type: "select",
        },
        {
          label: "Ngày sinh",
          name: "dateOfBirth",
          required: true,
          type: "date",
        },
        {
          fullWidth: true,
          label: "Avatar URL",
          name: "avatarUrl",
          placeholder: "https://cdn.example.com/avatar.png",
        },
        !isEditMode
          ? {
              fullWidth: true,
              helper: "Có thể để trống để backend tự sinh mật khẩu tạm.",
              label: "Mật khẩu",
              name: "password",
              placeholder: "Nhập mật khẩu ban đầu",
              type: "password",
            }
          : null,
        {
          fullWidth: true,
          label: "Địa chỉ",
          name: "address",
          placeholder: "Địa chỉ liên hệ của nhân viên...",
          required: true,
          type: "textarea",
        },
      ].filter(Boolean),
    [isEditMode, roleOptions, rolesLoading],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Nhân viên</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Quản lý tài khoản nhân viên, vai trò và trạng thái truy cập admin.
          </p>
        </div>

        {canCreate ? (
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white transition hover:bg-primary-hover"
            onClick={openCreateDrawer}
            type="button"
          >
            <Plus size={17} />
            Thêm nhân viên
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
        <AdminSearch
          disabled={loading}
          onChange={(nextValue) => {
            setQuery(nextValue);
            setPage(0);
          }}
          placeholder="Tìm theo tên, username, email hoặc số điện thoại..."
          value={query}
        />

        <AdminFilters
          className="p-3"
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: STAFF_STATUS_OPTIONS,
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
          summary="Lọc nhanh nhân viên"
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

      {rolesError ? (
        <ApiErrorAlert
          actionLabel="Tải lại vai trò"
          error={rolesError}
          onAction={loadRoles}
          onDismiss={() => setRolesError(null)}
          surface="admin"
        />
      ) : null}

      <AdminTable
        columns={columns}
        data={staff}
        emptyMessage="Thử thay đổi từ khóa hoặc bộ lọc trạng thái."
        emptyTitle="Không có nhân viên nào phù hợp"
        enablePagination
        loading={loading}
        manualPagination
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
        rowActions={rowActions}
      />

      <ConfirmDialog
        confirmLabel="Xóa nhân viên"
        description={
          deletingStaff
            ? `Nhân viên "${deletingStaff.name}" sẽ bị chuyển sang trạng thái xóa mềm.`
            : "Nhân viên sẽ bị chuyển sang trạng thái đã xóa."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteStaff}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa nhân viên"
        tone="danger"
      />

      <AdminDrawer
        description="Thông tin tài khoản nhân viên từ Staff API."
        onClose={closeDetailDrawer}
        open={modal.modalType === ADMIN_MODAL_TYPES.view}
        size="lg"
        title="Chi tiết nhân viên"
      >
        {viewedStaff ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <Avatar item={viewedStaff} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-slate-950">{viewedStaff.name}</h3>
                  <StatusBadge status={viewedStaff.status} />
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-500">@{viewedStaff.username || `staff-${viewedStaff.id}`}</p>
              </div>
              {detailLoading ? <Loader2 className="ml-auto animate-spin text-slate-400" size={18} /> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Email" value={viewedStaff.email} />
              <DetailItem label="Số điện thoại" value={viewedStaff.phone} />
              <DetailItem label="Vai trò" value={viewedStaff.role || "Chưa gán"} />
              <DetailItem label="Giới tính" value={viewedStaff.gender} />
              <DetailItem label="Ngày sinh" value={formatDate(viewedStaff.dateOfBirth)} />
              <DetailItem label="Ngày tạo" value={formatDateTime(viewedStaff.createdAt)} />
              <DetailItem label="Cập nhật" value={formatDateTime(viewedStaff.updatedAt)} />
              <DetailItem label="Mã nhân viên" value={`#${viewedStaff.id}`} />
              <div className="sm:col-span-2">
                <DetailItem label="Địa chỉ" value={viewedStaff.address} />
              </div>
            </div>
          </div>
        ) : null}
      </AdminDrawer>

      <AdminDrawer
        description="Thông tin nhân viên sẽ được đồng bộ trực tiếp với Staff API."
        onClose={closeFormDrawer}
        open={isFormOpen}
        size="lg"
        title={isEditMode ? "Cập nhật nhân viên" : "Tạo nhân viên mới"}
      >
        <AdminForm
          errors={formErrors}
          fields={formFields}
          loading={submitting}
          onCancel={closeFormDrawer}
          onChange={handleFormChange}
          onSubmit={handleSubmitStaff}
          submitLabel={isEditMode ? "Lưu thay đổi" : "Tạo nhân viên"}
          values={formValues}
        />
      </AdminDrawer>
    </section>
  );
}

export default Staff;
