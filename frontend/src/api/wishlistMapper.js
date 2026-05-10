import { normalizeProduct } from "./productMapper";
import { firstDefined, getPageItems, isPlainObject, unwrapApiPayload } from "./mapperUtils";

function normalizeWishlistId(value) {
  const id = firstDefined(value);

  return id === undefined ? "" : String(id);
}

function getProductSource(raw = {}) {
  return (
    raw.product ??
    raw.productResponse ??
    raw.productDto ??
    raw.productDetail ??
    raw.productSnapshot ??
    raw.item ??
    null
  );
}

function normalizeWishlistProduct(raw = {}) {
  if (!isPlainObject(raw)) {
    return null;
  }

  const hasProductIdentity = Boolean(
    raw.id ?? raw.productId ?? raw.apiId ?? raw.slug ?? raw.name ?? raw.productName ?? raw.title,
  );

  return hasProductIdentity ? normalizeProduct(raw) : null;
}

export function normalizeWishlistItem(raw = {}) {
  const source = unwrapApiPayload(raw) ?? raw;
  const productSource = getProductSource(source);
  const fallbackProductSource = {
    ...source,
    id: firstDefined(source.productId, source.product_id, source.apiId, source.id),
    name: firstDefined(source.productName, source.name, source.title),
  };
  const product = normalizeWishlistProduct(productSource ?? fallbackProductSource);
  const productId = normalizeWishlistId(
    firstDefined(source.productId, source.product_id, source.apiId, product?.apiId, product?.id),
  );

  if (!productId && !product?.id) {
    return null;
  }

  return {
    addedAt: String(firstDefined(source.addedAt, source.createdAt, source.created_at, new Date().toISOString())),
    apiId: firstDefined(product?.apiId, source.productId, source.product_id, source.apiId, productId),
    id: productId || String(product.id),
    product,
    productId: productId || String(product.id),
    raw: source,
    syncStatus: "synced",
  };
}

export function normalizeWishlistResponse(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeWishlistItem).filter(Boolean);

  return {
    items,
    raw: payload,
    updatedAt: firstDefined(payload?.updatedAt, payload?.updated_at, new Date().toISOString()),
  };
}

export function buildWishlistItemPayload(itemOrProduct = {}) {
  const source = itemOrProduct.product ?? itemOrProduct;
  const productId = firstDefined(
    itemOrProduct.apiId,
    itemOrProduct.productId,
    source.apiId,
    source.productId,
    source.id,
  );

  return {
    productId,
  };
}

export function buildWishlistReplacePayload(items = []) {
  const itemPayloads = items.map(buildWishlistItemPayload).filter((item) => item.productId);

  return {
    items: itemPayloads,
    productIds: itemPayloads.map((item) => item.productId),
  };
}
