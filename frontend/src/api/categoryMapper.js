import { firstDefined, getPageItems, getPageMeta, toArray, unwrapApiPayload } from "./mapperUtils";

const DEFAULT_CATEGORY_STATUS = "ACTIVE";

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
