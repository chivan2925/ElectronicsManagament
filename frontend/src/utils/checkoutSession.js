const PENDING_PAYMENT_ORDER_KEY = "electronicsmanagement.pendingPaymentOrderId";

function getSessionStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getPendingPaymentOrderId() {
  return getSessionStorage()?.getItem(PENDING_PAYMENT_ORDER_KEY) ?? "";
}

export function setPendingPaymentOrderId(orderId) {
  const storage = getSessionStorage();
  const normalizedOrderId = String(orderId || "").trim();

  if (!storage || !normalizedOrderId) {
    return;
  }

  storage.setItem(PENDING_PAYMENT_ORDER_KEY, normalizedOrderId);
}

export function clearPendingPaymentOrderId(orderId = "") {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  const normalizedOrderId = String(orderId || "").trim();
  const pendingOrderId = storage.getItem(PENDING_PAYMENT_ORDER_KEY);

  if (!normalizedOrderId || pendingOrderId === normalizedOrderId) {
    storage.removeItem(PENDING_PAYMENT_ORDER_KEY);
  }
}
