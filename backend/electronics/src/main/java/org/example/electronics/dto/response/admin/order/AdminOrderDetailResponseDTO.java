package org.example.electronics.dto.response.admin.order;

import org.example.electronics.entity.enums.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminOrderDetailResponseDTO(
        Integer id,
        String code,
        Integer userId,
        String userFullName,
        String userEmail,
        String userPhoneNumber,

        String shippingName,
        String shippingPhone,
        String shippingLine,
        String shippingWard,
        String shippingDistrict,
        String shippingProvince,
        String trackingCode,
        ShippingProvider shippingProvider,
        ShippingStatus shippingStatus,

        OrderStatus status,
        PaymentMethodType paymentMethod,
        PaymentStatus paymentStatus,
        LocalDateTime paidAt,
        String note,

        String couponCode,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal shippingFee,
        BigDecimal total,

        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        List<AdminOrderItemResponseDTO> orderDetails
) {
}
