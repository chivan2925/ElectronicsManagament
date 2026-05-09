import { api } from "./client";
import { buildBrandPayload, normalizeBrand, normalizeBrandDetail, normalizeBrandPage } from "./brandMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/brands";
const baseBrandService = createResourceService(RESOURCE_PATH);

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

export async function getAll(params = {}, config = {}) {
  const data = await baseBrandService.getAll(cleanParams(params), config);
  return normalizeBrandPage(data);
}

export async function getById(id, config = {}) {
  const data = await baseBrandService.getById(id, config);
  return normalizeBrandDetail(data);
}

export async function create(payload, config = {}) {
  const data = await baseBrandService.create(buildBrandPayload(payload), config);
  return normalizeBrand(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseBrandService.update(id, buildBrandPayload(payload), config);
  return normalizeBrand(data);
}

export async function remove(id, config = {}) {
  return baseBrandService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status: nextStatus }, config);

  return normalizeBrand(data);
}

const brandService = {
  create,
  getAll,
  getById,
  remove,
  update,
  updateStatus,
};

export default brandService;
