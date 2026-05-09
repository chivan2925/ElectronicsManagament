import { useCallback, useState } from "react";
import { buildCreateOrderPayload, createApiClientError } from "../api/checkoutMapper";
import orderService from "../api/orderService";
import useAuth from "../auth/useAuth";

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

        setCreatedOrder(order);
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
