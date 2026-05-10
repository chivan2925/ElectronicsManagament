import { useEffect } from "react";
import { ExternalLink, Image, Layers3, Loader2, Package, Star, Trash2, X } from "lucide-react";
import OptimizedImage from "../../../components/common/OptimizedImage";
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function DetailRow({ label, value }) {
  const displayValue = value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-black uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-800">{displayValue}</p>
    </div>
  );
}

function MediaPreviewModal({
  canDelete = false,
  canUpdate = false,
  deleting = false,
  media,
  onClose,
  onDelete,
  onSetPrimary,
  open = false,
  primaryLoading = false,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || !media) {
    return null;
  }

  const AttachmentIcon = media.attachmentType === "variant" ? Layers3 : media.attachmentType === "product" ? Package : Image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        aria-label="Close media preview overlay"
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      <section
        aria-modal="true"
        className="relative flex max-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/30"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-primary">
              <AttachmentIcon className="shrink-0" size={14} />
              <span className="truncate">{media.attachmentLabel}</span>
            </div>
            <h2 className="mt-3 truncate text-xl font-black text-slate-950">{media.fileName}</h2>
            <p className="mt-1 truncate text-sm font-semibold text-slate-500">{media.publicId || media.imageUrl}</p>
          </div>

          <button
            aria-label="Close media preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </header>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-h-[360px] items-center justify-center bg-slate-50 p-4 sm:p-6">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <OptimizedImage
                alt={media.fileName}
                className="max-h-[68vh] w-full object-contain"
                fallbackKind="media"
                placeholderClassName="bg-slate-100"
                priority
                sizes="(max-width: 1024px) 92vw, 760px"
                src={media.imageUrl}
                wrapperClassName="flex min-h-[320px] w-full items-center justify-center bg-white"
              />
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-white p-5 lg:border-l lg:border-t-0">
            <div className="flex flex-wrap gap-2">
              {media.isPrimary ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-xs font-black text-slate-950">
                  <Star fill="currentColor" size={13} />
                  Primary
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                {media.type}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              <DetailRow label="Media ID" value={media.id} />
              <DetailRow label="Public ID" value={media.publicId} />
              <DetailRow label="Product" value={media.productName || (media.productId ? `Product #${media.productId}` : "")} />
              <DetailRow label="Variant" value={media.variantName || media.variantSku} />
              <DetailRow label="Display order" value={media.displayOrder} />
              <DetailRow label="Created" value={formatDateTime(media.createdAt)} />
              <DetailRow label="Updated" value={formatDateTime(media.updatedAt)} />
            </div>

            <div className="mt-5 grid gap-2">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 transition hover:border-primary hover:bg-blue-50 hover:text-primary"
                href={media.imageUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink size={16} />
                Open original
              </a>

              <button
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60",
                  media.isPrimary
                    ? "border border-amber-200 bg-amber-50 text-amber-700"
                    : "border border-slate-200 bg-white text-amber-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700",
                )}
                disabled={!canUpdate || media.isPrimary || primaryLoading}
                onClick={() => onSetPrimary?.(media)}
                type="button"
              >
                {primaryLoading ? <Loader2 className="animate-spin" size={16} /> : <Star size={16} />}
                {media.isPrimary ? "Already primary" : "Set as primary"}
              </button>

              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-black text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canDelete || deleting}
                onClick={() => onDelete?.(media)}
                type="button"
              >
                {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                Delete media
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default MediaPreviewModal;
