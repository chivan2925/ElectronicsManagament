import { useCallback, useEffect, useMemo, useState } from "react";
import CartContext from "./CartContext";
import {
  clampCartQuantity,
  createCartItem,
  loadStoredCartItems,
  persistCartItems,
} from "./cartUtils";

function CartProvider({ children }) {
  const [items, setItems] = useState(loadStoredCartItems);

  useEffect(() => {
    persistCartItems(items);
  }, [items]);

  const addItem = useCallback((product, options = {}) => {
    const item = createCartItem(product, options);

    if (item.maxQuantity <= 0) {
      return {
        item,
        ok: false,
        reason: "out_of_stock",
      };
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
  }, []);

  const updateQuantity = useCallback((itemId, nextQuantity) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: clampCartQuantity(nextQuantity, item.maxQuantity),
            }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

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
      itemCount,
      items,
      productSavings,
      removeItem,
      setItems,
      subtotal,
      updateQuantity,
    };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
