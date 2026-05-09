import { api } from "./client";

export function createResourceService(resourcePath, options = {}) {
  const updateMethod = options.updateMethod ?? "put";

  return {
    create(payload, config = {}) {
      return api.post(resourcePath, payload, config);
    },
    getAll(params = {}, config = {}) {
      return api.get(resourcePath, {
        ...config,
        params: {
          ...params,
          ...config.params,
        },
      });
    },
    getById(id, config = {}) {
      return api.get(`${resourcePath}/${id}`, config);
    },
    remove(id, config = {}) {
      return api.delete(`${resourcePath}/${id}`, config);
    },
    update(id, payload, config = {}) {
      return api[updateMethod](`${resourcePath}/${id}`, payload, config);
    },
  };
}

export default createResourceService;
