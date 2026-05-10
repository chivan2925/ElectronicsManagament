import { useCallback, useState } from "react";
import { buildCreateOrderPayload, createApiClientError } from "../api/checkoutMapper";
import orderService from "../api/orderService";
import useAuth from "../auth/useAuth";
import { REALTIME_EVENT_TYPES } from "../realtime/realtimeEvents";
import { publishRealtimeEvent } from "./useRealtime";

function useCheckoutOrder() {
  const auth = useAuth();
  const [createdOrder, setCreatedOrder] = useState(null);
  const [createOrderError, setCreateOrderError] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const createOrder = useCallback(
    async ({ appliedCoupon, items, paymentMethod, shippingMethod, values }) => {
      if (!auth.isAuthenticated) {
        throw createApiClientError("Bạn cần đăng nhập để tiếp tục thanh toán.", {
          code: "UNAUTHORIZED_CHECKOUT",
          status: 401,
        });
      }

      setIsCreatingOrder(true);
      setCreateOrderError(null);

      try {
        const payload = buildCreateOrderPayload({
          appliedCoupon,
          items,
          paymentMethod,
          shippingMethod,
          user: auth.user,
          values,
        });
        const order = await orderService.createOrder(payload);
        const orderCode = order.code || order.id || Date.now();

        setCreatedOrder(order);
        publishRealtimeEvent(
          {
            channel: "all",
            id: `checkout-order-created-${order.id || orderCode}`,
            message: `Order #${orderCode} was placed with ${paymentMethod?.name || "checkout"} payment.`,
            payload: {
              customerName: values.fullName,
              orderCode,
              orderId: order.id,
              paymentMethod: paymentMethod?.provider || paymentMethod?.name,
              status: order.status,
              total: order.total,
            },
            priority: "high",
            source: "checkout",
            title: "Order created",
            type: REALTIME_EVENT_TYPES.ORDER_CREATED,
          },
          { queue: true },
        );
        return order;
      } catch (error) {
        setCreateOrderError(error);
        throw error;
      } finally {
        setIsCreatingOrder(false);
      }
    },
    [auth.isAuthenticated, auth.user],
  );

  const resetOrder = useCallback(() => {
    setCreatedOrder(null);
    setCreateOrderError(null);
  }, []);

  return {
    createOrder,
    createOrderError,
    createdOrder,
    isCreatingOrder,
    resetOrder,
  };
}

export default useCheckoutOrder;
