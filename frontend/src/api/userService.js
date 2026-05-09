import { api } from "./client";

const RESOURCE_PATH = "/admin/users";

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

const userService = {
  create,
  getAll,
  getById,
  remove,
  update,
};

export default userService;
