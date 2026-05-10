import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Image, RefreshCcw, Search, ShieldAlert, Star, Upload } from "lucide-react";
import mediaService from "../../api/mediaService";
import productService from "../../api/productService";
import { ConfirmDialog } from "../../admin/components";
import { ADMIN_MODAL_TYPES, useAdminModal, useDebouncedValue } from "../../admin/hooks";
import { ADMIN_RESOURCES } from "../../auth/roleHelpers";
import usePermissions from "../../auth/usePermissions";
import ApiErrorAlert from "../../components/ui/feedback/ApiErrorAlert";
import useToast from "../../components/ui/toast/useToast";
import MediaGrid from "./media/MediaGrid";
import MediaPreviewModal from "./media/MediaPreviewModal";
import MediaUploader from "./media/MediaUploader";

const PRIMARY_OPTIONS = [
  { label: "Tất cả ảnh", value: "" },
  { label: "Ảnh chính", value: "true" },
  { label: "Ảnh phụ", value: "false" },
];

function getUploadProgress(progressEvent) {
  if (!progressEvent?.total) {
    return 40;
  }

  return Math.min(88, Math.max(8, Math.round((progressEvent.loaded / progressEvent.total) * 88)));
}

function sameMediaOwner(source, target) {
  if (!source || !target) {
    return false;
  }

  if (source.variantId && target.variantId) {
    return String(source.variantId) === String(target.variantId);
  }

  if (source.productId && target.productId) {
    return String(source.productId) === String(target.productId);
  }

  return false;
}

function MediaStat({ icon, label, value }) {
  return (
    <div className="admin-panel admin-panel-hover rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
          {createElement(icon, { size: 18 })}
        </span>
        <span className="text-2xl font-black text-slate-950">{value}</span>
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
    </div>
  );
}

function Media() {
  const permission = usePermissions();
  const toast = useToast();
  const modal = useAdminModal();
  const { closeModal, openDelete } = modal;

  const [mediaItems, setMediaItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim());
  const [productFilter, setProductFilter] = useState("");
  const [primaryFilter, setPrimaryFilter] = useState("");
  const [uploadProductId, setUploadProductId] = useState("");
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productError, setProductError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [pageMeta, setPageMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [primaryUpdatingId, setPrimaryUpdatingId] = useState(null);

  const canCreate = permission.canAccessResourceAction(ADMIN_RESOURCES.media, "create");
  const canUpdate = permission.canAccessResourceAction(ADMIN_RESOURCES.media, "update");
  const canDelete = permission.canAccessResourceAction(ADMIN_RESOURCES.media, "delete");
  const deletingMedia = modal.modalType === ADMIN_MODAL_TYPES.delete ? modal.modalPayload : null;

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

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await mediaService.getAll(
        {
          keyword: debouncedQuery || undefined,
          page,
          primary: primaryFilter === "" ? undefined : primaryFilter === "true",
          productId: productFilter || undefined,
          size: pageSize,
          sort: "updatedAt,desc",
        },
        { skipGlobalErrorHandler: true },
      );

      setMediaItems(response.items);
      setPageMeta({
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (requestError) {
      setError(requestError);
      setMediaItems([]);
      setPageMeta({ totalItems: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, primaryFilter, productFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia, reloadKey]);

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        label: product.name,
        value: String(product.apiId ?? product.id),
      })),
    [products],
  );

  const stats = useMemo(
    () => [
      { icon: Image, label: "Assets in result", value: pageMeta.totalItems },
      { icon: Star, label: "Primary on page", value: mediaItems.filter((item) => item.isPrimary).length },
      { icon: Upload, label: "Attached on page", value: mediaItems.filter((item) => item.attachmentType !== "none").length },
      { icon: ShieldAlert, label: "Product targets", value: products.length },
    ],
    [mediaItems, pageMeta.totalItems, products.length],
  );

  const handleProductFilterChange = (value) => {
    setProductFilter(value);
    setPage(0);

    if (value) {
      setUploadProductId(value);
    }
  };

  const handleResetFilters = () => {
    setQuery("");
    setProductFilter("");
    setPrimaryFilter("");
    setPage(0);
  };

  const handleUploadFile = useCallback(
    async (file, { index = 0, isPrimary = false, onProgress, product, productId }) => {
      onProgress?.(6);

      const uploadResult = await mediaService.upload(file, {
        onUploadProgress: (progressEvent) => onProgress?.(getUploadProgress(progressEvent)),
        skipGlobalErrorHandler: true,
      });

      if (!uploadResult.imageUrl || !uploadResult.publicId) {
        throw new Error("Cloudinary upload chưa trả đủ imageUrl/publicId.");
      }

      onProgress?.(92);

      const ownerMediaCount = mediaItems.filter((item) => String(item.productId) === String(productId)).length;
      const createdMedia = await mediaService.create(
        {
          displayOrder: ownerMediaCount + index,
          imageUrl: uploadResult.imageUrl,
          isPrimary,
          productId,
          publicId: uploadResult.publicId,
        },
        { skipGlobalErrorHandler: true },
      );

      onProgress?.(100);

      return {
        ...createdMedia,
        productName: createdMedia.productName || product?.name || "",
      };
    },
    [mediaItems],
  );

  const handleUploadComplete = (uploadedItems = []) => {
    toast.showSuccess(`Đã upload ${uploadedItems.length} ảnh vào thư viện.`);
    setReloadKey((value) => value + 1);
  };

  const handleSetPrimary = useCallback(
    async (item) => {
      if (!item?.id || item.isPrimary) {
        return;
      }

      setPrimaryUpdatingId(item.id);

      try {
        await mediaService.setPrimary(item.apiId ?? item.id, { skipGlobalErrorHandler: true });

        setMediaItems((currentItems) =>
          currentItems.map((currentItem) =>
            sameMediaOwner(currentItem, item) ? { ...currentItem, isPrimary: currentItem.id === item.id } : currentItem,
          ),
        );
        setPreviewMedia((currentPreview) =>
          currentPreview && sameMediaOwner(currentPreview, item)
            ? { ...currentPreview, isPrimary: currentPreview.id === item.id }
            : currentPreview,
        );
        toast.showSuccess("Đã đặt ảnh chính.");
      } catch (requestError) {
        toast.showApiError(requestError, { title: "Đặt ảnh chính thất bại" });
      } finally {
        setPrimaryUpdatingId(null);
      }
    },
    [toast],
  );

  const handleDeleteMedia = async () => {
    if (!deletingMedia?.id) {
      return;
    }

    setDeleting(true);
    setDeletingId(deletingMedia.id);

    try {
      await mediaService.remove(deletingMedia.apiId ?? deletingMedia.id, { skipGlobalErrorHandler: true });
      toast.showSuccess("Đã xóa media.");

      if (previewMedia?.id === deletingMedia.id) {
        setPreviewMedia(null);
      }

      closeModal();

      if (mediaItems.length === 1 && page > 0) {
        setPage((value) => Math.max(0, value - 1));
      } else {
        setReloadKey((value) => value + 1);
      }
    } catch (requestError) {
      toast.showApiError(requestError, { title: "Xóa media thất bại" });
      setError(requestError);
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-page-shell">
      <div className="admin-panel overflow-hidden rounded-2xl">
        <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-primary">
              <Image size={14} />
              Asset manager
            </div>
            <h1 className="mt-4 text-2xl font-black text-slate-950 md:text-3xl">Media Library</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              Quản lý ảnh sản phẩm, upload Cloudinary, preview nhanh, đặt ảnh chính và xóa asset khỏi thư viện.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
              <MediaStat icon={stat.icon} key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>

      <MediaUploader
        canUpload={canCreate}
        disabled={productLoading}
        loadingProducts={productLoading}
        onProductChange={setUploadProductId}
        onUploadComplete={handleUploadComplete}
        onUploadFile={handleUploadFile}
        products={products}
        selectedProductId={uploadProductId}
      />

      <section className="admin-panel rounded-2xl p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-primary ring-1 ring-blue-100">
              <Filter size={18} />
            </span>
            <div>
              <h2 className="text-sm font-black text-slate-950">Library filters</h2>
              <p className="text-xs font-semibold text-slate-500">Tìm asset theo sản phẩm, URL, publicId hoặc trạng thái ảnh chính.</p>
            </div>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 transition hover:border-primary hover:bg-blue-50 hover:text-primary"
            onClick={handleResetFilters}
            type="button"
          >
            <RefreshCcw size={15} />
            Reset
          </button>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px_200px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="admin-control h-12 w-full rounded-xl pl-10 pr-3 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="Tìm theo publicId, URL, sản phẩm..."
              type="search"
              value={query}
            />
          </label>

          <select
            className="admin-control h-12 rounded-xl px-3 text-sm font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || productLoading}
            onChange={(event) => handleProductFilterChange(event.target.value)}
            value={productFilter}
          >
            <option value="">{productLoading ? "Đang tải sản phẩm..." : "Tất cả sản phẩm"}</option>
            {productOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            className="admin-control h-12 rounded-xl px-3 text-sm font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onChange={(event) => {
              setPrimaryFilter(event.target.value);
              setPage(0);
            }}
            value={primaryFilter}
          >
            {PRIMARY_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

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

      <MediaGrid
        canDelete={canDelete}
        canUpdate={canUpdate}
        data={mediaItems}
        deletingId={deletingId}
        loading={loading}
        onDelete={openDelete}
        onPreview={setPreviewMedia}
        onSetPrimary={handleSetPrimary}
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
        primaryUpdatingId={primaryUpdatingId}
      />

      <MediaPreviewModal
        canDelete={canDelete}
        canUpdate={canUpdate}
        deleting={deletingId === previewMedia?.id}
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
        onDelete={openDelete}
        onSetPrimary={handleSetPrimary}
        open={Boolean(previewMedia)}
        primaryLoading={primaryUpdatingId === previewMedia?.id}
      />

      <ConfirmDialog
        confirmLabel="Xóa media"
        description={
          deletingMedia
            ? `Ảnh "${deletingMedia.fileName}" sẽ bị xóa khỏi thư viện và Cloudinary nếu publicId còn hợp lệ.`
            : "Ảnh sẽ bị xóa khỏi thư viện."
        }
        loading={deleting}
        onCancel={closeModal}
        onConfirm={handleDeleteMedia}
        open={modal.modalType === ADMIN_MODAL_TYPES.delete}
        title="Xác nhận xóa media"
        tone="danger"
      />
    </section>
  );
}

export default Media;
