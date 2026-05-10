import { api } from "./client";
import {
  buildWishlistItemPayload,
  buildWishlistReplacePayload,
  normalizeWishlistResponse,
} from "./wishlistMapper";

const DEFAULT_RESOURCE_PATH = "/wishlist";
const RESOURCE_PATH = import.meta.env.VITE_WISHLIST_API_PATH || DEFAULT_RESOURCE_PATH;

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

export async function getWishlist(config = {}) {
  const data = await api.get(RESOURCE_PATH, withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function replaceWishlist(items = [], config = {}) {
  const data = await api.put(RESOURCE_PATH, buildWishlistReplacePayload(items), withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function addWishlistItem(itemOrProduct, config = {}) {
  const data = await api.post(`${RESOURCE_PATH}/items`, buildWishlistItemPayload(itemOrProduct), withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function removeWishlistItem(productId, config = {}) {
  const data = await api.delete(`${RESOURCE_PATH}/items/${encodePathValue(productId)}`, withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

export async function clearWishlist(config = {}) {
  const data = await api.delete(RESOURCE_PATH, withOptionalConfig(config));

  return normalizeWishlistResponse(data);
}

const wishlistService = {
  addWishlistItem,
  clearWishlist,
  getWishlist,
  replaceWishlist,
  removeWishlistItem,
};

export default wishlistService;
