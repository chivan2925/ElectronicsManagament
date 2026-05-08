package org.example.electronics.dto.request.user.payment;

import jakarta.validation.constraints.NotNull;
import org.example.electronics.entity.enums.PaymentProvider;

public record CreatePaymentLinkRequestDTO (

        @NotNull(message = "Mã đơn hàng không được để trống")
        Integer orderId,

        @NotNull(message = "Nhà cung cấp dịch vụ thanh toán không được để trống")
        PaymentProvider provider
) {
}
