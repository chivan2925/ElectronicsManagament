import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import { BadgePercent, CalendarClock, Loader2, Plus, RefreshCw, TicketPercent, TrendingUp } from "lucide-react";
import couponService from "../../api/couponService";
import { COUPON_STATUS, COUPON_TYPE, getCouponLifecycle, toDatetimeLocalValue } from "../../api/couponMapper";
import { AdminDrawer, AdminFilters, AdminSearch, ConfirmDialog } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal, useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import CouponForm from "./coupons/CouponForm";
import CouponTable from "./coupons/CouponTable";

const STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: COUPON_STATUS.active },
  { label: "Tạm ẩn", value: COUPON_STATUS.inactive },
  { label: "Đã xóa", value: COUPON_STATUS.deleted },
];

const TIME_STATUS_OPTIONS = [
  { label: "Đang hiệu lực", value: "VALID" },
  { label: "Hết hạn / chưa bắt đầu", value: "EXPIRED" },
];

const DATE_TYPE_OPTIONS = [
  { label: "Ngày tạo", value: "CREATED_AT" },
  { label: "Ngày cập nhật", value: "UPDATED_AT" },
];

function getDefaultDateRange() {
  const startDate = new Date(Date.now() + 60 * 60 * 1000);
  startDate.setSeconds(0, 0);

  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    endDate: toDatetimeLocalValue(endDate),
    startDate: toDatetimeLocalValue(startDate),
  };
}

function getInitialFormValues() {
  const dateRange = getDefaultDateRange();

  return {
    code: "",
    endDate: dateRange.endDate,
    maxDiscount: "",
    minOrder: 0,
    startDate: dateRange.startDate,
    status: COUPON_STATUS.active,
    type: COUPON_TYPE.percent,
    usageLimit: "",
    value: "",
  };
}

function toFormValues(coupon = {}) {
  return {
    code: coupon.code || "",
    endDate: toDatetimeLocalValue(coupon.endDate),
    maxDiscount: coupon.maxDiscount > 0 ? coupon.maxDiscount : "",
    minOrder: coupon.minOrder ?? 0,
    startDate: toDatetimeLocalValue(coupon.startDate),
    status: coupon.status || COUPON_STATUS.active,
    type: coupon.type || COUPON_TYPE.percent,
    usageLimit: coupon.usageLimit ?? "",
    value: coupon.value || "",
  };
}

function getDateTime(value) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function validateCouponForm(values = {}) {
  const errors = {};
  const code = String(values.code ?? "").trim();
  const value = Number(values.value);
  const minOrder = Number(values.minOrder);
  const maxDiscount = values.maxDiscount === "" ? null : Number(values.maxDiscount);
  const usageLimit = values.usageLimit === "" ? null : Number(values.usageLimit);
  const startTime = getDateTime(values.startDate);
  const endTime = getDateTime(values.endDate);
  const now = Date.now();

  if (!code) {
    errors.code = "Mã coupon không được để trống.";
  } else if (code.length > 20) {
    errors.code = "Mã coupon không được vượt quá 20 ký tự.";
  } else if (!/^[A-Z0-9_-]+$/.test(code)) {
    errors.code = "Chỉ dùng chữ in hoa, số, dấu gạch ngang hoặc gạch dưới.";
  }

  if (!values.type) {
    errors.type = "Loại giảm giá không được để trống.";
  }

  if (!Number.isFinite(value) || value <= 0) {
    errors.value = "Giá trị giảm phải lớn hơn 0.";
  } else if (values.type === COUPON_TYPE.percent && value > 100) {
    errors.value = "Coupon phần trăm không được vượt quá 100%.";
  }

  if (!Number.isFinite(minOrder) || minOrder < 0) {
    errors.minOrder = "Đơn tối thiểu phải là số không âm.";
  }

  if (!values.startDate || !startTime) {
    errors.startDate = "Ngày bắt đầu không hợp lệ.";
  } else if (startTime < now - 60 * 1000) {
    errors.startDate = "Ngày bắt đầu phải từ hiện tại trở đi.";
  }

  if (!values.endDate || !endTime) {
    errors.endDate = "Ngày kết thúc không hợp lệ.";
  } else if (endTime <= now) {
    errors.endDate = "Ngày kết thúc phải nằm trong tương lai.";
  }

  if (startTime && endTime && endTime <= startTime) {
    errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu.";
  }

  if (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit <= 0)) {
    errors.usageLimit = "Giới hạn lượt dùng phải là số nguyên lớn hơn 0.";
  }

  if (maxDiscount !== null && (!Number.isFinite(maxDiscount) || maxDiscount < 0)) {
    errors.maxDiscount = "Giảm tối đa phải là số không âm.";
  }

  if (!values.status) {
    errors.status = "Trạng thái không được để trống.";
  }

  return errors;
}

function StatCard({ icon, label, value }) {
  return (
    <div className="admin-panel admin-panel-hover rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
          {createElement(icon, { size: 18 })}
        </span>
        <span className="text-xl font-black text-slate-950">{value}</span>
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
    </div>
  );
}

function Coupons() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openCreate, openDelete, openEdit } = modal;

  const [coupons, setCoupons] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [statusFilter, setStatusFilter] = useState("");
  const [timeStatusFilter, setTimeStatusFilter] = useState("");
  const [dateType, setDateType] = useState("CREATED_AT");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const [formValues, setFormValues] = useState(getInitialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.coupons, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.coupons, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.coupons, "delete");
  const isFormOpen = modal.modalType === ADMIN_MODAL_TYPES.create || modal.modalType === ADMIN_MODAL_TYPES.edit;
  const isEditMode = modal.modalType === ADMIN_MODAL_TYPES.edit;
  const editingCoupon = isEditMode ? modal.modalPayload : null;
  const deletingCoupon = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await couponService.getAll(
        {
          dateType,
          fromDate: fromDate || undefined,
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
          timeStatus: timeStatusFilter || undefined,
          toDate: toDate || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setCoupons(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setCoupons([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [dateType, debouncedQuery, fromDate, page, pageSize, statusFilter, timeStatusFilter, toDate]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons, reloadKey]);

  const stats = useMemo(() => {
    const activeCount = coupons.filter((coupon) => getCouponLifecycle(coupon) === "active").length;
    const expiredCount = coupons.filter((coupon) => getCouponLifecycle(coupon) === "expired").length;
    const usedCount = coupons.reduce((total, coupon) => total + Number(coupon.usedCount || 0), 0);

    return [
      { icon: TicketPercent, label: "Total coupons", value: pageMeta.totalItems.toLocaleString("vi-VN") },
      { icon: BadgePercent, label: "Active on page", value: activeCount.toLocaleString("vi-VN") },
      { icon: CalendarClock, label: "Expired on page", value: expiredCount.toLocaleString("vi-VN") },
      { icon: TrendingUp, label: "Uses on page", value: usedCount.toLocaleString("vi-VN") },
    ];
  }, [coupons, pageMeta.totalItems]);

  const filterValues = useMemo(
    () => ({
      dateType,
      fromDate,
      status: statusFilter,
      timeStatus: timeStatusFilter,
      toDate,
    }),
    [dateType, fromDate, statusFilter, timeStatusFilter, toDate],
  );

  const handleFilterChange = (key, value) => {
    const setters = {
      dateType: setDateType,
      fromDate: setFromDate,
      status: setStatusFilter,
      timeStatus: setTimeStatusFilter,
      toDate: setToDate,
    };

    setters[key]?.(value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("");
    setTimeStatusFilter("");
    setDateType("CREATED_AT");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  const openCreateDrawer = () => {
    setFormValues(getInitialFormValues());
    setFormErrors({});
    openCreate();
  };

  const openEditDrawer = useCallback(async (coupon) => {
    setFormValues(toFormValues(coupon));
    setFormErrors({});
    openEdit(coupon);
    setDetailLoading(true);

    try {
      const detail = await couponService.getById(coupon.id, { skipGlobalErrorHandler: true });
      setFormValues(toFormValues(detail));
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được chi tiết coupon" });
    } finally {
      setDetailLoading(false);
    }
  }, [openEdit, toast]);

  const closeFormDrawer = () => {
    if (submitting) {
      return;
    }

    setFormErrors({});
    closeModal();
  };

  const handleFormChange = (key, value) => {
    setFormValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [key]: key === "code" ? String(value).toUpperCase() : value,
      };

      if (key === "type" && value === COUPON_TYPE.fixed) {
        nextValues.maxDiscount = "";
      }

      return nextValues;
    });

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

  const handleSubmitCoupon = async () => {
    const nextErrors = validateCouponForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode && editingCoupon?.id) {
        await couponService.update(editingCoupon.id, formValues, { skipGlobalErrorHandler: true });
        toast.showSuccess("Đã cập nhật coupon.");
      } else {
        await couponService.create(formValues, { skipGlobalErrorHandler: true });
        toast.showSuccess("Đã tạo coupon mới.");
      }

      closeFormDrawer();
      setReloadKey((value) => value + 1);
    } catch (requestError) {
      toast.showApiError(requestError, {
        title: isEditMode ? "Cập nhật coupon thất bại" : "Tạo coupon thất bại",
      });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = useCallback(async (coupon) => {
    if (!coupon?.id || coupon.status === COUPON_STATUS.deleted) {
      return;
    }

    const previousStatus = coupon.status;
    const nextStatus = previousStatus === COUPON_STATUS.active ? COUPON_STATUS.inactive : COUPON_STATUS.active;

    setStatusUpdatingId(coupon.id);
    setCoupons((currentCoupons) =>
      currentCoupons.map((item) => (item.id === coupon.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      const updatedCoupon = await couponService.updateStatus(coupon.id, nextStatus, { skipGlobalErrorHandler: true });
      setCoupons((currentCoupons) =>
        currentCoupons.map((item) => (item.id === coupon.id ? { ...item, ...updatedCoupon } : item)),
      );
      toast.showSuccess(nextStatus === COUPON_STATUS.active ? `Đã kích hoạt "${coupon.code}".` : `Đã tạm ẩn "${coupon.code}".`);
    } catch (requestError) {
      setCoupons((currentCoupons) =>
        currentCoupons.map((item) => (item.id === coupon.id ? { ...item, status: previousStatus } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật trạng thái coupon thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [toast]);

  const handleDeleteCoupon = async () => {
    if (!deletingCoupon?.id) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await couponService.remove(deletingCoupon.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa mềm coupon "${deletingCoupon.code}".`);
      closeModal();

      if (coupons.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        setReloadKey((value) => value + 1);
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa coupon thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="admin-page-shell">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Coupon Management</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Create coupon codes, track usage limits, manage discount types, and control active or expired campaigns.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            onClick={() => setReloadKey((value) => value + 1)}
            type="button"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            Refresh
          </button>

          {canCreate ? (
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-admin-card transition hover:bg-primary-hover"
              onClick={openCreateDrawer}
              type="button"
            >
              <Plus size={16} />
              New coupon
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard icon={stat.icon} key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.9fr)]">
        <AdminSearch
          disabled={loading}
          onChange={(nextValue) => {
            setQuery(nextValue);
            setPage(0);
          }}
          placeholder="Search by coupon code..."
          value={query}
        />

        <AdminFilters
          className="p-3"
          filters={[
            {
              key: "status",
              label: "Status",
              options: STATUS_OPTIONS,
              placeholder: "All statuses",
              type: "select",
            },
            {
              key: "timeStatus",
              label: "Validity",
              options: TIME_STATUS_OPTIONS,
              placeholder: "All validity",
              type: "select",
            },
            {
              key: "dateType",
              label: "Date field",
              options: DATE_TYPE_OPTIONS,
              placeholder: "Date field",
              type: "select",
            },
            {
              key: "fromDate",
              label: "From",
              type: "date",
            },
            {
              key: "toDate",
              label: "To",
              type: "date",
            },
          ]}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          summary="Status, active window, and audit dates"
          title="Filters"
          values={filterValues}
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

      <CouponTable
        canDelete={canDelete}
        canUpdate={canUpdate}
        data={coupons}
        loading={loading}
        onDelete={openDelete}
        onEdit={openEditDrawer}
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
        statusUpdatingId={statusUpdatingId}
      />

      <ConfirmDialog
        confirmLabel="Xóa coupon"
        description={
          deletingCoupon
            ? `Coupon "${deletingCoupon.code}" sẽ bị chuyển sang trạng thái xóa mềm.`
            : "Coupon sẽ bị chuyển sang trạng thái xóa mềm."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteCoupon}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa coupon"
        tone="danger"
      />

      <AdminDrawer
        description="Coupon dùng cho giỏ hàng và checkout. Hãy kiểm tra thời hạn, loại giảm giá và giới hạn sử dụng trước khi kích hoạt."
        onClose={closeFormDrawer}
        open={isFormOpen}
        size="lg"
        title={isEditMode ? "Cập nhật coupon" : "Tạo coupon mới"}
      >
        <CouponForm
          errors={formErrors}
          loading={submitting || detailLoading}
          mode={isEditMode ? "edit" : "create"}
          onCancel={closeFormDrawer}
          onChange={handleFormChange}
          onSubmit={handleSubmitCoupon}
          values={formValues}
        />
      </AdminDrawer>
    </section>
  );
}

export default Coupons;
