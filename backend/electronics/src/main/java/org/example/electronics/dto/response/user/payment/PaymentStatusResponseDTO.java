package org.example.electronics.dto.response.user.payment;

import org.example.electronics.entity.enums.PaymentProvider;
import org.example.electronics.entity.enums.PaymentStatus;
import org.example.electronics.entity.enums.PaymentTransactionStatus;

import java.math.BigDecimal;

public record PaymentStatusResponseDTO(
        Integer orderId,
        String orderCode,
        Integer transactionId,
        PaymentProvider provider,
        String status,
        PaymentStatus paymentStatus,
        PaymentTransactionStatus transactionStatus,
        BigDecimal amount,
        String providerPaymentId,
        String responseCode,
        String message,
        boolean verified,
        String redirectUrl
) {
}
