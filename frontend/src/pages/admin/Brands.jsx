import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ImagePlus, Loader2, Pencil, Plus, Star, Trash2, UploadCloud } from "lucide-react";
import brandService from "../../api/brandService";
import { AdminDrawer, AdminFilters, AdminForm, AdminSearch, AdminTable, ConfirmDialog, StatusBadge } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal, useAdminServerTableState, useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import OptimizedImage from "../../components/common/OptimizedImage";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import { cn } from "../../utils/classNames";

const BRAND_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đang ẩn", value: "HIDDEN" },
  { label: "Đã xóa", value: "DELETED" },
];

const BRAND_FEATURED_OPTIONS = [
  { label: "Nổi bật", value: "true" },
  { label: "Không nổi bật", value: "false" },
];

const initialFormValues = {
  description: "",
  featured: false,
  logo: "",
  name: "",
  slug: "",
  status: "ACTIVE",
};

function normalizeSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function validateBrandForm(values) {
  const errors = {};

  if (!String(values.name ?? "").trim()) {
    errors.name = "Tên thương hiệu không được để trống.";
  }

  if (!String(values.slug ?? "").trim()) {
    errors.slug = "Slug không được để trống.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
    errors.slug = "Slug chỉ gồm chữ thường, số và dấu gạch ngang.";
  }

  if (String(values.description ?? "").length > 1000) {
    errors.description = "Mô tả không được vượt quá 1000 ký tự.";
  }

  if (!String(values.status ?? "").trim()) {
    errors.status = "Trạng thái không được để trống.";
  }

  return errors;
}

function LogoUploadPlaceholder({ brandName, describedBy, disabled = false, error, fieldId, onChange, value }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-lg font-black uppercase text-slate-500 shadow-sm">
          {value ? (
            <OptimizedImage alt={brandName || "Brand logo"} className="h-full w-full object-contain p-2" fallbackKind="brand" sizes="64px" src={value} />
          ) : (
            <ImagePlus size={22} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-11 w-full rounded-xl border bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              error ? "border-rose-300 ring-2 ring-rose-100" : "border-slate-200",
            )}
            disabled={disabled}
            id={fieldId}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="https://cdn.example.com/brand-logo.png"
            type="url"
            value={value}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-400"
              disabled
              type="button"
            >
              <UploadCloud size={14} />
              Upload sau
            </button>
            {value ? (
              <button
                className="rounded-xl px-3 py-2 text-xs font-black text-slate-500 transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                onClick={() => onChange?.("")}
                type="button"
              >
                Xóa logo
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Brands() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openCreate, openDelete, openEdit } = modal;
  const [brands, setBrands] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { page, pageSize, pagination, refresh, reloadKey, resetPage, setPage, setPageMeta } = useAdminServerTableState();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [featuredUpdatingId, setFeaturedUpdatingId] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.brands, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.brands, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.brands, "delete");

  const isFormOpen = modal.modalType === ADMIN_MODAL_TYPES.create || modal.modalType === ADMIN_MODAL_TYPES.edit;
  const editingBrand = modal.modalType === ADMIN_MODAL_TYPES.edit ? modal.modalPayload : null;
  const deletingBrand = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  const loadBrands = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await brandService.getAll(
        {
          featured: featuredFilter === "" ? undefined : featuredFilter === "true",
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setBrands(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setBrands([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, featuredFilter, page, pageSize, setPageMeta, statusFilter]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands, reloadKey]);

  const openCreateDrawer = useCallback(() => {
    setFormValues(initialFormValues);
    setFormErrors({});
    setSlugTouched(false);
    openCreate();
  }, [openCreate]);

  const openEditDrawer = useCallback((brand) => {
    setFormValues({
      description: brand.description ?? "",
      featured: Boolean(brand.featured),
      logo: brand.logo ?? brand.imageUrl ?? "",
      name: brand.name ?? "",
      slug: brand.slug ?? "",
      status: brand.status ?? "ACTIVE",
    });
    setFormErrors({});
    setSlugTouched(true);
    openEdit(brand);
  }, [openEdit]);

  const closeFormDrawer = useCallback(() => {
    setFormErrors({});
    closeModal();
  }, [closeModal]);

  const handleFormChange = (key, value) => {
    setFormValues((currentValues) => {
      if (key === "name" && !slugTouched) {
        return {
          ...currentValues,
          name: value,
          slug: normalizeSlug(value),
        };
      }

      return {
        ...currentValues,
        [key]: value,
      };
    });

    if (key === "slug") {
      setSlugTouched(true);
    }

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

  const handleSubmitBrand = async () => {
    const nextErrors = validateBrandForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const isEditMode = modal.modalType === ADMIN_MODAL_TYPES.edit && editingBrand?.id;
    setSubmitting(true);
    setError(null);

    try {
      const savedBrand = isEditMode
        ? await brandService.update(editingBrand.id, formValues, { skipGlobalErrorHandler: true })
        : await brandService.create(formValues, { skipGlobalErrorHandler: true });

      setBrands((currentBrands) => {
        if (isEditMode) {
          return currentBrands.map((item) => (item.id === savedBrand.id ? { ...item, ...savedBrand } : item));
        }

        return currentBrands;
      });

      if (!isEditMode) {
        refresh();
      }

      toast.showSuccess(isEditMode ? "Đã cập nhật thương hiệu." : "Đã tạo thương hiệu mới.");
      closeFormDrawer();
    } catch (requestError) {
      toast.showApiError(requestError, {
        title: modal.modalType === ADMIN_MODAL_TYPES.edit ? "Cập nhật thương hiệu thất bại" : "Tạo thương hiệu thất bại",
      });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!deletingBrand?.id) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await brandService.remove(deletingBrand.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa thương hiệu "${deletingBrand.name}".`);
      closeModal();

      setBrands((currentBrands) => currentBrands.filter((item) => item.id !== deletingBrand.id));
      if (brands.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        refresh();
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa thương hiệu thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = useCallback(async (brand) => {
    if (!brand?.id || brand.status === "DELETED") {
      return;
    }

    const previousStatus = brand.status;
    const nextStatus = previousStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";

    setStatusUpdatingId(brand.id);
    setBrands((currentBrands) =>
      currentBrands.map((item) => (item.id === brand.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      const updatedBrand = await brandService.updateStatus(brand.id, nextStatus, { skipGlobalErrorHandler: true });
      setBrands((currentBrands) =>
        currentBrands.map((item) => (item.id === brand.id ? { ...item, ...updatedBrand } : item)),
      );
      toast.showSuccess(
        nextStatus === "ACTIVE"
          ? `Đã kích hoạt thương hiệu "${brand.name}".`
          : `Đã ẩn thương hiệu "${brand.name}".`,
      );
    } catch (requestError) {
      setBrands((currentBrands) =>
        currentBrands.map((item) => (item.id === brand.id ? { ...item, status: previousStatus } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật trạng thái thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [toast]);

  const handleToggleFeatured = useCallback(async (brand) => {
    if (!brand?.id || brand.status === "DELETED") {
      return;
    }

    const previousFeatured = Boolean(brand.featured);
    const nextFeatured = !previousFeatured;

    setFeaturedUpdatingId(brand.id);
    setBrands((currentBrands) =>
      currentBrands.map((item) => (item.id === brand.id ? { ...item, featured: nextFeatured } : item)),
    );

    try {
      const updatedBrand = await brandService.update(
        brand.id,
        {
          ...brand,
          featured: nextFeatured,
        },
        { skipGlobalErrorHandler: true },
      );
      setBrands((currentBrands) =>
        currentBrands.map((item) => (item.id === brand.id ? { ...item, ...updatedBrand } : item)),
      );
      toast.showSuccess(
        nextFeatured ? `Đã đánh dấu nổi bật "${brand.name}".` : `Đã bỏ nổi bật "${brand.name}".`,
      );
    } catch (requestError) {
      setBrands((currentBrands) =>
        currentBrands.map((item) => (item.id === brand.id ? { ...item, featured: previousFeatured } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật nổi bật thất bại" });
    } finally {
      setFeaturedUpdatingId(null);
    }
  }, [toast]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Thương hiệu",
        render: (item) => (
          <div className="flex min-w-[240px] items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-sm font-black uppercase text-slate-500">
              {item.logo ? (
                <OptimizedImage alt={item.name} className="h-full w-full object-contain p-2" fallbackKind="brand" sizes="48px" src={item.logo} />
              ) : (
                <span>{String(item.name || "?").slice(0, 1)}</span>
              )}
            </div>
            <div>
              <p className="font-black text-slate-900">{item.name}</p>
              <p className="text-xs font-semibold text-slate-500">#{item.id}</p>
            </div>
          </div>
        ),
      },
      {
        key: "slug",
        label: "Slug",
        render: (item) => <code className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{item.slug}</code>,
      },
      {
        key: "description",
        label: "Mô tả",
        render: (item) =>
          item.description ? (
            <p className="max-w-[300px] truncate text-sm font-semibold text-slate-600">{item.description}</p>
          ) : (
            <span className="text-sm font-semibold text-slate-400">Chưa có mô tả</span>
          ),
      },
      {
        key: "featured",
        label: "Nổi bật",
        render: (item) => (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ring-1",
                item.featured ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-slate-100 text-slate-600 ring-slate-200",
              )}
            >
              <Star className={item.featured ? "fill-current" : ""} size={13} />
              {item.featured ? "Có" : "Không"}
            </span>
            {canUpdate && item.status !== "DELETED" ? (
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={featuredUpdatingId === item.id}
                onClick={() => handleToggleFeatured(item)}
                title={item.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                type="button"
              >
                {featuredUpdatingId === item.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Star className={item.featured ? "fill-current" : ""} size={16} />
                )}
              </button>
            ) : null}
          </div>
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
                title={item.status === "ACTIVE" ? "Ẩn thương hiệu" : "Kích hoạt thương hiệu"}
                type="button"
              >
                {statusUpdatingId === item.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : item.status === "ACTIVE" ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            ) : null}
          </div>
        ),
      },
      {
        key: "updatedAt",
        label: "Cập nhật",
        render: (item) => <span className="text-sm font-semibold text-slate-600">{formatDateTime(item.updatedAt)}</span>,
      },
    ],
    [canUpdate, featuredUpdatingId, handleToggleFeatured, handleToggleStatus, statusUpdatingId],
  );

  const rowActions = useMemo(
    () =>
      [
        canUpdate
          ? {
              hidden: (item) => item.status === "DELETED",
              icon: Pencil,
              key: "edit",
              label: "Sửa thương hiệu",
              onClick: (item) => openEditDrawer(item),
            }
          : null,
        canDelete
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Trash2,
              key: "delete",
              label: "Xóa thương hiệu",
              onClick: (item) => openDelete(item),
            }
          : null,
      ].filter(Boolean),
    [canDelete, canUpdate, openDelete, openEditDrawer],
  );

  const formFields = useMemo(
    () => [
      {
        label: "Tên thương hiệu",
        name: "name",
        placeholder: "Ví dụ: ASUS ROG",
        required: true,
      },
      {
        helper: "Chỉ dùng chữ thường, số và dấu gạch ngang.",
        label: "Slug",
        name: "slug",
        placeholder: "asus-rog",
        required: true,
      },
      {
        fullWidth: true,
        helper: "Logo hiện được nhập bằng URL; nút upload là placeholder cho bước Media API.",
        label: "Logo",
        name: "logo",
        render: ({ describedBy, disabled, error, fieldId, onChange, value, values }) => (
          <LogoUploadPlaceholder
            brandName={values.name}
            describedBy={describedBy}
            disabled={disabled}
            error={error}
            fieldId={fieldId}
            onChange={onChange}
            value={value}
          />
        ),
      },
      {
        fullWidth: true,
        label: "Mô tả",
        name: "description",
        placeholder: "Mô tả ngắn về thương hiệu, phân khúc hoặc cam kết chính hãng...",
        type: "textarea",
      },
      {
        checkboxLabel: "Hiển thị trong nhóm thương hiệu nổi bật",
        label: "Nổi bật",
        name: "featured",
        type: "checkbox",
      },
      {
        label: "Trạng thái",
        name: "status",
        options: BRAND_STATUS_OPTIONS,
        required: true,
        type: "select",
      },
    ],
    [],
  );

  return (
    <section className="admin-page-shell">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Thương hiệu</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Quản lý thương hiệu, logo, trạng thái hiển thị và nhóm nổi bật cho catalog.
          </p>
        </div>

        {canCreate ? (
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white transition hover:bg-primary-hover"
            onClick={openCreateDrawer}
            type="button"
          >
            <Plus size={17} />
            Thêm thương hiệu
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_420px]">
        <AdminSearch
          disabled={loading}
          onChange={(nextValue) => {
            setQuery(nextValue);
            resetPage();
          }}
          placeholder="Tìm theo tên, slug hoặc mô tả thương hiệu..."
          value={query}
        />

        <AdminFilters
          className="p-3"
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: BRAND_STATUS_OPTIONS,
              placeholder: "Tất cả",
              type: "select",
            },
            {
              key: "featured",
              label: "Nổi bật",
              options: BRAND_FEATURED_OPTIONS,
              placeholder: "Tất cả",
              type: "select",
            },
          ]}
          onChange={(key, value) => {
            if (key === "status") {
              setStatusFilter(value);
            }

            if (key === "featured") {
              setFeaturedFilter(value);
            }

            resetPage();
          }}
          onReset={() => {
            setStatusFilter("");
            setFeaturedFilter("");
            resetPage();
          }}
          summary="Lọc theo trạng thái và nổi bật"
          title="Bộ lọc"
          values={{ featured: featuredFilter, status: statusFilter }}
        />
      </div>

      {error ? (
        <ApiErrorAlert
          actionLabel="Tải lại"
          error={error}
          onAction={refresh}
          onDismiss={() => setError(null)}
          surface="admin"
        />
      ) : null}

      <AdminTable
        columns={columns}
        data={brands}
        emptyMessage="Thử thay đổi từ khóa, trạng thái hoặc bộ lọc nổi bật."
        emptyTitle="Không có thương hiệu nào phù hợp"
        enablePagination
        loading={loading}
        manualPagination
        pagination={pagination}
        rowActions={rowActions}
      />

      <ConfirmDialog
        confirmLabel="Xóa thương hiệu"
        description={
          deletingBrand
            ? `Thương hiệu "${deletingBrand.name}" sẽ bị chuyển trạng thái xóa mềm.`
            : "Thương hiệu sẽ bị chuyển sang trạng thái đã xóa."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteBrand}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa thương hiệu"
        tone="danger"
      />

      <AdminDrawer
        description="Cập nhật dữ liệu thương hiệu để đồng bộ với Brand API."
        onClose={closeFormDrawer}
        open={isFormOpen}
        size="lg"
        title={modal.modalType === ADMIN_MODAL_TYPES.edit ? "Cập nhật thương hiệu" : "Tạo thương hiệu mới"}
      >
        <AdminForm
          errors={formErrors}
          fields={formFields}
          loading={submitting}
          onCancel={closeFormDrawer}
          onChange={handleFormChange}
          onSubmit={handleSubmitBrand}
          submitLabel={modal.modalType === ADMIN_MODAL_TYPES.edit ? "Lưu thay đổi" : "Tạo thương hiệu"}
          values={formValues}
        />
      </AdminDrawer>
    </section>
  );
}

export default Brands;
