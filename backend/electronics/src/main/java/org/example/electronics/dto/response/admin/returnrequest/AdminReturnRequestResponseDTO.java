package org.example.electronics.dto.response.admin.returnrequest;

import org.example.electronics.entity.enums.PaymentMethodType;
import org.example.electronics.entity.enums.ReturnRequestStatus;
import org.example.electronics.entity.enums.ReturnRequestType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminReturnRequestResponseDTO (
        Integer id,
        Integer userId,
        Integer orderId,
        Integer variantId,
        Integer quantity,
        Integer handledByStaffId,
        ReturnRequestType type,
        String reason,
        BigDecimal refundAmount,
        PaymentMethodType refundMethod,
        ReturnRequestStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime resolvedAt
) {
}
