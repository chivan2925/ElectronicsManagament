import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import productService from "../../api/productService";
import variantService from "../../api/variantService";
import { normalizeSlug } from "../../api/productMapper";
import { AdminDrawer, AdminFilters, AdminSearch, ConfirmDialog } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal, useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import VariantForm from "./variants/VariantForm";
import VariantTable from "./variants/VariantTable";

const STATUS_OPTIONS = [
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Đang ẩn", value: "HIDDEN" },
  { label: "Đã xóa", value: "DELETED" },
];

const INITIAL_FORM_VALUES = {
  attributeRows: [{ key: "", value: "" }],
  color: "",
  name: "",
  originalThumbnailUrl: "",
  price: 0,
  productId: "",
  productName: "",
  sku: "",
  size: "",
  slug: "",
  status: "ACTIVE",
  stock: 0,
  thumbnailUrl: "",
};

function toFormValues(variant = {}) {
  return {
    attributeRows: variant.attributeRows?.length ? variant.attributeRows : [{ key: "", value: "" }],
    color: variant.color || "",
    image: variant.image || "",
    name: variant.name || "",
    originalThumbnailUrl: variant.primaryImageUrl || "",
    price: variant.price || 0,
    primaryImageUrl: variant.primaryImageUrl || "",
    productId: variant.productId ? String(variant.productId) : "",
    productName: variant.productName || "",
    sku: variant.sku || "",
    size: variant.size || "",
    slug: variant.slug || "",
    status: variant.status || "ACTIVE",
    stock: variant.stock ?? variant.totalStock ?? 0,
    thumbnailUrl: variant.primaryImageUrl || "",
  };
}

function isValidUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function validateVariantForm(values) {
  const errors = {};

  if (!values.productId) {
    errors.productId = "Sản phẩm không được để trống.";
  }

  if (!String(values.sku ?? "").trim()) {
    errors.sku = "SKU không được để trống.";
  }

  if (!String(values.name ?? "").trim()) {
    errors.name = "Tên biến thể không được để trống.";
  }

  if (!String(values.slug ?? "").trim()) {
    errors.slug = "Slug không được để trống.";
  }

  if (!String(values.color ?? "").trim()) {
    errors.color = "Màu không được để trống.";
  }

  if (values.price === "" || Number(values.price) < 0) {
    errors.price = "Giá phải là số không âm.";
  }

  if (values.stock === "" || Number(values.stock) < 0 || !Number.isInteger(Number(values.stock))) {
    errors.stock = "Tồn kho phải là số nguyên không âm.";
  }

  if (!values.status) {
    errors.status = "Trạng thái không được để trống.";
  }

  if (values.thumbnailUrl && !isValidUrl(values.thumbnailUrl)) {
    errors.thumbnailUrl = "Ảnh preview phải là URL http/https hợp lệ.";
  }

  const invalidAttribute = (values.attributeRows ?? []).some((row) => (row.key && !row.value) || (!row.key && row.value));

  if (invalidAttribute) {
    errors.attributes = "Mỗi attribute cần đủ key và value.";
  }

  return errors;
}

function Variants() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openCreate, openDelete, openEdit } = modal;

  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [productFilter, setProductFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productError, setProductError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.variants, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.variants, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.variants, "delete");
  const isFormOpen = modal.modalType === ADMIN_MODAL_TYPES.create || modal.modalType === ADMIN_MODAL_TYPES.edit;
  const isEditMode = modal.modalType === ADMIN_MODAL_TYPES.edit;
  const editingVariant = isEditMode ? modal.modalPayload : null;
  const deletingVariant = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  const loadProducts = useCallback(async () => {
    setProductLoading(true);
    setProductError(null);

    try {
      const productPage = await productService.getAll(
        {
          page: 0,
          size: 300,
          sort: "name,asc",
          status: "ACTIVE",
        },
        { skipGlobalErrorHandler: true },
      );

      setProducts(productPage.items);
    } catch (requestError) {
      setProductError(requestError);
      setProducts([]);
    } finally {
      setProductLoading(false);
    }
  }, []);

  const loadVariants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await variantService.getAll(
        {
          keyword: debouncedQuery || undefined,
          page,
          productId: productFilter || undefined,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setVariants(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setVariants([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, productFilter, statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadVariants();
  }, [loadVariants, reloadKey]);

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: product.name,
        value: String(product.apiId ?? product.id),
      })),
    [products],
  );

  const filterValues = useMemo(
    () => ({
      productId: productFilter,
      status: statusFilter,
    }),
    [productFilter, statusFilter],
  );

  const handleFilterChange = (key, value) => {
    if (key === "query") {
      setQuery(value);
      setPage(0);
      return;
    }

    if (key === "productId") {
      setProductFilter(value);
    }

    if (key === "status") {
      setStatusFilter(value);
    }

    setPage(0);
  };

  const handleResetFilters = () => {
    setQuery("");
    setProductFilter("");
    setStatusFilter("");
    setPage(0);
  };

  const handleFormChange = (key, value) => {
    setFormValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [key]: value,
      };

      if (key === "productId") {
        nextValues.productName = products.find((product) => String(product.apiId ?? product.id) === String(value))?.name || "";
      }

      if ((key === "name" || key === "sku") && !currentValues.slug) {
        const nextName = key === "name" ? value : currentValues.name;
        const nextSku = key === "sku" ? value : currentValues.sku;
        nextValues.slug = normalizeSlug(`${nextName || "variant"}-${nextSku || ""}`);
      }

      return nextValues;
    });

    setFormErrors((currentErrors) => {
      if (!currentErrors[key] && key !== "attributeRows") {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [key]: undefined,
        attributes: key === "attributeRows" ? undefined : currentErrors.attributes,
      };
    });
  };

  const openCreateDrawer = () => {
    setFormValues(INITIAL_FORM_VALUES);
    setFormErrors({});
    openCreate();
  };

  const openEditDrawer = useCallback(async (variant) => {
    setFormValues(toFormValues(variant));
    setFormErrors({});
    openEdit(variant);
    setDetailLoading(true);

    try {
      const detail = await variantService.getById(variant.apiId ?? variant.id, { skipGlobalErrorHandler: true });
      setFormValues(toFormValues({ ...variant, ...detail }));
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được chi tiết biến thể" });
    } finally {
      setDetailLoading(false);
    }
  }, [openEdit, toast]);

  const closeFormDrawer = () => {
    setFormErrors({});
    closeModal();
  };

  const handleSubmitVariant = async () => {
    const nextErrors = validateVariantForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode && editingVariant?.id) {
        await variantService.update(editingVariant.apiId ?? editingVariant.id, formValues, { skipGlobalErrorHandler: true });
        toast.showSuccess("Đã cập nhật biến thể.");
      } else {
        await variantService.create(formValues, { skipGlobalErrorHandler: true });
        toast.showSuccess("Đã tạo biến thể mới.");
      }

      closeFormDrawer();
      setReloadKey((value) => value + 1);
    } catch (requestError) {
      toast.showApiError(requestError, {
        title: isEditMode ? "Cập nhật biến thể thất bại" : "Tạo biến thể thất bại",
      });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = useCallback(async (variant) => {
    if (!variant?.id || variant.status === "DELETED") {
      return;
    }

    const previousStatus = variant.status;
    const nextStatus = previousStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";

    setStatusUpdatingId(variant.id);
    setVariants((currentVariants) =>
      currentVariants.map((item) => (item.id === variant.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      const updatedVariant = await variantService.updateStatus(variant.apiId ?? variant.id, nextStatus, { skipGlobalErrorHandler: true });
      setVariants((currentVariants) =>
        currentVariants.map((item) => (item.id === variant.id ? { ...item, ...updatedVariant } : item)),
      );
      toast.showSuccess(nextStatus === "ACTIVE" ? `Đã kích hoạt "${variant.sku}".` : `Đã ẩn "${variant.sku}".`);
    } catch (requestError) {
      setVariants((currentVariants) =>
        currentVariants.map((item) => (item.id === variant.id ? { ...item, status: previousStatus } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật trạng thái thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [toast]);

  const handleDeleteVariant = async () => {
    if (!deletingVariant?.id) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await variantService.remove(deletingVariant.apiId ?? deletingVariant.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa mềm biến thể "${deletingVariant.sku || deletingVariant.name}".`);
      closeModal();

      if (variants.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        setReloadKey((value) => value + 1);
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa biến thể thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="admin-page-shell">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Biến thể Variant</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Quản lý SKU, giá override, thuộc tính bán hàng và tồn kho theo từng sản phẩm.
          </p>
        </div>

        {canCreate ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-admin-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            disabled={productLoading}
            onClick={openCreateDrawer}
            type="button"
          >
            {productLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            Thêm biến thể
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(460px,0.75fr)]">
        <AdminSearch
          disabled={loading}
          onChange={(nextValue) => handleFilterChange("query", nextValue)}
          placeholder="Tìm theo SKU, tên biến thể, sản phẩm hoặc màu..."
          value={query}
        />

        <AdminFilters
          className="p-3"
          filters={[
            {
              key: "productId",
              label: "Sản phẩm",
              options: productOptions,
              placeholder: "Tất cả sản phẩm",
              type: "select",
            },
            {
              key: "status",
              label: "Trạng thái",
              options: STATUS_OPTIONS,
              placeholder: "Tất cả trạng thái",
              type: "select",
            },
          ]}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          summary="Lọc nhanh tồn kho"
          title="Bộ lọc"
          values={filterValues}
        />
      </div>

      {productError ? (
        <ApiErrorAlert
          actionLabel="Tải lại sản phẩm"
          error={productError}
          onAction={loadProducts}
          onDismiss={() => setProductError(null)}
          surface="admin"
        />
      ) : null}

      {error ? (
        <ApiErrorAlert
          actionLabel="Tải lại"
          error={error}
          onAction={() => setReloadKey((value) => value + 1)}
          onDismiss={() => setError(null)}
          surface="admin"
        />
      ) : null}

      <VariantTable
        canDelete={canDelete}
        canUpdate={canUpdate}
        data={variants}
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
        confirmLabel="Xóa biến thể"
        description={
          deletingVariant
            ? `Biến thể "${deletingVariant.sku || deletingVariant.name}" sẽ bị chuyển sang trạng thái xóa mềm.`
            : "Biến thể sẽ bị chuyển sang trạng thái xóa mềm."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteVariant}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa biến thể"
        tone="danger"
      />

      <AdminDrawer
        description="Biến thể gắn với sản phẩm gốc, quản lý SKU, giá override, thuộc tính và tồn kho."
        onClose={closeFormDrawer}
        open={isFormOpen}
        size="lg"
        title={isEditMode ? "Cập nhật biến thể" : "Tạo biến thể mới"}
      >
        <VariantForm
          errors={formErrors}
          loading={submitting || detailLoading}
          mode={isEditMode ? "edit" : "create"}
          onCancel={closeFormDrawer}
          onChange={handleFormChange}
          onSubmit={handleSubmitVariant}
          products={products}
          values={formValues}
        />
      </AdminDrawer>
    </section>
  );
}

export default Variants;
