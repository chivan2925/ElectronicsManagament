import { createProductPlaceholderImage, normalizeSlug } from "./productMapper";
import {
  firstDefined,
  getPageItems,
  getPageMeta,
  isPlainObject,
  toArray,
  toNumber,
  unwrapApiPayload,
} from "./mapperUtils";

const DEFAULT_VARIANT_STATUS = "ACTIVE";
const VARIANT_PLACEHOLDER_IMAGE = "https://placehold.co/320x240/F1F5F9/64748B?text=Variant";

function getMediaUrl(media) {
  return firstDefined(media?.imageUrl, media?.url, media?.secureUrl, media?.src, media?.path);
}

function getPrimaryImage(source) {
  const mediaImage = toArray(source.media)
    .sort((a, b) => Number(Boolean(b?.isPrimary)) - Number(Boolean(a?.isPrimary)))
    .map(getMediaUrl)
    .find(Boolean);

  return firstDefined(source.primaryImageUrl, source.imageUrl, source.thumbnailUrl, source.image, mediaImage, "");
}

function getSize(specs = {}) {
  if (!isPlainObject(specs)) {
    return "";
  }

  return firstDefined(specs.size, specs.Size, specs.storage, specs.Storage, specs.ram, specs.RAM, "");
}

function getAttributeRows(specs = {}) {
  if (!isPlainObject(specs)) {
    return [];
  }

  return Object.entries(specs)
    .filter(([key]) => !["size", "Size"].includes(key))
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(", ") : String(value ?? ""),
    }))
    .filter((row) => row.key && row.value);
}

function buildMedia(values = {}) {
  const imageUrl = values.thumbnailUrl?.trim() || values.primaryImageUrl?.trim() || "";
  const originalImageUrl = values.originalThumbnailUrl?.trim() || "";

  if (!imageUrl || imageUrl === originalImageUrl || imageUrl === VARIANT_PLACEHOLDER_IMAGE) {
    return undefined;
  }

  const publicIdBase = normalizeSlug(values.sku || values.slug || values.name || "variant-image") || "variant-image";

  return [
    {
      displayOrder: 0,
      imageUrl,
      isPrimary: true,
      publicId: `${publicIdBase}-${Date.now()}`,
    },
  ];
}

export function normalizeAdminVariant(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const specsJson = isPlainObject(source.specsJson ?? source.specs) ? source.specsJson ?? source.specs : {};
  const productName = firstDefined(source.productName, source.product?.name, "");
  const name = firstDefined(source.name, source.variantName, source.sku, "Variant");
  const primaryImageUrl = getPrimaryImage(source);
  const image = primaryImageUrl || createProductPlaceholderImage({ category: productName, name }, 320, 240);

  return {
    apiId: firstDefined(source.id, source.variantId, null),
    attributeRows: getAttributeRows(specsJson),
    attributes: getAttributeRows(specsJson),
    color: firstDefined(source.color, ""),
    createdAt: firstDefined(source.createdAt, null),
    id: String(firstDefined(source.id, source.variantId, source.sku, source.slug, name)),
    image,
    media: toArray(source.media),
    name,
    originalThumbnailUrl: primaryImageUrl,
    price: toNumber(firstDefined(source.price, source.salePrice, source.finalPrice), 0),
    primaryImageUrl,
    productId: firstDefined(source.productId, source.product?.id, ""),
    productName,
    raw: source,
    size: getSize(specsJson),
    sku: firstDefined(source.sku, source.slug, ""),
    slug: firstDefined(source.slug, normalizeSlug(`${name}-${source.id ?? source.sku ?? ""}`)),
    specsJson,
    status: firstDefined(source.status, DEFAULT_VARIANT_STATUS),
    stock: toNumber(firstDefined(source.totalStock, source.stock, source.quantity, source.availableStock), 0),
    thumbnailUrl: primaryImageUrl,
    totalStock: toNumber(firstDefined(source.totalStock, source.stock, source.quantity, source.availableStock), 0),
    updatedAt: firstDefined(source.updatedAt, null),
    warehouseStocks: toArray(source.warehouseStocks),
  };
}

export function normalizeAdminVariantPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeAdminVariant);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function buildVariantPayload(values = {}) {
  const attributeRows = toArray(values.attributeRows)
    .map((row) => ({
      key: row.key?.trim() ?? "",
      value: row.value?.trim() ?? "",
    }))
    .filter((row) => row.key && row.value);
  const specsJson = attributeRows.reduce(
    (specs, row) => ({
      ...specs,
      [row.key]: row.value,
    }),
    {},
  );
  const size = values.size?.trim();
  const media = buildMedia(values);

  if (size) {
    specsJson.size = size;
  }

  const payload = {
    color: values.color?.trim() ?? "",
    media,
    name: values.name?.trim() ?? "",
    price: values.price !== "" && values.price !== null && values.price !== undefined ? Number(values.price) : 0,
    productId: values.productId ? Number(values.productId) : null,
    sku: values.sku?.trim() ?? "",
    slug: values.slug?.trim() ?? "",
    specsJson,
    status: values.status || DEFAULT_VARIANT_STATUS,
    totalStock: values.stock !== "" && values.stock !== null && values.stock !== undefined ? Number(values.stock) : 0,
  };

  if (!media) {
    delete payload.media;
  }

  return payload;
}
