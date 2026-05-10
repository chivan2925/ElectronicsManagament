import { api } from "./client";
import { buildVariantPayload, normalizeAdminVariant, normalizeAdminVariantPage } from "./variantMapper";
import { cleanParams } from "./mapperUtils";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/variants";
const baseVariantService = createResourceService(RESOURCE_PATH);

export async function getAll(params = {}, config = {}) {
  const data = await baseVariantService.getAll(cleanParams(params), config);
  return normalizeAdminVariantPage(data);
}

export async function getById(id, config = {}) {
  const data = await baseVariantService.getById(id, config);
  return normalizeAdminVariant(data);
}

export async function create(payload, config = {}) {
  const data = await baseVariantService.create(buildVariantPayload(payload), config);
  return normalizeAdminVariant(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseVariantService.update(id, buildVariantPayload(payload), config);
  return normalizeAdminVariant(data);
}

export async function remove(id, config = {}) {
  return baseVariantService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status: nextStatus }, config);

  return normalizeAdminVariant(data);
}

const variantService = {
  create,
  getAll,
  getById,
  remove,
  update,
  updateStatus,
};

export default variantService;
