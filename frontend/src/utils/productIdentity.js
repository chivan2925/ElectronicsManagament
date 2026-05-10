export function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

export function toProductKey(value) {
  const key = firstDefined(value);

  return key === undefined ? "" : String(key);
}

export function getProductAliases(productOrEntry = {}) {
  if (typeof productOrEntry === "string" || typeof productOrEntry === "number") {
    return [toProductKey(productOrEntry)].filter(Boolean);
  }

  const product = productOrEntry.product ?? productOrEntry;

  return [
    productOrEntry.id,
    productOrEntry.productId,
    productOrEntry.apiId,
    product?.id,
    product?.productId,
    product?.apiId,
    product?.slug,
  ].map(toProductKey).filter(Boolean);
}

export function hasSameProduct(left, right) {
  const leftAliases = new Set(getProductAliases(left));

  return getProductAliases(right).some((alias) => leftAliases.has(alias));
}
