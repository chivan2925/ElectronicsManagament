import { unwrapApiPayload } from "./productMapper";

const DEFAULT_CATEGORY_STATUS = "ACTIVE";

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

export function normalizeCategory(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const icon = firstDefined(source.iconUrl, source.icon, "");

  return {
    createdAt: firstDefined(source.createdAt, null),
    description: firstDefined(source.description, ""),
    icon,
    iconUrl: icon,
    id: firstDefined(source.id, source.categoryId, null),
    name: firstDefined(source.name, ""),
    parentId: firstDefined(source.parentId, source.parent?.id, null),
    parentName: firstDefined(source.parentName, source.parent?.name, ""),
    raw: source,
    slug: firstDefined(source.slug, ""),
    status: firstDefined(source.status, DEFAULT_CATEGORY_STATUS),
    updatedAt: firstDefined(source.updatedAt, null),
  };
}

export function normalizeCategoryDetail(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const category = normalizeCategory(source);

  return {
    ...category,
    subCategories: toArray(source.subCategoryList).map((item) => normalizeCategory(item)),
  };
}

export function normalizeCategoryPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeCategory);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function buildCategoryPayload(values = {}) {
  const payload = {
    iconUrl: values.icon?.trim() || values.iconUrl?.trim() || null,
    name: values.name?.trim() ?? "",
    slug: values.slug?.trim() ?? "",
    status: values.status || DEFAULT_CATEGORY_STATUS,
  };

  if (values.parentId !== null && values.parentId !== undefined && values.parentId !== "") {
    payload.parentId = Number(values.parentId);
  }

  return payload;
}

export default normalizeCategoryPage;
