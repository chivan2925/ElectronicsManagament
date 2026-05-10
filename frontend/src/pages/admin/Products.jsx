import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import brandService from "../../api/brandService";
import categoryService from "../../api/categoryService";
import productService from "../../api/productService";
import { parseProductSpecsText, normalizeSlug } from "../../api/productMapper";
import { AdminDrawer, ConfirmDialog } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal, useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import ProductFilters from "./products/ProductFilters";
import ProductForm from "./products/ProductForm";
import ProductTable from "./products/ProductTable";

const INITIAL_FORM_VALUES = {
  brandId: "",
  brandName: "",
  categoryId: "",
  categoryName: "",
  description: "",
  featured: false,
  name: "",
  originalThumbnailUrl: "",
  price: 0,
  primaryImageUrl: "",
  slug: "",
  specsText: "",
  status: "ACTIVE",
  stock: 0,
  thumbnailUrl: "",
  warrantyMonths: 12,
};

function toFormValues(product = {}) {
  const primaryImage = product.primaryImageUrl || "";

  return {
    brandId: product.brandId ? String(product.brandId) : "",
    brandName: product.brand || product.brandName || "",
    categoryId: product.categoryId ? String(product.categoryId) : "",
    categoryName: product.category || product.categoryName || "",
    description: product.description || "",
    featured: Boolean(product.featured),
    name: product.name || "",
    originalThumbnailUrl: primaryImage,
    price: product.price || 0,
    primaryImageUrl: primaryImage,
    slug: product.slug || "",
    specsText: product.specsText || "",
    status: product.status || "ACTIVE",
    stock: product.stock || 0,
    thumbnailUrl: primaryImage,
    warrantyMonths: product.warrantyMonths ?? 12,
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

function validateProductForm(values) {
  const errors = {};

  if (!String(values.name ?? "").trim()) {
    errors.name = "Tên sản phẩm không được để trống.";
  }

  if (!String(values.slug ?? "").trim()) {
    errors.slug = "Slug không được để trống.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Danh mục không được để trống.";
  }

  if (!values.brandId) {
    errors.brandId = "Thương hiệu không được để trống.";
  }

  if (!values.status) {
    errors.status = "Trạng thái không được để trống.";
  }

  if (values.warrantyMonths === "" || Number(values.warrantyMonths) < 0) {
    errors.warrantyMonths = "Bảo hành phải là số không âm.";
  }

  if (values.thumbnailUrl && !isValidUrl(values.thumbnailUrl)) {
    errors.thumbnailUrl = "Ảnh chính phải là URL http/https hợp lệ.";
  }

  try {
    parseProductSpecsText(values.specsText);
  } catch {
    errors.specsText = 'Thông số phải là JSON object hoặc từng dòng "key: value".';
  }

  return errors;
}

function Products() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openCreate, openDelete, openEdit } = modal;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lookupError, setLookupError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [featuredUpdatingId, setFeaturedUpdatingId] = useState(null);

  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.products, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.products, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.products, "delete");
  const isFormOpen = modal.modalType === ADMIN_MODAL_TYPES.create || modal.modalType === ADMIN_MODAL_TYPES.edit;
  const isEditMode = modal.modalType === ADMIN_MODAL_TYPES.edit;
  const editingProduct = isEditMode ? modal.modalPayload : null;
  const deletingProduct = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

  const loadLookups = useCallback(async () => {
    setLookupLoading(true);
    setLookupError(null);

    try {
      const [categoryPage, brandPage] = await Promise.all([
        categoryService.getAll({ page: 0, size: 200, sort: "name,asc", status: "ACTIVE" }, { skipGlobalErrorHandler: true }),
        brandService.getAll({ page: 0, size: 200, sort: "name,asc", status: "ACTIVE" }, { skipGlobalErrorHandler: true }),
      ]);

      setCategories(categoryPage.items);
      setBrands(brandPage.items);
    } catch (requestError) {
      setLookupError(requestError);
      setCategories([]);
      setBrands([]);
    } finally {
      setLookupLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productService.getAll(
        {
          brandId: brandFilter || undefined,
          categoryId: categoryFilter || undefined,
          featured: featuredFilter === "" ? undefined : featuredFilter === "true",
          keyword: debouncedQuery || undefined,
          page,
          size: pageSize,
          sort: "updatedAt,desc",
          status: statusFilter || undefined,
        },
        { skipGlobalErrorHandler: true },
      );

      setProducts(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setProducts([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [brandFilter, categoryFilter, debouncedQuery, featuredFilter, page, pageSize, statusFilter]);

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, reloadKey]);

  const filterValues = useMemo(
    () => ({
      brandId: brandFilter,
      categoryId: categoryFilter,
      featured: featuredFilter,
      status: statusFilter,
    }),
    [brandFilter, categoryFilter, featuredFilter, statusFilter],
  );

  const handleFilterChange = (key, value) => {
    if (key === "query") {
      setQuery(value);
      setPage(0);
      return;
    }

    const setters = {
      brandId: setBrandFilter,
      categoryId: setCategoryFilter,
      featured: setFeaturedFilter,
      status: setStatusFilter,
    };

    setters[key]?.(value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setQuery("");
    setBrandFilter("");
    setCategoryFilter("");
    setFeaturedFilter("");
    setStatusFilter("");
    setPage(0);
  };

  const handleFormChange = (key, value) => {
    setFormValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [key]: value,
      };

      if (key === "name" && !currentValues.slug) {
        nextValues.slug = normalizeSlug(value);
      }

      if (key === "categoryId") {
        nextValues.categoryName = categories.find((category) => String(category.id) === String(value))?.name || "";
      }

      if (key === "brandId") {
        nextValues.brandName = brands.find((brand) => String(brand.id) === String(value))?.name || "";
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

  const openCreateDrawer = () => {
    setFormValues(INITIAL_FORM_VALUES);
    setFormErrors({});
    openCreate();
  };

  const openEditDrawer = useCallback(async (product) => {
    setFormValues(toFormValues(product));
    setFormErrors({});
    openEdit(product);
    setDetailLoading(true);

    try {
      const detail = await productService.getById(product.apiId ?? product.id, { skipGlobalErrorHandler: true });
      setFormValues(toFormValues({ ...product, ...detail }));
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Không tải được chi tiết sản phẩm" });
    } finally {
      setDetailLoading(false);
    }
  }, [openEdit, toast]);

  const closeFormDrawer = () => {
    setFormErrors({});
    closeModal();
  };

  const handleSubmitProduct = async () => {
    const nextErrors = validateProductForm(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode && editingProduct?.id) {
        await productService.update(editingProduct.apiId ?? editingProduct.id, formValues, { skipGlobalErrorHandler: true });
        toast.showSuccess("Đã cập nhật sản phẩm.");
      } else {
        await productService.create(formValues, { skipGlobalErrorHandler: true });
        toast.showSuccess("Đã tạo sản phẩm mới.");
      }

      closeFormDrawer();
      setReloadKey((value) => value + 1);
    } catch (requestError) {
      toast.showApiError(requestError, {
        title: isEditMode ? "Cập nhật sản phẩm thất bại" : "Tạo sản phẩm thất bại",
      });
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = useCallback(async (product) => {
    if (!product?.id || product.status === "DELETED") {
      return;
    }

    const previousStatus = product.status;
    const nextStatus = previousStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";

    setStatusUpdatingId(product.id);
    setProducts((currentProducts) =>
      currentProducts.map((item) => (item.id === product.id ? { ...item, status: nextStatus } : item)),
    );

    try {
      const updatedProduct = await productService.updateStatus(product.apiId ?? product.id, nextStatus, { skipGlobalErrorHandler: true });
      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === product.id ? { ...item, ...updatedProduct } : item)),
      );
      toast.showSuccess(nextStatus === "ACTIVE" ? `Đã kích hoạt "${product.name}".` : `Đã ẩn "${product.name}".`);
    } catch (requestError) {
      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === product.id ? { ...item, status: previousStatus } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật trạng thái thất bại" });
    } finally {
      setStatusUpdatingId(null);
    }
  }, [toast]);

  const handleToggleFeatured = useCallback(async (product) => {
    if (!product?.id || product.status === "DELETED") {
      return;
    }

    const previousFeatured = Boolean(product.featured);
    const nextFeatured = !previousFeatured;

    setFeaturedUpdatingId(product.id);
    setProducts((currentProducts) =>
      currentProducts.map((item) => (item.id === product.id ? { ...item, featured: nextFeatured } : item)),
    );

    try {
      const updatedProduct = await productService.updateFeatured(product.apiId ?? product.id, nextFeatured, { skipGlobalErrorHandler: true });
      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === product.id ? { ...item, ...updatedProduct } : item)),
      );
      toast.showSuccess(nextFeatured ? `Đã đánh dấu nổi bật "${product.name}".` : `Đã bỏ nổi bật "${product.name}".`);
    } catch (requestError) {
      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === product.id ? { ...item, featured: previousFeatured } : item)),
      );
      toast.showApiError(requestError, { title: "Cập nhật nổi bật thất bại" });
    } finally {
      setFeaturedUpdatingId(null);
    }
  }, [toast]);

  const handleDeleteProduct = async () => {
    if (!deletingProduct?.id) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await productService.remove(deletingProduct.apiId ?? deletingProduct.id, { skipGlobalErrorHandler: true });
      toast.showSuccess(`Đã xóa mềm sản phẩm "${deletingProduct.name}".`);
      closeModal();

      if (products.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        setReloadKey((value) => value + 1);
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa sản phẩm thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Sản phẩm</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Quản lý catalog gốc, ảnh chính, trạng thái hiển thị và quan hệ danh mục/thương hiệu.
          </p>
        </div>

        {canCreate ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-admin-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            disabled={lookupLoading}
            onClick={openCreateDrawer}
            type="button"
          >
            {lookupLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            Thêm sản phẩm
          </button>
        ) : null}
      </div>

      <ProductFilters
        brands={brands}
        categories={categories}
        disabled={loading}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        query={query}
        values={filterValues}
      />

      {lookupError ? (
        <ApiErrorAlert
          actionLabel="Tải lại danh mục"
          error={lookupError}
          onAction={loadLookups}
          onDismiss={() => setLookupError(null)}
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

      <ProductTable
        canDelete={canDelete}
        canUpdate={canUpdate}
        data={products}
        featuredUpdatingId={featuredUpdatingId}
        loading={loading}
        onDelete={openDelete}
        onEdit={openEditDrawer}
        onToggleFeatured={handleToggleFeatured}
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
        confirmLabel="Xóa sản phẩm"
        description={
          deletingProduct
            ? `Sản phẩm "${deletingProduct.name}" sẽ bị chuyển sang trạng thái xóa mềm. Backend sẽ chặn nếu sản phẩm vẫn có biến thể.`
            : "Sản phẩm sẽ bị chuyển sang trạng thái xóa mềm."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteProduct}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa sản phẩm"
        tone="danger"
      />

      <AdminDrawer
        description="Sản phẩm gốc lưu thông tin catalog. Giá và tồn kho được tổng hợp từ biến thể."
        onClose={closeFormDrawer}
        open={isFormOpen}
        size="lg"
        title={isEditMode ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
      >
        <ProductForm
          brands={brands}
          categories={categories}
          errors={formErrors}
          loading={submitting || detailLoading}
          mode={isEditMode ? "edit" : "create"}
          onCancel={closeFormDrawer}
          onChange={handleFormChange}
          onSubmit={handleSubmitProduct}
          values={formValues}
        />
      </AdminDrawer>
    </section>
  );
}

export default Products;
