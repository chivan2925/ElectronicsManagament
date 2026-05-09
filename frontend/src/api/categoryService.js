import { api } from "./client";
import {
  buildCategoryPayload,
  normalizeCategory,
  normalizeCategoryDetail,
  normalizeCategoryPage,
} from "./categoryMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/categories";
const baseCategoryService = createResourceService(RESOURCE_PATH);

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

export async function getAll(params = {}, config = {}) {
  const data = await baseCategoryService.getAll(cleanParams(params), config);
  return normalizeCategoryPage(data);
}

export async function getById(id, config = {}) {
  const data = await baseCategoryService.getById(id, config);
  return normalizeCategoryDetail(data);
}

export async function create(payload, config = {}) {
  const data = await baseCategoryService.create(buildCategoryPayload(payload), config);
  return normalizeCategory(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseCategoryService.update(id, buildCategoryPayload(payload), config);
  return normalizeCategory(data);
}

export async function remove(id, config = {}) {
  return baseCategoryService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(
    `${RESOURCE_PATH}/${id}/status`,
    { status: nextStatus },
    config,
  );

  return normalizeCategory(data);
}

const categoryService = {
  create,
  getAll,
  getById,
  remove,
  update,
  updateStatus,
};

export default categoryService;
