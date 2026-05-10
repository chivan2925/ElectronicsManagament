import { api } from "./client";
import { normalizeOrderDetail, normalizeOrderPage } from "./accountMapper";
import { normalizeOrder } from "./checkoutMapper";
import {
  buildAdminOrderUpdatePayload,
  normalizeAdminOrderDetail,
  normalizeAdminOrderPage,
  normalizeAdminOrderSummary,
} from "./orderMapper";
import { cleanParams } from "./mapperUtils";
import { createResourceService } from "./resourceService";

const ADMIN_RESOURCE_PATH = "/admin/orders";
const CHECKOUT_RESOURCE_PATH = import.meta.env.VITE_ORDER_API_PATH || "/orders";
const USER_ORDERS_RESOURCE_PATH = import.meta.env.VITE_USER_ORDER_API_PATH || CHECKOUT_RESOURCE_PATH;
const adminOrderService = createResourceService(ADMIN_RESOURCE_PATH, { updateMethod: "patch" });

export async function getAll(params = {}, config = {}) {
  const data = await adminOrderService.getAll(cleanParams(params), config);
  return normalizeAdminOrderPage(data);
}

export async function getById(id, config = {}) {
  const data = await adminOrderService.getById(id, config);
  return normalizeAdminOrderDetail(data);
}

export async function update(id, payload, config = {}) {
  const data = await adminOrderService.update(id, buildAdminOrderUpdatePayload(payload), config);
  return normalizeAdminOrderSummary(data);
}

export const { remove } = adminOrderService;

export async function create(payload) {
  return createOrder(payload);
}

export async function createOrder(payload, config = {}) {
  const data = await api.post(CHECKOUT_RESOURCE_PATH, payload, {
    skipGlobalErrorHandler: true,
    ...config,
  });

  return normalizeOrder(data);
}

export async function getUserOrderById(userId, orderId, config = {}) {
  if (!userId || !orderId) {
    return null;
  }

  const { params: configParams, ...requestConfig } = config;
  const data = await api.get(`${USER_ORDERS_RESOURCE_PATH}/${orderId}`, {
    ...requestConfig,
    params: {
      ...configParams,
      userId,
    },
    skipGlobalErrorHandler: true,
  });

  return normalizeOrderDetail(data);
}

export async function getUserOrders(userId, params = {}, config = {}) {
  if (!userId) {
    return normalizeOrderPage([]);
  }

  const { params: configParams, ...requestConfig } = config;
  const data = await api.get(USER_ORDERS_RESOURCE_PATH, {
    ...requestConfig,
    params: {
      ...params,
      ...configParams,
      userId,
    },
    skipGlobalErrorHandler: true,
  });

  return normalizeOrderPage(data);
}

const orderService = {
  ...adminOrderService,
  create,
  createOrder,
  getAll,
  getById,
  getUserOrderById,
  getUserOrders,
  remove,
  update,
};

export default orderService;
