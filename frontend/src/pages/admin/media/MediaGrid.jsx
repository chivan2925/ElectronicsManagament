import { ChevronLeft, ChevronRight, Eye, Image, Layers3, Loader2, Package, Star, Trash2 } from "lucide-react";
import OptimizedImage from "../../../components/common/OptimizedImage";
import { cn } from "../../../utils/classNames";

const pageSizeOptions = [12, 24, 48, 96];

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
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function MediaGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950" key={index}>
          <div className="aspect-[4/3] animate-pulse bg-slate-800" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-800" />
            <div className="flex gap-2">
              <div className="h-9 flex-1 animate-pulse rounded-xl bg-slate-800" />
              <div className="h-9 w-10 animate-pulse rounded-xl bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AttachmentBadge({ item }) {
  const Icon = item.attachmentType === "variant" ? Layers3 : item.attachmentType === "product" ? Package : Image;
  const tone =
    item.attachmentType === "variant"
      ? "border-violet-400/20 bg-violet-400/10 text-violet-100"
      : item.attachmentType === "product"
        ? "border-blue-400/20 bg-blue-400/10 text-blue-100"
        : "border-slate-600 bg-slate-800 text-slate-300";

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black", tone)}>
      <Icon className="shrink-0" size={13} />
      <span className="truncate">{item.attachmentLabel}</span>
    </span>
  );
}

function GridPagination({ pagination }) {
  if (!pagination) {
    return null;
  }

  const totalPages = Math.max(1, pagination.totalPages ?? 1);
  const page = Math.min(Math.max(pagination.page ?? 0, 0), totalPages - 1);
  const pageSize = pagination.pageSize ?? 12;
  const totalItems = pagination.totalItems ?? 0;
  const startItem = totalItems === 0 ? 0 : page * pageSize + 1;
  const endItem = Math.min(totalItems, (page + 1) * pageSize);

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-400">
        Showing <span className="font-black text-white">{startItem}</span>-
        <span className="font-black text-white">{endItem}</span> of <span className="font-black text-white">{totalItems}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-2 text-sm font-bold text-slate-100 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
          onChange={(event) => pagination.onPageSizeChange?.(Number(event.target.value))}
          value={pageSize}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} / page
            </option>
          ))}
        </select>

        <div className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-900 p-1">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:text-slate-700"
            disabled={page <= 0}
            onClick={() => pagination.onPageChange?.(page - 1)}
            type="button"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-3 text-sm font-black text-slate-100">
            {page + 1}/{totalPages}
          </span>
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:text-slate-700"
            disabled={page + 1 >= totalPages}
            onClick={() => pagination.onPageChange?.(page + 1)}
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaGrid({
  canDelete = false,
  canUpdate = false,
  data = [],
  deletingId = null,
  loading = false,
  onDelete,
  onPreview,
  onSetPrimary,
  pagination,
  primaryUpdatingId = null,
}) {
  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/10">
        <MediaGridSkeleton />
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 px-6 py-16 text-center text-white shadow-2xl shadow-slate-950/10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-slate-400 ring-1 ring-slate-800">
          <Image size={24} />
        </span>
        <h3 className="mt-4 text-lg font-black text-white">Chưa có media phù hợp</h3>
        <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
          Upload ảnh mới hoặc đổi bộ lọc để xem các asset đang gắn với sản phẩm.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.map((item) => (
          <article
            className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:border-blue-400/40 hover:shadow-blue-950/20"
            key={item.id}
          >
            <button
              className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-900 text-left"
              onClick={() => onPreview?.(item)}
              type="button"
            >
              <OptimizedImage
                alt={item.fileName}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                fallbackKind="media"
                placeholderClassName="bg-slate-800"
                sizes="(max-width: 640px) 92vw, (max-width: 1280px) 33vw, 320px"
                src={item.imageUrl}
                wrapperClassName="h-full w-full bg-slate-900"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
              {item.isPrimary ? (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-xs font-black text-slate-950">
                  <Star fill="currentColor" size={13} />
                  Primary
                </span>
              ) : null}
              <span className="absolute bottom-3 left-3 right-3">
                <AttachmentBadge item={item} />
              </span>
            </button>

            <div className="space-y-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-100">{item.fileName}</p>
                <p className="mt-1 truncate text-xs font-semibold text-slate-500">{item.publicId || item.imageUrl}</p>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                <span>Order #{item.displayOrder}</span>
                <span>{formatDate(item.updatedAt || item.createdAt)}</span>
              </div>

              <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                <button
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-black text-slate-100 transition hover:border-blue-400 hover:text-white"
                  onClick={() => onPreview?.(item)}
                  type="button"
                >
                  <Eye size={16} />
                  Preview
                </button>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-amber-200 transition hover:border-amber-300 hover:bg-amber-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canUpdate || item.isPrimary || primaryUpdatingId === item.id}
                  onClick={() => onSetPrimary?.(item)}
                  title="Đặt làm ảnh chính"
                  type="button"
                >
                  {primaryUpdatingId === item.id ? <Loader2 className="animate-spin" size={16} /> : <Star size={16} />}
                </button>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-rose-200 transition hover:border-rose-300 hover:bg-rose-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canDelete || deletingId === item.id}
                  onClick={() => onDelete?.(item)}
                  title="Xóa media"
                  type="button"
                >
                  {deletingId === item.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <GridPagination pagination={pagination} />
    </section>
  );
}

export default MediaGrid;
