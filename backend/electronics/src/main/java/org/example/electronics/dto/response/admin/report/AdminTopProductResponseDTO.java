package org.example.electronics.dto.response.admin.report;

import java.math.BigDecimal;

public record AdminTopProductResponseDTO(
        Integer productId,
        String productName,
        Integer categoryId,
        String categoryName,
        Integer brandId,
        String brandName,
        Long orderCount,
        Integer quantitySold,
        BigDecimal revenue
) {
}
