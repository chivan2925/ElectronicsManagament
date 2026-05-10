package org.example.electronics.dto.response.admin.report;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AdminRevenueBucketResponseDTO(
        String period,
        String label,
        LocalDate startDate,
        LocalDate endDate,
        Long orderCount,
        Long revenueOrderCount,
        Integer itemCount,
        BigDecimal revenue,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal shippingFee
) {
}
