import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import categoryService from "../../api/categoryService";
import { AdminDrawer, AdminFilters, AdminForm, AdminSearch, AdminTable, ConfirmDialog, StatusBadge } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal, useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import OptimizedImage from "../../components/common/OptimizedImage";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";

const CATEGORY_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đang ẩn", value: "HIDDEN" },
  { label: "Đã xóa", value: "DELETED" },
];

const CATEGORY_FORM_STATUS_OPTIONS = [
  { label: "Đang hoạt động", value: "ACTIVE" },
  { label: "Đang ẩn", value: "HIDDEN" },
  { label: "Đã xóa", value: "DELETED" },
];

const initialFormValues = {
  description: "",
  icon: "",
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

function validateCategoryForm(values) {
  const errors = {};

  if (!String(values.name ?? "").trim()) {
    errors.name = "Tên danh mục không được để trống.";
  }

  if (!String(values.slug ?? "").trim()) {
    errors.slug = "Slug không được để trống.";
  } else if (!/^[a-z0-9-]+$/.test(values.slug)) {
    errors.slug = "Slug chỉ gồm chữ thường, số và dấu gạch ngang.";
  }

  if (!String(values.status ?? "").trim()) {
    errors.status = "Trạng thái không được để trống.";
  }

  return errors;
}

function Categories() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openCreate, openDelete, openEdit } = modal;
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
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
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.categories, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.categories, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.categories, "delete");

  const isFormOpen = modal.modalType === ADMIN_MODAL_TYPES.create || modal.modalType === ADMIN_MODAL_TYPES.edit;
  const editingCategory = modal.modalType === ADMIN_MODAL_TYPES.edit ? modal.modalPayload : null;
  const deletingCategory = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryService.getAll(
        {
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setCategories(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setCategories([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, statusFilter]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories, reloadKey]);

  const openCreateDrawer = useCallback(() => {
    setFormValues(initialFormValues);
    setFormErrors({});
    setSlugTouched(false);
    openCreate();
  }, [openCreate]);

  const openEditDrawer = useCallback((category) => {
    setFormValues({
      description: category.description ?? "",
      icon: category.icon ?? category.iconUrl ?? "",
      name: category.name ?? "",
      slug: category.slug ?? "",
      status: category.status ?? "ACTIVE",
    });
    setFormErrors({});
    setSlugTouched(true);
    openEdit(category);
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

  const handleSubmitCategory = async () => {
    const nextErrors = validateCategoryForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const isEditMode = modal.modalType === ADMIN_MODAL_TYPES.edit && editingCategory?.id;
    setSubmitting(true);
    setError(null);

    try {
      const savedCategory = isEditMode
        ? await categoryService.update(editingCategory.id, formValues, { skipGlobalErrorHandler: true })
        : await categoryService.create(formValues, { skipGlobalErrorHandler: true });
      const savedDescription = String(formValues.description ?? "").trim();

      setCategories((currentCategories) => {
        if (isEditMode) {
          return currentCategories.map((item) =>
            item.id === savedCategory.id
              ? {
                  ...item,
                  ...savedCategory,
                  description: savedDescription || savedCategory.description || "",
                }
              : item,
          );
        }

        return currentCategories;
      });

      if (!isEditMode) {
        setReloadKey((value) => value + 1);
      }

      toast.showSuccess(isEditMode ? "Đã cập nhật danh mục." : "Đã tạo danh mục mới.");
      closeFormDrawer();
    } catch (requestError) {
      toast.showApiError(requestError, {
        title: modal.modalType === ADMIN_MODAL_TYPES.edit ? "Cập nhật danh mục thất bại" : "Tạo danh mục thất bại",
      });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory?.id) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await categoryService.remove(deletingCategory.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa danh mục "${deletingCategory.name}".`);
      closeModal();

      setCategories((currentCategories) => currentCategories.filter((item) => item.id !== deletingCategory.id));
      if (categories.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        setReloadKey((value) => value + 1);
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa danh mục thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = useCallback(async (category) => {
    if (!category?.id || category.status === "DELETED") {
      return;
    }

    const previousStatus = category.status;
    const nextStatus = previousStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";

    setStatusUpdatingId(category.id);
    setCategories((currentCategories) =>
      currentCategories.map((item) =>
        item.id === category.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
      ),
    );

    try {
      const updatedCategory = await categoryService.updateStatus(category.id, nextStatus, { skipGlobalErrorHandler: true });
      setCategories((currentCategories) =>
        currentCategories.map((item) =>
          item.id === category.id
            ? {
                ...item,
                ...updatedCategory,
                description: item.description || updatedCategory.description || "",
              }
            : item,
        ),
      );
      toast.showSuccess(
        nextStatus === "ACTIVE"
          ? `Đã kích hoạt danh mục "${category.name}".`
          : `Đã ẩn danh mục "${category.name}".`,
      );
    } catch (requestError) {
      setCategories((currentCategories) =>
        currentCategories.map((item) =>
          item.id === category.id
            ? {
                ...item,
                status: previousStatus,
              }
            : item,
        ),
      );
      toast.showApiError(requestError, { title: "Cập nhật trạng thái thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [toast]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Danh mục",
        render: (item) => (
          <div className="flex min-w-[220px] items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-xs font-black uppercase text-slate-500">
              {item.icon ? (
                <OptimizedImage alt={item.name} className="h-full w-full object-cover" fallbackKind="category" sizes="40px" src={item.icon} />
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
            <p className="max-w-[280px] truncate text-sm font-semibold text-slate-600">{item.description}</p>
          ) : (
            <span className="text-sm font-semibold text-slate-400">Chưa có mô tả</span>
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
                title={item.status === "ACTIVE" ? "Ẩn danh mục" : "Kích hoạt danh mục"}
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
    [canUpdate, handleToggleStatus, statusUpdatingId],
  );

  const rowActions = useMemo(
    () =>
      [
        canUpdate
          ? {
              hidden: (item) => item.status === "DELETED",
              icon: Pencil,
              key: "edit",
              label: "Sửa danh mục",
              onClick: (item) => openEditDrawer(item),
            }
          : null,
        canDelete
          ? {
              disabled: (item) => item.status === "DELETED",
              icon: Trash2,
              key: "delete",
              label: "Xóa danh mục",
              onClick: (item) => openDelete(item),
            }
          : null,
      ].filter(Boolean),
    [canDelete, canUpdate, openDelete, openEditDrawer],
  );

  const formFields = useMemo(
    () => [
      {
        label: "Tên danh mục",
        name: "name",
        placeholder: "Ví dụ: Laptop Gaming",
        required: true,
      },
      {
        helper: "Chỉ dùng chữ thường, số và dấu gạch ngang.",
        label: "Slug",
        name: "slug",
        placeholder: "laptop-gaming",
        required: true,
      },
      {
        fullWidth: true,
        helper: "Mô tả đang được lưu ở UI session; backend Category API hiện chưa trả trường này.",
        label: "Mô tả",
        name: "description",
        placeholder: "Mô tả ngắn cho danh mục...",
        type: "textarea",
      },
      {
        label: "Icon",
        name: "icon",
        placeholder: "https://cdn.example.com/icon.png",
      },
      {
        label: "Trạng thái",
        name: "status",
        options: CATEGORY_FORM_STATUS_OPTIONS,
        required: true,
        type: "select",
      },
    ],
    [],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Danh mục</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Quản lý danh mục sản phẩm, trạng thái hiển thị và metadata SEO.
          </p>
        </div>

        {canCreate ? (
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-white transition hover:bg-primary-hover"
            onClick={openCreateDrawer}
            type="button"
          >
            <Plus size={17} />
            Thêm danh mục
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
          placeholder="Tìm theo tên hoặc slug danh mục..."
          value={query}
        />

        <AdminFilters
          className="p-3"
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: CATEGORY_STATUS_OPTIONS,
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
          summary="Lọc nhanh danh mục"
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
        data={categories}
        emptyMessage="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái."
        emptyTitle="Không có danh mục nào phù hợp"
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
        confirmLabel="Xóa danh mục"
        description={
          deletingCategory
            ? `Danh mục "${deletingCategory.name}" sẽ bị chuyển trạng thái xóa mềm.`
            : "Danh mục sẽ bị chuyển sang trạng thái đã xóa."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteCategory}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa danh mục"
        tone="danger"
      />

      <AdminDrawer
        description="Điền thông tin cơ bản của danh mục để đồng bộ với backend."
        onClose={closeFormDrawer}
        open={isFormOpen}
        size="lg"
        title={modal.modalType === ADMIN_MODAL_TYPES.edit ? "Cập nhật danh mục" : "Tạo danh mục mới"}
      >
        <AdminForm
          errors={formErrors}
          fields={formFields}
          loading={submitting}
          onCancel={closeFormDrawer}
          onChange={handleFormChange}
          onSubmit={handleSubmitCategory}
          submitLabel={modal.modalType === ADMIN_MODAL_TYPES.edit ? "Lưu thay đổi" : "Tạo danh mục"}
          values={formValues}
        />
      </AdminDrawer>
    </section>
  );
}

export default Categories;
