const CART_STORAGE_KEY = "electronicsmanagement.cart";
const DEFAULT_MAX_QUANTITY = 99;

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function getVariantStock(variant, product) {
  return toNumber(firstDefined(variant?.stock, variant?.totalStock, product?.stock, DEFAULT_MAX_QUANTITY), DEFAULT_MAX_QUANTITY);
}

export function getDefaultCartVariant(product = {}) {
  const variants = toArray(product.variants);

  return variants.find((variant) => getVariantStock(variant, product) > 0) ?? variants[0] ?? null;
}

export function createCartItem(product, options = {}) {
  const selectedVariant = options.variant ?? getDefaultCartVariant(product) ?? {};
  const variantId = firstDefined(selectedVariant.id, selectedVariant.variantId, product.variantId, product.apiId, product.id);
  const variantName = firstDefined(selectedVariant.name, selectedVariant.label, selectedVariant.color, "Phiên bản tiêu chuẩn");
  const unitPrice = toNumber(firstDefined(selectedVariant.price, product.price), 0);
  const maxQuantity = Math.max(0, getVariantStock(selectedVariant, product));
  const requestedQuantity = toNumber(options.quantity, 1);
  const quantity = Math.min(Math.max(requestedQuantity, 1), Math.max(maxQuantity, 1));

  return {
    id: `${product.id ?? product.apiId}-${variantId}`,
    maxQuantity,
    product: {
      apiId: product.apiId ?? product.id,
      brand: product.brand ?? "",
      brandId: product.brandId ?? null,
      category: product.category ?? "",
      categoryId: product.categoryId ?? null,
      id: String(product.id ?? product.apiId ?? variantId),
      image: selectedVariant.image ?? product.image,
      name: product.name ?? "Sản phẩm ElectronicsManagement",
      oldPrice: product.oldPrice ?? null,
      price: unitPrice,
      slug: product.slug ?? String(product.id ?? variantId),
      stock: maxQuantity,
    },
    quantity,
    unitPrice,
    variant: variantName,
    variantId,
  };
}

export function loadStoredCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]");

    return Array.isArray(parsed) ? parsed.filter(isPlainObject) : [];
  } catch {
    return [];
  }
}

export function persistCartItems(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function clampCartQuantity(quantity, maxQuantity) {
  return Math.min(Math.max(toNumber(quantity, 1), 1), Math.max(toNumber(maxQuantity, DEFAULT_MAX_QUANTITY), 1));
}
