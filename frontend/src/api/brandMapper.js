import { unwrapApiPayload } from "./productMapper";

const DEFAULT_BRAND_STATUS = "ACTIVE";

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

function normalizeSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
