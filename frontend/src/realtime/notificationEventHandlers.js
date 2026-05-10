import {
  REALTIME_CHANNELS,
  REALTIME_EVENT_TYPES,
  isOrderRealtimeEvent,
  isPaymentRealtimeEvent,
  isStockRealtimeEvent,
  normalizeRealtimeEvent,
  realtimeEventMatchesChannel,
} from "./realtimeEvents";

const notificationTypeByEvent = {
  [REALTIME_EVENT_TYPES.ADMIN_ALERT]: "admin",
  [REALTIME_EVENT_TYPES.ORDER_CREATED]: "order",
  [REALTIME_EVENT_TYPES.ORDER_STATUS_CHANGED]: "order",
  [REALTIME_EVENT_TYPES.ORDER_UPDATED]: "order",
  [REALTIME_EVENT_TYPES.PAYMENT_CANCELLED]: "payment",
  [REALTIME_EVENT_TYPES.PAYMENT_FAILED]: "payment",
  [REALTIME_EVENT_TYPES.PAYMENT_SUCCEEDED]: "payment",
  [REALTIME_EVENT_TYPES.STOCK_LOW]: "stock",
  [REALTIME_EVENT_TYPES.STOCK_RESTOCKED]: "stock",
  [REALTIME_EVENT_TYPES.SYSTEM]: "system",
};

const notificationFallbackCopy = {
  [REALTIME_EVENT_TYPES.ADMIN_ALERT]: {
    message: "Co mot canh bao moi trong bang dieu khien.",
    title: "Admin alert",
  },
  [REALTIME_EVENT_TYPES.ORDER_CREATED]: {
    message: "Mot don hang moi vua duoc tao.",
    title: "New order received",
  },
  [REALTIME_EVENT_TYPES.ORDER_STATUS_CHANGED]: {
    message: "Trang thai don hang vua duoc cap nhat.",
    title: "Order status updated",
  },
  [REALTIME_EVENT_TYPES.ORDER_UPDATED]: {
    message: "Don hang vua co cap nhat moi.",
    title: "Order update",
  },
  [REALTIME_EVENT_TYPES.PAYMENT_CANCELLED]: {
    message: "Khach hang da huy luong thanh toan.",
    title: "Payment cancelled",
  },
  [REALTIME_EVENT_TYPES.PAYMENT_FAILED]: {
    message: "Giao dich thanh toan khong thanh cong.",
    title: "Payment failed",
  },
  [REALTIME_EVENT_TYPES.PAYMENT_SUCCEEDED]: {
    message: "Giao dich thanh toan da duoc xac nhan.",
    title: "Payment confirmed",
  },
  [REALTIME_EVENT_TYPES.STOCK_LOW]: {
    message: "Mot SKU da cham nguong can bo sung.",
    title: "Low stock alert",
  },
  [REALTIME_EVENT_TYPES.STOCK_RESTOCKED]: {
    message: "Ton kho da duoc cap nhat lai.",
    title: "Stock replenished",
  },
  [REALTIME_EVENT_TYPES.SYSTEM]: {
    message: "He thong vua co cap nhat moi.",
    title: "System update",
  },
};

function getOrderCode(payload = {}) {
  return payload.orderCode || payload.orderNumber || payload.orderId || payload.id || "";
}

function getProductLabel(payload = {}) {
  return payload.productName || payload.variantName || payload.sku || payload.productId || "";
}

function getProviderLabel(payload = {}) {
  return payload.provider || payload.paymentProvider || payload.gateway || "";
}

function buildHref(event, surface) {
  const payload = event.payload || {};

  if (event.href) {
    return event.href;
  }

  if (surface === REALTIME_CHANNELS.ADMIN) {
    if (isStockRealtimeEvent(event.type)) {
      return "/admin/warehouse";
    }

    if (isOrderRealtimeEvent(event.type) || isPaymentRealtimeEvent(event.type)) {
      return "/admin/orders";
    }

    return "/admin/dashboard";
  }

  if (isOrderRealtimeEvent(event.type) || isPaymentRealtimeEvent(event.type)) {
    const orderId = payload.orderId || payload.id;

    return orderId ? `/profile/orders/${orderId}` : "/profile/orders";
  }

  return null;
}

function buildActionLabel(event, surface) {
  if (surface === REALTIME_CHANNELS.ADMIN) {
    if (isStockRealtimeEvent(event.type)) {
      return "Open warehouse";
    }

    if (isOrderRealtimeEvent(event.type) || isPaymentRealtimeEvent(event.type)) {
      return "Open orders";
    }

    return "Open dashboard";
  }

  if (isPaymentRealtimeEvent(event.type)) {
    return "Xem thanh toán";
  }

  if (isOrderRealtimeEvent(event.type)) {
    return "Theo dõi đơn";
  }

  return "";
}

function buildMetadata(event) {
  const payload = event.payload || {};

  return {
    ...payload,
    eventId: event.id,
    eventType: event.type,
    orderCode: getOrderCode(payload),
    productLabel: getProductLabel(payload),
    provider: getProviderLabel(payload),
    source: event.source,
  };
}

function buildToastTone(event) {
  if (event.type === REALTIME_EVENT_TYPES.PAYMENT_SUCCEEDED || event.type === REALTIME_EVENT_TYPES.STOCK_RESTOCKED) {
    return "success";
  }

  if (event.type === REALTIME_EVENT_TYPES.PAYMENT_FAILED) {
    return "error";
  }

  if (event.type === REALTIME_EVENT_TYPES.PAYMENT_CANCELLED || event.type === REALTIME_EVENT_TYPES.STOCK_LOW) {
    return "warning";
  }

  return "info";
}

export function filterRealtimeEventForSurface(event, surface = REALTIME_CHANNELS.STOREFRONT) {
  const normalizedEvent = normalizeRealtimeEvent(event);

  if (!normalizedEvent) {
    return false;
  }

  return realtimeEventMatchesChannel(normalizedEvent, surface);
}

export function createNotificationFromRealtimeEvent(event, options = {}) {
  const normalizedEvent = normalizeRealtimeEvent(event);
  const surface = options.surface || REALTIME_CHANNELS.STOREFRONT;

  if (!normalizedEvent || !filterRealtimeEventForSurface(normalizedEvent, surface)) {
    return null;
  }

  const fallbackCopy = notificationFallbackCopy[normalizedEvent.type] || notificationFallbackCopy.SYSTEM;
  const metadata = buildMetadata(normalizedEvent);
  const notificationType = notificationTypeByEvent[normalizedEvent.type] || "system";

  return {
    actionLabel: buildActionLabel(normalizedEvent, surface),
    createdAt: normalizedEvent.createdAt,
    href: buildHref(normalizedEvent, surface),
    id: `rt-${surface}-${normalizedEvent.id}`,
    message: normalizedEvent.message || fallbackCopy.message,
    metadata,
    priority: normalizedEvent.priority,
    readAt: null,
    surface,
    title: normalizedEvent.title || fallbackCopy.title,
    type: notificationType,
  };
}

export function createToastFromRealtimeEvent(event) {
  const normalizedEvent = normalizeRealtimeEvent(event);

  if (!normalizedEvent) {
    return null;
  }

  const fallbackCopy = notificationFallbackCopy[normalizedEvent.type] || notificationFallbackCopy.SYSTEM;

  return {
    duration: normalizedEvent.priority === "high" ? 5200 : 4200,
    message: normalizedEvent.message || fallbackCopy.message,
    title: normalizedEvent.title || fallbackCopy.title,
    tone: buildToastTone(normalizedEvent),
  };
}

export function handleRealtimeNotificationEvent(event, options = {}) {
  const notification = createNotificationFromRealtimeEvent(event, options);

  if (!notification) {
    return null;
  }

  options.addNotification?.(notification);

  if (options.showToast !== false) {
    const toastPayload = createToastFromRealtimeEvent(event);

    if (toastPayload) {
      options.toast?.showToast?.({
        id: `toast-${notification.id}`,
        ...toastPayload,
      });
    }
  }

  return notification;
}
