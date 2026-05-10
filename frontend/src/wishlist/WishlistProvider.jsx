import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeApiError } from "../api/normalizeApiError";
import { normalizeProduct } from "../api/productMapper";
import wishlistService from "../api/wishlistService";
import useAuth from "../auth/useAuth";
import { products as catalogProducts } from "../data";
import WishlistContext from "./WishlistContext";

const LEGACY_WISHLIST_STORAGE_KEY = "electronicsManagement:wishlist";
const WISHLIST_STORAGE_PREFIX = "electronicsManagement:wishlist:v2";
const WISHLIST_CHANGE_EVENT = "electronicsManagement:wishlist-change";
const UNAVAILABLE_WISHLIST_STATUSES = new Set([401, 403, 404, 405, 501]);
const GUEST_WISHLIST_STORAGE_KEY = `${WISHLIST_STORAGE_PREFIX}:guest`;

const catalogProductMap = new Map(catalogProducts.map((product) => [String(product.id), product]));

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

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function toWishlistId(value) {
  const id = firstDefined(value);

  return id === undefined ? "" : String(id);
}

function getUserStorageIdentity(user) {
  const identity = firstDefined(user?.id, user?.userId, user?.staffId, user?.email, "guest");

  return String(identity).replace(/[^a-zA-Z0-9@._-]/g, "_");
}

function getWishlistStorageKey(user) {
  return `${WISHLIST_STORAGE_PREFIX}:${getUserStorageIdentity(user)}`;
}

function notifyWishlistChanged(storageKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(WISHLIST_CHANGE_EVENT, { detail: { storageKey } }));
}

function getWishlistProductId(productOrItem) {
  if (typeof productOrItem === "string" || typeof productOrItem === "number") {
    return String(productOrItem);
  }

  const source = productOrItem?.product ?? productOrItem;

  return toWishlistId(
    firstDefined(
      productOrItem?.productId,
      source?.id,
      source?.productId,
      source?.apiId,
      productOrItem?.apiId,
      productOrItem?.id,
    ),
  );
}

function getWishlistApiId(productOrItem, fallbackId = "") {
  const source = productOrItem?.product ?? productOrItem;

  return firstDefined(productOrItem?.apiId, source?.apiId, source?.productId, source?.id, fallbackId);
}

function normalizeProductSnapshot(productOrItem) {
  const source = productOrItem?.product ?? productOrItem;
  const productId = getWishlistProductId(productOrItem);
  const productSource = isPlainObject(source) ? source : catalogProductMap.get(productId);
  const hasProductIdentity = Boolean(
    productSource?.id ?? productSource?.apiId ?? productSource?.productId ?? productSource?.slug ?? productSource?.name,
  );

  return hasProductIdentity ? normalizeProduct(productSource) : null;
}

function getWishlistAliases(itemOrProduct) {
  const product = itemOrProduct?.product ?? itemOrProduct;

  return [
    getWishlistProductId(itemOrProduct),
    toWishlistId(itemOrProduct?.apiId),
    toWishlistId(itemOrProduct?.productId),
    toWishlistId(product?.id),
    toWishlistId(product?.apiId),
    toWishlistId(product?.productId),
  ].filter(Boolean);
}

function isSameWishlistProduct(left, right) {
  const leftAliases = new Set(getWishlistAliases(left));

  return getWishlistAliases(right).some((alias) => leftAliases.has(alias));
}

function createWishlistItem(productOrItem, existingItem = null) {
  const product = normalizeProductSnapshot(productOrItem) ?? existingItem?.product ?? null;
  const productId = getWishlistProductId(productOrItem) || getWishlistProductId(product) || existingItem?.productId;

  if (!productId) {
    return null;
  }

  return {
    addedAt: existingItem?.addedAt ?? productOrItem?.addedAt ?? new Date().toISOString(),
    apiId: getWishlistApiId(productOrItem, product?.apiId ?? productId),
    id: String(productId),
    product,
    productId: String(productId),
    syncStatus: existingItem?.syncStatus ?? productOrItem?.syncStatus ?? "local",
  };
}

function normalizeWishlistItems(items = []) {
  return items.reduce((normalizedItems, item) => {
    const normalizedItem = createWishlistItem(item, item);

    if (!normalizedItem) {
      return normalizedItems;
    }

    const existingIndex = normalizedItems.findIndex((currentItem) => isSameWishlistProduct(currentItem, normalizedItem));

    if (existingIndex >= 0) {
      const existingItem = normalizedItems[existingIndex];
      normalizedItems[existingIndex] = {
        ...existingItem,
        ...normalizedItem,
        addedAt: existingItem.addedAt ?? normalizedItem.addedAt,
        product: normalizedItem.product ?? existingItem.product,
      };
      return normalizedItems;
    }

    return [...normalizedItems, normalizedItem];
  }, []);
}

function readWishlistValue(key) {
  const storage = getStorage();
  const rawValue = storage?.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

function normalizeStoredWishlist(parsedValue) {
  if (!parsedValue) {
    return [];
  }

  if (Array.isArray(parsedValue)) {
    return normalizeWishlistItems(parsedValue.map((item) => (typeof item === "string" ? { productId: item } : item)));
  }

  const sourceItems = parsedValue.items ?? parsedValue.products;
  const sourceIds = parsedValue.ids ?? parsedValue.productIds;

  if (Array.isArray(sourceItems)) {
    return normalizeWishlistItems(sourceItems);
  }

  if (Array.isArray(sourceIds)) {
    return normalizeWishlistItems(sourceIds.map((id) => ({ productId: id })));
  }

  return [];
}

function readStoredWishlist(storageKey) {
  const currentValue = readWishlistValue(storageKey);

  if (currentValue) {
    return normalizeStoredWishlist(currentValue);
  }

  const guestValue = storageKey === GUEST_WISHLIST_STORAGE_KEY ? null : readWishlistValue(GUEST_WISHLIST_STORAGE_KEY);

  if (guestValue) {
    return normalizeStoredWishlist(guestValue);
  }

  return normalizeStoredWishlist(readWishlistValue(LEGACY_WISHLIST_STORAGE_KEY));
}

function serializeWishlistItem(item) {
  return {
    addedAt: item.addedAt,
    apiId: item.apiId,
    id: item.id,
    product: item.product,
    productId: item.productId,
    syncStatus: item.syncStatus,
  };
}

function writeStoredWishlist(storageKey, items) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(
    storageKey,
    JSON.stringify({
      items: normalizeWishlistItems(items).map(serializeWishlistItem),
      updatedAt: new Date().toISOString(),
      version: 2,
    }),
  );
  notifyWishlistChanged(storageKey);
}

function sortWishlistItems(items) {
  return [...items].sort((left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime());
}

function mergeWishlistItems(...sources) {
  return sortWishlistItems(normalizeWishlistItems(sources.flat()));
}

function isWishlistApiUnavailable(error) {
  const apiError = normalizeApiError(error);

  return apiError.isUnauthorized || apiError.isForbidden || UNAVAILABLE_WISHLIST_STATUSES.has(Number(apiError.status));
}

function WishlistProvider({ children }) {
  const { isAuthenticated, loading: isAuthLoading, user } = useAuth();
  const storageKey = useMemo(() => getWishlistStorageKey(user), [user]);
  const [items, setItems] = useState(() => readStoredWishlist(storageKey));
  const [error, setError] = useState(null);
  const [isHydrating, setIsHydrating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [pendingIds, setPendingIds] = useState([]);
  const [syncMode, setSyncMode] = useState("local");

  const commitWishlistItems = useCallback(
    (nextItems) => {
      const normalizedItems = sortWishlistItems(normalizeWishlistItems(nextItems));

      setItems(normalizedItems);
      writeStoredWishlist(storageKey, normalizedItems);

      return normalizedItems;
    },
    [storageKey],
  );

  const setItemPending = useCallback((itemOrProduct, isPending) => {
    const aliases = getWishlistAliases(itemOrProduct);

    if (!aliases.length) {
      return;
    }

    setPendingIds((currentIds) => {
      if (isPending) {
        return Array.from(new Set([...currentIds, ...aliases]));
      }

      return currentIds.filter((id) => !aliases.includes(id));
    });
  }, []);

  const hydrateRemoteWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setSyncMode("local");
      setError(null);
      return { ok: true, syncMode: "local" };
    }

    setIsHydrating(true);
    setError(null);

    try {
      const remoteWishlist = await wishlistService.getWishlist();
      const localItems = readStoredWishlist(storageKey);
      const mergedItems = mergeWishlistItems(localItems, remoteWishlist.items);

      commitWishlistItems(mergedItems);
      setSyncMode("remote");
      setLastSyncedAt(new Date().toISOString());

      if (mergedItems.length !== remoteWishlist.items.length) {
        setIsSyncing(true);
        await wishlistService.replaceWishlist(mergedItems);
        setLastSyncedAt(new Date().toISOString());
      }

      return { ok: true, syncMode: "remote" };
    } catch (syncError) {
      if (isWishlistApiUnavailable(syncError)) {
        setSyncMode("local");
        setError(null);
        return { ok: true, syncMode: "local" };
      }

      const apiError = normalizeApiError(syncError);

      setSyncMode("offline");
      setError(apiError);
      return { error: apiError, ok: false, syncMode: "offline" };
    } finally {
      setIsHydrating(false);
      setIsSyncing(false);
    }
  }, [commitWishlistItems, isAuthenticated, storageKey]);

  useEffect(() => {
    const localItems = readStoredWishlist(storageKey);

    setItems(localItems);
    if (localItems.length) {
      writeStoredWishlist(storageKey, localItems);
    }
    setError(null);
    setLastSyncedAt(null);
    setPendingIds([]);
  }, [storageKey]);

  useEffect(() => {
    if (isAuthLoading) {
      return undefined;
    }

    let isActive = true;

    hydrateRemoteWishlist().then((result) => {
      if (!isActive) {
        return;
      }

      setSyncMode(result.syncMode);
    });

    return () => {
      isActive = false;
    };
  }, [hydrateRemoteWishlist, isAuthLoading]);

  useEffect(() => {
    const syncFromStorage = (event) => {
      if (event?.detail?.storageKey && event.detail.storageKey !== storageKey) {
        return;
      }

      setItems(readStoredWishlist(storageKey));
    };

    window.addEventListener(WISHLIST_CHANGE_EVENT, syncFromStorage);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [storageKey]);

  const runRemoteMutation = useCallback(
    async ({ item, previousItems, task }) => {
      if (!isAuthenticated || syncMode !== "remote") {
        return { ok: true, syncMode };
      }

      setItemPending(item, true);
      setIsSyncing(true);
      setError(null);

      try {
        await task();
        setLastSyncedAt(new Date().toISOString());
        return { ok: true, syncMode: "remote" };
      } catch (mutationError) {
        if (isWishlistApiUnavailable(mutationError)) {
          setSyncMode("local");
          setError(null);
          return { ok: true, syncMode: "local" };
        }

        const apiError = normalizeApiError(mutationError);

        commitWishlistItems(previousItems);
        setError(apiError);
        return { error: apiError, ok: false, syncMode: "remote" };
      } finally {
        setItemPending(item, false);
        setIsSyncing(false);
      }
    },
    [commitWishlistItems, isAuthenticated, setItemPending, syncMode],
  );

  const isWishlisted = useCallback(
    (productOrItem) => items.some((item) => isSameWishlistProduct(item, productOrItem)),
    [items],
  );

  const isWishlistPending = useCallback(
    (productOrItem) => {
      const aliases = getWishlistAliases(productOrItem);

      return aliases.some((alias) => pendingIds.includes(alias));
    },
    [pendingIds],
  );

  const addToWishlist = useCallback(
    async (productOrItem) => {
      const existingItem = items.find((item) => isSameWishlistProduct(item, productOrItem));
      const nextItem = createWishlistItem(productOrItem, existingItem);

      if (!nextItem) {
        return { ok: false, reason: "missing_product", wishlisted: false };
      }

      const previousItems = items;
      const nextItems = mergeWishlistItems([nextItem], previousItems.filter((item) => !isSameWishlistProduct(item, nextItem)));

      commitWishlistItems(nextItems);

      const remoteResult = await runRemoteMutation({
        item: nextItem,
        previousItems,
        task: () => wishlistService.addWishlistItem(nextItem),
      });

      return {
        ...remoteResult,
        action: existingItem ? "updated" : "added",
        item: nextItem,
        wishlisted: true,
      };
    },
    [commitWishlistItems, items, runRemoteMutation],
  );

  const removeFromWishlist = useCallback(
    async (productOrItem) => {
      const targetItem = items.find((item) => isSameWishlistProduct(item, productOrItem));

      if (!targetItem) {
        return { action: "noop", ok: true, wishlisted: false };
      }

      const previousItems = items;
      const nextItems = previousItems.filter((item) => !isSameWishlistProduct(item, targetItem));

      commitWishlistItems(nextItems);

      const remoteResult = await runRemoteMutation({
        item: targetItem,
        previousItems,
        task: () => wishlistService.removeWishlistItem(targetItem.apiId ?? targetItem.productId),
      });

      return {
        ...remoteResult,
        action: "removed",
        item: targetItem,
        wishlisted: false,
      };
    },
    [commitWishlistItems, items, runRemoteMutation],
  );

  const toggleWishlist = useCallback(
    (productOrItem) => (isWishlisted(productOrItem) ? removeFromWishlist(productOrItem) : addToWishlist(productOrItem)),
    [addToWishlist, isWishlisted, removeFromWishlist],
  );

  const clearWishlist = useCallback(async () => {
    const previousItems = items;

    if (!previousItems.length) {
      return { action: "noop", ok: true };
    }

    commitWishlistItems([]);
    setPendingIds(previousItems.flatMap(getWishlistAliases));

    const remoteResult = await runRemoteMutation({
      item: previousItems,
      previousItems,
      task: () => wishlistService.clearWishlist(),
    });

    setPendingIds([]);

    return {
      ...remoteResult,
      action: "cleared",
    };
  }, [commitWishlistItems, items, runRemoteMutation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const wishlistProducts = useMemo(() => items.map((item) => item.product).filter(Boolean), [items]);
  const wishlistIds = useMemo(() => items.map((item) => item.productId), [items]);

  const value = useMemo(
    () => ({
      addToWishlist,
      clearError,
      clearWishlist,
      error,
      hasWishlistItems: items.length > 0,
      isHydrating,
      isLoading: isHydrating,
      isSyncing,
      isWishlistPending,
      isWishlisted,
      lastSyncedAt,
      pendingIds,
      refreshWishlist: hydrateRemoteWishlist,
      removeFromWishlist,
      syncMode,
      toggleWishlist,
      wishlistCount: items.length,
      wishlistIds,
      wishlistItems: items,
      wishlistProducts,
    }),
    [
      addToWishlist,
      clearError,
      clearWishlist,
      error,
      hydrateRemoteWishlist,
      isHydrating,
      isSyncing,
      isWishlistPending,
      isWishlisted,
      items,
      lastSyncedAt,
      pendingIds,
      removeFromWishlist,
      syncMode,
      toggleWishlist,
      wishlistIds,
      wishlistProducts,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export default WishlistProvider;
