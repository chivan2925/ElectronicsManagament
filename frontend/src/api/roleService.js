import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/roles";
const roleService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = roleService;

export default roleService;
