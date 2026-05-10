const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const ORDER_TRACKING_STEPS = [
  {
    description: "Đơn hàng đã được hệ thống ghi nhận.",
    key: "pending",
    label: "Đã nhận đơn",
    shortLabel: "Nhận đơn",
  },
  {
    description: "Cửa hàng đang xác nhận thông tin và thanh toán.",
    key: "confirmed",
    label: "Đã xác nhận",
    shortLabel: "Xác nhận",
  },
  {
    description: "Sản phẩm đang được chuẩn bị và đóng gói.",
    key: "preparing",
    label: "Chuẩn bị hàng",
    shortLabel: "Chuẩn bị",
  },
  {
    description: "Đơn hàng đã bàn giao cho đơn vị vận chuyển.",
    key: "shipping",
    label: "Đang giao",
    shortLabel: "Giao hàng",
  },
  {
    description: "Đơn hàng đã hoàn tất giao nhận.",
    key: "delivered",
    label: "Đã giao",
    shortLabel: "Hoàn tất",
  },
];

export const ORDER_STATUS_META = {
  cancelled: {
    description: "Đơn hàng đã được hủy hoặc đóng do hoàn trả.",
    label: "Đã hủy",
    tone: "danger",
  },
  confirmed: {
    description: "Đơn hàng đã được xác nhận.",
    label: "Đã xác nhận",
    tone: "primary",
  },
  delivered: {
    description: "Đơn hàng đã giao thành công.",
    label: "Đã giao",
    tone: "success",
  },
  pending: {
    description: "Đơn hàng đang chờ xác nhận.",
    label: "Chờ xác nhận",
    tone: "warning",
  },
  preparing: {
    description: "Đơn hàng đang được chuẩn bị.",
    label: "Đang chuẩn bị",
    tone: "primary",
  },
  shipping: {
    description: "Đơn hàng đang trên đường giao.",
    label: "Đang giao",
    tone: "primary",
  },
};

const statusAliases = {
  CANCELLED: "cancelled",
  CANCELED: "cancelled",
  CANCELLED_BY_SYSTEM: "cancelled",
  COMPLETED: "delivered",
  CONFIRMED: "confirmed",
  DELIVERED: "delivered",
  DONE: "delivered",
  FULFILLED: "delivered",
  IN_TRANSIT: "shipping",
  OUT_FOR_DELIVERY: "shipping",
  PACKED: "preparing",
  PACKING: "preparing",
  PAID: "confirmed",
  PAYMENT_CONFIRMED: "confirmed",
  PAYMENT_PAID: "confirmed",
  PENDING: "pending",
  PREPARING: "preparing",
  PROCESSING: "preparing",
  READY_TO_SHIP: "preparing",
  RECEIVED: "pending",
  REFUNDED: "cancelled",
  RETURNED: "cancelled",
  SHIPPED: "shipping",
  SHIPPING: "shipping",
};

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== "");
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeStatusToken(value) {
  return String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

function isValidDate(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  return Number.isFinite(date.getTime());
}

function addDays(value, days) {
  const date = isValidDate(value) ? new Date(value) : new Date();

  date.setDate(date.getDate() + days);

  return date.toISOString();
}

function isSameTimestamp(left, right) {
  if (!isValidDate(left) || !isValidDate(right)) {
    return false;
  }

  return new Date(left).getTime() === new Date(right).getTime();
}

function sortActivities(left, right) {
  const leftTime = isValidDate(left.date) ? new Date(left.date).getTime() : 0;
  const rightTime = isValidDate(right.date) ? new Date(right.date).getTime() : 0;

  return rightTime - leftTime;
}

function normalizeOrderStatusValue(value) {
  const token = normalizeStatusToken(value);

  return statusAliases[token] ?? null;
}

function getRawOrder(order = {}) {
  return order?.raw && typeof order.raw === "object" ? order.raw : {};
}

export function getOrderTrackingStatus(orderOrStatus, options = {}) {
  const isOrderObject = Boolean(orderOrStatus && typeof orderOrStatus === "object");
  const order = isOrderObject ? orderOrStatus : {};
  const raw = getRawOrder(order);
  const status = isOrderObject ? firstDefined(order.status, order.orderStatus, raw.status, raw.orderStatus) : orderOrStatus;
  const shippingStatus = firstDefined(options.shippingStatus, order.shippingStatus, raw.shippingStatus);
  const paymentStatus = firstDefined(options.paymentStatus, order.paymentStatus, raw.paymentStatus);
  const normalizedOrderStatus = normalizeOrderStatusValue(status);
  const normalizedShippingStatus = normalizeOrderStatusValue(shippingStatus);

  if (normalizedOrderStatus === "cancelled" || normalizedShippingStatus === "cancelled") {
    return "cancelled";
  }

  if (normalizedShippingStatus === "delivered" || normalizedOrderStatus === "delivered") {
    return "delivered";
  }

  if (normalizedShippingStatus === "shipping" || normalizedOrderStatus === "shipping") {
    return "shipping";
  }

  if (normalizedOrderStatus === "preparing") {
    return "preparing";
  }

  if (normalizedOrderStatus === "confirmed") {
    return "confirmed";
  }

  if (normalizeStatusToken(paymentStatus) === "PAID" && normalizedOrderStatus === "pending") {
    return "confirmed";
  }

  return normalizedOrderStatus ?? normalizedShippingStatus ?? "pending";
}

export function getOrderStatusMeta(orderOrStatus, options = {}) {
  const status = getOrderTrackingStatus(orderOrStatus, options);

  return ORDER_STATUS_META[status] ?? ORDER_STATUS_META.pending;
}

export function getTrackingStepIndex(orderOrStatus, options = {}) {
  const status = getOrderTrackingStatus(orderOrStatus, options);

  return ORDER_TRACKING_STEPS.findIndex((step) => step.key === status);
}

export function formatTrackingDate(value, fallback = "Đang cập nhật") {
  if (!isValidDate(value)) {
    return fallback;
  }

  return dateTimeFormatter.format(new Date(value));
}

export function formatTrackingDateOnly(value, fallback = "Đang cập nhật") {
  if (!isValidDate(value)) {
    return fallback;
  }

  return dateFormatter.format(new Date(value));
}

export function getEstimatedDelivery(order = {}) {
  const currentOrder = order ?? {};
  const raw = getRawOrder(currentOrder);
  const directEstimate = firstDefined(
    currentOrder.estimatedDelivery,
    currentOrder.estimatedDeliveryAt,
    currentOrder.deliveryDate,
    currentOrder.deliveryEta,
    raw.estimatedDelivery,
    raw.estimatedDeliveryAt,
    raw.deliveryDate,
    raw.deliveryEta,
  );
  const status = getOrderTrackingStatus(currentOrder);

  if (directEstimate) {
    return {
      date: directEstimate,
      label: status === "delivered" ? `Đã giao ${formatTrackingDateOnly(directEstimate)}` : `Dự kiến ${formatTrackingDateOnly(directEstimate)}`,
      source: "api",
    };
  }

  if (status === "cancelled") {
    return {
      date: null,
      label: "Không áp dụng",
      source: "status",
    };
  }

  if (status === "delivered") {
    const deliveredDate = firstDefined(
      currentOrder.deliveredAt,
      raw.deliveredAt,
      currentOrder.updatedAt,
      raw.updatedAt,
      currentOrder.createdAt,
      raw.createdAt,
    );

    return {
      date: deliveredDate,
      label: `Đã giao ${formatTrackingDateOnly(deliveredDate)}`,
      source: "status",
    };
  }

  const createdAt = firstDefined(currentOrder.createdAt, raw.createdAt);
  const offsetByStatus = {
    confirmed: 3,
    pending: 4,
    preparing: 2,
    shipping: 1,
  };
  const estimatedDate = addDays(createdAt, offsetByStatus[status] ?? 3);

  return {
    date: estimatedDate,
    label: `Dự kiến ${formatTrackingDateOnly(estimatedDate)}`,
    source: "estimated",
  };
}

function normalizeActivity(rawActivity = {}, index = 0) {
  const activity = rawActivity ?? {};
  const status = getOrderTrackingStatus(
    firstDefined(activity.trackingStatus, activity.status, activity.orderStatus, activity.shippingStatus),
  );
  const title = firstDefined(activity.title, activity.label, activity.name, ORDER_STATUS_META[status]?.label, "Cập nhật đơn hàng");
  const description = firstDefined(activity.description, activity.message, activity.note, ORDER_STATUS_META[status]?.description, "");
  const date = firstDefined(activity.createdAt, activity.updatedAt, activity.time, activity.timestamp, activity.date, null);

  return {
    date,
    description,
    id: firstDefined(activity.id, activity.key, `${title}-${date ?? index}`),
    status,
    title,
  };
}

function pushActivity(activities, activity) {
  if (!activity.title) {
    return;
  }

  activities.push({
    date: activity.date ?? null,
    description: activity.description ?? "",
    id: activity.id ?? `${activity.title}-${activity.date ?? activities.length}`,
    status: activity.status ?? "pending",
    title: activity.title,
  });
}

export function getOrderActivityHistory(order = {}) {
  const currentOrder = order ?? {};
  const raw = getRawOrder(currentOrder);
  const explicitHistory = firstDefined(
    currentOrder.activityHistory,
    currentOrder.activities,
    currentOrder.timeline,
    currentOrder.statusHistory,
    raw.activityHistory,
    raw.activities,
    raw.timeline,
    raw.statusHistory,
    raw.histories,
  );
  const explicitActivities = toArray(explicitHistory);

  if (explicitActivities.length > 0) {
    return explicitActivities.map(normalizeActivity).sort(sortActivities);
  }

  const status = getOrderTrackingStatus(currentOrder);
  const activities = [];
  const createdAt = firstDefined(currentOrder.createdAt, raw.createdAt);
  const updatedAt = firstDefined(currentOrder.updatedAt, raw.updatedAt);
  const paidAt = firstDefined(currentOrder.paidAt, raw.paidAt);
  const trackingCode = firstDefined(currentOrder.trackingCode, raw.trackingCode);
  const deliveredAt = firstDefined(currentOrder.deliveredAt, raw.deliveredAt, status === "delivered" ? updatedAt : null);
  const cancelledAt = firstDefined(currentOrder.cancelledAt, raw.cancelledAt, status === "cancelled" ? updatedAt : null);

  pushActivity(activities, {
    date: createdAt,
    description: "Đơn hàng đã được tạo và đang chờ xử lý.",
    id: "created",
    status: "pending",
    title: "Đơn hàng được ghi nhận",
  });

  if (paidAt || normalizeStatusToken(currentOrder.paymentStatus ?? raw.paymentStatus) === "PAID") {
    pushActivity(activities, {
      date: paidAt ?? updatedAt,
      description: "Thanh toán đã được ghi nhận cho đơn hàng.",
      id: "payment",
      status: "confirmed",
      title: "Thanh toán đã xác nhận",
    });
  }

  if (["preparing", "shipping", "delivered"].includes(status)) {
    pushActivity(activities, {
      date: updatedAt,
      description: "Cửa hàng đang kiểm tra tồn kho và chuẩn bị sản phẩm.",
      id: "preparing",
      status: "preparing",
      title: "Đơn hàng đang được chuẩn bị",
    });
  }

  if (trackingCode || status === "shipping" || status === "delivered") {
    pushActivity(activities, {
      date: updatedAt,
      description: trackingCode ? `Mã vận đơn ${trackingCode} đã được cập nhật.` : "Đơn hàng đã được bàn giao cho vận chuyển.",
      id: "shipping",
      status: "shipping",
      title: "Đơn hàng đang giao",
    });
  }

  if (status === "delivered") {
    pushActivity(activities, {
      date: deliveredAt,
      description: "Đơn hàng đã hoàn tất giao nhận.",
      id: "delivered",
      status: "delivered",
      title: "Giao hàng thành công",
    });
  }

  if (status === "cancelled") {
    pushActivity(activities, {
      date: cancelledAt,
      description: firstDefined(currentOrder.note, raw.note, "Đơn hàng đã được hủy hoặc hoàn trả."),
      id: "cancelled",
      status: "cancelled",
      title: "Đơn hàng đã hủy",
    });
  }

  if (updatedAt && !isSameTimestamp(updatedAt, createdAt) && activities.length <= 1) {
    pushActivity(activities, {
      date: updatedAt,
      description: ORDER_STATUS_META[status]?.description,
      id: "latest-update",
      status,
      title: "Trạng thái mới nhất đã cập nhật",
    });
  }

  return activities.sort(sortActivities);
}
