import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import cartService from "../api/cartService";
import productService from "../api/productService";
import useAuth from "../auth/useAuth";
import CartContext from "./CartContext";
import {
  clampCartQuantity,
  createCartItem,
  loadStoredCartItems,
  persistCartItems,
} from "./cartUtils";

const CART_SYNC_DEBOUNCE_MS = 500;

function getCartSyncSignature(items = []) {
  const syncItems = items
    .map((item) => ({
      quantity: Number(item?.quantity ?? 0),
      variantId: Number(item?.variantId),
    }))
    .filter((item) => Number.isInteger(item.variantId) && item.variantId > 0 && item.quantity > 0)
    .sort((left, right) => left.variantId - right.variantId);

  return JSON.stringify(syncItems);
}

function getCartMergeKey(item) {
  const variantId = Number(item?.variantId);

  if (Number.isInteger(variantId) && variantId > 0) {
    return `variant:${variantId}`;
  }

  return item?.id ? `item:${item.id}` : null;
}

function mergeCartItems(...groups) {
  const mergedItems = new Map();

  groups.flat().forEach((item) => {
    const key = getCartMergeKey(item);

    if (!key) {
      return;
    }

    const existingItem = mergedItems.get(key);

    if (!existingItem) {
      mergedItems.set(key, item);
      return;
    }

    const maxQuantity = Math.max(Number(existingItem.maxQuantity ?? 0), Number(item.maxQuantity ?? 0), 1);
    const quantity = clampCartQuantity(Number(existingItem.quantity ?? 0) + Number(item.quantity ?? 0), maxQuantity);

    mergedItems.set(key, {
      ...existingItem,
      maxQuantity,
      product: {
        ...existingItem.product,
        stock: maxQuantity,
      },
      quantity,
    });
  });

  return Array.from(mergedItems.values());
}

function hasCartVariantIdentity(product = {}, options = {}) {
  if (options.variant?.id || options.variant?.variantId || product.variantId) {
    return true;
  }

  return Array.isArray(product.variants) && product.variants.some((variant) => variant?.id || variant?.variantId);
}

async function resolveProductForCartItem(product = {}, options = {}) {
  if (hasCartVariantIdentity(product, options)) {
    return product;
  }

  const productId = product.apiId ?? product.productId ?? product.id;

  try {
    if (productId && /^\d+$/.test(String(productId))) {
      const detail = await productService.getCatalogProductById(productId, {
        cacheTtl: 15_000,
        skipGlobalErrorHandler: true,
      });

      return detail?.product ?? product;
    }

    if (product.slug) {
      const detail = await productService.getCatalogProductBySlug(product.slug, {
        cacheTtl: 15_000,
        skipGlobalErrorHandler: true,
      });

      return detail?.product ?? product;
    }
  } catch {
    return product;
  }

  return product;
}

function CartProvider({ children }) {
  const auth = useAuth();
  const [items, setItems] = useState(loadStoredCartItems);
  const [isHydrating, setIsHydrating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [syncMode, setSyncMode] = useState("local");
  const itemsRef = useRef(items);
  const isApplyingRemoteRef = useRef(false);
  const isRemoteReadyRef = useRef(false);
  const lastSyncedSignatureRef = useRef(getCartSyncSignature(items));

  const isAdminSession = auth.canAccessAdmin?.() ?? false;
  const canSyncCart = Boolean(
    auth.isAuthenticated &&
      auth.accessToken &&
      !auth.loading &&
      !isAdminSession &&
      cartService.isCartSyncConfigured(),
  );
  const syncSessionKey = `${auth.user?.id ?? auth.user?.userId ?? auth.user?.email ?? "guest"}:${
    auth.accessToken ? auth.accessToken.slice(-12) : "no-token"
  }`;

  useEffect(() => {
    itemsRef.current = items;
    persistCartItems(items);
  }, [items]);

  useEffect(() => {
    if (auth.loading) {
      return undefined;
    }

    if (!canSyncCart) {
      isRemoteReadyRef.current = false;
      lastSyncedSignatureRef.current = getCartSyncSignature(itemsRef.current);
      setIsHydrating(false);
      setIsSyncing(false);
      setSyncError(null);
      setSyncMode("local");
      return undefined;
    }

    let isActive = true;

    async function hydrateRemoteCart() {
      setIsHydrating(true);
      setSyncError(null);

      try {
        const startingItems = itemsRef.current;
        const startingSignature = getCartSyncSignature(startingItems);
        const remoteCart = await cartService.getCart();
        let nextItems = mergeCartItems(remoteCart.items, startingItems);

        if (getCartSyncSignature(nextItems) !== getCartSyncSignature(remoteCart.items)) {
          setIsSyncing(true);
          const syncedCart = await cartService.syncCart(nextItems);
          nextItems = syncedCart.items;
        }

        if (getCartSyncSignature(itemsRef.current) !== startingSignature) {
          const latestItems = mergeCartItems(nextItems, itemsRef.current);
          const syncedCart = await cartService.syncCart(latestItems);
          nextItems = syncedCart.items;
        }

        if (!isActive) {
          return;
        }

        isApplyingRemoteRef.current = true;
        isRemoteReadyRef.current = true;
        lastSyncedSignatureRef.current = getCartSyncSignature(nextItems);
        setItems(nextItems);
        setSyncMode("remote");
      } catch (error) {
        if (!isActive) {
          return;
        }

        isRemoteReadyRef.current = false;
        setSyncError(error);
        setSyncMode("offline");
      } finally {
        if (isActive) {
          setIsHydrating(false);
          setIsSyncing(false);
          window.setTimeout(() => {
            isApplyingRemoteRef.current = false;
          }, 0);
        }
      }
    }

    hydrateRemoteCart();

    return () => {
      isActive = false;
    };
  }, [auth.loading, canSyncCart, syncSessionKey]);

  useEffect(() => {
    if (!canSyncCart || !isRemoteReadyRef.current || isHydrating || isApplyingRemoteRef.current) {
      return undefined;
    }

    const currentSignature = getCartSyncSignature(items);

    if (currentSignature === lastSyncedSignatureRef.current) {
      return undefined;
    }

    let isActive = true;
    const timerId = window.setTimeout(async () => {
      setIsSyncing(true);
      setSyncError(null);

      try {
        const syncedCart = await cartService.syncCart(itemsRef.current);
        const remoteSignature = getCartSyncSignature(syncedCart.items);

        if (!isActive) {
          return;
        }

        isApplyingRemoteRef.current = true;
        lastSyncedSignatureRef.current = remoteSignature;

        if (remoteSignature !== getCartSyncSignature(itemsRef.current)) {
          setItems(syncedCart.items);
        }

        setSyncMode("remote");
      } catch (error) {
        if (isActive) {
          setSyncError(error);
          setSyncMode("offline");
        }
      } finally {
        if (isActive) {
          setIsSyncing(false);
          window.setTimeout(() => {
            isApplyingRemoteRef.current = false;
          }, 0);
        }
      }
    }, CART_SYNC_DEBOUNCE_MS);

    return () => {
      isActive = false;
      window.clearTimeout(timerId);
    };
  }, [canSyncCart, isHydrating, items]);

  const refreshCart = useCallback(async () => {
    if (!canSyncCart) {
      return { items, ok: true, syncMode: "local" };
    }

    setIsHydrating(true);
    setSyncError(null);

    try {
      const remoteCart = await cartService.getCart();

      isApplyingRemoteRef.current = true;
      isRemoteReadyRef.current = true;
      lastSyncedSignatureRef.current = getCartSyncSignature(remoteCart.items);
      setItems(remoteCart.items);
      setSyncMode("remote");

      return { cart: remoteCart, ok: true, syncMode: "remote" };
    } catch (error) {
      setSyncError(error);
      setSyncMode("offline");

      return { error, ok: false, syncMode: "offline" };
    } finally {
      setIsHydrating(false);
      window.setTimeout(() => {
        isApplyingRemoteRef.current = false;
      }, 0);
    }
  }, [canSyncCart, items]);

  const addItem = useCallback(
    async (product, options = {}) => {
      const resolvedProduct = await resolveProductForCartItem(product, options);
      const item = createCartItem(resolvedProduct, options);

      if (!hasCartVariantIdentity(resolvedProduct, options) && canSyncCart) {
        return {
          item,
          ok: false,
          reason: "missing_variant",
        };
      }

      if (item.maxQuantity <= 0) {
        return {
          item,
          ok: false,
          reason: "out_of_stock",
        };
      }

      if (canSyncCart) {
        setIsSyncing(true);
        setSyncError(null);
        try {
          const remoteCart = await cartService.addCartItem(item);

          isApplyingRemoteRef.current = true;
          isRemoteReadyRef.current = true;
          lastSyncedSignatureRef.current = getCartSyncSignature(remoteCart.items);
          setItems(remoteCart.items);
          setSyncMode("remote");

          return { item, ok: true };
        } catch (error) {
          setSyncError(error);
          setSyncMode("offline");
          return { item, ok: false, error };
        } finally {
          setIsSyncing(false);
          window.setTimeout(() => {
            isApplyingRemoteRef.current = false;
          }, 0);
        }
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find((currentItem) => currentItem.id === item.id);

        if (!existingItem) {
          return [...currentItems, item];
        }

        return currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                quantity: clampCartQuantity(currentItem.quantity + item.quantity, currentItem.maxQuantity),
              }
            : currentItem,
        );
      });

      return {
        item,
        ok: true,
      };
    },
    [canSyncCart],
  );

  const updateQuantity = useCallback(
    async (itemId, nextQuantity) => {
      const itemToUpdate = itemsRef.current.find((item) => item.id === itemId);
      if (!itemToUpdate) return;

      const quantity = clampCartQuantity(nextQuantity, itemToUpdate.maxQuantity);

      if (canSyncCart && itemToUpdate.variantId) {
        setIsSyncing(true);
        setSyncError(null);
        try {
          const remoteCart = await cartService.updateCartItem(itemToUpdate.variantId, quantity);

          isApplyingRemoteRef.current = true;
          lastSyncedSignatureRef.current = getCartSyncSignature(remoteCart.items);
          setItems(remoteCart.items);
          setSyncMode("remote");
          return;
        } catch (error) {
          setSyncError(error);
          setSyncMode("offline");
        } finally {
          setIsSyncing(false);
          window.setTimeout(() => {
            isApplyingRemoteRef.current = false;
          }, 0);
        }
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
              }
            : item,
        ),
      );
    },
    [canSyncCart],
  );

  const removeItem = useCallback(
    async (itemId) => {
      const itemToRemove = itemsRef.current.find((item) => item.id === itemId);

      if (canSyncCart && itemToRemove && itemToRemove.variantId) {
        setIsSyncing(true);
        setSyncError(null);
        try {
          const remoteCart = await cartService.removeCartItem(itemToRemove.variantId);

          isApplyingRemoteRef.current = true;
          lastSyncedSignatureRef.current = getCartSyncSignature(remoteCart.items);
          setItems(remoteCart.items);
          setSyncMode("remote");
          return;
        } catch (error) {
          setSyncError(error);
          setSyncMode("offline");
        } finally {
          setIsSyncing(false);
          window.setTimeout(() => {
            isApplyingRemoteRef.current = false;
          }, 0);
        }
      }

      setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    },
    [canSyncCart],
  );

  const clearCart = useCallback(async () => {
    if (canSyncCart) {
      setIsSyncing(true);
      setSyncError(null);
      try {
        const remoteCart = await cartService.clearCart();

        isApplyingRemoteRef.current = true;
        lastSyncedSignatureRef.current = getCartSyncSignature(remoteCart.items);
        setItems(remoteCart.items);
        setSyncMode("remote");
        return;
      } catch (error) {
        setSyncError(error);
        setSyncMode("offline");
      } finally {
        setIsSyncing(false);
        window.setTimeout(() => {
          isApplyingRemoteRef.current = false;
        }, 0);
      }
    }

    setItems([]);
  }, [canSyncCart]);

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const productSavings = items.reduce((total, item) => {
      if (!item.product.oldPrice || item.product.oldPrice <= item.unitPrice) {
        return total;
      }

      return total + (item.product.oldPrice - item.unitPrice) * item.quantity;
    }, 0);

    return {
      addItem,
      clearCart,
      hasItems: items.length > 0,
      isHydrating,
      isLoading: isHydrating,
      isSyncing,
      itemCount,
      items,
      productSavings,
      refreshCart,
      removeItem,
      setItems,
      subtotal,
      syncError,
      syncMode,
      updateQuantity,
    };
  }, [
    addItem,
    clearCart,
    isHydrating,
    isSyncing,
    items,
    refreshCart,
    removeItem,
    syncError,
    syncMode,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
