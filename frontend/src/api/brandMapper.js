import { firstDefined, getPageItems, getPageMeta, unwrapApiPayload } from "./mapperUtils";

const DEFAULT_BRAND_STATUS = "ACTIVE";

function normalizeSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeBrand(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const name = firstDefined(source.name, "");
  const logo = firstDefined(source.logo, source.logoUrl, source.imageUrl, source.image, "");

  return {
    createdAt: firstDefined(source.createdAt, null),
    description: firstDefined(source.description, ""),
    featured: Boolean(source.featured),
    id: firstDefined(source.id, source.brandId, null),
    imageUrl: logo,
    logo,
    name,
    raw: source,
    slug: firstDefined(source.slug, normalizeSlug(name)),
    status: firstDefined(source.status, DEFAULT_BRAND_STATUS),
    updatedAt: firstDefined(source.updatedAt, null),
  };
}

export function normalizeBrandDetail(raw = {}) {
  return normalizeBrand(raw);
}

export function normalizeBrandPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeBrand);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function buildBrandPayload(values = {}) {
  return {
    description: values.description?.trim() || null,
    featured: Boolean(values.featured),
    imageUrl: values.logo?.trim() || values.imageUrl?.trim() || null,
    name: values.name?.trim() ?? "",
    slug: values.slug?.trim() ?? "",
    status: values.status || DEFAULT_BRAND_STATUS,
  };
}

export default normalizeBrandPage;
