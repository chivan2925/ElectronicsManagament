import { getImageFallbackSrc } from "../utils/imageFallbacks";
import { firstDefined, toArray, toNumber, unwrapApiPayload } from "./mapperUtils";

const DEFAULT_MAX_QUANTITY = 99;

function getCartItemVariantId(item = {}) {
  return firstDefined(item.variantId, item.variant?.id, item.variant?.variantId, null);
}

function getNumericId(value) {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
}

function clampQuantity(quantity, maxQuantity = DEFAULT_MAX_QUANTITY) {
  const resolvedMax = Math.max(1, toNumber(maxQuantity, DEFAULT_MAX_QUANTITY));

  return Math.min(Math.max(toNumber(quantity, 1), 1), resolvedMax);
}

export function normalizeCartItem(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const variantId = getNumericId(getCartItemVariantId(source));

  if (!variantId) {
    return null;
  }

  const productId = firstDefined(source.productId, source.product?.id, source.product?.apiId, variantId);
  const productName = firstDefined(source.productName, source.product?.name, source.name, "Sản phẩm ElectronicsManagement");
  const variantName = firstDefined(source.variantName, source.variant?.name, source.variant, "Phiên bản tiêu chuẩn");
  const unitPrice = toNumber(firstDefined(source.unitPrice, source.price, source.variant?.price, source.product?.price), 0);
  const maxQuantity = Math.max(
    0,
    toNumber(firstDefined(source.maxQuantity, source.totalStock, source.stock, source.product?.stock), DEFAULT_MAX_QUANTITY),
  );
  const quantity = clampQuantity(source.quantity, Math.max(maxQuantity, 1));
  const image = firstDefined(
    source.imageUrl,
    source.image,
    source.product?.image,
    source.product?.imageUrl,
    getImageFallbackSrc("product", productName),
  );

  return {
    id: `${productId}-${variantId}`,
    maxQuantity,
    product: {
      apiId: productId,
      brand: firstDefined(source.brandName, source.product?.brand, ""),
      brandId: firstDefined(source.brandId, source.product?.brandId, null),
      category: firstDefined(source.categoryName, source.product?.category, ""),
      categoryId: firstDefined(source.categoryId, source.product?.categoryId, null),
      id: String(productId),
      image,
      name: productName,
      oldPrice: firstDefined(source.oldPrice, source.product?.oldPrice, null),
      price: unitPrice,
      slug: firstDefined(source.productSlug, source.product?.slug, String(productId)),
      stock: maxQuantity,
    },
    quantity,
    status: firstDefined(source.status, "ACTIVE"),
    syncStatus: "synced",
    unitPrice,
    updatedAt: firstDefined(source.updatedAt, source.updated_at, null),
    variant: variantName,
    variantId,
  };
}

export function normalizeCartResponse(response) {
  const payload = unwrapApiPayload(response) ?? {};
  const rawItems = Array.isArray(payload) ? payload : toArray(payload.items ?? payload.cartItems ?? payload.data);
  const items = rawItems.map(normalizeCartItem).filter(Boolean);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  return {
    id: firstDefined(payload.id, payload.cartId, null),
    itemCount: toNumber(payload.itemCount, itemCount),
    items,
    raw: payload,
    subtotal: toNumber(payload.subtotal, subtotal),
    updatedAt: firstDefined(payload.updatedAt, payload.updated_at, new Date().toISOString()),
    userId: firstDefined(payload.userId, null),
  };
}

export function buildCartItemPayload(item = {}) {
  const variantId = getNumericId(getCartItemVariantId(item));

  if (!variantId) {
    return null;
  }

  return {
    quantity: clampQuantity(item.quantity),
    variantId,
  };
}

export function buildCartSyncPayload(items = []) {
  return {
    items: items.map(buildCartItemPayload).filter(Boolean),
  };
}
