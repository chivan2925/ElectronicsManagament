package org.example.electronics.dto.request.admin.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.electronics.entity.enums.OrderStatus;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.enums.ShippingProvider;
import org.example.electronics.entity.enums.ShippingStatus;

public record AdminUpdateOrderRequestDTO(

        @Size(max = 20, message = "Mã vận đơn không được vượt quá 20 ký tự")
        String trackingCode,

        @NotNull(message = "Trạng thái đơn hàng không được để trống")
        OrderStatus status,

        @NotNull(message = "Trạng thái thanh toán không được để trống")
        PaymentStatus paymentStatus,

        @NotNull(message = "Đơn vị vận chuyển không được để trống")
        ShippingProvider shippingProvider,

        @NotNull(message = "Trạng thái giao hàng không được để trống")
        ShippingStatus shippingStatus
) {
}
