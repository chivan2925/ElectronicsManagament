import client from "./client";

const RESOURCE_PATH = "/admin/products";

export async function getAll(params = {}) {
  const response = await client.get(RESOURCE_PATH, { params });
  return response.data;
}

export async function getById(id) {
  const response = await client.get(`${RESOURCE_PATH}/${id}`);
  return response.data;
}

export async function create(payload) {
  const response = await client.post(RESOURCE_PATH, payload);
  return response.data;
}

export async function update(id, payload) {
  const response = await client.put(`${RESOURCE_PATH}/${id}`, payload);
  return response.data;
}

export async function remove(id) {
  const response = await client.delete(`${RESOURCE_PATH}/${id}`);
  return response.data;
}

const productService = {
  create,
  getAll,
  getById,
  remove,
  update,
};

export default productService;
