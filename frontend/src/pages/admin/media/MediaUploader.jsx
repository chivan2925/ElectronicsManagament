import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Star, Upload, X } from "lucide-react";
import OptimizedImage from "../../../components/common/OptimizedImage";
import { cn } from "../../../utils/classNames";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_UPLOAD_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

function formatFileSize(size = 0) {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${size} B`;
}

function getErrorMessage(error) {
  return error?.apiError?.message || error?.normalizedError?.message || error?.message || "Upload thất bại.";
}

function createObjectPreviewUrl(file) {
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    return "";
  }

  return URL.createObjectURL(file);
}

function revokePreviewUrl(previewUrl) {
  if (!previewUrl || !previewUrl.startsWith("blob:") || typeof URL === "undefined" || typeof URL.revokeObjectURL !== "function") {
    return;
  }

  URL.revokeObjectURL(previewUrl);
}

function revokeQueuePreviews(items = []) {
  items.forEach((item) => revokePreviewUrl(item.previewUrl));
}

function getFileExtension(fileName = "") {
  const extension = fileName.split(".").pop();

  return extension ? extension.toLowerCase() : "";
}

function validateUploadFile(file) {
  if (!file) {
    return "File không hợp lệ.";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return "Ảnh không được vượt quá 5MB.";
  }

  if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
    return "Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.";
  }

  if (!ALLOWED_UPLOAD_EXTENSIONS.has(getFileExtension(file.name))) {
    return "Phần mở rộng file phải là JPG, PNG hoặc WEBP.";
  }

  return "";
}

function createQueueItem(file, error = "") {
  return {
    error,
    file,
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    previewUrl: createObjectPreviewUrl(file),
    progress: 0,
    size: file.size,
    status: error ? "failed" : "queued",
  };
}

function MediaUploader({
  canUpload = false,
  disabled = false,
  loadingProducts = false,
  onUploadComplete,
  onUploadFile,
  products = [],
  selectedProductId = "",
  onProductChange,
}) {
  const inputRef = useRef(null);
  const queueRef = useRef([]);
  const [dragActive, setDragActive] = useState(false);
  const [makePrimary, setMakePrimary] = useState(false);
  const [queue, setQueue] = useState([]);
  const [notice, setNotice] = useState("");

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.apiId ?? product.id) === String(selectedProductId)),
    [products, selectedProductId],
  );
  const isUploading = queue.some((item) => item.status === "uploading");
  const isDisabled = disabled || !canUpload || isUploading;
  const canStartUpload = !isDisabled && selectedProductId;

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(
    () => () => {
      revokeQueuePreviews(queueRef.current);
    },
    [],
  );

  const updateQueueItem = (id, patch) => {
    setQueue((currentQueue) => currentQueue.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleFiles = async (fileList) => {
    const selectedFiles = Array.from(fileList ?? []);

    if (!canUpload) {
      setNotice("Bạn chưa có quyền upload media.");
      return;
    }

    if (!selectedProductId) {
      setNotice("Chọn sản phẩm trước khi upload để ảnh được lưu vào thư viện.");
      return;
    }

    if (selectedFiles.length === 0) {
      setNotice("Chọn ít nhất một ảnh JPG, PNG hoặc WEBP.");
      return;
    }

    setNotice("");
    const nextQueueItems = selectedFiles.map((file) => createQueueItem(file, validateUploadFile(file)));
    const uploadableQueueItems = nextQueueItems.filter((item) => item.status !== "failed");
    const uploadedItems = [];

    setQueue((currentQueue) => {
      const combinedQueue = [...nextQueueItems, ...currentQueue];
      const nextQueue = combinedQueue.slice(0, 8);
      const nextIds = new Set(nextQueue.map((item) => item.id));

      revokeQueuePreviews(combinedQueue.filter((item) => !nextIds.has(item.id)));

      return nextQueue;
    });

    if (uploadableQueueItems.length === 0) {
      setNotice("Không có file nào đạt yêu cầu upload.");
      return;
    }

    for (const [index, queueItem] of uploadableQueueItems.entries()) {
      updateQueueItem(queueItem.id, { progress: 4, status: "uploading" });

      try {
        const uploadedMedia = await onUploadFile(queueItem.file, {
          index,
          isPrimary: makePrimary && index === 0,
          onProgress: (progress) => updateQueueItem(queueItem.id, { progress }),
          product: selectedProduct,
          productId: selectedProductId,
        });

        uploadedItems.push(uploadedMedia);
        updateQueueItem(queueItem.id, { progress: 100, status: "completed" });
      } catch (error) {
        updateQueueItem(queueItem.id, {
          error: getErrorMessage(error),
          progress: 100,
          status: "failed",
        });
      }
    }

    if (uploadedItems.length > 0) {
      onUploadComplete?.(uploadedItems);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    if (isDisabled) {
      return;
    }

    handleFiles(event.dataTransfer.files);
  };

  const handleBrowse = () => {
    if (canStartUpload) {
      inputRef.current?.click();
      return;
    }

    if (!selectedProductId) {
      setNotice("Chọn sản phẩm trước khi upload để ảnh được lưu vào thư viện.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleBrowse();
    }
  };

  const clearFinished = () => {
    setQueue((currentQueue) => {
      const nextQueue = currentQueue.filter((item) => item.status === "uploading" || item.status === "queued");
      const nextIds = new Set(nextQueue.map((item) => item.id));

      revokeQueuePreviews(currentQueue.filter((item) => !nextIds.has(item.id)));

      return nextQueue;
    });
  };

  return (
    <section className="admin-panel overflow-hidden rounded-2xl">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-primary">
                <ImagePlus size={14} />
                Cloudinary uploader
              </div>
              <h2 className="mt-3 text-xl font-black text-slate-950">Media Management</h2>
              <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                Kéo thả ảnh, theo dõi tiến trình upload và lưu ảnh vào sản phẩm đã chọn.
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 transition hover:border-primary hover:bg-blue-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!queue.some((item) => item.status !== "uploading")}
              onClick={clearFinished}
              type="button"
            >
              <X size={15} />
              Clear
            </button>
          </div>

          <div
            className={cn(
              "mt-5 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center outline-none transition",
              dragActive
                ? "border-primary bg-blue-50 shadow-inner shadow-blue-100"
                : "border-slate-300 bg-slate-50/80 hover:border-blue-300 hover:bg-white",
              !canStartUpload ? "cursor-not-allowed opacity-75" : "",
            )}
            onClick={handleBrowse}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            <input
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              className="hidden"
              disabled={!canStartUpload}
              multiple
              onChange={(event) => {
                handleFiles(event.target.files);
                event.target.value = "";
              }}
              ref={inputRef}
              type="file"
            />
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
              {isUploading ? <Loader2 className="animate-spin" size={25} /> : <Upload size={25} />}
            </span>
            <h3 className="mt-4 text-base font-black text-slate-950">Thả ảnh vào đây hoặc bấm để chọn file</h3>
            <p className="mt-2 max-w-lg text-sm font-semibold leading-6 text-slate-500">
              JPG, PNG, WEBP. Ảnh sẽ được upload lên Cloudinary, sau đó tạo media record cho sản phẩm.
            </p>
            {!selectedProductId ? (
              <p className="mt-3 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                Chọn sản phẩm ở panel bên phải để bắt đầu.
              </p>
            ) : null}
          </div>

          {notice ? (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
              <AlertCircle size={17} />
              {notice}
            </div>
          ) : null}

          {queue.length > 0 ? (
            <div className="mt-5 space-y-3">
              {queue.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="grid gap-3 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-start">
                    <OptimizedImage
                      alt={item.name}
                      className="h-full w-full object-cover"
                      fallbackKind="media"
                      placeholderClassName="rounded-xl bg-slate-100"
                      sizes="64px"
                      src={item.previewUrl}
                      wrapperClassName="h-16 w-16 rounded-xl border border-slate-200 bg-white"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">{item.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{formatFileSize(item.size)}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.status === "failed" ? "bg-rose-500" : item.status === "completed" ? "bg-emerald-400" : "bg-blue-500",
                          )}
                          style={{ width: `${Math.max(4, Math.min(100, item.progress))}%` }}
                        />
                      </div>
                      {item.error ? <p className="mt-2 text-xs font-semibold leading-5 text-rose-600">{item.error}</p> : null}
                    </div>
                    <span
                      className={cn(
                        "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black",
                        item.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "failed"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-blue-50 text-primary",
                      )}
                    >
                      {item.status === "completed" ? <CheckCircle2 size={13} /> : null}
                      {item.status === "failed" ? <AlertCircle size={13} /> : null}
                      {item.status === "uploading" ? <Loader2 className="animate-spin" size={13} /> : null}
                      {item.status === "completed" ? "Done" : item.status === "failed" ? "Failed" : "Uploading"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="border-t border-slate-200 bg-slate-50/80 p-4 sm:p-5 xl:border-l xl:border-t-0">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-normal text-slate-500">Attach to product</span>
            <select
              className="admin-control mt-2 h-12 w-full rounded-xl px-3 text-sm font-bold text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDisabled || loadingProducts}
              onChange={(event) => onProductChange?.(event.target.value)}
              value={selectedProductId}
            >
              <option value="">{loadingProducts ? "Đang tải sản phẩm..." : "Chọn sản phẩm"}</option>
              {products.map((product) => (
                <option key={product.apiId ?? product.id} value={product.apiId ?? product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
            <input
              checked={makePrimary}
              className="h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              disabled={isDisabled}
              onChange={(event) => setMakePrimary(event.target.checked)}
              type="checkbox"
            />
            <span className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-700">
              <Star className="shrink-0 text-amber-500" size={16} />
              Đặt ảnh đầu tiên làm ảnh chính
            </span>
          </label>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">Upload target</p>
            <p className="mt-2 text-sm font-black text-slate-950">{selectedProduct?.name || "Chưa chọn sản phẩm"}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
              Gắn variant sẽ được bổ sung ở bước sau; module hiện ưu tiên upload và gắn ảnh cấp sản phẩm.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default MediaUploader;
