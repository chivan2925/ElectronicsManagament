import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/brands";

const brandService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = brandService;

export default brandService;
