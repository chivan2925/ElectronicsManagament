package org.example.electronics.dto.request.user.payment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.example.electronics.entity.enums.PaymentProvider;

public record CreatePaymentLinkRequestDTO (

        @NotNull(message = "Mã đơn hàng không được để trống")
        @Positive(message = "Mã đơn hàng phải lớn hơn 0")
        Integer orderId,

        @NotNull(message = "Nhà cung cấp dịch vụ thanh toán không được để trống")
        PaymentProvider provider
) {
}
