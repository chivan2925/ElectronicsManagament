import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/variants";
const variantService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = variantService;

export default variantService;
