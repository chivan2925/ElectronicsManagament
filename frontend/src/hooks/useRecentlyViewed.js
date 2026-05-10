import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeProduct } from "../api/productMapper";
import { firstDefined, hasSameProduct } from "../utils/productIdentity";

const RECENTLY_VIEWED_STORAGE_KEY = "electronicsManagement:recentlyViewed";
const RECENTLY_VIEWED_CHANGE_EVENT = "electronicsManagement:recently-viewed-change";
const MAX_RECENTLY_VIEWED_ITEMS = 12;

const LEGACY_MOCK_PRODUCT_ID_PATTERN = /^P\d+$/i;
const API_PRODUCT_ID_PATTERN = /^[1-9]\d*$/;

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isApiProductId(value) {
  return API_PRODUCT_ID_PATTERN.test(String(value ?? "").trim());
}

function isLegacyMockProductId(value) {
  return LEGACY_MOCK_PRODUCT_ID_PATTERN.test(String(value ?? "").trim());
}

function getProductIdentity(product) {
  return firstDefined(product?.apiId, product?.productId, product?.id);
}

function hasProductDisplayData(product) {
  return Boolean(firstDefined(product?.name, product?.productName, product?.title));
}

function getEntryProductSource(entry) {
  if (typeof entry === "string" || typeof entry === "number") {
    return null;
  }

  if (!isPlainObject(entry)) {
    return null;
  }

  return entry.product ?? entry;
}

function createProductSnapshot(productSource) {
  if (!isPlainObject(productSource)) {
    return null;
  }

  if (!hasProductDisplayData(productSource) || isLegacyMockProductId(getProductIdentity(productSource))) {
    return null;
  }

  const product = normalizeProduct(productSource);
  const productId = getProductIdentity(product);

  if (!isApiProductId(productId) || isLegacyMockProductId(productId)) {
    return null;
  }

  return {
    apiId: product.apiId,
    brand: product.brand,
    category: product.category,
    discount: product.discount,
    id: product.id,
    image: product.image,
    name: product.name,
    oldPrice: product.oldPrice,
    price: product.price,
    rating: product.rating,
    reviews: product.reviews,
    slug: product.slug,
    sold: product.sold,
    stock: product.stock,
    tags: product.tags,
  };
}

function normalizeRecentlyViewedEntry(entry) {
  const productSource = getEntryProductSource(entry);
  const product = createProductSnapshot(productSource);
  const id = firstDefined(product?.id, entry?.productId, entry?.id, entry?.apiId);

  if (!id || !product) {
    return null;
  }

  return {
    apiId: product.apiId,
    id: String(id),
    product,
    productId: String(id),
    viewedAt: entry?.viewedAt || new Date().toISOString(),
  };
}

function normalizeRecentlyViewedEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries.reduce((normalizedEntries, entry) => {
    const normalizedEntry = normalizeRecentlyViewedEntry(entry);

    if (!normalizedEntry) {
      return normalizedEntries;
    }

    const duplicateIndex = normalizedEntries.findIndex((item) => hasSameProduct(item, normalizedEntry));

    if (duplicateIndex >= 0) {
      const existingEntry = normalizedEntries[duplicateIndex];
      normalizedEntries[duplicateIndex] = {
        ...existingEntry,
        ...normalizedEntry,
        viewedAt: normalizedEntry.viewedAt || existingEntry.viewedAt,
      };
      return normalizedEntries;
    }

    return [...normalizedEntries, normalizedEntry];
  }, []);
}

function sortRecentlyViewed(entries) {
  return [...entries].sort((left, right) => new Date(right.viewedAt).getTime() - new Date(left.viewedAt).getTime());
}

function readRecentlyViewedEntries() {
  const storage = getStorage();
  const rawValue = storage?.getItem(RECENTLY_VIEWED_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const entries = Array.isArray(parsedValue) ? parsedValue : parsedValue.items;
    const normalizedEntries = sortRecentlyViewed(normalizeRecentlyViewedEntries(entries)).slice(0, MAX_RECENTLY_VIEWED_ITEMS);

    if (Array.isArray(entries) && normalizedEntries.length !== entries.length) {
      saveRecentlyViewedEntries(normalizedEntries, { notify: false });
    }

    return normalizedEntries;
  } catch {
    return [];
  }
}

function serializeRecentlyViewedEntry(entry) {
  return {
    id: entry.id,
    product: entry.product,
    productId: entry.productId,
    viewedAt: entry.viewedAt,
  };
}

function saveRecentlyViewedEntries(entries, { notify = true } = {}) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (!entries.length) {
    storage.removeItem(RECENTLY_VIEWED_STORAGE_KEY);
  } else {
    storage.setItem(
      RECENTLY_VIEWED_STORAGE_KEY,
      JSON.stringify({
        items: entries.map(serializeRecentlyViewedEntry),
        updatedAt: new Date().toISOString(),
        version: 2,
      }),
    );
  }

  if (notify && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_CHANGE_EVENT));
  }
}

function writeRecentlyViewedEntries(entries) {
  const normalizedEntries = sortRecentlyViewed(normalizeRecentlyViewedEntries(entries)).slice(0, MAX_RECENTLY_VIEWED_ITEMS);

  saveRecentlyViewedEntries(normalizedEntries);
}

function useRecentlyViewed() {
  const [recentlyViewedEntries, setRecentlyViewedEntries] = useState(readRecentlyViewedEntries);

  useEffect(() => {
    const syncRecentlyViewed = () => {
      setRecentlyViewedEntries(readRecentlyViewedEntries());
    };

    window.addEventListener(RECENTLY_VIEWED_CHANGE_EVENT, syncRecentlyViewed);
    window.addEventListener("storage", syncRecentlyViewed);
    const syncFrame = window.requestAnimationFrame(syncRecentlyViewed);

    return () => {
      window.cancelAnimationFrame(syncFrame);
      window.removeEventListener(RECENTLY_VIEWED_CHANGE_EVENT, syncRecentlyViewed);
      window.removeEventListener("storage", syncRecentlyViewed);
    };
  }, []);

  const addRecentlyViewed = useCallback((product) => {
    const nextEntry = normalizeRecentlyViewedEntry({
      product,
      viewedAt: new Date().toISOString(),
    });

    if (!nextEntry) {
      return;
    }

    const currentEntries = readRecentlyViewedEntries();
    const nextEntries = [
      nextEntry,
      ...currentEntries.filter((entry) => !hasSameProduct(entry, nextEntry)),
    ].slice(0, MAX_RECENTLY_VIEWED_ITEMS);

    setRecentlyViewedEntries(nextEntries);
    writeRecentlyViewedEntries(nextEntries);
  }, []);

  const removeRecentlyViewed = useCallback((productOrId) => {
    const target = isPlainObject(productOrId) ? productOrId : { id: productOrId };
    const nextEntries = readRecentlyViewedEntries().filter((entry) => !hasSameProduct(entry, target));

    setRecentlyViewedEntries(nextEntries);
    writeRecentlyViewedEntries(nextEntries);
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewedEntries([]);
    writeRecentlyViewedEntries([]);
  }, []);

  const isRecentlyViewed = useCallback(
    (productOrId) => {
      const target = isPlainObject(productOrId) ? productOrId : { id: productOrId };

      return recentlyViewedEntries.some((entry) => hasSameProduct(entry, target));
    },
    [recentlyViewedEntries],
  );

  const recentlyViewedProducts = useMemo(
    () => recentlyViewedEntries.map((entry) => entry.product).filter(Boolean),
    [recentlyViewedEntries],
  );

  return {
    addRecentlyViewed,
    clearRecentlyViewed,
    hasRecentlyViewed: recentlyViewedEntries.length > 0,
    isRecentlyViewed,
    recentlyViewedCount: recentlyViewedEntries.length,
    recentlyViewedEntries,
    recentlyViewedProducts,
    removeRecentlyViewed,
  };
}

export default useRecentlyViewed;
