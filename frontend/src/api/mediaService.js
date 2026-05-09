import { api } from "./client";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/media";

const baseMediaService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = baseMediaService;

export async function upload(file) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`${RESOURCE_PATH}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  });
}

const mediaService = {
  ...baseMediaService,
  create,
  getAll,
  getById,
  remove,
  update,
  upload,
};

export default mediaService;
