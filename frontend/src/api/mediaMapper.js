import { unwrapApiPayload } from "./productMapper";

const FALLBACK_MEDIA_IMAGE = "https://placehold.co/640x480/0F172A/FFFFFF?text=Media";

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  return [];
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getPageItems(response) {
  const payload = unwrapApiPayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isPlainObject(payload)) {
    return [];
  }

  return toArray(
    payload.content ??
      payload.items ??
      payload.media ??
      payload.assets ??
      payload.records ??
      payload.results ??
      payload.list ??
      payload.rows ??
      payload.data,
  );
}

function getPageMeta(response, items) {
  const payload = unwrapApiPayload(response);
  const source = isPlainObject(payload) ? payload : {};
  const page = source.page ?? source.pagination ?? {};
  const pageNumber = firstDefined(source.number, source.pageNumber, source.currentPage, page.number, page.page, page.currentPage, 0);
  const pageSize = firstDefined(source.size, source.pageSize, page.size, page.pageSize, items.length);
  const totalItems = firstDefined(source.totalElements, source.totalItems, source.total, page.totalElements, page.totalItems, page.total, items.length);
  const totalPages = firstDefined(
    source.totalPages,
    page.totalPages,
    Math.max(1, Math.ceil(toNumber(totalItems, items.length) / Math.max(toNumber(pageSize, items.length || 1), 1))),
  );

  return {
    page: toNumber(pageNumber, 0),
    size: toNumber(pageSize, items.length),
    totalItems: toNumber(totalItems, items.length),
    totalPages: Math.max(1, toNumber(totalPages, 1)),
  };
}

function getFileName(imageUrl = "", publicId = "") {
  const source = publicId || imageUrl;
  const cleanSource = String(source).split("?")[0].split("#")[0];
  const segment = cleanSource.split("/").filter(Boolean).at(-1);

  return segment || "media-image";
}

function getAttachmentType(source = {}) {
  if (firstDefined(source.variantId, source.variant?.id)) {
    return "variant";
  }

  if (firstDefined(source.productId, source.product?.id)) {
    return "product";
  }

  return "none";
}

export function normalizeMedia(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const imageUrl = firstDefined(source.imageUrl, source.secureUrl, source.url, source.src, source.path, FALLBACK_MEDIA_IMAGE);
  const productId = firstDefined(source.productId, source.product?.id, null);
  const variantId = firstDefined(source.variantId, source.variant?.id, null);
  const productName = firstDefined(source.productName, source.product?.name, "");
  const variantName = firstDefined(source.variantName, source.variant?.name, source.variantSku, source.variant?.sku, "");
  const attachmentType = getAttachmentType(source);
  const attachmentLabel =
    attachmentType === "variant"
      ? variantName || `Variant #${variantId}`
      : attachmentType === "product"
        ? productName || `Product #${productId}`
        : "Chưa gắn";
  const id = firstDefined(source.id, source.mediaId, source.publicId, imageUrl);

  return {
    apiId: firstDefined(source.id, source.mediaId, id),
    attachmentLabel,
    attachmentType,
    createdAt: firstDefined(source.createdAt, source.created_at, ""),
    displayOrder: toNumber(firstDefined(source.displayOrder, source.sortOrder, source.order), 0),
    fileName: getFileName(imageUrl, source.publicId),
    id: String(id),
    imageUrl,
    isPrimary: Boolean(firstDefined(source.isPrimary, source.primary, false)),
    productId,
    productName,
    publicId: firstDefined(source.publicId, source.cloudinaryPublicId, ""),
    raw: source,
    type: "image",
    updatedAt: firstDefined(source.updatedAt, source.updated_at, source.createdAt, source.created_at, ""),
    variantId,
    variantName,
    variantSku: firstDefined(source.variantSku, source.variant?.sku, ""),
  };
}

export function normalizeMediaPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeMedia);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function normalizeUploadResponse(response = {}) {
  const payload = unwrapApiPayload(response) ?? {};

  return {
    imageUrl: firstDefined(payload.imageUrl, payload.secureUrl, payload.url, payload.src, ""),
    publicId: firstDefined(payload.publicId, payload.public_id, payload.cloudinaryPublicId, ""),
    raw: payload,
  };
}

export function buildMediaPayload(values = {}) {
  return {
    displayOrder:
      values.displayOrder !== "" && values.displayOrder !== null && values.displayOrder !== undefined
        ? Number(values.displayOrder)
        : 0,
    imageUrl: values.imageUrl?.trim() ?? "",
    isPrimary: Boolean(values.isPrimary),
    productId: values.productId ? Number(values.productId) : null,
    publicId: values.publicId?.trim() ?? "",
    variantId: values.variantId ? Number(values.variantId) : null,
  };
}
