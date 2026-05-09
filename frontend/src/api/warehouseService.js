import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/warehouses";

const warehouseService = createResourceService(RESOURCE_PATH);

export const { create, getAll, getById, remove, update } = warehouseService;

export default warehouseService;
