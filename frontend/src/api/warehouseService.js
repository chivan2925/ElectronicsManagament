import { api } from "./client";
import {
  buildWarehouseStatusPayload,
  buildWarehouseTransactionPayload,
  normalizeWarehouse,
  normalizeWarehousePage,
  normalizeWarehouseTransaction,
  normalizeWarehouseTransactionPage,
} from "./warehouseMapper";
import { cleanParams } from "./mapperUtils";
import { createResourceService } from "./resourceService";

const RESOURCE_PATH = "/admin/warehouses";
const TRANSACTION_PATH = "/admin/warehouse-transactions";

const baseWarehouseService = createResourceService(RESOURCE_PATH);
const baseTransactionService = createResourceService(TRANSACTION_PATH);

export async function getAll(params = {}, config = {}) {
  const data = await baseWarehouseService.getAll(cleanParams(params), config);
  return normalizeWarehousePage(data);
}

export async function getById(id, config = {}) {
  const data = await baseWarehouseService.getById(id, config);
  return normalizeWarehouse(data);
}

export async function create(payload, config = {}) {
  const data = await baseWarehouseService.create(payload, config);
  return normalizeWarehouse(data);
}

export async function update(id, payload, config = {}) {
  const data = await baseWarehouseService.update(id, payload, config);
  return normalizeWarehouse(data);
}

export async function remove(id, config = {}) {
  return baseWarehouseService.remove(id, config);
}

export async function updateStatus(id, status, config = {}) {
  const data = await api.patch(`${RESOURCE_PATH}/${id}`, buildWarehouseStatusPayload(status), config);
  return normalizeWarehouse(data);
}

export async function getTransactions(params = {}, config = {}) {
  const data = await baseTransactionService.getAll(cleanParams(params), config);
  return normalizeWarehouseTransactionPage(data);
}

export async function getTransactionById(id, config = {}) {
  const data = await baseTransactionService.getById(id, config);
  return normalizeWarehouseTransaction(data);
}

export async function createTransaction(values, config = {}) {
  const data = await baseTransactionService.create(buildWarehouseTransactionPayload(values), config);
  return normalizeWarehouseTransaction(data);
}

export async function completeTransaction(id, type, config = {}) {
  const data = await api.patch(
    `${TRANSACTION_PATH}/${id}/status`,
    {
      status: "COMPLETED",
      type,
    },
    config,
  );

  return normalizeWarehouseTransaction(data);
}

export async function createAndCompleteTransaction(values, config = {}) {
  const transaction = await createTransaction(values, config);
  return completeTransaction(transaction.id, transaction.type, config);
}

const warehouseService = {
  completeTransaction,
  create,
  createAndCompleteTransaction,
  createTransaction,
  getAll,
  getById,
  getTransactionById,
  getTransactions,
  remove,
  update,
  updateStatus,
};

export default warehouseService;
