package org.example.electronics.dto.response.user.payment;

import org.example.electronics.entity.enums.PaymentProvider;

public record PaymentLinkResponseDTO(

        String paymentUrl,
        PaymentProvider provider,
        Integer orderId
) {
}
