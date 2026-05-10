import { api } from "./client";
import {
  buildWishlistItemPayload,
  buildWishlistReplacePayload,
  normalizeWishlistResponse,
} from "./wishlistMapper";

const RESOURCE_PATH = String(import.meta.env.VITE_WISHLIST_API_PATH ?? "")
  .trim()
  .replace(/\/+$/g, "");

const OPTIONAL_WISHLIST_CONFIG = {
  retry: false,
  silent: true,
  skipAuthRefresh: true,
  skipGlobalErrorHandler: true,
  skipUnauthorizedHandler: true,
};

function withOptionalConfig(config = {}) {
  return {
    ...OPTIONAL_WISHLIST_CONFIG,
    ...config,
  };
}

function encodePathValue(value) {
  return encodeURIComponent(String(value));
}

export function isWishlistSyncConfigured() {
  return Boolean(RESOURCE_PATH);
}

function createWishlistSyncDisabledError() {
  const error = new Error("Wishlist sync API is not configured.");

  error.apiError = {
    code: "WISHLIST_SYNC_DISABLED",
    details: null,
    isForbidden: false,
    isNetworkError: false,
    isServerError: false,
    isTimeout: false,
    isUnauthorized: false,
    isValidationError: false,
    message: error.message,
    method: null,
    path: null,
    status: 501,
    type: "disabled",
    url: null,
  };
  error.normalizedError = error.apiError;

  return error;
}

function ensureWishlistSyncConfigured() {
  if (!isWishlistSyncConfigured()) {
    throw createWishlistSyncDisabledError();
  }
}

export async function getWishlist(config = {}) {
  ensureWishlistSyncConfigured();

  const data = await api.get(RESOURCE_PATH, withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function replaceWishlist(items = [], config = {}) {
  ensureWishlistSyncConfigured();

  const data = await api.put(RESOURCE_PATH, buildWishlistReplacePayload(items), withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function addWishlistItem(itemOrProduct, config = {}) {
  ensureWishlistSyncConfigured();

  const data = await api.post(`${RESOURCE_PATH}/items`, buildWishlistItemPayload(itemOrProduct), withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function removeWishlistItem(productId, config = {}) {
  ensureWishlistSyncConfigured();

  const data = await api.delete(`${RESOURCE_PATH}/items/${encodePathValue(productId)}`, withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function clearWishlist(config = {}) {
  ensureWishlistSyncConfigured();

  const data = await api.delete(RESOURCE_PATH, withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

const wishlistService = {
  addWishlistItem,
  clearWishlist,
  getWishlist,
  isWishlistSyncConfigured,
  replaceWishlist,
  removeWishlistItem,
};

export default wishlistService;
