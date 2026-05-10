import { normalizeAdminPermission, normalizeAdminPermissionPage } from "./adminPeopleMapper";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/permissions";
const basePermissionService = createResourceService(RESOURCE_PATH);

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

export async function getAll(params = {}, config = {}) {
  const data = await basePermissionService.getAll(cleanParams(params), config);
  return normalizeAdminPermissionPage(data);
}

export async function getById(id, config = {}) {
  const data = await basePermissionService.getById(id, config);
  return normalizeAdminPermission(data);
}

const permissionService = {
  getAll,
  getById,
};

export default permissionService;
