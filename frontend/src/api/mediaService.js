import { api } from "./client";

const RESOURCE_PATH = "/admin/media";

export async function getAll(params = {}) {
  return api.get(RESOURCE_PATH, { params });
}

export async function getById(id) {
  return api.get(`${RESOURCE_PATH}/${id}`);
}

export async function create(payload) {
  return api.post(RESOURCE_PATH, payload);
}

export async function update(id, payload) {
  return api.put(`${RESOURCE_PATH}/${id}`, payload);
}

export async function remove(id) {
  return api.delete(`${RESOURCE_PATH}/${id}`);
}

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
  create,
  getAll,
  getById,
  remove,
  update,
  upload,
};

export default mediaService;
