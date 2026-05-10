import { useCallback, useEffect, useMemo, useState } from "react";

const NOTIFICATIONS_STORAGE_KEY = "electronicsManagement:notifications";
const NOTIFICATIONS_CHANGE_EVENT = "electronicsManagement:notifications-change";
const MAX_NOTIFICATIONS = 24;

const NOTIFICATION_TYPES = new Set(["admin", "coupon", "order", "payment", "stock", "system"]);
const NOTIFICATION_SURFACES = new Set(["admin", "all", "storefront"]);

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

function createDefaultNotifications() {
  const now = Date.now();

  return [
    {
      actionLabel: "Theo dõi đơn",
      createdAt: new Date(now - 18 * 60 * 1000).toISOString(),
      href: "/profile/orders/1",
      id: "order-shipping-em10021",
      message: "Đơn #EM10021 đã bàn giao cho đơn vị vận chuyển.",
      metadata: {
        orderCode: "EM10021",
        orderId: "1",
        status: "shipping",
      },
      priority: "high",
      readAt: null,
      title: "Đơn hàng đang giao",
      type: "order",
    },
    {
      actionLabel: "Dùng mã",
      createdAt: new Date(now - 44 * 60 * 1000).toISOString(),
      href: "/cart",
      id: "coupon-gear10-ending",
      message: "Mã GEAR10 giảm phụ kiện gaming sắp hết lượt trong hôm nay.",
      metadata: {
        couponCode: "GEAR10",
        discountLabel: "10%",
      },
      priority: "medium",
      readAt: null,
      title: "Ưu đãi phụ kiện gaming",
      type: "coupon",
    },
    {
      actionLabel: "Xem chi tiết",
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      href: "/profile/orders/1",
      id: "order-confirmed-em10020",
      message: "Đơn #EM10020 đã được xác nhận và đang chuẩn bị hàng.",
      metadata: {
        orderCode: "EM10020",
        orderId: "1",
        status: "confirmed",
      },
      priority: "medium",
      readAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      title: "Đã xác nhận đơn hàng",
      type: "order",
    },
    {
      actionLabel: "Xem sản phẩm",
      createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
      href: "/products?category=phu-kien-gaming",
      id: "coupon-weekend-accessories",
      message: "Combo bàn phím, chuột và lót chuột đang có giá tốt cuối tuần.",
      metadata: {
        couponCode: "WEEKEND",
      },
      priority: "low",
      readAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      title: "Combo gear cuối tuần",
      type: "coupon",
    },
    {
      createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      href: null,
      id: "system-placeholder",
      message: "Cập nhật bảo trì, bảo mật và tài khoản sẽ xuất hiện tại đây.",
      metadata: {
        placeholder: true,
      },
      priority: "low",
      readAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      title: "Trung tâm thông báo hệ thống",
      type: "system",
    },
  ];
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeNotification(notification) {
  if (!isPlainObject(notification)) {
    return null;
  }

  const id = notification.id ? String(notification.id) : "";
  const title = notification.title ? String(notification.title) : "";
  const message = notification.message ? String(notification.message) : "";

  if (!id || !title || !message) {
    return null;
  }

  const type = NOTIFICATION_TYPES.has(notification.type) ? notification.type : "system";
  const surface = NOTIFICATION_SURFACES.has(notification.surface) ? notification.surface : "storefront";
  const createdAt = notification.createdAt || new Date().toISOString();

  return {
    actionLabel: notification.actionLabel ? String(notification.actionLabel) : "",
    createdAt,
    href: notification.href || null,
    id,
    message,
    metadata: isPlainObject(notification.metadata) ? notification.metadata : {},
    priority: notification.priority || "low",
    readAt: notification.readAt || null,
    surface,
    title,
    type,
  };
}

function normalizeNotifications(notifications) {
  if (!Array.isArray(notifications)) {
    return [];
  }

  const seenIds = new Set();

  return notifications
    .map(normalizeNotification)
    .filter(Boolean)
    .filter((notification) => {
      if (seenIds.has(notification.id)) {
        return false;
      }

      seenIds.add(notification.id);
      return true;
    })
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, MAX_NOTIFICATIONS);
}

function readStoredNotifications() {
  const storage = getStorage();
  const rawValue = storage?.getItem(NOTIFICATIONS_STORAGE_KEY);

  if (!rawValue) {
    return normalizeNotifications(createDefaultNotifications());
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const items = Array.isArray(parsedValue) ? parsedValue : parsedValue.items;

    if (!Array.isArray(items)) {
      return normalizeNotifications(createDefaultNotifications());
    }

    return normalizeNotifications(items);
  } catch {
    return normalizeNotifications(createDefaultNotifications());
  }
}

function notificationMatchesSurface(notification, surface) {
  return surface === "all" || notification.surface === surface || notification.surface === "all";
}

function filterNotificationsBySurface(notifications, surface) {
  if (surface === "all") {
    return notifications;
  }

  return notifications.filter((notification) => notificationMatchesSurface(notification, surface));
}

function writeStoredNotifications(notifications) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const normalizedNotifications = normalizeNotifications(notifications);

  storage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify({
      items: normalizedNotifications,
      updatedAt: new Date().toISOString(),
      version: 1,
    }),
  );
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGE_EVENT));
}

function useNotifications(options = {}) {
  const surface = NOTIFICATION_SURFACES.has(options.surface) ? options.surface : "storefront";
  const [storedNotifications, setStoredNotifications] = useState(readStoredNotifications);

  useEffect(() => {
    const syncNotifications = () => {
      setStoredNotifications(readStoredNotifications());
    };

    window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, syncNotifications);
    window.addEventListener("storage", syncNotifications);

    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, syncNotifications);
      window.removeEventListener("storage", syncNotifications);
    };
  }, []);

  const updateNotifications = useCallback((updater) => {
    setStoredNotifications((currentNotifications) => {
      const storedNotifications = readStoredNotifications();
      const baseNotifications = storedNotifications.length ? storedNotifications : currentNotifications;
      const nextNotifications = normalizeNotifications(updater(baseNotifications));

      writeStoredNotifications(nextNotifications);
      return nextNotifications;
    });
  }, []);

  const addNotification = useCallback(
    (notification) => {
      const normalizedNotification = normalizeNotification({
        ...notification,
        createdAt: notification?.createdAt || new Date().toISOString(),
      });

      if (!normalizedNotification) {
        return;
      }

      updateNotifications((currentNotifications) => [
        normalizedNotification,
        ...currentNotifications.filter((item) => item.id !== normalizedNotification.id),
      ]);
    },
    [updateNotifications],
  );

  const dismissNotification = useCallback(
    (notificationId) => {
      updateNotifications((currentNotifications) =>
        currentNotifications.filter((notification) => notification.id !== notificationId),
      );
    },
    [updateNotifications],
  );

  const markAsRead = useCallback(
    (notificationId) => {
      updateNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId && !notification.readAt
            ? { ...notification, readAt: new Date().toISOString() }
            : notification,
        ),
      );
    },
    [updateNotifications],
  );

  const markAllAsRead = useCallback(() => {
    updateNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.readAt || !notificationMatchesSurface(notification, surface)
          ? notification
          : { ...notification, readAt: new Date().toISOString() },
      ),
    );
  }, [surface, updateNotifications]);

  const resetNotifications = useCallback(() => {
    const defaultNotifications = normalizeNotifications(createDefaultNotifications());

    setStoredNotifications(defaultNotifications);
    writeStoredNotifications(defaultNotifications);
  }, []);

  const notifications = useMemo(
    () => filterNotificationsBySurface(storedNotifications, surface),
    [storedNotifications, surface],
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.readAt),
    [notifications],
  );

  const notificationCounts = useMemo(
    () =>
      notifications.reduce(
        (counts, notification) => {
          counts.total += 1;
          counts.byType[notification.type] = (counts.byType[notification.type] || 0) + 1;

          if (!notification.readAt) {
            counts.unread += 1;
            counts.unreadByType[notification.type] = (counts.unreadByType[notification.type] || 0) + 1;
          }

          return counts;
        },
        {
          byType: {},
          total: 0,
          unread: 0,
          unreadByType: {},
        },
      ),
    [notifications],
  );

  return {
    addNotification,
    dismissNotification,
    hasNotifications: notifications.length > 0,
    hasUnreadNotifications: unreadNotifications.length > 0,
    markAllAsRead,
    markAsRead,
    notificationCounts,
    notifications,
    resetNotifications,
    unreadCount: unreadNotifications.length,
    unreadNotifications,
  };
}

export default useNotifications;
