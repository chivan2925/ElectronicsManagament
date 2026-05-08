package org.example.electronics.dto.response.admin.order;

import org.example.electronics.entity.enums.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminOrderResponseDTO(

        Integer id,
        String code,
        Integer userId,
        String userFullName,

        String shippingName,
        String shippingPhone,

        BigDecimal total,

        PaymentMethodType paymentMethod,
        PaymentStatus paymentStatus,

        ShippingProvider shippingProvider,
        ShippingStatus shippingStatus,

        OrderStatus status,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
){
}
