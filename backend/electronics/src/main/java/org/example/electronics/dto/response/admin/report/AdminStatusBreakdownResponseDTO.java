package org.example.electronics.dto.response.admin.report;

import java.math.BigDecimal;

public record AdminStatusBreakdownResponseDTO(
        String status,
        String label,
        Long count,
        BigDecimal amount,
        Double percentage
) {
}
