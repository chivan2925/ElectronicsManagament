import { getImageFallbackSrc } from "../utils/imageFallbacks";
import { firstDefined, getPageItems, getPageMeta, toNumber, unwrapApiPayload } from "./mapperUtils";

const FALLBACK_MEDIA_IMAGE = getImageFallbackSrc("media");

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
