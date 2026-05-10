import { api } from "./client";
import { buildMediaPayload, normalizeMedia, normalizeMediaPage, normalizeUploadResponse } from "./mediaMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/media";

const baseMediaService = createResourceService(RESOURCE_PATH);

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

export async function getAll(params = {}, config = {}) {
  const data = await baseMediaService.getAll(cleanParams(params), config);
  return normalizeMediaPage(data);
}

export async function getById(id, config = {}) {
  const data = await baseMediaService.getById(id, config);
  return normalizeMedia(data);
}

export async function create(payload, config = {}) {
  const data = await baseMediaService.create(buildMediaPayload(payload), config);
  return normalizeMedia(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseMediaService.update(id, buildMediaPayload(payload), config);
  return normalizeMedia(data);
}

export async function remove(id, config = {}) {
  return baseMediaService.remove(id, config);
}

export async function upload(file, config = {}) {
  const formData = new FormData();
  formData.append("file", file);

  const data = await api.post(`${RESOURCE_PATH}/upload`, formData, {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  });

  return normalizeUploadResponse(data);
}

export async function setPrimary(id, config = {}) {
  return api.patch(`${RESOURCE_PATH}/${id}/primary`, null, config);
}

export async function updateOrder(id, displayOrder, config = {}) {
  const nextDisplayOrder = typeof displayOrder === "number" ? displayOrder : Number(displayOrder?.displayOrder ?? 0);
  const data = await api.patch(`${RESOURCE_PATH}/${id}/order`, { displayOrder: nextDisplayOrder }, config);

  return normalizeMedia(data);
}

const mediaService = {
  create,
  getAll,
  getById,
  remove,
  setPrimary,
  update,
  updateOrder,
  upload,
};

export default mediaService;
