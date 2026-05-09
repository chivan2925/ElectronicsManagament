import { useCallback, useEffect, useMemo, useState } from "react";
import { products as catalogProducts } from "../data";

const RECENTLY_VIEWED_STORAGE_KEY = "electronicsManagement:recentlyViewed";
const RECENTLY_VIEWED_CHANGE_EVENT = "electronicsManagement:recently-viewed-change";
const MAX_RECENTLY_VIEWED_ITEMS = 8;

const catalogProductIds = new Set(catalogProducts.map((product) => product.id));

function normalizeRecentlyViewedEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries.reduce((normalizedEntries, entry) => {
    const productId = typeof entry === "string" ? entry : entry?.id;
    const normalizedId = String(productId || "");

    if (!catalogProductIds.has(normalizedId) || normalizedEntries.some((item) => item.id === normalizedId)) {
      return normalizedEntries;
    }

    return [
      ...normalizedEntries,
      {
        id: normalizedId,
        viewedAt: entry?.viewedAt || new Date().toISOString(),
      },
    ];
  }, []);
}

function readRecentlyViewedEntries() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const entries = Array.isArray(parsedValue) ? parsedValue : parsedValue.items;

    return normalizeRecentlyViewedEntries(entries).slice(0, MAX_RECENTLY_VIEWED_ITEMS);
  } catch {
    return [];
  }
}

function writeRecentlyViewedEntries(entries) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RECENTLY_VIEWED_STORAGE_KEY,
    JSON.stringify({
      items: normalizeRecentlyViewedEntries(entries).slice(0, MAX_RECENTLY_VIEWED_ITEMS),
      updatedAt: new Date().toISOString(),
    }),
  );
  window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_CHANGE_EVENT));
}

function useRecentlyViewed() {
  const [recentlyViewedEntries, setRecentlyViewedEntries] = useState(readRecentlyViewedEntries);

  useEffect(() => {
    const syncRecentlyViewed = () => {
      setRecentlyViewedEntries(readRecentlyViewedEntries());
    };

    window.addEventListener(RECENTLY_VIEWED_CHANGE_EVENT, syncRecentlyViewed);
    window.addEventListener("storage", syncRecentlyViewed);

    return () => {
      window.removeEventListener(RECENTLY_VIEWED_CHANGE_EVENT, syncRecentlyViewed);
      window.removeEventListener("storage", syncRecentlyViewed);
    };
  }, []);

  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewedEntries
        .map((entry) => catalogProducts.find((product) => product.id === entry.id))
        .filter(Boolean),
    [recentlyViewedEntries],
  );

  const addRecentlyViewed = useCallback((product) => {
    if (!product?.id) {
      return;
    }

    const currentEntries = readRecentlyViewedEntries();
    const nextEntries = [
      {
        id: product.id,
        viewedAt: new Date().toISOString(),
      },
      ...currentEntries.filter((entry) => entry.id !== product.id),
    ];

    setRecentlyViewedEntries(normalizeRecentlyViewedEntries(nextEntries).slice(0, MAX_RECENTLY_VIEWED_ITEMS));
    writeRecentlyViewedEntries(nextEntries);
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewedEntries([]);
    writeRecentlyViewedEntries([]);
  }, []);

  return {
    addRecentlyViewed,
    clearRecentlyViewed,
    recentlyViewedCount: recentlyViewedEntries.length,
    recentlyViewedEntries,
    recentlyViewedProducts,
  };
}

export default useRecentlyViewed;
