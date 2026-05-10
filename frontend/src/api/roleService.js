import { api } from "./client";
import { buildRolePayload, normalizeAdminRole, normalizeAdminRolePage } from "./adminPeopleMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/roles";
const baseRoleService = createResourceService(RESOURCE_PATH);

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

export async function getAll(params = {}, config = {}) {
  const data = await baseRoleService.getAll(cleanParams(params), config);
  return normalizeAdminRolePage(data);
}

export async function getById(id, config = {}) {
  const data = await baseRoleService.getById(id, config);
  return normalizeAdminRole(data);
}

export async function create(payload, config = {}) {
  const data = await baseRoleService.create(buildRolePayload(payload), config);
  return normalizeAdminRole(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseRoleService.update(id, buildRolePayload(payload), config);
  return normalizeAdminRole(data);
}

export async function remove(id, config = {}) {
  return baseRoleService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const nextStatus = typeof status === "string" ? status : status?.status;
  const data = await api.patch(`${RESOURCE_PATH}/${id}/status`, { status: nextStatus }, config);

  return normalizeAdminRole(data);
}

const roleService = {
  create,
  getAll,
  getById,
  remove,
  update,
  updateStatus,
};

export default roleService;
