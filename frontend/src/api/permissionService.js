import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/permissions";
const basePermissionService = createResourceService(RESOURCE_PATH);

export const { getAll, getById } = basePermissionService;

const permissionService = {
  getAll,
  getById,
};

export default permissionService;
