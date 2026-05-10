import { firstDefined, getPageItems, getPageMeta, toArray, toNumber, unwrapApiPayload } from "./mapperUtils";

export const LOW_STOCK_THRESHOLD = 10;

function normalizeEnum(value, fallback = "") {
  return String(value ?? fallback).trim().toUpperCase();
}

function joinAddress(source = {}) {
  return [source.line, source.ward, source.district, source.province].filter(Boolean).join(", ");
}

export function getStockLevel(quantity, threshold = LOW_STOCK_THRESHOLD) {
  const stock = toNumber(quantity, 0);

  if (stock <= 0) {
    return "OUT_OF_STOCK";
  }

  if (stock <= threshold) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
}

export function normalizeWarehouseStock(raw = {}, warehouse = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const warehouseId = firstDefined(source.warehouseId, warehouse.id, warehouse.apiId, null);
  const variantId = firstDefined(source.variantId, source.variant?.id, source.id, null);
  const quantity = toNumber(firstDefined(source.quantity, source.stock, source.availableStock, source.totalStock), 0);

  return {
    id: `${warehouseId ?? "warehouse"}-${variantId ?? "variant"}`,
    quantity,
    raw: source,
    sku: firstDefined(source.sku, source.variantSku, source.variant?.sku, ""),
    status: getStockLevel(quantity),
    updatedAt: firstDefined(source.updatedAt, source.updated_at, warehouse.updatedAt, warehouse.createdAt, ""),
    utilization: warehouse.utilization ?? 0,
    variantId,
    variantName: firstDefined(source.variantName, source.variant?.name, source.productName, variantId ? `Variant #${variantId}` : "Variant"),
    warehouseAddress: warehouse.address ?? "",
    warehouseCapacity: warehouse.capacity ?? 0,
    warehouseCurrentStock: warehouse.currentStock ?? 0,
    warehouseId,
    warehouseName: warehouse.name ?? (warehouseId ? `Warehouse #${warehouseId}` : "Warehouse"),
    warehouseStatus: warehouse.status ?? "",
  };
}

export function normalizeWarehouse(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const detailsSource = toArray(source.warehouseDetails ?? source.details ?? source.stocks ?? source.items);
  const detailQuantity = detailsSource.reduce((total, item) => total + toNumber(firstDefined(item.quantity, item.stock), 0), 0);
  const capacity = toNumber(source.capacity, 0);
  const currentStock = toNumber(firstDefined(source.currentStock, source.stock, detailQuantity), 0);
  const utilization = capacity > 0 ? Math.min(100, Math.round((currentStock / capacity) * 100)) : 0;

  const warehouse = {
    address: joinAddress(source),
    apiId: firstDefined(source.id, source.warehouseId, null),
    capacity,
    createdAt: firstDefined(source.createdAt, source.created_at, ""),
    currentStock,
    district: firstDefined(source.district, ""),
    id: firstDefined(source.id, source.warehouseId, null),
    line: firstDefined(source.line, ""),
    name: firstDefined(source.name, source.warehouseName, "Warehouse"),
    province: firstDefined(source.province, ""),
    raw: source,
    status: normalizeEnum(firstDefined(source.status, "ACTIVE")),
    updatedAt: firstDefined(source.updatedAt, source.updated_at, source.createdAt, source.created_at, ""),
    utilization,
    ward: firstDefined(source.ward, ""),
  };

  return {
    ...warehouse,
    warehouseDetails: detailsSource.map((detail) => normalizeWarehouseStock(detail, warehouse)),
  };
}

export function normalizeWarehousePage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeWarehouse);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function flattenWarehouseStocks(warehouses = []) {
  return toArray(warehouses).flatMap((warehouse) => warehouse.warehouseDetails ?? []);
}

export function normalizeWarehouseTransaction(raw = {}) {
  const source = unwrapApiPayload(raw) ?? {};
  const details = toArray(source.warehouseTransactionDetails ?? source.details ?? source.items);
  const quantity = details.reduce((total, item) => total + toNumber(item.quantity, 0), 0);

  return {
    code: firstDefined(source.code, source.transactionCode, source.id, ""),
    createdAt: firstDefined(source.createdAt, source.created_at, ""),
    details: details.map((detail) => ({
      quantity: toNumber(detail.quantity, 0),
      raw: detail,
      variantId: firstDefined(detail.variantId, detail.variant?.id, null),
      variantName: firstDefined(detail.variantName, detail.variant?.name, "Variant"),
    })),
    id: firstDefined(source.id, source.transactionId, null),
    note: firstDefined(source.note, ""),
    quantity,
    raw: source,
    staffFullName: firstDefined(source.staffFullName, source.staff?.fullName, ""),
    status: normalizeEnum(firstDefined(source.status, "PENDING")),
    type: normalizeEnum(firstDefined(source.type, "IMPORT")),
    updatedAt: firstDefined(source.updatedAt, source.updated_at, source.createdAt, source.created_at, ""),
    warehouseId: firstDefined(source.warehouseId, source.warehouse?.id, null),
    warehouseName: firstDefined(source.warehouseName, source.warehouse?.name, ""),
  };
}

export function normalizeWarehouseTransactionPage(response) {
  const payload = unwrapApiPayload(response);
  const items = getPageItems(payload).map(normalizeWarehouseTransaction);

  return {
    items,
    meta: getPageMeta(payload, items),
    raw: payload,
  };
}

export function buildWarehouseTransactionPayload(values = {}) {
  const type = normalizeEnum(values.type || "IMPORT");
  const code = String(values.code || `ADJ-${Date.now().toString(36).toUpperCase()}`).slice(0, 20);

  return {
    code,
    note: values.note?.trim() || null,
    orderId: values.orderId ? Number(values.orderId) : null,
    returnRequestId: values.returnRequestId ? Number(values.returnRequestId) : null,
    type,
    warehouseId: values.warehouseId ? Number(values.warehouseId) : null,
    warehouseTransactionDetails: [
      {
        quantity: Number(values.quantity || 1),
        variantId: values.variantId ? Number(values.variantId) : null,
      },
    ],
  };
}

export function buildWarehouseStatusPayload(status) {
  return {
    status: normalizeEnum(typeof status === "string" ? status : status?.status),
  };
}
