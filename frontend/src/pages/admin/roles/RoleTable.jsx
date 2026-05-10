import { useMemo } from "react";
import { Eye, KeyRound, Loader2, Lock, Pencil, ShieldCheck, Trash2, Unlock, Users } from "lucide-react";
import { AdminTable, StatusBadge } from "../../../admin/components";
import { cn } from "../../../utils/classNames";

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

function RoleMetric({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="inline-flex min-w-24 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
      <IconComponent className="text-slate-400" size={16} />
      <div>
        <p className="text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
        <p className="text-sm font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function RoleTable({
  canDelete = false,
  canUpdate = false,
  data = [],
  loading = false,
  onDelete,
  onEdit,
  onSelect,
  onToggleStatus,
  pagination,
  selectedRoleId,
  statusUpdatingId,
}) {
  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Vai trò",
        render: (item) => (
          <button
            className={cn(
              "flex min-w-[240px] items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-blue-50",
              selectedRoleId === item.id && "bg-blue-50 ring-1 ring-blue-100",
            )}
            onClick={() => onSelect?.(item)}
            type="button"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07111F] text-white">
              <ShieldCheck size={18} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-black text-slate-900">{item.name || "Unnamed role"}</span>
              <span className="block text-xs font-semibold text-slate-500">Role #{item.id}</span>
            </span>
          </button>
        ),
      },
      {
        key: "permissionCount",
        label: "Quyền",
        render: (item) => <RoleMetric icon={KeyRound} label="Permissions" value={item.permissionCount ?? item.permissions?.length ?? 0} />,
      },
      {
        key: "staffCount",
        label: "Nhân viên",
        render: (item) => <RoleMetric icon={Users} label="Staff" value={item.staffCount ?? 0} />,
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
                disabled={statusUpdatingId === item.id}
                onClick={() => onToggleStatus?.(item)}
                title={item.status === "ACTIVE" ? "Khóa vai trò" : "Kích hoạt vai trò"}
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
        key: "updatedAt",
        label: "Cập nhật",
        render: (item) => <span className="text-sm font-semibold text-slate-600">{formatDateTime(item.updatedAt || item.createdAt)}</span>,
      },
    ],
    [canUpdate, onSelect, onToggleStatus, selectedRoleId, statusUpdatingId],
  );

  const rowActions = useMemo(
    () =>
      [
        {
          icon: Eye,
          key: "view",
          label: "Xem quyền",
          onClick: (item) => onSelect?.(item),
        },
        canUpdate
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Pencil,
              key: "edit",
              label: "Sửa vai trò",
              onClick: (item) => onEdit?.(item),
            }
          : null,
        canDelete
          ? {
              disabled: (item) => item.status === "DELETED" || Number(item.staffCount ?? 0) > 0,
              icon: Trash2,
              key: "delete",
              label: "Xóa vai trò",
              onClick: (item) => onDelete?.(item),
            }
          : null,
      ].filter(Boolean),
    [canDelete, canUpdate, onDelete, onEdit, onSelect],
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      emptyMessage="Thử đổi từ khóa, trạng thái hoặc tải lại danh sách vai trò."
      emptyTitle="Không có vai trò phù hợp"
      enablePagination
      loading={loading}
      manualPagination
      pagination={pagination}
      rowActions={rowActions}
    />
  );
}

export default RoleTable;
