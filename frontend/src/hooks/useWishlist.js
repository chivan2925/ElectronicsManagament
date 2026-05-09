import { useCallback, useEffect, useMemo, useState } from "react";
import { products as catalogProducts } from "../data";

const WISHLIST_STORAGE_KEY = "electronicsManagement:wishlist";
const WISHLIST_CHANGE_EVENT = "electronicsManagement:wishlist-change";
const DEFAULT_WISHLIST_IDS = ["P002", "P003", "P014"];

const catalogProductIds = new Set(catalogProducts.map((product) => product.id));

function normalizeWishlistIds(ids) {
  if (!Array.isArray(ids)) {
    return [];
  }

  return ids.reduce((normalizedIds, id) => {
    const normalizedId = String(id);

    if (!catalogProductIds.has(normalizedId) || normalizedIds.includes(normalizedId)) {
      return normalizedIds;
    }

    return [...normalizedIds, normalizedId];
  }, []);
}

function readWishlistIds() {
  if (typeof window === "undefined") {
    return DEFAULT_WISHLIST_IDS;
  }

  const rawValue = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_WISHLIST_IDS;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const ids = Array.isArray(parsedValue) ? parsedValue : parsedValue.ids;

    return normalizeWishlistIds(ids);
  } catch {
    return DEFAULT_WISHLIST_IDS;
  }
}

function writeWishlistIds(ids) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    WISHLIST_STORAGE_KEY,
    JSON.stringify({
      ids: normalizeWishlistIds(ids),
      updatedAt: new Date().toISOString(),
    }),
  );
  window.dispatchEvent(new CustomEvent(WISHLIST_CHANGE_EVENT));
}

function getProductId(productOrId) {
  return typeof productOrId === "string" ? productOrId : productOrId?.id;
}

function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState(readWishlistIds);

  useEffect(() => {
    const syncWishlist = () => {
      setWishlistIds(readWishlistIds());
    };

    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
    window.addEventListener("storage", syncWishlist);

    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const wishlistProducts = useMemo(
    () =>
      wishlistIds
        .map((id) => catalogProducts.find((product) => product.id === id))
        .filter(Boolean),
    [wishlistIds],
  );

  const isWishlisted = useCallback(
    (productOrId) => {
      const productId = getProductId(productOrId);

      return Boolean(productId && wishlistIds.includes(productId));
    },
    [wishlistIds],
  );

  const setNextWishlistIds = useCallback((nextIds) => {
    const normalizedIds = normalizeWishlistIds(nextIds);

    setWishlistIds(normalizedIds);
    writeWishlistIds(normalizedIds);
  }, []);

  const addToWishlist = useCallback(
    (productOrId) => {
      const productId = getProductId(productOrId);

      if (!productId) {
        return;
      }

      setNextWishlistIds([productId, ...readWishlistIds().filter((id) => id !== productId)]);
    },
    [setNextWishlistIds],
  );

  const removeFromWishlist = useCallback(
    (productOrId) => {
      const productId = getProductId(productOrId);

      if (!productId) {
        return;
      }

      setNextWishlistIds(readWishlistIds().filter((id) => id !== productId));
    },
    [setNextWishlistIds],
  );

  const toggleWishlist = useCallback(
    (productOrId) => {
      const productId = getProductId(productOrId);

      if (!productId) {
        return;
      }

      const currentIds = readWishlistIds();
      const nextIds = currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [productId, ...currentIds];

      setNextWishlistIds(nextIds);
    },
    [setNextWishlistIds],
  );

  const clearWishlist = useCallback(() => {
    setNextWishlistIds([]);
  }, [setNextWishlistIds]);

  return {
    addToWishlist,
    clearWishlist,
    isWishlisted,
    removeFromWishlist,
    toggleWishlist,
    wishlistCount: wishlistIds.length,
    wishlistIds,
    wishlistProducts,
  };
}

export default useWishlist;
