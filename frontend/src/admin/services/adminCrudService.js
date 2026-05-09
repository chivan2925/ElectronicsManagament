import { getAdminModuleConfig } from "./adminModuleRegistry";

const METHOD_CAPABILITY_MAP = Object.freeze({
  create: "create",
  remove: "remove",
  update: "update",
});

function getServiceMethod(moduleKey, methodName) {
  const moduleConfig = getAdminModuleConfig(moduleKey);
  const capability = METHOD_CAPABILITY_MAP[methodName];

  if (capability && moduleConfig?.capabilities?.[capability] === false) {
    throw new Error(`Admin module "${moduleKey}" does not allow "${methodName}".`);
  }

  const serviceMethod = moduleConfig?.service?.[methodName];

  if (typeof serviceMethod !== "function") {
    throw new Error(`Admin module "${moduleKey}" does not support "${methodName}".`);
  }

  return serviceMethod;
}

export function listAdminRecords(moduleKey, params = {}, config = {}) {
  return getServiceMethod(moduleKey, "getAll")(params, config);
}

export function getAdminRecord(moduleKey, id, config = {}) {
  return getServiceMethod(moduleKey, "getById")(id, config);
}

export function createAdminRecord(moduleKey, payload, config = {}) {
  return getServiceMethod(moduleKey, "create")(payload, config);
}

export function updateAdminRecord(moduleKey, id, payload, config = {}) {
  return getServiceMethod(moduleKey, "update")(id, payload, config);
}

export function removeAdminRecord(moduleKey, id, config = {}) {
  return getServiceMethod(moduleKey, "remove")(id, config);
}

export function createAdminCrudService(moduleKey) {
  return {
    create: (payload, config) => createAdminRecord(moduleKey, payload, config),
    getAll: (params, config) => listAdminRecords(moduleKey, params, config),
    getById: (id, config) => getAdminRecord(moduleKey, id, config),
    remove: (id, config) => removeAdminRecord(moduleKey, id, config),
    update: (id, payload, config) => updateAdminRecord(moduleKey, id, payload, config),
  };
}
