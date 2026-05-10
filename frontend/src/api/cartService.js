import { isDemoModeEnabled } from "../demo/demoMode";
import { api } from "./client";
import { buildCartItemPayload, buildCartSyncPayload, normalizeCartResponse } from "./cartMapper";

const RESOURCE_PATH =
  String(import.meta.env.VITE_CART_API_PATH || "/cart")
    .trim()
    .replace(/\/+$/g, "") || "/cart";

const OPTIONAL_CART_CONFIG = {
  retry: false,
  silent: true,
  skipGlobalErrorHandler: true,
};

function withOptionalConfig(config = {}) {
  return {
    ...OPTIONAL_CART_CONFIG,
    ...config,
  };
}

function encodePathValue(value) {
  return encodeURIComponent(String(value));
}

export function isCartSyncConfigured() {
  return !isDemoModeEnabled && Boolean(RESOURCE_PATH);
}

export async function getCart(config = {}) {
  const data = await api.get(RESOURCE_PATH, withOptionalConfig(config));

  return normalizeCartResponse(data);
}

export async function syncCart(items = [], config = {}) {
  const data = await api.put(RESOURCE_PATH, buildCartSyncPayload(items), withOptionalConfig(config));

  return normalizeCartResponse(data);
}

export async function addCartItem(item = {}, config = {}) {
  const payload = buildCartItemPayload(item);

  if (!payload) {
    return normalizeCartResponse([]);
  }

  const data = await api.post(`${RESOURCE_PATH}/items`, payload, withOptionalConfig(config));

  return normalizeCartResponse(data);
}

export async function updateCartItem(variantId, quantity, config = {}) {
  const data = await api.patch(
    `${RESOURCE_PATH}/items/${encodePathValue(variantId)}`,
    { quantity },
    withOptionalConfig(config),
  );

  return normalizeCartResponse(data);
}

export async function removeCartItem(variantId, config = {}) {
  const data = await api.delete(`${RESOURCE_PATH}/items/${encodePathValue(variantId)}`, withOptionalConfig(config));

  return normalizeCartResponse(data);
}

export async function clearCart(config = {}) {
  const data = await api.delete(RESOURCE_PATH, withOptionalConfig(config));

  return normalizeCartResponse(data);
}

const cartService = {
  addCartItem,
  clearCart,
  getCart,
  isCartSyncConfigured,
  removeCartItem,
  syncCart,
  updateCartItem,
};

export default cartService;
