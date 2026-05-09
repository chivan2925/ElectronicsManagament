import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/categories";

const categoryService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = categoryService;

export default categoryService;
