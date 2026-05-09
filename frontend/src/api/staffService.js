import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/staffs";

const staffService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = staffService;

export default staffService;
