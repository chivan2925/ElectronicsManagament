package org.example.electronics.dto.response.admin;

import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.enums.PaymentTransactionStatus;
import org.example.electronics.entity.enums.PaymentTransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminPaymentTransactionResponseDTO(

        Integer id,
        Integer orderId,
        Integer returnRequestId,
        PaymentTransactionType type,
        PaymentProvider provider,
        String providerPaymentId,
        BigDecimal amount,
        String note,
        PaymentTransactionStatus status,
        LocalDateTime paymentTime,
        LocalDateTime createdAt
) {
}
