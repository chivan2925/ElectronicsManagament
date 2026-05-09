import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Loader2, Lock, Trash2, Unlock } from "lucide-react";
import userService from "../../api/userService";
import { AdminDrawer, AdminFilters, AdminSearch, AdminTable, ConfirmDialog, StatusBadge } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";

const USER_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đã khóa", value: "BLOCKED" },
  { label: "Đã xóa", value: "DELETED" },
];

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

function Users() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openDelete, openView } = modal;
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.users, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.users, "delete");
  const viewedUser = detailUser ?? (modal.modalType === ADMIN_MODAL_TYPES.view ? modal.modalPayload : null);
  const deletingUser = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 320);

    return () => window.clearTimeout(timer);
  }, [query]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getAll(
        {
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setUsers(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setUsers([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, reloadKey]);

  const openDetailDrawer = useCallback(async (user) => {
    setDetailUser(user);
    openView(user);
    setDetailLoading(true);

    try {
      const detail = await userService.getById(user.id, { skipGlobalErrorHandler: true });
      setDetailUser(detail);
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được chi tiết người dùng" });
    } finally {
      setDetailLoading(false);
    }
  }, [openView, toast]);

  const closeDetailDrawer = useCallback(() => {
    setDetailUser(null);
    closeModal();
  }, [closeModal]);

  const handleToggleStatus = useCallback(async (user) => {
    if (!user?.id || user.status === "DELETED") {
      return;
    }

    const previousStatus = user.status;
    const nextStatus = previousStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

    setStatusUpdatingId(user.id);
    setUsers((currentUsers) =>
      currentUsers.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      const updatedUser = await userService.updateStatus(user.id, nextStatus, { skipGlobalErrorHandler: true });
      setUsers((currentUsers) =>
        currentUsers.map((item) => (item.id === user.id ? { ...item, ...updatedUser } : item)),
      );
      setDetailUser((currentDetail) => (currentDetail?.id === user.id ? { ...currentDetail, ...updatedUser } : currentDetail));
      toast.showSuccess(
        nextStatus === "ACTIVE"
          ? `Đã kích hoạt tài khoản "${user.name}".`
          : `Đã khóa tài khoản "${user.name}".`,
      );
    } catch (requestError) {
      setUsers((currentUsers) =>
        currentUsers.map((item) => (item.id === user.id ? { ...item, status: previousStatus } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật trạng thái thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [toast]);

  const handleDeleteUser = async () => {
    if (!deletingUser?.id) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await userService.remove(deletingUser.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa mềm người dùng "${deletingUser.name}".`);
      closeModal();
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== deletingUser.id));

      if (users.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        setReloadKey((value) => value + 1);
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa người dùng thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Người dùng",
        render: (item) => (
          <div className="flex min-w-[240px] items-center gap-3">
            <Avatar item={item} />
            <div>
              <p className="font-black text-slate-900">{item.name}</p>
              <p className="text-xs font-semibold text-slate-500">@{item.username || `user-${item.id}`}</p>
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
            {item.role}
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-primary hover:bg-blue-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={statusUpdatingId === item.id}
                onClick={() => handleToggleStatus(item)}
                title={item.status === "ACTIVE" ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
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
    [canUpdate, handleToggleStatus, statusUpdatingId],
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
        canDelete
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Trash2,
              key: "delete",
              label: "Xóa người dùng",
              onClick: (item) => openDelete(item),
            }
          : null,
      ].filter(Boolean),
    [canDelete, openDelete, openDetailDrawer],
  );

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Người dùng</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Theo dõi tài khoản khách hàng, trạng thái đăng nhập và thông tin liên hệ.
        </p>
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
              options: USER_STATUS_OPTIONS,
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
          summary="Lọc nhanh tài khoản"
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

      <AdminTable
        columns={columns}
        data={users}
        emptyMessage="Thử thay đổi từ khóa hoặc bộ lọc trạng thái."
        emptyTitle="Không có người dùng nào phù hợp"
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
        confirmLabel="Xóa người dùng"
        description={
          deletingUser
            ? `Người dùng "${deletingUser.name}" sẽ bị chuyển sang trạng thái xóa mềm.`
            : "Người dùng sẽ bị chuyển sang trạng thái đã xóa."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteUser}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa người dùng"
        tone="danger"
      />

      <AdminDrawer
        description="Thông tin tài khoản khách hàng từ User API."
        onClose={closeDetailDrawer}
        open={modal.modalType === ADMIN_MODAL_TYPES.view}
        size="lg"
        title="Chi tiết người dùng"
      >
        {viewedUser ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <Avatar item={viewedUser} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-slate-950">{viewedUser.name}</h3>
                  <StatusBadge status={viewedUser.status} />
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-500">@{viewedUser.username || `user-${viewedUser.id}`}</p>
              </div>
              {detailLoading ? <Loader2 className="ml-auto animate-spin text-slate-400" size={18} /> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Email" value={viewedUser.email} />
              <DetailItem label="Số điện thoại" value={viewedUser.phone} />
              <DetailItem label="Vai trò" value={viewedUser.role} />
              <DetailItem label="Giới tính" value={viewedUser.gender} />
              <DetailItem label="Ngày sinh" value={formatDate(viewedUser.dateOfBirth)} />
              <DetailItem label="Ngày tạo" value={formatDateTime(viewedUser.createdAt)} />
              <DetailItem label="Cập nhật" value={formatDateTime(viewedUser.updatedAt)} />
              <DetailItem label="Mã tài khoản" value={`#${viewedUser.id}`} />
            </div>
          </div>
        ) : null}
      </AdminDrawer>
    </section>
  );
}

export default Users;
